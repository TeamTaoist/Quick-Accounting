import { create } from "zustand";
import { ethers } from "ethers";
import Safe, { EthersAdapter } from "@safe-global/protocol-kit";
import SafeApiKit from "@safe-global/api-kit";
import { useLoading } from "./useLoading";
import { createTokenTransferParams01 } from "../utils/safeTx";

interface ISafeStore {
  safe?: Safe;
  safeApiService?: SafeApiKit;
  owners: string[];
  threshold: number;
  initSafeSDK: (chainId: number, signer: any, safeAddress: string) => void;
  signAndCreateTx: (
    address: string,
    safeAddress: string,
    requests: IPaymentRequest[]
  ) => Promise<string | undefined>;
  getSafeInfo: (safeAddress: string) => void;
}

export const createEthersAdapter = (signer: any) => {
  return new EthersAdapter({
    ethers,
    signerOrProvider: signer,
  });
};

export const useSafeStore = create<ISafeStore>((set, get) => {
  const { setLoading } = useLoading.getState();

  return {
    safe: undefined,
    safeApiService: undefined,
    owners: [],
    threshold: 0,
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
    getSafeInfo: (safeAddress: string) => {
      const { safeApiService } = get();
      if (!safeApiService) {
        return;
      }
      safeApiService.getSafeInfo(safeAddress).then((res) => {
        set({ owners: res.owners, threshold: res.threshold });
      });
    },
    signAndCreateTx: async (
      senderAddress: string,
      safeAddress: string,
      requests: IPaymentRequest[]
    ) => {
      const { safe, safeApiService } = get();
      if (!safe || !safeApiService) {
        return;
      }
      console.log("===senderAddress===", senderAddress);
      // Create transaction
      const nextNonce = await safeApiService.getNextNonce(safeAddress);
      console.log("nextNonce", nextNonce);

      const txParams = requests.map((item) =>
        createTokenTransferParams01(
          senderAddress,
          item.amount,
          item.currency_contract_address
        )
      );

      console.log("===txParams===", txParams);

      const safeTransaction = await safe.createTransaction({
        transactions: [...txParams],
        options: { nonce: nextNonce },
      });

      console.log("===safeTransaction===", safeTransaction);

      const safeTxHash = await safe.getTransactionHash(safeTransaction);

      console.log("===safeTxHash===", safeTxHash);

      const signature = await safe.signTransactionHash(safeTxHash);

      console.log("Proposed a transaction with Safe:", safeAddress);
      console.log("- safeTxHash:", safeTxHash);
      console.log("- Sender:", senderAddress);
      console.log("- Sender signature:", signature);

      // Propose transaction to the service
      await safeApiService.proposeTransaction({
        safeAddress,
        safeTransactionData: safeTransaction.data,
        safeTxHash,
        senderAddress,
        senderSignature: signature.data,
      });
      return safeTxHash;
    },
  };
});
