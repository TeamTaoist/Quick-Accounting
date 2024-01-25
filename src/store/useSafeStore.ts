import { create } from "zustand";
import { ethers } from "ethers";
import Safe, { EthersAdapter } from "@safe-global/protocol-kit";
import SafeApiKit from "@safe-global/api-kit";

interface ISafeStore {
  safe?: Safe;
  safeApiService?: SafeApiKit;
  initSafeSDK: (chainId: number, signer: any, safeAddress: string) => void;
}

export const createEthersAdapter = (signer: any) => {
  return new EthersAdapter({
    ethers,
    signerOrProvider: signer,
  });
};

export const useSafeStore = create<ISafeStore>((set) => {
  return {
    safe: undefined,
    safeApiService: undefined,
    initSafeSDK: async (chainId: number, signer: any, safeAddress: string) => {
      console.log("signer: ", signer, chainId);
      const safe = await Safe.create({
        ethAdapter: createEthersAdapter(signer),
        safeAddress,
      });
      console.log("safe", safe);
      const safeApiService = new SafeApiKit({
        chainId: BigInt(chainId),
      });
      console.log("safeApiService", safeApiService);
      set({ safe, safeApiService });
    },
  };
});
