import { create } from "zustand";
import { useLoading } from "./useLoading";
import axiosClient from "../utils/axios";

interface UserPaymentRequest {
  // userPayment: IPaymentRequest[];
  userPayment: {
    page: number;
    size: number;
    total: number;
    rows: IPaymentRequest[];
  };
  getUserPayment: (pageNumber: number) => Promise<void>;
}

export const useUserPayment = create<UserPaymentRequest>((set) => {
  const { setLoading } = useLoading.getState();
  return {
    userPayment: {
      page: 0,
      size: 0,
      total: 0,
      rows: [],
    },
    getUserPayment: async (pageNumber) => {
      try {
        setLoading(true);
        const { data } = await axiosClient.get(
          `/user/my_payment_requests?page=${pageNumber}`
        );
        set({ userPayment: data.data });
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    },
  };
});
