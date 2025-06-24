'use client';
import { useState } from 'react';
import {
  Networks,
  rpc as SorobanRpc,
  TransactionBuilder,
} from '@stellar/stellar-sdk';
import { Client as EascrowClient } from 'eascrow-contract';
import { useFreighterWallet } from '@/app/hooks/useFreighterWallet';
import { toast } from 'sonner';
import { pollForTransactionStatus } from '@/lib/utils';
import { useStellar } from '@/app/context/StellarContext';

interface DeployContractButtonProps {
  disabled?: boolean;
}

export default function DeployContractButton({
  disabled,
}: DeployContractButtonProps) {
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [message, setMessage] = useState('');
  const [newContract, setNewContract] = useState('');
  const { signXDR, publicKey } = useFreighterWallet();
  const { rpcUrl, networkPassphrase, wasmHash } = useStellar();

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

      // Deploy contract instance (at: Assembled Transaction)
      const at = await EascrowClient.deploy({
        wasmHash: wasmHash!,
        rpcUrl: rpcUrl!,
        networkPassphrase: networkPassphrase!,
        publicKey, // <-- Wallet's public key
      });
      const deployedContractId = at.result.options.contractId;

      // Sign transaction
      const freighterSignature = await signXDR(at.built!.toXDR());
      let signedTxXdr = '';
      if (freighterSignature && 'signedTxXdr' in freighterSignature) {
        signedTxXdr = freighterSignature.signedTxXdr;
      }
      // Submit
      const provider = new SorobanRpc.Server(rpcUrl!, {
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
      pollForTransactionStatus(result.hash, toastId, rpcUrl!, {
        success: 'Contract deployment successful',
        error: 'Contract deployment failed',
      });
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
