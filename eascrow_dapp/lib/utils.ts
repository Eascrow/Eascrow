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
  Keypair,
} from '@stellar/stellar-sdk';
import { UUID } from 'crypto';

const signerKeypair = Keypair.fromSecret(
  `${process.env.NEXT_PUBLIC_EASCROW_SECRET}`
);
// console.log(signerKeypair);

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

export function generateSalt() {
  return crypto.randomUUID().replaceAll('-', '');
}

export function uuidToBytes32(uuid: UUID) {
  // Convertir l'UUID hexadécimal en tableau d'octets
  const hex = uuid.padStart(64, '0'); // S'assure qu'on ait 32 octets en hex
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
  console.log('Here is the caller', caller);
  const provider = new SorobanRpc.Server(
    'https://soroban-testnet.stellar.org',
    { allowHttp: false }
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

  transaction.sign(signerKeypair);

  console.log('total signatures:', transaction.signatures.length);
  try {
    const prepareTx = await provider.prepareTransaction(transaction);

    return prepareTx.toXDR();
  } catch (e) {
    console.error(e);

    throw new Error('Unable to send transaction');
  }
}

export async function callWithSignedXDR(xdr: string) {
  const provider = new SorobanRpc.Server(
    'https://soroban-testnet.stellar.org',
    { allowHttp: true }
  );
  console.log(xdr);
  const transaction = TransactionBuilder.fromXDR(xdr, Networks.TESTNET);
  console.log('total signatures:', transaction.signatures.length);
  const sendTx = await provider.sendTransaction(transaction);
  console.log('sent TX');

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
