'use client';
import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useEffect,
  ReactNode,
  useCallback,
} from 'react';
import { Env } from '../../lib/env';

interface StellarContextType {
  adminPublicKey: string | null;
  adminSecretKey: string | null;
  network: string | null;
  rpcUrl: string | null;
  horizonUrl: string | null;
  networkPassphrase: string | null;
  wasmHash: string | null;
  getSAC: () => string;
  setNetwork: (network: string) => void;
}
const TESTNET_XLM_SAC =
  'CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC';
const MAINNET_XLM_SAC =
  'CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA';
const StellarContext = createContext<StellarContextType | undefined>(undefined);

interface StellarProviderProps {
  children: ReactNode;
}

export const StellarProvider: React.FC<StellarProviderProps> = ({
  children,
}) => {
  const [network, setNetwork] = useState<string | null>(null);
  const [adminPublicKey, setAdminPublicKey] = useState<string | null>(null);
  const [adminSecretKey, setAdminSecretKey] = useState<string | null>(null);
  const [rpcUrl, setRpcUrl] = useState<string | null>(null);
  const [horizonUrl, setHorizonUrl] = useState<string | null>(null);
  const [networkPassphrase, setNetworkPassphrase] = useState<string | null>(
    null
  );
  const [wasmHash, setWasmHash] = useState<string | null>(null);

  const env = useMemo(() => {
    return new Env(network as 'testnet' | 'mainnet');
  }, [network]);

  const getSAC = useCallback(() => {
    if (network?.toLowerCase() === 'testnet') {
      return TESTNET_XLM_SAC;
    } else {
      return MAINNET_XLM_SAC;
    }
  }, [network]);

  useEffect(() => {
    setAdminPublicKey(env.env.adminPublicKey);
    setAdminSecretKey(env.env.adminSecretKey);
    setRpcUrl(env.env.rpcUrl);
    setHorizonUrl(env.env.horizonUrl);
    setNetworkPassphrase(env.env.networkPassphrase);
    setWasmHash(env.env.wasmHash);
  }, [env, network]);

  const value: StellarContextType = {
    adminPublicKey,
    adminSecretKey,
    network,
    rpcUrl,
    horizonUrl,
    networkPassphrase,
    wasmHash,
    getSAC,
    setNetwork,
  };

  return (
    <StellarContext.Provider value={value}>{children}</StellarContext.Provider>
  );
};

export const useStellar = () => {
  const context = useContext(StellarContext);
  if (context === undefined) {
    throw new Error('useStellar must be used within a StellarProvider');
  }
  return context;
};
