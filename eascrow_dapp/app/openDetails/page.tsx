'use client';
import Image from 'next/image';
import { useState, useEffect, useReducer } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useFreighterWallet } from '@/app/hooks/useFreighterWallet';
import {
  addressToScVal,
  submitSignedXDR,
  getContractXDR,
  numberToi128,
  pollForTransactionStatus,
} from '@/lib/utils';
import Card from '@/components/shared/Card';
import {
  Keypair,
  TransactionBuilder,
  xdr,
  rpc as SorobanRpc,
  Horizon,
  Operation,
  BASE_FEE,
  Account,
  Contract,
} from '@stellar/stellar-sdk';
import { basicNodeSigner } from '@stellar/stellar-sdk/contract';
import { useRouter } from 'next/navigation';
import { Client as ContractClient } from 'eascrow-contract';

enum LoadingState {
  None = 'NONE',
  Initialize = 'INITIALIZE',
  Fund = 'FUND',
  Release = 'RELEASE',
}

enum ActionType {
  SET_LOADING = 'SET_LOADING',
  RESET_LOADING = 'RESET_LOADING',
}

interface Action {
  type: ActionType;
  payload?: LoadingState;
}

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

// Manage Button state when using smart contract functions
const loadingReducer = (state: LoadingState, action: Action): LoadingState => {
  switch (action.type) {
    case ActionType.SET_LOADING:
      return action.payload ?? LoadingState.None;
    case ActionType.RESET_LOADING:
      return LoadingState.None;
    default:
      return state;
  }
};

export default function SmartContractUI() {
  const router = useRouter();
  const [loadingState, dispatch] = useReducer(
    loadingReducer,
    LoadingState.None
  );
  const { signXDR, publicKey } = useFreighterWallet();
  const [fetchedData, setFetchedData] = useState<FormData | null>(null);
  const [eascrowContractAddress, setEascrowContractAddress] = useState<
    string | null
  >(null);

  const [formData, setFormData] = useState({
    sacAddress: '',
    buyerAddress: '',
    sellerAddress: '',
    authorizedAddress: process.env.NEXT_PUBLIC_ADMIN_PUBLIC_KEY!,
    tokenAddress: process.env.NEXT_PUBLIC_XLM_SAC!,
    price: 0,
  });

  useEffect(() => {
    const newContractAddress = localStorage.getItem('newContractAddress');
    const formDataString = localStorage.getItem('formData');

    if (newContractAddress && formDataString) {
      try {
        const parsedFormData = JSON.parse(formDataString) as FormData;

        setFetchedData(parsedFormData);
        setEascrowContractAddress(newContractAddress);

        // Update price with data parsed from localStorage formData
        setFormData(prevFormData => ({
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
    const newFormData = { ...formData, [e.target.name]: e.target.value };
    setFormData(newFormData);

    // Check if buyer and seller addresses are the same
    if (e.target.name === 'buyerAddress' || e.target.name === 'sellerAddress') {
      if (
        newFormData.buyerAddress &&
        newFormData.sellerAddress &&
        newFormData.buyerAddress === newFormData.sellerAddress
      ) {
        toast.warning('Buyer and seller addresses should not be the same');
      }
    }
  };

  const setAsBuyer = () => {
    if (publicKey) {
      const newBuyerAddress = publicKey;
      setFormData(prev => ({ ...prev, buyerAddress: newBuyerAddress }));

      // Check if the new buyer address matches the seller address
      if (newBuyerAddress === formData.sellerAddress) {
        toast.warning('Buyer and seller addresses should not be the same');
      }
    } else {
      toast.error('Please connect your wallet first');
    }
  };

  const setAsSeller = () => {
    if (publicKey) {
      const newSellerAddress = publicKey;
      setFormData(prev => ({ ...prev, sellerAddress: newSellerAddress }));

      // Check if the new seller address matches the buyer address
      if (newSellerAddress === formData.buyerAddress) {
        toast.warning('Buyer and seller addresses should not be the same');
      }
    } else {
      toast.error('Please connect your wallet first');
    }
  };

  const handleInitialize = async () => {
    try {
      if (!publicKey) {
        toast.error('Please connect your wallet first');
        return;
      }

      dispatch({
        type: ActionType.SET_LOADING,
        payload: LoadingState.Initialize,
      });

      // Validate required fields
      if (!formData.buyerAddress || !formData.sellerAddress) {
        alert(
          'Please fill in both Customer Address and Service Provider Address'
        );
        return;
      }

      const contractParams = [
        addressToScVal(formData.buyerAddress),
        addressToScVal(formData.sellerAddress),
        addressToScVal(formData.tokenAddress),
        addressToScVal(formData.authorizedAddress),
        numberToi128(Number(formData.price)),
      ];

      const xdr = await getContractXDR(
        formData.sacAddress,
        'initialize',
        publicKey!,
        contractParams
      );

      const signedXDR = await signXDR(xdr);
      if (signedXDR && signedXDR.signedTxXdr) {
        const txHash = await submitSignedXDR(signedXDR.signedTxXdr);
        const toastId = toast.loading('Initializing contract...');
        pollForTransactionStatus(txHash, toastId, {
          success: 'Contract initialized successfully',
          error: 'Failed to initialize contract',
        });
      } else {
        toast.error('Failed to sign the XDR. The response is undefined.');
      }
    } catch (error) {
      console.error('Initialize error:', error);
      toast.error(
        'Failed to initialize contract. Please check the console for details.'
      );
    } finally {
      dispatch({ type: ActionType.RESET_LOADING });
    }
  };

  const handleFund = async () => {
    try {
      // Verify that the signing account is the buyer
      if (publicKey !== formData.buyerAddress) {
        toast.error('Only the buyer can fund the contract');
        return;
      }

      dispatch({
        type: ActionType.SET_LOADING,
        payload: LoadingState.Fund,
      });
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
        publicKey!, // Contract's caller
        contractParams
      );

      const signedXDR = await signXDR(xdr);
      if (signedXDR && signedXDR.signedTxXdr) {
        const txHash = await submitSignedXDR(signedXDR.signedTxXdr);
        const toastId = toast.loading('Funding in progress...');
        pollForTransactionStatus(txHash, toastId);
      } else {
        toast.error('Failed to sign the XDR. The response is undefined.');
      }
    } catch (error) {
      toast.error('Failed to fund. Please check the console for details.');
      console.error(error);
    } finally {
      dispatch({ type: ActionType.RESET_LOADING });
    }
  };

  const handleReleaseFunds = async () => {
    try {
      dispatch({
        type: ActionType.SET_LOADING,
        payload: LoadingState.Release,
      });
      const contractParams: xdr.ScVal[] = [];

      /**
       * This contract call will send the Assets to the Ticket Sale Contract
       */
      const xdr = await getContractXDR(
        formData.sacAddress,
        'release_funds',
        formData.authorizedAddress!, // Admin
        contractParams //
      );
      // Create transaction based on XDR
      const transaction = TransactionBuilder.fromXDR(
        xdr,
        process.env.NEXT_PUBLIC_NETWORK_PASSPHRASE!
      );
      const signerKeypair = Keypair.fromSecret(
        `${process.env.NEXT_PUBLIC_ADMIN_SECRET_KEY}`
      );
      // Add signature with secure admin key
      transaction.sign(signerKeypair);

      // Convert transaction into signed XDR
      const signedXDR = transaction.toXDR();
      if (signedXDR) {
        const txHash = await submitSignedXDR(signedXDR);
        const toastId = toast.loading('Releasing funds...');
        pollForTransactionStatus(txHash, toastId);
      } else {
        toast.error('Failed to sign the XDR. The response is undefined.');
      }
    } catch (error) {
      toast.error(
        'Failed to release funds. Please check the console for details.'
      );
      console.error(error);
    } finally {
      dispatch({ type: ActionType.RESET_LOADING });
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
                  value={formData.sacAddress}
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
                  value={formData.tokenAddress}
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
                  value={formData.buyerAddress}
                  className="mt-2.5 py-[22px] px-[14px] border border-[#2c303d]"
                  id="buyerAddress"
                  name="buyerAddress"
                  onChange={handleInputChange}
                />
                <Button
                  onClick={setAsBuyer}
                  className="mt-2 bg-mintGreen text-background text-sm font-bold"
                >
                  Use My Wallet
                </Button>
              </div>
              <div className="space-y-2 min-w-[40%]">
                <Label htmlFor="sellerAddress" className="text-white text-sm">
                  Service provider Address
                </Label>
                <Input
                  value={formData.sellerAddress}
                  className="mt-2.5 py-[22px] px-[14px] border border-[#2c303d]"
                  id="sellerAddress"
                  name="sellerAddress"
                  onChange={handleInputChange}
                />
                <Button
                  onClick={setAsSeller}
                  className="mt-2 bg-mintGreen text-background text-sm font-bold"
                >
                  Use My Wallet
                </Button>
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
                  value={formData.price}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
          <div className=" flex flex-col justify-center">
            <div className="space-x-2">
              <Button
                onClick={handleInitialize}
                className="w-full h-[65px] mb-5 bg-mintGreen text-background text-sm font-bold"
                disabled={loadingState !== LoadingState.None}
              >
                {loadingState === LoadingState.Initialize
                  ? 'Initializing...'
                  : 'Initialize Contract'}
              </Button>
            </div>
            <div className=" space-x-2">
              <Button
                onClick={handleFund}
                className="w-full h-[65px] mb-5 bg-mintGreen text-background text-sm font-bold"
                disabled={loadingState !== LoadingState.None}
              >
                {loadingState === LoadingState.Fund ? 'Funding...' : 'Fund'}
              </Button>
            </div>
            <div className="space-x-2">
              <Button
                onClick={handleReleaseFunds}
                className="w-full h-[65px] mb-5 bg-mintGreen text-background text-sm font-bold"
                disabled={loadingState !== LoadingState.None}
              >
                {loadingState === LoadingState.Release
                  ? 'Releasing...'
                  : 'Release Funds'}
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
