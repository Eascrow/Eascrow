#![no_std]

use soroban_sdk::{contract, contractimpl, token, Address, ConversionError, Env, TryFromVal, Val};

#[derive(Clone, Copy)]
#[repr(u32)]
pub enum DataKey {
    NativeToken = 0, //Address
    Buyer = 1, //Address
    Seller = 2, //Address
    AuthorizedAddress = 3, //Address
    Price = 4, //i128
    IsInitialized = 5, //bool
}

impl TryFromVal<Env, DataKey> for Val {
    type Error = ConversionError;

    fn try_from_val(_env: &Env, v: &DataKey) -> Result<Self, Self::Error> {
        Ok((*v as u32).into())
    }
}

fn get_contract_address(env: &Env) -> Address {
    env.current_contract_address()
}

fn get_token_address(env: &Env) -> Address {
    env.storage().instance().get(&DataKey::NativeToken).unwrap()
}

fn get_buyer_address(env: &Env) -> Address {
    env.storage().instance().get(&DataKey::Buyer).unwrap()
}

fn get_seller_address(env: &Env) -> Address {
    env.storage().instance().get(&DataKey::Seller).unwrap()
}

fn get_authorized_address(env: &Env) -> Address {
    env.storage().instance().get(&DataKey::AuthorizedAddress).unwrap()
}

fn get_is_funded(env: &Env) -> bool {
    get_contract_balance(&env) >= get_price(&env)
}

fn get_price(env: &Env) -> i128 {
    env.storage().instance().get(&DataKey::Price).unwrap()
}

fn get_contract_balance(env: &Env) -> i128 {
    let native_token = token::Client::new(&env, &get_token_address(env));
    native_token.balance(&get_contract_address(env))
}

fn get_token_client(env: &Env) -> token::TokenClient<'_> {
    token::Client::new(&env, &get_token_address(env))
}

fn get_is_initialized(env: &Env) -> bool {
    env.storage().instance().get(&DataKey::IsInitialized).unwrap_or(false)
}

fn set_buyer_address(env: &Env, buyer: Address) {
    env.storage().instance().set(&DataKey::Buyer, &buyer);
}

fn set_seller_address(env: &Env, seller: Address) {
    env.storage().instance().set(&DataKey::Seller, &seller);
}

fn set_authorized_address(env: &Env, authorized_address: Address) {
    env.storage().instance().set(&DataKey::AuthorizedAddress, &authorized_address);
}

fn set_native_token(env: &Env, native_token: Address) {
    env.storage().instance().set(&DataKey::NativeToken, &native_token);
}

fn set_price(env: &Env, price: i128) {
    env.storage().instance().set(&DataKey::Price, &price);
}

fn set_is_initialized(env: &Env, value: bool) {
    env.storage().instance().set(&DataKey::IsInitialized, &value);
}

fn transfer(env: &Env, from: &Address, to: &Address, amount: &i128) {
    let native_token: token::TokenClient<'_> = get_token_client(&env);
    native_token.transfer(&from, &to, &amount);
}

#[contract]
pub struct EascrowContract;

#[contractimpl]
impl EascrowContract {
    // Called by eascrow platform every time a customer wants to buy something
    pub fn initialize(env: Env, buyer: Address, seller: Address, token: Address, authorized_address: Address, price: i128) {
        if get_is_initialized(&env) {
            panic!("Contract is already initialized");
        }
        
        if price <= 0 {
            panic!("Price must be positive");
        }

        set_is_initialized(&env, true);
        set_buyer_address(&env, buyer);
        set_seller_address(&env, seller);
        set_authorized_address(&env, authorized_address);
        set_native_token(&env, token);
        set_price(&env, price);
    }

    // Called by customer when he add money to the contract
    pub fn fund(env: Env, buyer: Address, tokens_to_transfer: i128) {
        if buyer != get_buyer_address(&env) {
            panic!("Buyer address is invalid");
        }

        if tokens_to_transfer <= 0 {
            panic!("Tokens_to_transfer must be positive");
        }

        let is_funded: bool = get_is_funded(&env);
        if is_funded {
            panic!("Contract is already funded");
        }
        
        buyer.require_auth();

        let contract: Address = get_contract_address(&env);
        let contract_balance: i128 = get_contract_balance(&env);
        let price: i128 = get_price(&env);
        let new_balance: i128 = contract_balance.checked_add(tokens_to_transfer)
            .expect("Overflow in balance calculation");
        if new_balance > price {
            panic!("Cannot overfund the contract");
        }
        transfer(&env, &buyer, &contract, &tokens_to_transfer);
    }

    // Called by Eascrow platform when the customer confirms it has received the service
    pub fn release_funds(env: Env) {
        let is_funded: bool = get_is_funded(&env);
        if !is_funded {
            panic!("Contract is not funded");
        }

        get_authorized_address(&env).require_auth();
        
        let seller: Address = get_seller_address(&env);
        let contract = get_contract_address(&env);
        let price: i128 = get_price(&env);
        transfer(&env, &contract, &seller, &price);
    }

    // Called by Eascrow platform when the customer raises dispute
    pub fn refund(env: Env) {
        let is_funded: bool = get_is_funded(&env);
        if !is_funded {
            panic!("Contract is not Funded");
        }

        get_authorized_address(&env).require_auth();

        let buyer: Address = get_buyer_address(&env);
        let contract = get_contract_address(&env);
        let price: i128 = get_price(&env);
        transfer(&env, &contract, &buyer, &price);
    }
}

mod test;
