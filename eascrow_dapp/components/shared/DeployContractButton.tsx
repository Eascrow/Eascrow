import { useState } from 'react';
import {
  Keypair,
  nativeToScVal,
  Networks,
  StrKey,
  TransactionBuilder,
} from '@stellar/stellar-sdk';
import {
  getContractXDR,
  callWithSignedXDR,
  generateSalt,
  uuidToBytes32,
} from '@/lib/utils';
import { Client as EascrowClient } from 'eascrow-sc';
import { hash } from '@stellar/stellar-sdk/minimal';
import { basicNodeSigner,AssembledTransaction, type AssembledTransactionOptions, type Tx } from '@stellar/stellar-sdk/minimal/contract'



const rpcUrl = "https://soroban-testnet.stellar.org";
const networkPassphrase = "Test SDF Network ; September 2015";
const timeoutInSeconds = 30;

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
  const contractId = 'CCXRMV2VYZGGNQNCVUBCMFFZH47CDEIX4CSKZHNVBIMLUAAXZXSGCT74';
  // [Jose]: I used this to deploy the contract.
  const adminAddress =
    'GCXYZTVG7VLC4SIEIN75GJ3KJZF4LXX2VCVM2HNORXOUDB47LHHNBY6F';

  const saltHex = generateSalt();
  const saltBytes32 = uuidToBytes32(saltHex);

  // TODO: update le wasmHash
  const wasmHash = "ae4333761a7bcc80c8eddcb460e35bbbf21ca3bd68ea98c841b2df8ae6abbe71";

  const deployContract = async () => {
    if (disabled) return;

    try {
      setLoading(true);
      setMessage('');



      // Assemble transaction
      const at = await EascrowClient.deploy({
        admin: adminAddress,
      },{
        wasmHash,
        rpcUrl,
        networkPassphrase,
        publicKey: adminAddress,
      });
      const deployedContractId = at.result.options.contractId;

      // Sign transaction
      console.log('at', at);
      console.log('Before signing');
      const signedAt = await at.sign({
        signTransaction: basicNodeSigner(signerKeypair, networkPassphrase).signTransaction
      })
      console.log('After signing');
      console.log('signedAt', signedAt);

      console.log('deployedContractId', deployedContractId);
      setNewContract(deployedContractId);
      localStorage.setItem('newContractAddress', deployedContractId);
      setMessage(`New Eascrow created at contract address: ${newContract}`);
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
    </>
  );
}
