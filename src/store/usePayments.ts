import { create } from "zustand";
import { useLoading } from "./useLoading";
import axiosClient from "../utils/axios";
import { useWorkspace } from "./useWorkspace";
import { toast } from "react-toastify";

interface IPaymentsStore {
  paymentRequestList: IPaymentRequest[];
  paymentRequestDetails: IPaymentRequest;
  paymentRequestGroupDetails: IPaymentRequest[];
  paymentRquestMap: Map<string, IPaymentRequest[]>;
  getPaymentRequestList: (
    workspaceId: number,
    isRejected?: boolean,
    page?: number,
    size?: number
  ) => Promise<number>;
  createPaymentRequest: (
    workspaceId: number,
    paymentRequestBody: IPaymentRequestBody,
    navigate: any
  ) => Promise<boolean | undefined>;
  getPaymentRequestDetails: (
    workspaceId: number,
    paymentRequestId: number,
    paymentId: number
  ) => Promise<boolean | undefined>;
  getPaymentRequestGroupDetails: (
    workspaceId: number,
    paymentRequestId: string
  ) => Promise<boolean | undefined>;
  approvePaymentRequest: (
    workspaceId: string | undefined,
    paymentRequestIds: string,
    navigate: any,
    safeTxHash?: string
  ) => void;
  rejectPaymentRequest: (
    workspaceId: string | undefined,
    paymentRequestIds: string
  ) => Promise<void>;
  getPaymentRequestBySafeTxHash: (
    workspaceId: number,
    safeTxHash: string[]
  ) => Promise<void>;
  setCurrentPaymentRequestDetail: (paymentRequest: IPaymentRequest) => void;
  getFailedPaymentRequestList: (
    workspaceId: number,
    isInqueue?: boolean,
    page?: number,
    size?: number
  ) => Promise<IPageResponse<IPaymentRequest>>;
  updatePaymentRequestCategory: (
    workspaceId: string | undefined,
    paymentRequestId: string,
    updatedPaymentBody: any
  ) => Promise<void>;
}

const usePaymentsStore = create<IPaymentsStore>((set, get) => {
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
      decimals: 18,
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
    paymentRquestMap: new Map(),
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
        if (data.msg === "success" && data.code === 200) {
          return data.data.total;
        }
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
        return true;
      } catch (error: any) {
        toast.error(error?.data.msg || error?.status || error);
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
    // get payment request details
    getPaymentRequestGroupDetails: async (workspaceId, paymentRequestId) => {
      setLoading(true);
      try {
        const { data } = await axiosClient.get(
          `/payment_request/${workspaceId}/${paymentRequestId}`
        );
        set({ paymentRequestGroupDetails: data.data });
        return true;
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
          navigate(`/workspace/${workspaceId}/queue`);
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
    // get payment reqeust by safe tx hash
    getPaymentRequestBySafeTxHash: async (
      workspaceId: number,
      safeTxHash: string[]
    ) => {
      setLoading(true);
      try {
        const reqs = safeTxHash.map((hash) =>
          axiosClient.get(
            `/payment_requests/${workspaceId}/payment_requests_by_safe_tx_hash?safe_tx_hash=${hash}`
          )
        );
        Promise.all(reqs)
          .then((respons) => {
            const { paymentRquestMap } = get();
            respons.forEach((resp, i) => {
              console.log(resp.data);
              if (resp?.data?.msg === "success" && resp?.data?.code === 200) {
                paymentRquestMap.set(safeTxHash[i], resp.data.data);
              }
            });
            set({ paymentRquestMap: new Map(paymentRquestMap) });
          })
          .catch((error) => {
            toast.error(error?.data?.msg || error?.status || error);
            console.error(error);
          })
          .finally(() => {
            setLoading(false);
          });
      } catch (error: any) {
      } finally {
      }
    },
    // update current Payment Request detail
    setCurrentPaymentRequestDetail: (paymentRequest: IPaymentRequest) => {
      set({ paymentRequestDetails: paymentRequest });
    },
    getFailedPaymentRequestList: async (
      workspaceId: number,
      isInqueue = false,
      page = 0,
      size = 10
    ) => {
      try {
        setLoading(true);
        const { data } = await axiosClient.get(
          isInqueue
            ? `/queue/${workspaceId}?failed=true`
            : `/payment_request/${workspaceId}?rejected=true`,
          {
            params: { page, size },
          }
        );
        if (data?.msg === "success" && data?.code === 200) {
          return data.data;
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
    // update payment request category & property
    updatePaymentRequestCategory: async (
      workspaceId,
      paymentRequestId,
      updatedPaymentBody
    ) => {
      setLoading(true);
      try {
        const { data } = await axiosClient.put(
          `/payment_request/${workspaceId}/${paymentRequestId}`,
          updatedPaymentBody
        );
        if (data.msg === "success" && data.code === 200) {
          toast.success("Updated successfully");
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
