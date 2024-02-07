import { create } from "zustand";
import { useLoading } from "./useLoading";
import axiosClient from "../utils/axios";
import { toast } from "react-toastify";

interface UseQueue {
  queueList: QueueList[];
  getQueueList: (workspaceId: number, queueStatus: boolean) => void;
}

export const useQueue = create<UseQueue>((set) => {
  const { setLoading } = useLoading.getState();
  return {
    queueList: [],
    getQueueList: async (workspaceId, queueStatus) => {
      try {
        setLoading(true);
        const { data } = await axiosClient.get(
          `/queue/${workspaceId}?failed=${queueStatus}`
        );
        set({ queueList: data.data.rows });
      } catch (error: any) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    },
  };
});
