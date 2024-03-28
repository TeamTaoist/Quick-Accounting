import { create } from "zustand";
import { useLoading } from "./useLoading";
import axiosClient from "../utils/axios";
import { toast } from "react-toastify";

interface UserPaymentRequest {
  // userPayment: IPaymentRequest[];
  userPaymentRequest: {
    page: number;
    size: number;
    total: number;
    rows: IPaymentRequest[];
  };
  userFilterList: IPaymentRequest[];
  myPayment: {
    page: number;
    size: number;
    total: number;
    rows: IPaymentRequest[];
  };
  getUserPaymentRequest: (
    pageNumber?: number,
    size?: number,
    searchKeyWords?: string
  ) => Promise<void>;
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
    userFilterList: [],
    myPayment: {
      page: 0,
      size: 0,
      total: 0,
      rows: [],
    },
    getUserPaymentRequest: async (
      pageNumber = 0,
      size = 0,
      searchKeyWords = ""
    ) => {
      try {
        setLoading(true);
        const { data } = await axiosClient.get(
          `/user/my_payment_requests?page=${pageNumber}&size=${size}&sort_field=submit_ts&sort_order=desc&search_wk_name=${searchKeyWords}`
        );
        if (searchKeyWords === "") {
          set({ userPaymentRequest: data.data });
        }
        set({ userFilterList: data.data.rows });
      } catch (error: any) {
        toast(error?.data?.msg || error?.status || error);
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
      } catch (error: any) {
        toast(error?.data?.msg || error?.status || error);
      } finally {
        setLoading(false);
      }
    },
  };
});
