'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Card from '@/components/shared/Card';

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

import { nativeToScVal, xdr } from '@stellar/stellar-sdk';

/////// TEST DEPLOY CONTRACT

interface FormData {
  email: string;
  service: string;
  amount: number | null;
  terms: string;
}

export default function CreateEscrow() {
  /////// TEST DEPLOY CONTRACT
  const { signXDR } = useFreighterWallet();
  const saltHex = generateSalt();
  const saltBytes32 = uuidToBytes32(saltHex);

  const wasmHashBytes = new Uint8Array([
    196, 154, 41, 244, 136, 160, 143, 45, 74, 148, 82, 73, 212, 0, 94, 145, 177,
    19, 84, 148, 161, 168, 174, 170, 137, 159, 195, 6, 157, 224, 124, 69,
  ]);

  const deployContract = async () => {
    try {
      const xdr = await getContractXDR(
        'CAYGT4GMVXWWGMFV7JXATNQSIDQXBORAMHXSKPPN5UWGSELMXIHFMFVI',
        'deploy',
        'GAKRPF4CZGG3VM6NTZQPYDRZ6TT3VOMLHJQZ443TEB2HVDJ5WPKVGAME',
        [
          nativeToScVal(wasmHashBytes),
          nativeToScVal(saltBytes32),
          nativeToScVal(false),
        ]
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

  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    email: '',
    service: '',
    amount: null,
    terms: '',
  });

  const [errors, setErrors] = useState<{ [key in keyof FormData]?: string }>(
    {}
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === 'amount' ? parseFloat(value) : value, // Convert amount to number
    }));
  };

  const validateEmail = (email: string): boolean => {
    // Check if the email ends with [value].[value]
    const emailPattern = /^[\w-.]+@([\w-]+\.)+[a-z]{2,}$/i;
    return emailPattern.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key in keyof FormData]?: string } = {};

    // Validate fields
    if (!formData.email) {
      newErrors.email = 'Email is required.';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'The email format is incorrect.';
    }

    if (!formData.service) {
      newErrors.service = 'Service is required.';
    } else if (!isNaN(Number(formData.service))) {
      newErrors.service = 'Service must be a string, not a number.';
    }

    if (!formData.amount || formData.amount <= 0 || formData.amount === null) {
      newErrors.amount = 'The amount must be greater than zero.';
    }

    if (!formData.terms) {
      newErrors.terms = 'Terms are required.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return; // Do not submit if there are errors
    }

    try {
      // Save data to localStorage on successful submission
      localStorage.setItem('formData', JSON.stringify(formData));
      // Redirect to "openDetails" page after saving data
      router.push('/openDetails');
    } catch (error) {
      console.error(error);
    } finally {
      // Optionally reset the form data
      setFormData({ email: '', service: '', amount: 0, terms: '' });
      // Reset errors after successful submission
      setErrors({});
    }
  };

  return (
    <div className="pt-[70px] pb-5 px-9">
      <Card>
        <div className="m-8 flex justify-center">
          <div className="flex justify-center items-center space-x-2">
            <Image
              src="/icons/arrow-swapp-green.png"
              alt="Escrow website"
              width="36"
              height="36"
              priority
            />
            <h2 className="text-2xl text-white font-bold">Create an Escrow</h2>
          </div>
        </div>
        <div className=" flex flex-col items-center">
          <form onSubmit={handleSubmit} className="w-[788px]">
            <div className="mb-8">
              <Label htmlFor="email" className="text-white text-sm">
                Email address
              </Label>
              <Input
                placeholder="uihutofficial@gmail.com"
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="mt-2.5 py-[22px] px-[14px] border border-[#2c303d]"
              />
              {errors.email && (
                <span style={{ color: 'red' }}>{errors.email}</span>
              )}
            </div>
            <div className="mb-8 flex justify-between">
              <div>
                <Label htmlFor="service" className="text-white">
                  Product or Service description
                </Label>
                <Input
                  placeholder="Product/Service"
                  type="text"
                  id="service"
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  required
                  className="mt-2.5 w-[376px] py-[22px] px-[14px] border border-[#2c303d]"
                />
                {errors.service && (
                  <span style={{ color: 'red' }}>{errors.service}</span>
                )}
              </div>
              <div>
                <Label htmlFor="amount" className="text-white">
                  Amount
                </Label>
                <Input
                  placeholder="0"
                  type="number"
                  id="amount"
                  name="amount"
                  onChange={handleChange}
                  required
                  className="mt-2.5 w-[376px] py-[22px] px-[14px] border border-[#2c303d]"
                />
                {errors.amount && (
                  <span style={{ color: 'red' }}>{errors.amount}</span>
                )}
              </div>
            </div>
            <div className="mb-8">
              <Label htmlFor="terms" className="text-white">
                Terms
              </Label>
              <Input
                placeholder="Terms"
                type="text"
                id="terms"
                name="terms"
                value={formData.terms}
                onChange={handleChange}
                required
                className="mt-2.5 py-[22px] px-[14px] border border-[#2c303d]"
              />
              {errors.terms && (
                <span style={{ color: 'red' }}>{errors.terms}</span>
              )}
            </div>
            <div className="flex justify-center">
              <Button
                className="mt-2.5 w-[182px] py-[6px] px-[12px] bg-mintGreen text-background text-sm font-bold"
                onClick={deployContract}
              >
                CreateContract
              </Button>
            </div>
            {/* <div className="flex justify-center">
              <Button
                type="submit"
                className="mt-2.5 w-[182px] py-[6px] px-[12px] bg-mintGreen text-background text-sm font-bold"
              >
                Create
              </Button>
            </div> */}
          </form>
        </div>
      </Card>
    </div>
  );
}
