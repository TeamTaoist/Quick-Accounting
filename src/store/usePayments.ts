import { create } from "zustand";
import { useLoading } from "./useLoading";
import axiosClient from "../utils/axios";
import { useWorkspace } from "./useWorkspace";
import { toast } from "react-toastify";

interface IPaymentsStore {
  paymentRequestList: IPaymentRequest[];
  paymentRequestDetails: any;
  getPaymentRequestList: (
    workspaceId: number,
    page: number,
    size: number
  ) => void;
  createPaymentRequest: (
    workspaceId: number,
    paymentRequestBody: IPaymentRequestBody,
    navigate: any
  ) => void;
  getPaymentRequestDetails: (
    workspaceId: number,
    paymentRequestId: number
  ) => void;
}

const usePaymentsStore = create<IPaymentsStore>((set) => {
  const { setLoading } = useLoading.getState();
  const { workspace } = useWorkspace.getState();

  return {
    paymentRequestList: [],
    paymentRequestDetails: {},
    getPaymentRequestList: async (workspaceId, page: number, size: number) => {
      setLoading(true);
      try {
        const { data } = await axiosClient.get(
          `/payment_request/${workspaceId}?page=${page}&size=${size}`
        );
        set({ paymentRequestList: data.data.rows });
      } catch (error: any) {
        toast.error(error?.data.msg || error?.status || error);
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
    // create payment request
    createPaymentRequest: async (workspaceId, paymentRequestBody, navigate) => {
      setLoading(true);
      try {
        const { data } = await axiosClient.post(
          `/payment_request/${workspaceId}`,
          paymentRequestBody
        );
        if (data.msg === "success" && data.code === 200) {
          navigate("/workspace/8/payment-request");
        }
      } catch (error: any) {
        toast.error(error?.data.msg || error?.status || error);
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
    // get payment request details
    getPaymentRequestDetails: async (workspaceId, paymentRequestId) => {
      setLoading(true);
      try {
        const { data } = await axiosClient.get(
          `/payment_request/${workspaceId}/${paymentRequestId}`
        );
        set({ paymentRequestDetails: data.data });
      } catch (error: any) {
        toast.error(error?.data.msg || error?.status || error);
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
  };
});

export default usePaymentsStore;
