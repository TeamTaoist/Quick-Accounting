import { create } from "zustand";
import { useLoading } from "./useLoading";
import axiosClient from "../utils/axios";
import { toast } from "react-toastify";

interface UsePaymentRequest {
  paymentRequest: any;
}

export const usePaymentRequest = create<UsePaymentRequest>((set) => {
  const { setLoading } = useLoading.getState();
  return {
    paymentRequest: {},
  };
});
