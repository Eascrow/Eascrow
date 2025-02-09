'use client';
import Overview from './overview/page';
import { Button } from '@/components/ui/button';

/////// TEST DEPLOY CONTRACT
import { useFreighterWallet } from '@/app/hooks/useFreighterWallet';
import {
  // addressToScVal,
  callWithSignedXDR,
  getContractXDR,
  // numberToi128,
  generateSalt,
  uuidToBytes32,
} from '@/lib/utils';

import { nativeToScVal, scValToNative, xdr } from '@stellar/stellar-sdk';
import DeployButton from '@/components/shared/DeployContractButton';

/////// TEST DEPLOY CONTRACT

export default function Home() {
  /////// TEST DEPLOY CONTRACT
  const { signXDR } = useFreighterWallet();
  const saltHex = generateSalt();
  const saltBytes32 = uuidToBytes32(saltHex);

  // const wasmHashBytes = new Uint8Array([
  //   196, 154, 41, 244, 136, 160, 143, 45, 74, 148, 82, 73, 212, 0, 94, 145, 177,
  //   19, 84, 148, 161, 168, 174, 170, 137, 159, 195, 6, 157, 224, 124, 69,
  // ]);
  const wasmHash =
    'c49a29f488a08f2d4a945249d4005e91b1135494a1a8aeaa899fc3069de07c45';

  const deployContract = async () => {
    try {
      const xdr = await getContractXDR(
        'CAYGT4GMVXWWGMFV7JXATNQSIDQXBORAMHXSKPPN5UWGSELMXIHFMFVI',
        'deploy',
        'GAKRPF4CZGG3VM6NTZQPYDRZ6TT3VOMLHJQZ443TEB2HVDJ5WPKVGAME',
        // [
        nativeToScVal(wasmHash),
        // nativeToScVal(wasmHashBytes),
        nativeToScVal(saltBytes32),
        nativeToScVal(false)
        // ]
      );

      const signedXDR = await signXDR(xdr);
      if (signedXDR && signedXDR.signedTxXdr) {
        console.log('signedXDR', signedXDR, signedXDR.signedTxXdr);
        const txResult = await callWithSignedXDR(signedXDR.signedTxXdr);
        console.log('txResult', txResult);
      } else {
        console.error('Failed to sign the XDR. The response is undefined.');
      }
    } catch (error) {
      console.error(error);
    }
  };

  /////// TEST DEPLOY CONTRACT
  return (
    <>
      <div className="flex justify-center">
        <Button
          className="mt-2.5 w-[182px] py-[6px] px-[12px] bg-mintGreen text-background text-sm font-bold"
          onClick={deployContract}
        >
          CreateContract
        </Button>
      </div>
      {/* <DeployButton /> */}
      <Overview />
    </>
  );
}
