import { useState } from 'react';
import {
  Keypair,
  Networks,
  rpc as SorobanRpc,
  TransactionBuilder,
} from '@stellar/stellar-sdk';
import { Client as EascrowClient } from 'eascrow-sc';
import { useFreighterWallet } from '@/app/hooks/useFreighterWallet';
import { toast } from 'sonner';
import {
  pollForTransactionStatus,
  RPC_URL,
  NETWORK_PASSPHRASE,
} from '@/lib/utils';

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
  const { signXDR, publicKey } = useFreighterWallet();

  // MAINNET (TODO)
  // const contractId = 'CBGOAAK7IJT3HRGNWG7D7P2YKGVYESUP6E4GWDRZSH2CHQEW5Q2VPCP7';
  // const adminAddress =
  //   'GC2C6IPK5LPI56AKOX4H3SKJW5JVVWLGLMTP2FPKAH35HN2RJANHIWIJ';

  // TESTNET
  // (Eascrow Contract)

  // TODO: update le wasmHash
  const wasmHash =
    'ae4333761a7bcc80c8eddcb460e35bbbf21ca3bd68ea98c841b2df8ae6abbe71';

  /**
   * Main function to deploy a contract
   * @returns
   */
  const deployContract = async () => {
    if (disabled) return;

    try {
      setLoading(true);
      setMessage('');
      if (!publicKey) {
        setMessage('Please connect your wallet');
        return;
      }

      // Assemble transaction
      const at = await EascrowClient.deploy(
        {
          admin: signerKeypair.publicKey(),
        },
        {
          wasmHash,
          rpcUrl: RPC_URL,
          networkPassphrase: NETWORK_PASSPHRASE,
          publicKey,
        }
      );
      const deployedContractId = at.result.options.contractId;
      // Sign transaction

      const freighterSignature = await signXDR(at.built!.toXDR());
      let signedTxXdr = '';
      if (freighterSignature && 'signedTxXdr' in freighterSignature) {
        signedTxXdr = freighterSignature.signedTxXdr;
      }
      // Submit
      const provider = new SorobanRpc.Server(RPC_URL, {
        allowHttp: true,
      });
      const result = await provider.sendTransaction(
        TransactionBuilder.fromXDR(signedTxXdr, Networks.TESTNET)
      );
      if (result.errorResult) {
        toast.error('Contract deployment failed');
        return;
      }

      const toastId = toast.loading('Contract deployment in progress...');
      setNewContract(deployedContractId);
      localStorage.setItem('newContractAddress', deployedContractId);
      setMessage(
        `New Eascrow created at contract address: ${deployedContractId}`
      );
      console.log('result: ', result);
      console.log('result.hash: ', result.hash);
      console.log('result.status: ', result.status);
      pollForTransactionStatus(result.hash, toastId);
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
        {newContract && (
          <span
            className="cursor-pointer"
            onClick={() => {
              navigator.clipboard.writeText(newContract);
            }}
          >
            {newContract}
          </span>
        )}
      </p>
    </>
  );
}
