import { create } from "zustand";
import { useLoading } from "./useLoading";
import axiosClient from "../utils/axios";
import { useWorkspace } from "./useWorkspace";
import { toast } from "react-toastify";

interface IPaymentsStore {
  paymentRequestList: IPaymentRequest[];
  getPaymentRequestList: (page: number, size: number) => void;
}

const usePaymentsStore = create<IPaymentsStore>((set) => {
  const { setLoading } = useLoading.getState();
  const { workspace } = useWorkspace.getState();

  return {
    paymentRequestList: [],
    getPaymentRequestList: async (page: number, size: number) => {
      setLoading(true);
      try {
        const { data } = await axiosClient.post(
          `/payment_request/${workspace.ID}`,
          { page, size }
        );
        set({ paymentRequestList: data.data.rows });
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
