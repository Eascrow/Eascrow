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

  const contractId = 'CBGOAAK7IJT3HRGNWG7D7P2YKGVYESUP6E4GWDRZSH2CHQEW5Q2VPCP7';
  const adminAddress =
    'GC2C6IPK5LPI56AKOX4H3SKJW5JVVWLGLMTP2FPKAH35HN2RJANHIWIJ';

  const saltHex = generateSalt();
  const saltBytes32 = uuidToBytes32(saltHex);

  // TODO: update le wasmHash
  const wasmHashBytes = new Uint8Array([
    245, 174, 43, 2, 4, 6, 7, 219, 155, 100, 130, 53, 61, 172, 129, 133, 134,
    129, 171, 153, 154, 113, 242, 198, 238, 44, 214, 253, 45, 56, 255, 78,
  ]);

  const deployContract = async () => {
    if (disabled) return;

    try {
      setLoading(true);
      setMessage('');

      const xdr = await getContractXDR(contractId, 'deploy', adminAddress, [
        nativeToScVal(wasmHashBytes),
        nativeToScVal(saltBytes32),
      ]);

      // Create transaction based on XDR
      const transaction = TransactionBuilder.fromXDR(xdr, Networks.TESTNET);

      // Add signature with secure admin key
      transaction.sign(signerKeypair);

      // Convert transaction into signed XDR
      const signedXDR = transaction.toXDR();
      const txResult = await callWithSignedXDR(signedXDR);

      // Convert BytesN<32> result from txResult into a readable contract address
      // @ts-expect-error: I need to get contract address in txResult and I'm sure this is the right way. If you console.log(txResult) you will see contract address stored in _value/_value
      const contractBytes = txResult!._value!._value;
      const contractAddress = StrKey.encodeContract(contractBytes);
      setNewContract(contractAddress);
      localStorage.setItem('newContractAddress', contractAddress);
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
