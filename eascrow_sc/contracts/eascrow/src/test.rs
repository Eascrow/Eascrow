#![cfg(test)]

use super::*;
use soroban_sdk::{testutils, Address, Env, testutils::Logs};
extern crate std;

// Utility function to create and register a token contract (StellarAsset) in the environment.
fn create_token_contract<'a>(
    e: &Env,
    admin: &Address,
) -> (token::Client<'a>, token::StellarAssetClient<'a>) {
    let sac = e.register_stellar_asset_contract_v2(admin.clone());
    (
        token::Client::new(e, &sac.address()),
        token::StellarAssetClient::new(e, &sac.address()),
    )
}

// Global test covering the full cycle: mint, initialize, funding, and release_funds.
#[test]
fn test_full_flow() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register_contract(None, EascrowContract);
    let client = EascrowContractClient::new(&env, &contract_id);
    
    let token_admin = <Address as testutils::Address>::generate(&env);
    let buyer = <Address as testutils::Address>::generate(&env);
    let seller = <Address as testutils::Address>::generate(&env);

    let token = create_token_contract(&env, &token_admin);
    let token_client = token.0;
    let token_admin_client = token.1;

    std::println!("\nMint phase");
    std::println!("buyer balance before mint: {:#?}", token_client.balance(&buyer));
    token_admin_client.mint(&buyer, &100);
    std::println!("buyer balance after mint: {:#?}", token_client.balance(&buyer));

    client.initialize(&buyer, &seller, &token_client.address, &token_admin, &25);

    std::println!("\nFunding phase");
    client.fund(&buyer, &10);
    client.fund(&buyer, &15);
    std::println!("buyer balance after funding: {:#?}", token_client.balance(&buyer));
    std::println!("contract balance after funding: {:#?}", token_client.balance(&contract_id));

    std::println!("\nRelease funds phase");
    client.release_funds();
    std::println!("contract balance after release: {:#?}", token_client.balance(&contract_id));
    std::println!("seller balance after release: {:#?}", token_client.balance(&seller));
}

// Verifies that a second initialization of the contract triggers a panic.
#[test]
#[should_panic(expected = "Contract is already initialized")]
fn test_double_initialize() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register_contract(None, EascrowContract);
    let client = EascrowContractClient::new(&env, &contract_id);
    
    let token_admin = <Address as testutils::Address>::generate(&env);
    let buyer = <Address as testutils::Address>::generate(&env);
    let seller = <Address as testutils::Address>::generate(&env);

    let token = create_token_contract(&env, &token_admin);
    let token_client = token.0;
    let token_admin_client = token.1;
    
    token_admin_client.mint(&buyer, &100);

    client.initialize(&buyer, &seller, &token_client.address, &token_admin, &25);
    // The second initialization must panic.
    client.initialize(&buyer, &seller, &token_client.address, &token_admin, &25);
}

// Verifies that excessive funding triggers a panic.
#[test]
#[should_panic(expected = "Cannot overfund the contract")]
fn test_overfund() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register_contract(None, EascrowContract);
    let client = EascrowContractClient::new(&env, &contract_id);
    
    let token_admin = <Address as testutils::Address>::generate(&env);
    let buyer = <Address as testutils::Address>::generate(&env);
    let seller = <Address as testutils::Address>::generate(&env);

    let token = create_token_contract(&env, &token_admin);
    let token_client = token.0;
    let token_admin_client = token.1;
    
    token_admin_client.mint(&buyer, &100);

    client.initialize(&buyer, &seller, &token_client.address, &token_admin, &25);

    // Funding with 30 tokens would exceed the set price of 25.
    client.fund(&buyer, &30);
}

// Verifies that calling fund with a buyer different from the registered one triggers a panic.
#[test]
#[should_panic(expected = "Buyer address is invalid")]
fn test_fund_wrong_buyer() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register_contract(None, EascrowContract);
    let client = EascrowContractClient::new(&env, &contract_id);
    
    let token_admin = <Address as testutils::Address>::generate(&env);
    let buyer = <Address as testutils::Address>::generate(&env);
    let wrong_buyer = <Address as testutils::Address>::generate(&env);
    let seller = <Address as testutils::Address>::generate(&env);

    let token = create_token_contract(&env, &token_admin);
    let token_client = token.0;
    let token_admin_client = token.1;
    
    token_admin_client.mint(&buyer, &100);

    client.initialize(&buyer, &seller, &token_client.address, &token_admin, &25);

    // A call to fund with wrong_buyer must fail.
    client.fund(&wrong_buyer, &10);
}

// Tests the refund case: after funding, the buyer must recover their funds.
#[test]
fn test_refund() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register_contract(None, EascrowContract);
    let client = EascrowContractClient::new(&env, &contract_id);
    
    let token_admin = <Address as testutils::Address>::generate(&env);
    let buyer = <Address as testutils::Address>::generate(&env);
    let seller = <Address as testutils::Address>::generate(&env);

    let token = create_token_contract(&env, &token_admin);
    let token_client = token.0;
    let token_admin_client = token.1;
    
    token_admin_client.mint(&buyer, &100);

    client.initialize(&buyer, &seller, &token_client.address, &token_admin, &25);

    // Funding phase: the buyer sends 10 tokens, then 15 tokens.
    client.fund(&buyer, &10);
    client.fund(&buyer, &15);

    // Instead of releasing the funds to the seller, we call refund to reimburse the buyer.
    client.refund();

    // Verification after refund:
    // The contract balance must be zero, and the buyer’s balance must return to 100.
    let contract_balance = token_client.balance(&contract_id);
    let buyer_balance = token_client.balance(&buyer);
    assert_eq!(contract_balance, 0);
    assert_eq!(buyer_balance, 100);
}