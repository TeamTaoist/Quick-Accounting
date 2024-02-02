import { create } from "zustand";
import { useLoading } from "./useLoading";
import axiosClient from "../utils/axios";
import { toast } from "react-toastify";

interface UseSharePaymentRequest {
  createSharePaymentRequest: (
    workspaceId: number | string,
    createSharePaymentRequest: any
  ) => Promise<boolean | undefined>;
  getPaymentRequestShareCode: (
    workspaceId: string | undefined
  ) => Promise<string | undefined>;
}

export const useSharePaymentRequest = create<UseSharePaymentRequest>((set) => {
  const { setLoading } = useLoading.getState();
  return {
    createSharePaymentRequest: async (
      workspaceId,
      sharePaymentRequestFormData
    ) => {
      try {
        setLoading(true);
        const { data } = await axiosClient.post(
          `/payment_requests/${workspaceId}/create_from_share`,
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
    //get new share code
    getPaymentRequestShareCode: async (workspaceId) => {
      try {
        setLoading(true);
        const { data } = await axiosClient.get(
          `/workspace/${workspaceId}/new_share_code`
        );
        if (data.msg === "success" && data.code === 200) {
          // toast.success("The share link has been copied to your clipboard!");
          toast.success("The share link has been copied to your clipboard!");
          return data.data.share_code;
        }
      } catch (error: any) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    },
  };
});
