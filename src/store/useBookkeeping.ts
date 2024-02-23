import { create } from "zustand";
import { useLoading } from "./useLoading";
import axiosClient from "../utils/axios";
import { toast } from "react-toastify";
import { useWorkspace } from "./useWorkspace";

interface UseBookkeeping {
  bookkeepingList: IBookkeeping[];
  bookkeepingHiddenList: IBookkeeping[];
  bookkeepingDetails: any;
  getBookkeepingList: (
    workspaceId: number,
    visibility: boolean,
    page?: number
  ) => Promise<number>;
  exportBookkeepingList: (
    workspaceId: number,
    paymentRequestIds: string
  ) => Promise<void>;
  importBookkeepingList: (
    workspaceId: number,
    bookkeepingFile: any
  ) => Promise<void>;
  hideBookkeepingList: (
    workspaceId: number,
    paymentRequestIds: string
  ) => Promise<void>;
  unHideBookkeepingList: (
    workspaceId: number,
    paymentRequestIds: string
  ) => Promise<void>;
  setCurrentBookkeepingDetail: (bookkeeping: IBookkeeping) => void;
}

export const useBookkeeping = create<UseBookkeeping>((set) => {
  const { setLoading } = useLoading.getState();
  return {
    bookkeepingList: [],
    bookkeepingHiddenList: [],
    bookkeepingDetails: {},
    // fetch bookkeeping list
    getBookkeepingList: async (workspaceId, visibility, page = 0) => {
      try {
        setLoading(true);
        const { data } = await axiosClient.get(
          `/bookkeeping/${workspaceId}?hided=${visibility}&page=${page}&sort_field=tx_timestamp&sort_order=desc`
        );
        if (visibility) {
          set({ bookkeepingHiddenList: data.data.rows });
        } else {
          set({ bookkeepingList: data.data.rows });
        }
        if (data?.msg === "success" && data?.code === 200) {
          return data.data.total;
        }
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
    //import bookkeeping
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
    //hide bookkeeping
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
    //un-hide bookkeeping
    unHideBookkeepingList: async (workspaceId, paymentRequestIds) => {
      try {
        setLoading(true);
        const response = await axiosClient.post(
          `/bookkeeping/${workspaceId}/unhide?ids=${paymentRequestIds}`
        );
        console.log(response);
        if (response.data.code === 200) {
          toast.success("Selected items unhide successfully");
        }
      } catch (error: any) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    },
    setCurrentBookkeepingDetail: (bookkeeping: IBookkeeping) => {
      set({ bookkeepingDetails: bookkeeping });
    },
  };
});
