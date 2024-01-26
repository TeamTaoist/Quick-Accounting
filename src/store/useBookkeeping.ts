import { create } from "zustand";
import { useLoading } from "./useLoading";
import axiosClient from "../utils/axios";
import { toast } from "react-toastify";
import { useWorkspace } from "./useWorkspace";

interface UseBookkeeping {
  bookkeepingList: IBookkeeping[];
  getBookkeepingList: (workspaceId: number, visibility: boolean) => void;
  exportBookkeepingList: (
    workspaceId: number,
    paymentRequestIds: string
  ) => Promise<void>;
}

export const useBookkeeping = create<UseBookkeeping>((set) => {
  const { setLoading } = useLoading.getState();
  return {
    bookkeepingList: [],
    // fetch bookkeeping list
    getBookkeepingList: async (workspaceId, visibility) => {
      try {
        setLoading(true);
        const { data } = await axiosClient.get(
          `/bookkeeping/${workspaceId}?hided=${visibility}`
        );
        set({ bookkeepingList: data.data.data });
      } catch (error: any) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    },

    //export bookkeeping
    exportBookkeepingList: async (workspaceId, paymentRequestIds) => {
      try {
        setLoading(true);
        const response = await axiosClient.get(
          `/bookkeeping/${workspaceId}/export?ids=${paymentRequestIds}`,
          {
            responseType: "arraybuffer",
          }
        );
        console.log(response);
        const blob = new Blob([response.data], {
          type: response.headers["Content_Types"],
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "bookkeeping.xlsx";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error: any) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    },
  };
});
