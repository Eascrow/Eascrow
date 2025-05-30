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

// Convert Stroops to XLM
export const numberToi128 = (val: number) => {
  const num = BigInt(Math.round(val * 10 ** 7));
  return nativeToScVal(num, { type: 'i128' });
};

// Convert Stellar address to ScVal
export function addressToScVal(addressStr: string) {
  Address.fromString(addressStr);
  // Convert to ScVal as an Object with Bytes
  return nativeToScVal(Address.fromString(addressStr));
}

export function generateSalt() {
  return crypto.randomUUID().replaceAll('-', '');
}

// Convert hexadecimal UUID into octets array
export function uuidToBytes32(uuid: string) {
  const hex = uuid.padStart(64, '0');
  const byteArray = new Uint8Array(32);

  for (let i = 0; i < 32; i++) {
    byteArray[i] = parseInt(hex.substr(i * 2, 2), 16);
  }
  return byteArray;
}

export function hexToBytes(hex: string): Uint8Array {
  if (hex.length % 2 !== 0) {
    throw new Error('Hex string must have an even length');
  }
  const byteArray = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    byteArray[i / 2] = parseInt(hex.substr(i, 2), 16);
  }

  return byteArray;
}

export async function getContractXDR(
  address: string,
  contractMethod: string,
  caller: string,
  values: xdr.ScVal[]
) {
  // MAINNET
  const provider = new SorobanRpc.Server('https://mainnet.sorobanrpc.com', {
    allowHttp: true,
  });

  // TESTNET
  // const provider = new SorobanRpc.Server(
  //   'https://soroban-testnet.stellar.org',
  //   { allowHttp: true }
  // );

  const sourceAccount = await provider.getAccount(caller);
  const contract = new Contract(address);

  // TESTNET
  // const transaction = new TransactionBuilder(sourceAccount, {
  //   fee: BASE_FEE,
  //   networkPassphrase: Networks.TESTNET,
  // })

  // MAINNET
  const transaction = new TransactionBuilder(sourceAccount, {
    fee: BASE_FEE,
    networkPassphrase: Networks.PUBLIC,
  })
    .addOperation(contract.call(contractMethod, ...values))
    .setTimeout(30)
    .build();

  try {
    const prepareTx = await provider.prepareTransaction(transaction);

    return prepareTx.toXDR();
  } catch (e) {
    console.error(e);
    throw new Error('Unable to send transaction');
  }
}

export async function callWithSignedXDR(xdr: string) {
  // TESTNET
  // const provider = new SorobanRpc.Server(
  //   'https://soroban-testnet.stellar.org',
  //   { allowHttp: true }
  // );

  // MAINNET
  const provider = new SorobanRpc.Server('https://mainnet.sorobanrpc.com', {
    allowHttp: true,
  });

  // TESTNET
  // const transaction = TransactionBuilder.fromXDR(xdr, Networks.TESTNET);

  // MAINNET
  const transaction = TransactionBuilder.fromXDR(xdr, Networks.PUBLIC);
  const sendTx = await provider.sendTransaction(transaction);

  if (sendTx.errorResult) {
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
      throw new Error('Unable to send transaction');
    }
  }
}
