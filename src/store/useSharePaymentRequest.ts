import { create } from "zustand";
import { useLoading } from "./useLoading";
import axiosClient from "../utils/axios";
import { toast } from "react-toastify";
import { useWorkspace } from "./useWorkspace";

interface UseSharePaymentRequest {
  sharePaymentRequestList: any;
  createSharePaymentRequest: (createSharePaymentRequest: any) => void;
}

export const useSharePaymentRequest = create<UseSharePaymentRequest>((set) => {
  const { setLoading } = useLoading.getState();
  const { workspace } = useWorkspace.getState();
  return {
    sharePaymentRequestList: [],
    createSharePaymentRequest: async (sharePaymentRequestFormData) => {
      try {
        setLoading(true);
        const { data } = await axiosClient.post(
          `/payment_requests/${workspace.ID}/create_from_share`,
          sharePaymentRequestFormData
        );
        set({ sharePaymentRequestList: data.data });
      } catch (error: any) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    },
  };
});
