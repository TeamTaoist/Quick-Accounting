import { create } from "zustand";
import { useLoading } from "./useLoading";
import axiosClient from "../utils/axios";

interface UserPaymentRequest {
  userPayment: {
    page: number;
    size: number;
    total: number;
    rows: [];
  };
  getUserPayment: () => void;
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
    getUserPayment: async () => {
      try {
        setLoading(true);
        const { data } = await axiosClient.get("/user/my_payment_requests");
        set({ userPayment: data.data });
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    },
  };
});
