'use client';
import { useEffect, useState } from 'react';
import {
  isConnected,
  isAllowed,
  requestAccess,
  getNetwork,
  getAddress,
  signTransaction,
  setAllowed,
} from '@stellar/freighter-api';
import { Horizon } from '@stellar/stellar-sdk';
import { getBalances, getTransactions } from '../../lib/utils';
import { useStellar } from '../context/StellarContext';

export const useFreighterWallet = () => {
  const [hasFreighter, setHasFreighter] = useState<boolean>(false);
  const [isFreighterAllowed, setIsFreighterAllowed] = useState<boolean>(false);
  const [publicKey, setPublicKey] = useState<string>();
  const { setNetwork: setStellarNetwork, horizonUrl } = useStellar();
  const [transactions, setTransactions] = useState<
    Horizon.ServerApi.TransactionRecord[]
  >([]);
  const [balances, setBalances] = useState<
    Horizon.ServerApi.AccountRecord['balances']
  >([]);

  function fetchWalletData() {
    if (publicKey && horizonUrl) {
      getBalances(publicKey, horizonUrl).then(setBalances);
      getTransactions(publicKey, horizonUrl).then(setTransactions);
    }
  }

  useEffect(() => {
    fetchWalletData();
    const intervalId = setInterval(fetchWalletData, 5000); // Polling every 5 seconds

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, [publicKey, horizonUrl]);

  useEffect(() => {
    const fetchWalletData = () => {
      isConnected()
        .then(connected => {
          if (connected) {
            setHasFreighter(true);
            // Request access, if not already allowed
            isAllowed()
              .then(({ isAllowed }) => {
                setIsFreighterAllowed(isAllowed);
                if (isAllowed) {
                  setIsFreighterAllowed(true);
                  // Fetch network
                  getNetwork()
                    .then(({ network }) => {
                      setStellarNetwork(network);
                    })
                    .catch(() => console.error('Error getting network'));
                  // Fetch public key
                  getAddress()
                    .then(({ address }) => {
                      if (address) setPublicKey(address);
                    })
                    .catch(() => console.error('Error getting public key'));
                } else {
                  setIsFreighterAllowed(false);
                }
              })
              .catch(() => console.error('Error requesting Freighter Wallet'));
          } else {
            setHasFreighter(false);
          }
        })
        .catch(() => console.error('Error connecting Wallet'));
    };
    fetchWalletData();

    const intervalId = setInterval(fetchWalletData, 5000); // Polling every 5 seconds

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, [setStellarNetwork]);

  async function connect() {
    setAllowed()
      .then(allowed => {
        if (allowed) {
          setIsFreighterAllowed(true);
          // Fetch network
          getNetwork()
            .then(({ network }) => setStellarNetwork(network))
            .catch(() => console.error('Error getting network'));
          // Fetch public key
          requestAccess()
            .then(({ address }) => {
              if (address) {
                setPublicKey(address);
              } else {
                setPublicKey(undefined);
              }
            })
            .catch(() => console.error('Error getting public key'));
        } else {
          setIsFreighterAllowed(false);
        }
      })
      .catch(() => console.error('Error requesting Freighter Wallet'));
  }

  async function signXDR(xdr: string) {
    if (!isFreighterAllowed) {
      await setAllowed()
        .then(({ isAllowed }) => setIsFreighterAllowed(isAllowed))
        .catch(() => console.error('Error requesting access'));
    }

    try {
      const result = await requestAccess();
      if (result && 'address' in result) {
        const { address: publicKey } = result;
        setPublicKey(publicKey);
        const { networkPassphrase, network } = await getNetwork();
        setStellarNetwork(network);
        return signTransaction(xdr, {
          address: publicKey as string,
          networkPassphrase,
        });
      } else {
        console.error('Error: No address returned from requestAccess');
      }
    } catch (error) {
      console.error('Error requesting access', error);
    }
  }

  return {
    publicKey,
    signXDR,
    hasFreighter,
    isFreighterAllowed,
    connect,
    balances,
    transactions,
  };
};
