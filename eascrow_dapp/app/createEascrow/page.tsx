'use client';
import Image from 'next/image';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from '@/components/ui/card';
import { useFreighterWaller } from '@/app/hooks/useFreighterWallet';
import {
  addressToScVal,
  callWithSignedXDR,
  getContractXDR,
  numberToi128,
} from '@/lib/utils';
import Card from '@/components/shared/Card';

export default function SmartContractUI() {
  const { publicKey, signXDR, connect, hasFreighter } = useFreighterWaller();
  const [contractState, setContractState] = useState({
    initialized: false,
    funded: false,
    balance: 0,
    buyer: '',
    seller: '',
    token: '',
    price: 0,
  });

  const [formData, setFormData] = useState({
    sacAddress: 'CDUXCICCRTDFNN56U75E4L66CYMC5JZR77WZKTEKS5YMMNGZW3MVXDL3',
    buyerAddress: '',
    sellerAddress: '',
    tokenAddress: 'CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC',
    price: '',
  });

  const [logs, setLogs] = useState<string[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addLog = (message: string) => {
    setLogs((prevLogs) => [
      ...prevLogs,
      `${new Date().toLocaleTimeString()}: ${message}`,
    ]);
  };

  const handleInitialize = async () => {
    try {
      console.log('formData', formData);
      const contractParams = [
        addressToScVal(formData.buyerAddress),
        addressToScVal(formData.sellerAddress),
        addressToScVal(formData.tokenAddress),
        numberToi128(Number(formData.price)),
      ];

      console.log('contractParams', contractParams.length);

      /**
       * This contract call will send the Assets to the Ticket Sale Contract
       */
      const xdr = await getContractXDR(
        formData.sacAddress,
        'initialize',
        formData.buyerAddress, // Contract's caller
        contractParams //
      );

      const signedXDR = await signXDR(xdr);
      console.log('signedXDR', signedXDR, signedXDR.signedTxXdr);
      const txResult = await callWithSignedXDR(signedXDR.signedTxXdr);
      console.log('txResult', txResult);
    } catch (error) {
      console.error(error);
    }
  };

  const handleReleaseFunds = async () => {
    try {
      const contractParams = [];

      /**
       * This contract call will send the Assets to the Ticket Sale Contract
       */
      const xdr = await getContractXDR(
        formData.sacAddress,
        'release_funds',
        formData.buyerAddress, // Contract's caller
        contractParams //
      );

      const signedXDR = await signXDR(xdr);
      console.log('signedXDR', signedXDR, signedXDR.signedTxXdr);
      const txResult = await callWithSignedXDR(signedXDR.signedTxXdr);
      console.log('txResult', txResult);
    } catch (error) {
      console.error(error);
    }
  };

  const handleFund = async () => {
    try {
      const contractParams = [
        addressToScVal(formData.buyerAddress),
        numberToi128(Number(formData.price)),
      ];

      /**
       * This contract call will send the Assets to the Ticket Sale Contract
       */
      const xdr = await getContractXDR(
        formData.sacAddress,
        'fund',
        formData.buyerAddress, // Contract's caller
        contractParams //
      );

      const signedXDR = await signXDR(xdr);
      console.log('signedXDR', signedXDR, signedXDR.signedTxXdr);
      const txResult = await callWithSignedXDR(signedXDR.signedTxXdr);
      console.log('txResult', txResult);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="pt-[70px] pb-5 px-9">
      <Card>
        <div className="mb-10 flex justify-between items-center">
          <div className="flex justify-center items-center space-x-2">
            <Image
              src="/icons/arrow-swapp-green.png"
              alt="Eascrow website"
              width="36"
              height="36"
              priority
            />
            <h2 className="text-2xl text-white font-bold">Create an Escrow</h2>
          </div>
          <div>
            {!hasFreighter && (
              <p className="text-red-500">Freighter Wallet not detected</p>
            )}
            {!publicKey ? (
              <Button
                onClick={connect}
                className="w-full bg-mintGreen text-background text-sm font-bold"
              >
                Connect Wallet
              </Button>
            ) : (
              <p className=" text-mintGreen">Wallet connected: {publicKey}</p>
            )}
          </div>
        </div>
        <div className="p-5">
          <div className="space-y-4 flex flex-col items-center">
            <div className="space-y-2 min-w-[40%]">
              <Label htmlFor="sacAddress">Smart Contract Address</Label>
              <Input
                value={formData.sacAddress}
                className="bg-transparent"
                id="sacAddress"
                name="sacAddress"
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2 min-w-[40%]">
              <Label htmlFor="buyerAddress">Buyer Address</Label>
              <Input
                className="bg-transparent"
                id="buyerAddress"
                name="buyerAddress"
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2 min-w-[40%]">
              <Label htmlFor="sellerAddress">Seller Address</Label>
              <Input
                className="bg-transparent"
                id="sellerAddress"
                name="sellerAddress"
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2 min-w-[40%]">
              <Label htmlFor="tokenAddress">Token Address</Label>
              <Input
                value={formData.tokenAddress}
                className="bg-transparent"
                id="tokenAddress"
                name="tokenAddress"
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2 min-w-[40%]">
              <Label htmlFor="price">Price</Label>
              <Input
                className="bg-transparent"
                id="price"
                name="price"
                type="number"
                onChange={handleInputChange}
              />
            </div>

            <div className="min-w-[40%] flex justify-between">
              <div className="space-x-2">
                <span>1</span>
                <Button
                  onClick={handleInitialize}
                  disabled={contractState.initialized}
                  className="bg-background border border-mintGreen text-mintGreen text-sm font-bold"
                >
                  Initialize Contract
                </Button>
              </div>
              <div className="space-x-2">
                <span>2</span>
                <Button
                  onClick={handleFund}
                  className="bg-background border border-mintGreen text-mintGreen text-sm font-bold"
                >
                  Fund
                </Button>
              </div>
              <div className="space-x-2">
                <span>3</span>
                <Button
                  onClick={handleReleaseFunds}
                  className="bg-background border border-mintGreen text-mintGreen text-sm font-bold"
                >
                  Release Funds
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
