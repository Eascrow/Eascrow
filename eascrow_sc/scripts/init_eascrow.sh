#! /usr/bin/env bash

SECRET_KEY=$1
BUYER=$2
SELLER=$3
TOKEN=$4
AUTHORIZED_ADDRESS=$5
PRICE=$6
SOROBAN_PATH=$7

echo $SECRET_KEY
echo $BUYER
echo $SELLER
echo $TOKEN
echo $AUTHORIZED_ADDRESS
echo $PRICE

CONTRACT_ADDRESS=`$SOROBAN_PATH contract deploy \
    --wasm ../target/wasm32-unknown-unknown/release/eascrow.wasm \
    --source $SECRET_KEY \
    --rpc-url https://soroban-testnet.stellar.org:443 \
    --network-passphrase 'Test SDF Network ; September 2015'`

TEST=echo $SOROBAN_PATH contract invoke \
    --id $CONTRACT_ADDRESS \
    --source $SECRET_KEY \
    --rpc-url https://soroban-testnet.stellar.org:443 \
    --network-passphrase 'Test SDF Network ; September 2015' \
    -- \
    initialize \
    --buyer $BUYER \
    --seller $SELLER \
    --token $TOKEN \
    --authorized_address $AUTHORIZED_ADDRESS \
    --price $PRICE