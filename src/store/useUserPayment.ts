import { create } from "zustand";
import { useLoading } from "./useLoading";
import axiosClient from "../utils/axios";

interface UserPaymentRequest {
  // userPayment: IPaymentRequest[];
  userPaymentRequest: {
    page: number;
    size: number;
    total: number;
    rows: IPaymentRequest[];
  };
  myPayment: {
    page: number;
    size: number;
    total: number;
    rows: IPaymentRequest[];
  };
  getUserPaymentRequest: (pageNumber: number) => Promise<void>;
  getMyPayment: (pageNumber: number) => Promise<void>;
}

export const useUserPayment = create<UserPaymentRequest>((set) => {
  const { setLoading } = useLoading.getState();
  return {
    userPaymentRequest: {
      page: 0,
      size: 0,
      total: 0,
      rows: [],
    },
    myPayment: {
      page: 0,
      size: 0,
      total: 0,
      rows: [],
    },
    getUserPaymentRequest: async (pageNumber) => {
      try {
        setLoading(true);
        const { data } = await axiosClient.get(
          `/user/my_payment_requests?page=${pageNumber}&sort_field=submit_ts&sort_order=desc`
        );
        set({ userPaymentRequest: data.data });
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    },
    getMyPayment: async (pageNumber) => {
      try {
        setLoading(true);
        const { data } = await axiosClient.get(
          `/user/my_payments?page=${pageNumber}&sort_field=submit_ts&sort_order=desc`
        );
        set({ myPayment: data.data });
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    },
  };
});
