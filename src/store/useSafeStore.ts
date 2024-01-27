import { create } from "zustand";
import { ethers } from "ethers";
import Safe, { EthersAdapter } from "@safe-global/protocol-kit";
import SafeApiKit from "@safe-global/api-kit";
import { useLoading } from "./useLoading";
import { createTokenTransferParams } from "../utils/safeTx";
import {
  SafeTransaction,
  SafeMultisigTransactionResponse,
} from "@safe-global/safe-core-sdk-types";
import { toast } from "react-toastify";
import {
  getTransactionQueue,
  TransactionListItem,
  TransactionListItemType,
} from "@safe-global/safe-gateway-typescript-sdk";

interface ISafeStore {
  safe?: Safe;
  safeApiService?: SafeApiKit;
  isReady: boolean;
  owners: string[];
  threshold: number;
  initSafeSDK: (chainId: number, signer: any, safeAddress: string) => void;
  signAndCreateTx: (
    address: string,
    safeAddress: string,
    requests: IPaymentRequest[]
  ) => Promise<string | undefined>;
  getSafeInfo: (safeAddress: string) => void;
  getQueueTx: (
    chainId: number,
    safeAddress: string
  ) => Promise<IQueueGroupItemProps[]>;
  confirmTx: (safeTxHash: string) => void;
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
    isReady: false,
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
      set({ safe, safeApiService, isReady: true });
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
    getQueueTx: async (
      chainId: number,
      safeAddress: string
    ): Promise<IQueueGroupItemProps[]> => {
      const result = await getTransactionQueue(String(chainId), safeAddress);
      // const result = await safeApiService.getPendingTransactions(safeAddress);
      // console.log("queueTx", result.results);
      const array = new Array<IQueueGroupItemProps>();
      result.results.forEach((item: TransactionListItem) => {
        if (item.type === TransactionListItemType.LABEL) {
          array.push(item);
        } else if (item.type === TransactionListItemType.TRANSACTION) {
          if (item.transaction.executionInfo?.type === "MULTISIG") {
            array.push({
              type: item.type,
              transactions: [
                {
                  nonce: item.transaction.executionInfo?.nonce,
                  confirmationsRequired:
                    item.transaction.executionInfo?.confirmationsRequired,
                  confirmationsSubmitted:
                    item.transaction.executionInfo?.confirmationsSubmitted,
                  safeTxHash: item.transaction.id.split("_")[2],
                  timestamp: item.transaction.timestamp,
                  // @ts-ignore
                  actionCount: item.transaction.txInfo.actionCount,
                  txStatus: item.transaction.txStatus,
                  missingSigners:
                    item.transaction.executionInfo?.missingSigners?.map(
                      (item) => item.value
                    ) || [],
                },
              ],
            });
          }
        } else {
          return { type: item.type };
        }
      });
      return array;
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
      try {
        setLoading(true);
        console.log("===senderAddress===", senderAddress);
        // Create transaction
        const nextNonce = await safeApiService.getNextNonce(safeAddress);
        console.log("nextNonce", nextNonce);

        const txParams = requests.map((item) =>
          createTokenTransferParams(
            senderAddress,
            item.amount,
            item.decimals,
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
      } catch (error: any) {
        toast.error(error?.data?.msg || error?.status || error);
      } finally {
        setLoading(false);
      }
    },
    confirmTx: async (safeTxHash: string) => {
      const { safe, safeApiService } = get();
      if (!safe || !safeApiService) {
        return;
      }
      try {
        setLoading(true);
        const signature = await safe.signTransactionHash(safeTxHash);

        // Confirm the Safe transaction
        const signatureResponse = await safeApiService.confirmTransaction(
          safeTxHash,
          signature.data
        );

        console.log("Added a new signature to transaction with safeTxGas");
        console.log("- Signer signature:", signatureResponse.signature);

      } catch (error: any) {
        toast.error(error?.data?.msg || error?.status || error);
      } finally {
        setLoading(false);
      }
    },
    rejectTx: async (nonce: number) => {
      const { safe, safeApiService } = get();
      if (!safe || !safeApiService) {
        return;
      }
      await safe.createRejectionTransaction(nonce);
    },
    executeTx: async (
      safeTransaction: SafeTransaction | SafeMultisigTransactionResponse
    ) => {
      const { safe, safeApiService } = get();
      if (!safe || !safeApiService) {
        return;
      }
      const isTxExecutable = await safe.isValidTransaction(safeTransaction);

      if (isTxExecutable) {
        // Execute the transaction
        const txResponse = await safe.executeTransaction(safeTransaction);
        const contractReceipt = await txResponse.transactionResponse?.wait();

        console.log("Transaction executed.");
        console.log("- Transaction hash:", contractReceipt?.blockHash);
      } else {
        console.log("Transaction invalid. Transaction was not executed.");
      }
    },
  };
});
