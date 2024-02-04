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
  TransactionInfoType,
  ConflictType,
} from "@safe-global/safe-gateway-typescript-sdk";
import axiosClient from "../utils/axios";

interface ISafeStore {
  safe?: Safe;
  safeApiService?: SafeApiKit;
  isReady: boolean;
  owners: string[];
  threshold: number;
  currentNonce?: number;
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
  confirmTx: (safeTxHash: string) => Promise<boolean | undefined>;
  createRejectTx: (
    safeAddress: string,
    senderAddress: string,
    nonce: number
  ) => Promise<boolean | void>;
  executeTx: (
    workspace_id: number,
    safeTxHash: string,
    requests: IPaymentRequest[],
    isReject?: boolean
  ) => Promise<boolean | undefined>;
  getConfirmedOwners: (safeTxHash: string) => Promise<string[]>;
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
      setLoading(true);
      try {
        const result = await getTransactionQueue(String(chainId), safeAddress);
        const array = new Array<IQueueGroupItemProps>();
        const currentConflict: {
          nonce: number;
          transactions: IQueueTransaction[];
        } = {
          nonce: -1,
          transactions: [],
        };
        let currentNonce: number | undefined = undefined;
        result.results.forEach((item: TransactionListItem) => {
          if (item.type === TransactionListItemType.LABEL) {
            array.push(item);
          } else if (item.type === TransactionListItemType.CONFLICT_HEADER) {
            currentConflict.nonce = item.nonce;
            if (!currentNonce) {
              currentNonce = item.nonce;
            }
          } else if (item.type === TransactionListItemType.TRANSACTION) {
            if (
              item.transaction.executionInfo?.type === "MULTISIG" &&
              [
                TransactionInfoType.CUSTOM,
                TransactionInfoType.TRANSFER,
              ].includes(item.transaction.txInfo.type)
            ) {
              if (!currentNonce) {
                currentNonce = item.transaction.executionInfo?.nonce;
              }
              const tx = {
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
              };
              if (
                item.transaction.executionInfo.nonce === currentConflict.nonce
              ) {
                if (
                  item.transaction.txInfo.type === TransactionInfoType.CUSTOM &&
                  item.transaction.txInfo.isCancellation
                ) {
                  currentConflict.transactions[1] = tx;
                } else if (
                  item.transaction.txInfo.type ===
                    TransactionInfoType.TRANSFER ||
                  item.transaction.txInfo.type === TransactionInfoType.CUSTOM
                ) {
                  currentConflict.transactions[0] = tx;
                }
              } else {
                array.push({
                  type: item.type,
                  transactions: [tx],
                });
              }
            }
            if (
              item.conflictType === ConflictType.END &&
              currentConflict.nonce > -1
            ) {
              array.push({
                type: item.type,
                transactions: [...currentConflict.transactions],
              });
              currentConflict.nonce = -1;
              currentConflict.transactions = [];
            }
          } else {
            return { type: item.type };
          }
        });
        set({ currentNonce });
        return array;
      } catch (error: any) {
        console.error(error);
        toast.error(error);
      } finally {
        setLoading(false);
      }
      return [];
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

        const signature = await safe.signTypedData(safeTransaction);

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
        return true;
      } catch (error: any) {
        toast.error(error?.data?.msg || error?.status || error);
      } finally {
        setLoading(false);
      }
    },
    createRejectTx: async (
      safeAddress: string,
      senderAddress: string,
      nonce: number
    ) => {
      const { safeApiService, safe } = get();
      if (!safeApiService || !safe) {
        return;
      }

      try {
        setLoading(true);
        const safeTransaction = await safe.createRejectionTransaction(nonce);
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
        return true;
      } catch (error: any) {
        console.error(error);
        toast.error(error);
      } finally {
        setLoading(false);
      }
    },
    executeTx: async (
      workspace_id: number,
      safeTxHash: string,
      requests: IPaymentRequest[],
      isReject?: boolean
    ) => {
      const { safeApiService, safe } = get();
      if (!safeApiService || !safe) {
        return;
      }

      try {
        setLoading(true);
        const safeTransaction = await safeApiService.getTransaction(safeTxHash);

        console.log("===safeTransaction===", safeTransaction);

        const isTxExecutable = await safe.isValidTransaction(safeTransaction);

        console.log("===isTxExecutable===", isTxExecutable);

        if (isTxExecutable) {
          // Execute the transaction
          const txResponse = await safe.executeTransaction(safeTransaction);
          const contractReceipt = await txResponse.transactionResponse?.wait();

          console.log("Transaction executed.");
          console.log("- Transaction hash:", contractReceipt?.hash);

          await axiosClient.post(
            `/payment_requests/${workspace_id}/${
              isReject ? "mark_failed" : "mark_executed"
            }?ids=${requests.map((r) => r.ID).join(",")}&tx=${
              contractReceipt?.hash
            }&timestamp=${Date.now()}`
          );
          return true;
        } else {
          console.log("Transaction invalid. Transaction was not executed.");
          toast.error("Transaction invalid. Transaction was not executed.");
        }
      } catch (error: any) {
        toast.error(error?.data?.msg || error?.status || error);
      } finally {
        setLoading(false);
      }
    },
    getConfirmedOwners: async (safeTxHash: string) => {
      const { safeApiService, safe } = get();
      if (!safeApiService || !safe) {
        return [];
      }
      try {
        const res = await safeApiService.getTransactionConfirmations(
          safeTxHash
        );
        return res.results.map((item) => item.owner);
      } catch (error) {
        console.error("getConfirmedOwners failed", error);
      }
      return [];
    },
  };
});
