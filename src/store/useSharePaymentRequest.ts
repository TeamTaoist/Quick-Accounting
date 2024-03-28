import { create } from "zustand";
import { useLoading } from "./useLoading";
import axiosClient from "../utils/axios";
import { toast } from "react-toastify";
import { Workspace, useWorkspace } from "./useWorkspace";

interface UseSharePaymentRequest {
  shareData: ISharePaymentList;
  createSharePaymentRequest: (
    shareCode: string | undefined,
    sharePaymentRequestFormData: any
  ) => Promise<boolean | undefined>;
  getPaymentRequestShareCode: (
    workspaceId: string | undefined
  ) => Promise<string | undefined>;
  getPaymentRequestShareCodeData: (
    shareCode: string | undefined
  ) => Promise<Workspace>;
  saveSharePaymentRequest: (
    shareCode: string | undefined,
    sharePaymentRequestFormData: any
  ) => Promise<boolean | undefined>;
}

export const useSharePaymentRequest = create<UseSharePaymentRequest>((set) => {
  const { setLoading } = useLoading.getState();
  // const { updateWorkspace } = useWorkspace();
  return {
    shareData: {
      category_and_properties: [],
      payment_request_items: null,
      workspace: {
        ID: 0,
        CreatedAt: "",
        UpdatedAt: "",
        DeletedAt: "",
        name: "",
        avatar: "",
        vault_wallet: "",
        chain_id: 0,
        creator: "",
      },
    },
    createSharePaymentRequest: async (
      shareCode,
      sharePaymentRequestFormData
    ) => {
      try {
        setLoading(true);
        const { data } = await axiosClient.post(
          `/payment_request_share/${shareCode}/submit`,
          sharePaymentRequestFormData
        );
        if (data.msg === "success" && data.code === 200) {
          toast("Payment request submitted");
          return true;
        }
      } catch (error: any) {
        toast(error?.response?.data?.msg);
      } finally {
        setLoading(false);
      }
    },
    //get new share code
    getPaymentRequestShareCode: async (workspaceId) => {
      try {
        setLoading(true);
        const { data } = await axiosClient.get(
          `/workspace/${workspaceId}/new_share_code`
        );
        if (data.msg === "success" && data.code === 200) {
          toast("The share link has been copied to your clipboard!");
          return data.data.share_code;
        }
      } catch (error: any) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    },
    //get payment request data
    getPaymentRequestShareCodeData: async (shareCode) => {
      try {
        setLoading(true);
        const { data } = await axiosClient.get(
          `/payment_request_share/${shareCode}`
        );
        set({ shareData: data.data });
        // updateWorkspace(data.data.workspace);
        if (data.msg === "success" && data.code === 200) {
          return data.data.workspace;
        }
      } catch (error: any) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    },
    // save payment request
    saveSharePaymentRequest: async (shareCode, sharePaymentRequestFormData) => {
      try {
        setLoading(true);
        const { data } = await axiosClient.post(
          `/payment_request_share/${shareCode}/save`,
          sharePaymentRequestFormData
        );
        if (data.msg === "success" && data.code === 200) {
          toast("Payment request saved");
          return true;
        }
      } catch (error: any) {
        toast(error?.response?.data?.msg);
      } finally {
        setLoading(false);
      }
    },
  };
});
