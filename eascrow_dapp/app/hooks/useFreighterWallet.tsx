"use client";
import { useEffect, useState } from "react";
import {
    isConnected,
    isAllowed,
    requestAccess,
    getNetwork,
    getAddress,
    signTransaction,
    setAllowed,
} from "@stellar/freighter-api";

export const useFreighterWaller = () => {
    const [hasFreighter, setHasFreighter] = useState<boolean>(false);
    const [isFreighterAllowed, setIsFreighterAllowed] = useState<boolean>(false);
    const [publicKey, setPublicKey] = useState<string>();
    const [network, setNetwork] = useState<string>();

    useEffect(() => {
        const fetchWalletData = () => {
            isConnected()
                .then((connected) => {
                    if (connected) {
                        setHasFreighter(true);
                        // Request access, if not already allowed
                        isAllowed()
                            .then(({isAllowed}) => {
                                setIsFreighterAllowed(isAllowed);
                                if (isAllowed) {
                                    setIsFreighterAllowed(true);
                                    // Fetch network
                                    getNetwork()
                                        .then(({network}) => setNetwork(network))
                                        .catch(() => console.error("Error getting network"));
                                    // Fetch public key
                                    getAddress()
                                        .then(({address}) => {
                                            if (address) setPublicKey(address);
                                        })
                                        .catch(() => console.error("Error getting public key"));
                                } else {
                                    setIsFreighterAllowed(false);
                                }
                            })
                            .catch(() => console.error("Error requesting Freighter Wallet"));
                    } else {
                        console.log("is not connected");
                        setHasFreighter(false);
                    }
                })
                .catch(() => console.error("Error connecting Wallet"));
        };
        fetchWalletData();

        const intervalId = setInterval(fetchWalletData, 5000); // Polling every 5 seconds

        return () => clearInterval(intervalId); // Cleanup interval on component unmount
    }, []);

    async function connect() {
        setAllowed()
            .then((allowed) => {
                if (allowed) {
                    setIsFreighterAllowed(true);
                    // Fetch network
                    getNetwork()
                        .then(({network}) => setNetwork(network))
                        .catch(() => console.error("Error getting network"));
                    // Fetch public key
                    requestAccess()
                        .then(({address}) => {
                            if (address) {
                                setPublicKey(address);
                            } else {
                                setPublicKey(undefined);
                            }
                        })
                        .catch(() => console.error("Error getting public key"));
                } else {
                    setIsFreighterAllowed(false);
                }
            })
            .catch(() => console.error("Error requesting Freighter Wallet"));
    }

    async function signXDR(xdr: string) {
        if (!isFreighterAllowed) {
            await setAllowed()
                .then(({isAllowed}) => setIsFreighterAllowed(isAllowed))
                .catch(() => console.error("Error requesting access"));
        }
        const {address: publicKey} = await requestAccess().catch(() =>
            console.error("Error requesting access"),
        );
        setPublicKey(publicKey);
        const {networkPassphrase, network} = await getNetwork();
        setNetwork(network);
        return signTransaction(xdr, {
            accountToSign: publicKey as string,
            networkPassphrase
        });
    }

    return {
        publicKey,
        network,
        signXDR,
        hasFreighter,
        isFreighterAllowed,
        connect,
    };
};
