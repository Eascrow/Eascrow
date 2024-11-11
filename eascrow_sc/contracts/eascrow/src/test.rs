#![cfg(test)]

use super::*;
use soroban_sdk::{testutils, Address, Env, testutils::{Logs}};
extern crate std;

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


// Pour faire les tests avec les logs : 
// cargo test -- --nocapture
#[test]
fn test() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register_contract(None, EascrowContract);
    let client = EascrowContractClient::new(&env, &contract_id);
    
    let token_admin = <soroban_sdk::Address as testutils::Address>::generate(&env);
    let buyer = <soroban_sdk::Address as testutils::Address>::generate(&env);
    let seller = <soroban_sdk::Address as testutils::Address>::generate(&env);

    let token = create_token_contract(&env, &token_admin);
    let token_client = token.0;
    let token_admin_client = token.1;

    std::println!("\nMint phase");
    std::println!("buyer balance : {:#?}", token_client.balance(&buyer));
    token_admin_client.mint(&buyer, &100);
    std::println!("buyer balance : {:#?}", token_client.balance(&buyer));

    client.initialize(&buyer, &seller, &token_client.address, &token_admin, &25);

    std::println!("\nFunding phase");
    client.fund(&buyer, &10);
    client.fund(&buyer, &15);
    std::println!("buyer balance : {:#?}", token_client.balance(&buyer));
    std::println!("contract balance : {:#?}", token_client.balance(&contract_id));

    std::println!("\nRelease funds phase");
    client.release_funds();
    std::println!("contract balance : {:#?}", token_client.balance(&contract_id));
    std::println!("seller balance : {:#?}", token_client.balance(&seller));


    // Méthode pour forcer l'adresse sur le token XLM sur testnet
    //let address_str = String::from_str(&env, "CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC");
    //let native_token = Address::from_string(&address_str);
}
