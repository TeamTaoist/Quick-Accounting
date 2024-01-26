import { create } from "zustand";
import { useLoading } from "./useLoading";
import axiosClient from "../utils/axios";
import { toast } from "react-toastify";
import { useWorkspace } from "./useWorkspace";

interface UseBookkeeping {
  bookkeepingList: IBookkeeping[];
  getBookkeepingList: (visibility: boolean) => void;
}

export const useBookkeeping = create<UseBookkeeping>((set) => {
  const { setLoading } = useLoading.getState();
  const { workspace } = useWorkspace.getState();
  return {
    bookkeepingList: [],
    getBookkeepingList: async (visibility) => {
      try {
        setLoading(true);
        const { data } = await axiosClient.get(
          `/bookkeeping/${workspace.ID}?hided=${visibility}`
        );
        set({ bookkeepingList: data.data.data });
      } catch (error: any) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    },
  };
});
