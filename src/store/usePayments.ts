import { create } from "zustand";
import { useLoading } from "./useLoading";
import axiosClient from "../utils/axios";
import { useWorkspace } from "./useWorkspace";
import { toast } from "react-toastify";

interface IPaymentsStore {
  paymentRequestList: IPaymentRequest[];
  paymentRequestDetails: IPaymentRequest;
  paymentRequestGroupDetails: IPaymentRequest[];
  getPaymentRequestList: (
    workspaceId: number,
    isRejected?: boolean,
    page?: number,
    size?: number
  ) => void;
  createPaymentRequest: (
    workspaceId: number,
    paymentRequestBody: IPaymentRequestBody,
    navigate: any
  ) => Promise<boolean | undefined>;
  getPaymentRequestDetails: (
    workspaceId: number,
    paymentRequestId: number,
    paymentId: number
  ) => void;
  getPaymentRequestGroupDetails: (paymentRequestId: string) => void;
  approvePaymentRequest: (
    workspaceId: string | undefined,
    paymentRequestIds: string,
    navigate: any,
    safeTxHash?: string
  ) => void;
  rejectPaymentRequest: (
    workspaceId: string | undefined,
    paymentRequestIds: string
  ) => void;
}

const usePaymentsStore = create<IPaymentsStore>((set) => {
  const { setLoading } = useLoading.getState();
  const { workspace } = useWorkspace.getState();

  return {
    paymentRequestList: [],
    paymentRequestDetails: {
      ID: 0,
      CreatedAt: "",
      UpdatedAt: "",
      DeletedAt: "",
      workspace_id: 0,
      payment_request_id: 0,
      recipient: "",
      amount: "",
      currency_name: "",
      currency_contract_address: "",
      category_id: 0,
      category_name: "",
      category_properties: "",
      safe_id: "",
      tx_hash: "",
      safe_tx_hash: "",
      tx_timestamp: 0,
      status: 0,
      hide: false,
    },
    paymentRequestGroupDetails: [],
    getPaymentRequestList: async (
      workspaceId,
      isRejected = false,
      page = 0,
      size = 10
    ) => {
      setLoading(true);
      try {
        const { data } = await axiosClient.get(
          `/payment_request/${workspaceId}?rejected=${isRejected}&page=${page}&size=${size}`
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
          return true;
        }
      } catch (error: any) {
        toast.error(error?.data.msg || error?.status || error);
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
    // get payment request details
    getPaymentRequestDetails: async (
      workspaceId,
      paymentRequestId,
      paymentId
    ) => {
      setLoading(true);
      try {
        const { data } = await axiosClient.get(
          `/payment_request/${workspaceId}/${paymentRequestId}/item/${paymentId}`
        );
        set({ paymentRequestDetails: data.data });
      } catch (error: any) {
        toast.error(error?.data.msg || error?.status || error);
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
    // get payment request details
    getPaymentRequestGroupDetails: async (paymentRequestId) => {
      setLoading(true);
      try {
        const { data } = await axiosClient.get(
          `/payment_request/${workspace.ID}/${paymentRequestId}`
        );
        set({ paymentRequestGroupDetails: data.data });
      } catch (error: any) {
        toast.error(error?.data.msg || error?.status || error);
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
    // approve payment request
    approvePaymentRequest: async (
      workspaceId,
      paymentRequestIds,
      navigate,
      safeTxHash
    ) => {
      setLoading(true);
      try {
        const { data } = await axiosClient.post(
          `/payment_requests/${workspaceId}/approve?ids=${paymentRequestIds}&safe_tx_hash=${safeTxHash}`
        );
        if (data.msg === "success" && data.code === 200) {
          toast.success("Payment request on chain successfully");
          navigate("/workspace/8/queue");
        }
      } catch (error: any) {
        toast.error(error?.data.msg || error?.status || error);
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
    // approve payment request
    rejectPaymentRequest: async (workspaceId, paymentRequestIds) => {
      setLoading(true);
      try {
        const { data } = await axiosClient.post(
          `/payment_requests/${workspaceId}/reject?ids=${paymentRequestIds}`
        );
        if (data.msg === "success" && data.code === 200) {
          toast.success("Payment request rejected successfully");
        }
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
