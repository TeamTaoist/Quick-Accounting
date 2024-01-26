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
  importBookkeepingList: (
    workspaceId: number,
    bookkeepingFile: any
  ) => Promise<void>;
  hideBookkeepingList: (workspaceId: number, paymentRequestIds: string) => void;
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
        set({ bookkeepingList: data.data.rows });
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
    //export bookkeeping
    importBookkeepingList: async (workspaceId, bookkeepingFile) => {
      try {
        setLoading(true);
        const response = await axiosClient.post(
          `/bookkeeping/${workspaceId}/import`,
          bookkeepingFile
        );
        console.log(response);
        if (response.data.code === 200) {
          toast.success("Success! Data imported.");
        }
      } catch (error: any) {
        console.log(error);
        toast.error("Failed to import bookkeeping list.");
      } finally {
        setLoading(false);
      }
    },
    //export bookkeeping
    hideBookkeepingList: async (workspaceId, paymentRequestIds) => {
      try {
        setLoading(true);
        const response = await axiosClient.post(
          `/bookkeeping/${workspaceId}/hide?ids=${paymentRequestIds}`
        );
        console.log(response);
        if (response.data.code === 200) {
          toast.success("Selected items hidden successfully");
        }
      } catch (error: any) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    },
  };
});
