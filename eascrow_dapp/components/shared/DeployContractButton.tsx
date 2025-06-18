import { useState } from 'react';
import {
  Keypair,
  rpc as SorobanRpc,
} from '@stellar/stellar-sdk';
import { Client as EascrowClient } from 'eascrow-sc';



const rpcUrl = "https://soroban-testnet.stellar.org";
const networkPassphrase = "Test SDF Network ; September 2015";

interface DeployContractButtonProps {
  disabled?: boolean;
}

const signerKeypair = Keypair.fromSecret(
  `${process.env.NEXT_PUBLIC_EASCROW_SECRET}`
);

export default function DeployContractButton({
  disabled,
}: DeployContractButtonProps) {
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [message, setMessage] = useState('');
  const [newContract, setNewContract] = useState('');

  // MAINNET (TODO)
  // const contractId = 'CBGOAAK7IJT3HRGNWG7D7P2YKGVYESUP6E4GWDRZSH2CHQEW5Q2VPCP7';
  // const adminAddress =
  //   'GC2C6IPK5LPI56AKOX4H3SKJW5JVVWLGLMTP2FPKAH35HN2RJANHIWIJ';
  
  // TESTNET 
  // (Eascrow Contract)

  // TODO: update le wasmHash
  const wasmHash = "ae4333761a7bcc80c8eddcb460e35bbbf21ca3bd68ea98c841b2df8ae6abbe71";

  const deployContract = async () => {
    if (disabled) return;

    try {
      setLoading(true);
      setMessage('');

      // Assemble transaction
      const at = await EascrowClient.deploy({
        admin: signerKeypair.publicKey(),
      },{
        wasmHash,
        rpcUrl,
        networkPassphrase,
        publicKey: signerKeypair.publicKey(),
      });
      const deployedContractId = at.result.options.contractId;
      // Sign transaction
      at.built!.sign(signerKeypair);
      // Submit
      const provider = new SorobanRpc.Server(rpcUrl, {
        allowHttp: true,
      });
      await provider.sendTransaction(at.built!);
      setNewContract(deployedContractId);
      localStorage.setItem('newContractAddress', deployedContractId);
      setMessage(`New Eascrow created at contract address: ${deployedContractId}`);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setMessage(`Error: ${error.message}`);
      } else {
        console.error(error);
        setIsError(true);
        setMessage('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={deployContract}
        className={`w-[195px] h-[60px] mb-1 text-xl text-white font-bold rounded-lg 
          bg-custom-gradient hover:opacity-90 border border-[#34455C] 
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={disabled || loading}
      >
        {loading ? 'Deploying...' : 'Deploy Contract'}
      </button>
      {message && <p className="mt-4 text-sm text-gray-500">{message}</p>}
      <p className="mt-4 text-sm text-gray-500">
        Click to copy contract address:{''}
        {newContract && <span className="cursor-pointer" onClick={() => {
          navigator.clipboard.writeText(newContract);
        }}>{newContract}</span>}
      </p>
    </>
  );
}
