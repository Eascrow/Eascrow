#![cfg(test)]
extern crate alloc;
extern crate std;
//use super::*;

use crate::{Deployer, DeployerClient};
use alloc::vec;
use soroban_sdk::{
    symbol_short, testutils::{self, Address as _, AuthorizedFunction, AuthorizedInvocation}, token, Address, BytesN, Env, IntoVal, Val, Vec
};


// The contract that will be deployed by the deployer contract.
mod contract {
    soroban_sdk::contractimport!(
        file =
            "../../target/wasm32-unknown-unknown/release/eascrow.wasm"
    );
}

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

fn convert_bytes_to_array(env: &Env, bytes: soroban_sdk::Bytes) -> [u8; 32] {
    let buffer = bytes.to_buffer::<32>();
    let slice = buffer.as_slice();
    slice.try_into().expect("Incorrect length")
}

#[test]
fn test() {
    let env = Env::default();
    env.mock_all_auths();


    // Init and mint Token
    let token_admin = <soroban_sdk::Address as testutils::Address>::generate(&env);
    let buyer = <soroban_sdk::Address as testutils::Address>::generate(&env);
    let seller = <soroban_sdk::Address as testutils::Address>::generate(&env);
    let token = create_token_contract(&env, &token_admin);
    let token_client = token.0;
    let token_admin_client = token.1;
    
    std::println!("\nMint phase");
    std::println!("buyer balance : {:#?}", token_client.balance(&buyer));
    token_admin_client.mint(&buyer, &100000);
    std::println!("buyer balance : {:#?}", token_client.balance(&buyer));
    

    // Init deployer contract 
    let admin = Address::generate(&env);
    let deployer_client = DeployerClient::new(&env, &env.register(Deployer, (&admin,)));
    let wasm_hash = env.deployer().upload_contract_wasm(contract::WASM);

    for n in 0..300 {
        std::println!("\n\nCONTRACT {:?}", n);

        // Deploy eascrow contract
        let index = deployer_client.index();
        let bytes_index: soroban_sdk::Bytes = index.to_be_bytes();
        let index_array: [u8;32] = convert_bytes_to_array(&env, bytes_index);
        let salt: BytesN<32> = BytesN::from_array(&env, &index_array);
        std::println!("salt : {:#?}", salt);
        let constructor_args: Vec<Val> = (false,).into_val(&env);
        let contract_id = deployer_client.deploy(&wasm_hash, &salt, &constructor_args);
        
        // Test deployed eascrow contract
        let client = contract::Client::new(&env, &contract_id);
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
    }

    std::println!("\nDEPLOYER TESTS ENDED");
}