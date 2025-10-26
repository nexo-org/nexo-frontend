import { useEffect, useState } from "react";
import { HaloAptosWallet } from "../utils/haloAptosWallet";
import { Aptos } from "@aptos-labs/ts-sdk";
import { cleanAddress, isValidAddressFormat } from "../utils/addressUtils";

interface HaloWalletData {
  address: string;
  publicKey: string;
  isConnected: boolean;
}

// Local storage keys
const HALO_WALLET_KEY = "halo_wallet_data";
const HALO_ADDRESS_KEY = "halo_address";
const HALO_CONNECTED_KEY = "halo_connected";

export const useHaloWallet = (aptos?: Aptos) => {
  const [walletData, setWalletData] = useState<HaloWalletData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load wallet data from localStorage on mount
  useEffect(() => {
    loadWalletFromStorage();
  }, []);

  const loadWalletFromStorage = () => {
    try {
      const isConnected = localStorage.getItem(HALO_CONNECTED_KEY) === "true";
      const storedData = localStorage.getItem(HALO_WALLET_KEY);

      if (isConnected && storedData) {
        const parsedData = JSON.parse(storedData) as HaloWalletData;
        if (parsedData.address && parsedData.isConnected) {
          // Clean up any potential double 0x prefix from stored data
          const cleanedAddress = cleanAddress(parsedData.address);

          // Validate the cleaned address format
          if (!isValidAddressFormat(cleanedAddress)) {
            console.warn("Invalid address format found in storage, clearing wallet data");
            clearWalletStorage();
            return;
          }

          const cleanedData = {
            ...parsedData,
            address: cleanedAddress,
          };

          // If we cleaned the address, update localStorage
          if (cleanedAddress !== parsedData.address) {
            localStorage.setItem(HALO_WALLET_KEY, JSON.stringify(cleanedData));
            localStorage.setItem(HALO_ADDRESS_KEY, cleanedAddress);
          }

          setWalletData(cleanedData);
        }
      }
    } catch (error) {
      console.error("Error loading wallet from localStorage:", error);
      clearWalletStorage();
    } finally {
      setIsLoading(false);
    }
  };

  const saveWalletToStorage = (data: HaloWalletData) => {
    try {
      // Clean the address before saving
      const cleanedAddress = cleanAddress(data.address);

      if (!isValidAddressFormat(cleanedAddress)) {
        throw new Error(`Invalid address format: ${data.address}`);
      }

      const cleanedData = {
        ...data,
        address: cleanedAddress,
      };

      localStorage.setItem(HALO_WALLET_KEY, JSON.stringify(cleanedData));
      localStorage.setItem(HALO_ADDRESS_KEY, cleanedAddress);
      localStorage.setItem(HALO_CONNECTED_KEY, "true");
      setWalletData(cleanedData);
    } catch (error) {
      console.error("Failed to save wallet data to localStorage:", error);
      throw new Error("Failed to save wallet data");
    }
  };

  const clearWalletStorage = () => {
    localStorage.removeItem(HALO_WALLET_KEY);
    localStorage.removeItem(HALO_ADDRESS_KEY);
    localStorage.removeItem(HALO_CONNECTED_KEY);
    setWalletData(null);
  };

  const createHaloWallet = (customAptos?: Aptos): HaloAptosWallet | null => {
    if (!walletData) return null;
    return new HaloAptosWallet(walletData.address, walletData.publicKey, customAptos || aptos);
  };

  const isConnected = (): boolean => {
    return walletData?.isConnected ?? false;
  };

  const getAddress = (): string | null => {
    return walletData?.address ?? null;
  };

  const getPublicKey = (): string | null => {
    return walletData?.publicKey ?? null;
  };

  const connectHaloCard = async (aptosClient?: Aptos): Promise<HaloWalletData> => {
    try {
      const haloWallet = await HaloAptosWallet.fromHaloCard(aptosClient || aptos);

      const walletData: HaloWalletData = {
        address: haloWallet.address.toString(),
        publicKey: haloWallet.publicKey,
        isConnected: true,
      };

      saveWalletToStorage(walletData);
      return walletData;
    } catch (error) {
      console.error("Failed to connect HaLo card:", error);
      throw error;
    }
  };

  return {
    walletData,
    isLoading,
    isConnected: isConnected(),
    address: getAddress(),
    publicKey: getPublicKey(),
    saveWalletToStorage,
    clearWalletStorage,
    createHaloWallet,
    loadWalletFromStorage,
    connectHaloCard,
  };
};

export default useHaloWallet;