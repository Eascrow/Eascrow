'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useFreighterWaller } from '@/app/hooks/useFreighterWallet';
import {
  addressToScVal,
  callWithSignedXDR,
  getContractXDR,
  numberToi128,
} from '@/lib/utils';

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
    sacAddress: 'CCL4XLVBZZCJ4ZFESWFBHGYTBQKANQYDZ5AR7MQZ56U2C5ZYYBPKGTFP',
    buyerAddress: '',
    sellerAddress: '',
    tokenAddress: '',
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
        addressToScVal(formData.sellerAddress),
        addressToScVal(formData.buyerAddress),
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
    <div className="container">
      {!hasFreighter && (
        <p className="text-red-500">Freighter Wallet not detected</p>
      )}
      {!publicKey && <Button onClick={connect}>Connect Wallet</Button>}
      Public Key: {publicKey}
      <Card className="bg-transparent text-white w-full">
        <CardHeader>
          <CardTitle>Contract Initialization</CardTitle>
          <CardDescription>Set up the contract parameters</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sacAddress">SAC Address</Label>
              <Input
                value={formData.sacAddress}
                className="bg-transparent"
                id="sacAddress"
                name="sacAddress"
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="buyerAddress">Buyer Address</Label>
              <Input
                className="bg-transparent"
                id="buyerAddress"
                name="buyerAddress"
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sellerAddress">Seller Address</Label>
              <Input
                className="bg-transparent"
                id="sellerAddress"
                name="sellerAddress"
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tokenAddress">Token Address</Label>
              <Input
                className="bg-transparent"
                id="tokenAddress"
                name="tokenAddress"
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                className="bg-transparent"
                id="price"
                name="price"
                type="number"
                onChange={handleInputChange}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleInitialize}
            disabled={contractState.initialized}
          >
            Initialize Contract
          </Button>
          <Button onClick={handleFund}>Fund</Button>
          <Button onClick={handleReleaseFunds}>Release Funds</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
