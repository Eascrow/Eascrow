import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import {
  Address,
  Contract,
  Networks,
  TransactionBuilder,
  xdr,
  nativeToScVal,
  SorobanRpc,
  BASE_FEE,
} from '@stellar/stellar-sdk';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const stringToSymbol = (val: string) => {
  return nativeToScVal(val, { type: 'symbol' });
};

export const numberToU64 = (val: number) => {
  const num = parseInt((val * 100).toFixed(0));
  return nativeToScVal(num, { type: 'u64' });
};

export const numberToi128 = (val: number) => {
  const num = parseInt((val * 100).toFixed(0));
  return nativeToScVal(num, { type: 'i128' });
};

// Convert Stellar address to ScVal
export function addressToScVal(addressStr: string) {
  Address.fromString(addressStr);
  // Convert to ScVal as an Object with Bytes
  return nativeToScVal(Address.fromString(addressStr));
}

export async function getContractXDR(
  address: string,
  contractMethod: string,
  caller: string,
  values: xdr.ScVal[]
) {
  console.log('Here is the caller', caller);
  const provider = new SorobanRpc.Server(
    'https://soroban-testnet.stellar.org',
    { allowHttp: true }
  );
  const sourceAccount = await provider.getAccount(caller);
  const contract = new Contract(address);
  const transaction = new TransactionBuilder(sourceAccount, {
    fee: BASE_FEE,
    networkPassphrase: Networks.TESTNET,
  })
    .addOperation(contract.call(contractMethod, ...values))
    .setTimeout(30)
    .build();

  console.log('total signatures:', transaction.signatures.length);
  try {
    const prepareTx = await provider.prepareTransaction(transaction);

    return prepareTx.toXDR();
  } catch (e) {
    console.log('Error', e);
    throw new Error('Unable to send transaction');
  }
}

export async function callWithSignedXDR(xdr: string) {
  const provider = new SorobanRpc.Server(
    'https://soroban-testnet.stellar.org',
    { allowHttp: true }
  );

  const transaction = TransactionBuilder.fromXDR(xdr, Networks.TESTNET);
  console.log('total signatures:', transaction.signatures.length);

  const sendTx = await provider.sendTransaction(transaction);
  console.log('sent TX', sendTx);

  if (sendTx.errorResult) {
    console.log('Error', sendTx.errorResult);
    throw new Error('Unable to send transaction');
  }
  if (sendTx.status === 'PENDING') {
    let txResponse = await provider.getTransaction(sendTx.hash);
    while (
      txResponse.status === SorobanRpc.Api.GetTransactionStatus.NOT_FOUND
    ) {
      txResponse = await provider.getTransaction(sendTx.hash);
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    if (txResponse.status === SorobanRpc.Api.GetTransactionStatus.SUCCESS) {
      return txResponse.returnValue;
    } else {
      console.log('Error', txResponse);

      throw new Error('Unable to send transaction');
    }
  }
}
