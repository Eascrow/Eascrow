import { useState } from 'react';
import {
  Keypair,
  nativeToScVal,
  Networks,
  TransactionBuilder,
} from '@stellar/stellar-sdk';
import { useFreighterWallet } from '@/app/hooks/useFreighterWallet';

import {
  getContractXDR,
  callWithSignedXDR,
  generateSalt,
  uuidToBytes32,
  hexToBytes,
} from '@/lib/utils';

const signerKeypair = Keypair.fromSecret(
  `${process.env.NEXT_PUBLIC_EASCROW_SECRET}`
);

export default function DeployButton() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { signXDR } = useFreighterWallet();

  const contractId = 'CAB3M5IEH52YXDOOJXN74WQZSK365KPGXUHHPQI5YNJ6T6FI6QHTNRJQ';
  const adminAddress =
    'GC2C6IPK5LPI56AKOX4H3SKJW5JVVWLGLMTP2FPKAH35HN2RJANHIWIJ';

  const saltHex = generateSalt();
  const saltBytes32 = uuidToBytes32(saltHex);

  const wasmHashBytes = new Uint8Array([
    245, 174, 43, 2, 4, 6, 7, 219, 155, 100, 130, 53, 61, 172, 129, 133, 134,
    129, 171, 153, 154, 113, 242, 198, 238, 44, 214, 253, 45, 56, 255, 78,
  ]);

  // const deployContract = async () => {
  //   try {
  //     setLoading(true);
  //     setMessage('');
  //     const xdr = await getContractXDR(contractId, 'deploy', adminAddress, [
  //       nativeToScVal(wasmHashBytes),
  //       nativeToScVal(saltBytes32),
  //     ]);
  //     console.log(adminAddress);

  //     const signedXDR = await signXDR(xdr);

  //     if (signedXDR && signedXDR.signedTxXdr) {
  //       console.log('signedXDR', signedXDR.signedTxXdr);
  //       const txResult = await callWithSignedXDR(signedXDR.signedTxXdr);
  //       console.log('txResult', txResult);
  //       setMessage(`Transaction successful: ${txResult}`);
  //     } else {
  //       console.error('Failed to sign the XDR.');
  //       setMessage('Failed to sign the transaction.');
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     setMessage(`Error: ${error.message}`);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const deployContract = async () => {
    try {
      setLoading(true);
      setMessage('');

      const xdr = await getContractXDR(contractId, 'deploy', adminAddress, [
        nativeToScVal(wasmHashBytes),
        nativeToScVal(saltBytes32),
      ]);

      console.log(adminAddress);

      // Convertir l'XDR en transaction
      const transaction = TransactionBuilder.fromXDR(xdr, Networks.TESTNET);

      // ✅ Ajouter la signature avec la clé privée de GC2C6IPK...
      transaction.sign(signerKeypair);

      const signedXDR = transaction.toXDR(); // Convertir en XDR signé

      console.log('signedXDR', signedXDR);

      const txResult = await callWithSignedXDR(signedXDR);

      console.log('txResult', txResult);
      console.log(txResult);

      setMessage(`Transaction successful: ${txResult}`);
    } catch (error) {
      console.error(error);
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={deployContract}
        className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:bg-gray-300"
        disabled={loading}
      >
        {loading ? 'Deploying...' : 'Deploy Contract'}
      </button>
      {message && <p className="mt-4 text-sm text-gray-700">{message}</p>}
    </div>
  );
}
