'use client';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useFreighterWallet } from '@/app/hooks/useFreighterWallet';
import {
  addressToScVal,
  callWithSignedXDR,
  getContractXDR,
  numberToi128,
} from '@/lib/utils';
import Card from '@/components/shared/Card';
import {
  Keypair,
  Networks,
  TransactionBuilder,
  xdr,
} from '@stellar/stellar-sdk';

interface FormData {
  sacAddress: string;
  buyerAddress: string;
  sellerAddress: string;
  authorizedAddress: string;
  tokenAddress: string;
  email?: string;
  service?: string;
  terms?: string;
  price: number;
}

const signerKeypair = Keypair.fromSecret(
  `${process.env.NEXT_PUBLIC_EASCROW_SECRET}`
);

export default function SmartContractUI() {
  const { signXDR } = useFreighterWallet();
  const [fetchedData, setFetchedData] = useState<FormData | null>(null);
  const [eascrowContractAddress, setEascrowContractAddress] = useState<
    string | null
  >(null);

  const [formData, setFormData] = useState({
    sacAddress: '',
    buyerAddress: '',
    sellerAddress: '',
    authorizedAddress:
      'GC2C6IPK5LPI56AKOX4H3SKJW5JVVWLGLMTP2FPKAH35HN2RJANHIWIJ',
    tokenAddress: 'CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC',
    price: 0,
  });
  console.log(formData);

  useEffect(() => {
    const newContractAddress = localStorage.getItem('newContractAddress');
    const formDataString = localStorage.getItem('formData');

    if (newContractAddress && formDataString) {
      try {
        const parsedFormData = JSON.parse(formDataString) as FormData;

        setFetchedData(parsedFormData);
        setEascrowContractAddress(newContractAddress);

        // Update price with data parsed from localStorage formData
        setFormData((prevFormData) => ({
          ...prevFormData,
          sacAddress: newContractAddress,
          price: parsedFormData.price,
        }));
      } catch (error) {
        console.error('LocalStorage parsin error:', error);
      }
    }
  }, [eascrowContractAddress]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleInitialize = async () => {
    try {
      console.log('formData', formData);
      const contractParams = [
        addressToScVal(formData.buyerAddress),
        addressToScVal(formData.sellerAddress),
        addressToScVal(formData.tokenAddress),
        addressToScVal(formData.authorizedAddress),
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
        contractParams
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

  const handleReleaseFunds = async () => {
    try {
      const contractParams: xdr.ScVal[] = [];

      /**
       * This contract call will send the Assets to the Ticket Sale Contract
       */
      const xdr = await getContractXDR(
        formData.sacAddress,
        'release_funds',
        formData.authorizedAddress, // Contract's caller
        contractParams //
      );
      // Create transaction based on XDR
      const transaction = TransactionBuilder.fromXDR(xdr, Networks.TESTNET);

      // Add signature with secure admin key
      transaction.sign(signerKeypair);

      // Convert transaction into signed XDR
      const signedXDR = transaction.toXDR();
      await callWithSignedXDR(signedXDR);
      console.log(transaction);

      // const xdr = await getContractXDR(
      //   formData.sacAddress,
      //   'release_funds',
      //   formData.authorizedAddress, // Contract's caller
      //   contractParams //
      // );

      // const signedXDR = await signXDR(xdr);
      // if (signedXDR && signedXDR.signedTxXdr) {
      //   console.log('signedXDR', signedXDR, signedXDR.signedTxXdr);
      //   const txResult = await callWithSignedXDR(signedXDR.signedTxXdr);
      //   console.log('txResult', txResult);
      // } else {
      //   console.error(
      //     'Failed to sign the XDR. The response is undefined or incomplete.'
      //   );
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
            <h2 className="text-2xl text-white font-bold">
              {fetchedData?.service}
            </h2>
          </div>
        </div>
        <div className=" flex flex-col lg:flex-row justify-between p-5">
          <div className="  w-full space-y-4 flex flex-col items-center">
            <div className=" flex flex-col lg:flex-row w-full justify-evenly">
              <div className=" flex flex-col justify-between min-w-[40%] pt-2">
                <Label htmlFor="sacAddress" className="text-white text-sm">
                  Smart Contract Address
                </Label>
                <Input
                  value={formData.sacAddress || ''}
                  className="mt-2.5 py-[22px] px-[14px] border border-[#2c303d]"
                  id="sacAddress"
                  name="sacAddress"
                  onChange={handleInputChange}
                />
              </div>
              <div className=" flex flex-col justify-between min-w-[40%]">
                <Label
                  htmlFor="tokenAddress"
                  className="flex justify-between items-center text-white text-sm "
                >
                  Token Address
                  <span className="ml-2 flex items-center">
                    Current:
                    <Image
                      src="/icons/xlm.png"
                      alt="Eascrow website"
                      width="36"
                      height="36"
                      priority
                      className="ml-2"
                    />
                  </span>
                </Label>
                <Input
                  value={formData.tokenAddress || ''}
                  className="mt-2.5 py-[22px] px-[14px] border border-[#2c303d]"
                  id="tokenAddress"
                  name="tokenAddress"
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className=" flex flex-col lg:flex-row w-full justify-evenly">
              <div className="space-y-2 min-w-[40%]">
                <Label htmlFor="buyerAddress" className="text-white text-sm">
                  Customer Address
                </Label>
                <Input
                  className="mt-2.5 py-[22px] px-[14px] border border-[#2c303d]"
                  id="buyerAddress"
                  name="buyerAddress"
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2 min-w-[40%]">
                <Label htmlFor="sellerAddress" className="text-white text-sm">
                  Service provider Address
                </Label>
                <Input
                  className="mt-2.5 py-[22px] px-[14px] border border-[#2c303d]"
                  id="sellerAddress"
                  name="sellerAddress"
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className=" w-full flex justify-start lg:justify-center">
              <div className="space-y-2">
                <Label htmlFor="price" className="text-white text-sm ">
                  Price
                </Label>
                <Input
                  className="mt-2.5 py-[22px] px-[14px] border border-[#2c303d]"
                  id="price"
                  name="price"
                  type="number"
                  value={formData.price || ''}
                  readOnly
                />
              </div>
            </div>
          </div>
          <div className=" flex flex-col justify-center">
            <div className="space-x-2">
              <Button
                onClick={handleInitialize}
                className="w-full h-[65px] mb-5 bg-mintGreen text-background text-sm font-bold"
              >
                Initialize Contract
              </Button>
            </div>
            <div className=" space-x-2">
              <Button
                onClick={handleFund}
                className="w-full h-[65px] mb-5 bg-mintGreen text-background text-sm font-bold"
              >
                Fund
              </Button>
            </div>
            <div className="space-x-2">
              <Button
                onClick={handleReleaseFunds}
                className="w-full h-[65px] mb-5 bg-mintGreen text-background text-sm font-bold"
              >
                Release Funds
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
