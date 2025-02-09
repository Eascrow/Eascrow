import { useState } from 'react';
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
import {
  // addressToScVal,
  // callWithSignedXDR,
  // getContractXDR,
  // numberToi128,
  generateSalt,
  uuidToBytes32,
} from '@/lib/utils';

export default function DeployButton() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const contractId = 'CAYGT4GMVXWWGMFV7JXATNQSIDQXBORAMHXSKPPN5UWGSELMXIHFMFVI'; // Remplacez par votre contrat address
  const networkPassphrase = Networks.TESTNET;
  const server = new SorobanRpc.Server('https://horizon-testnet.stellar.org');

  const saltHex = generateSalt();
  const saltBytes32 = uuidToBytes32(saltHex);

  // const wasmHashBytes = new Uint8Array([
  //   196, 154, 41, 244, 136, 160, 143, 45, 74, 148, 82, 73, 212, 0, 94, 145, 177,
  //   19, 84, 148, 161, 168, 174, 170, 137, 159, 195, 6, 157, 224, 124, 69,
  // ]);

  async function deployContract() {
    setLoading(true);
    setMessage('');

    try {
      // Exemple de données
      const wasmHash =
        'c49a29f488a08f2d4a945249d4005e91b1135494a1a8aeaa899fc3069de07c45'; // Remplacez par votre hash
      const salt = saltBytes32; // Salt sur 32 octets
      const constructorArgs = false; // Arguments du constructeur si besoin
      const contract = new Contract(contractId);

      // Connexion
      const sourceKeypair = Keypair.fromSecret(
        'slam second oak energy height apple device wait timber rookie vapor one blossom desert drill major pulse finger melody sweet vintage jealous valley hour'
      );
      const sourceAccount = await server.getAccount(
        'GAKRPF4CZGG3VM6NTZQPYDRZ6TT3VOMLHJQZ443TEB2HVDJ5WPKVGAME'
      );
      const contractMethod = 'deploy';
      const values = [
        nativeToScVal(wasmHash),
        nativeToScVal(salt),
        nativeToScVal(constructorArgs),
      ];

      const deployContractTx = new TransactionBuilder(sourceAccount, {
        fee: BASE_FEE,
        networkPassphrase: networkPassphrase,
      })
        .addOperation(contract.call(contractMethod, ...values))
        .setTimeout(30)
        .build();

      deployContractTx.sign(sourceKeypair);

      const txResult = await server.sendTransaction(deployContractTx);
      setMessage(`Transaction successful: ${txResult.hash}`);
    } catch (error) {
      setMessage(`Transaction failed: ${error}`);
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

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
