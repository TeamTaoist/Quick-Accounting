import { create } from "zustand";
import { useLoading } from "./useLoading";
import axiosClient from "../utils/axios";

interface UserPaymentRequest {
  userPayment: IPaymentRequest[];
  getUserPayment: () => void;
}

export const useUserPayment = create<UserPaymentRequest>((set) => {
  const { setLoading } = useLoading.getState();
  return {
    userPayment: [],
    getUserPayment: async () => {
      try {
        setLoading(true);
        const { data } = await axiosClient.get("/user/my_payment_requests");
        set({ userPayment: data.data.rows });
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    },
  };
});
