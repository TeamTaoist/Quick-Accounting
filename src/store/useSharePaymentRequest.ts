import { create } from "zustand";
import { useLoading } from "./useLoading";
import axiosClient from "../utils/axios";
import { toast } from "react-toastify";
import { useWorkspace } from "./useWorkspace";

interface UseSharePaymentRequest {
  createSharePaymentRequest: (
    createSharePaymentRequest: any
  ) => Promise<boolean | undefined>;
}

export const useSharePaymentRequest = create<UseSharePaymentRequest>((set) => {
  const { setLoading } = useLoading.getState();
  const { workspace } = useWorkspace.getState();
  return {
    createSharePaymentRequest: async (sharePaymentRequestFormData) => {
      try {
        setLoading(true);
        const { data } = await axiosClient.post(
          `/payment_requests/${workspace.ID}/create_from_share`,
          sharePaymentRequestFormData
        );
        if (data.msg === "success" && data.code === 200) {
          toast.success("Payment request submitted");
          return true;
        }
      } catch (error: any) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    },
  };
});
