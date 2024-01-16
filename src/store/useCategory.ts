import { create } from "zustand";
import { useLoading } from "./useLoading";
import axiosClient from "../utils/axios";

interface WorkspaceCategories {
  code: number;
  msg: string;
  data: {
    page: number;
    rows: [];
    size: number;
    total: number;
    data: {
      archived: boolean;
      createdAt: string;
      deletedAt: {
        time: string;
        valid: boolean;
      };
      id: number;
      name: string;
      updatedAt: string;
      workspace_id: number;
    };
  };
}
interface UseCategory {
  workspaceCategories: WorkspaceCategories;
  getWorkspaceCategories: (workspaceId: string) => void;
}

export const useCategory = create<UseCategory>((set) => {
  const { setLoading } = useLoading.getState();
  return {
    workspaceCategories: {
      code: 0,
      msg: "",
      data: {
        page: 0,
        rows: [],
        size: 0,
        total: 0,
        data: {
          archived: false,
          createdAt: "",
          deletedAt: {
            time: "",
            valid: false,
          },
          id: 0,
          name: "",
          updatedAt: "",
          workspace_id: 0,
        },
      },
    },
    getWorkspaceCategories: async (workspaceId) => {
      try {
        setLoading(true);
        const { data } = await axiosClient.get(
          `/workspace_categories/categories_by_workspace_id/${workspaceId}`
        );
        set({ workspaceCategories: data });
        // if (data.msg === "success" && data.code === 200) {
        //   navigate("/assets");
        // }
      } catch (error: any) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    },
  };
});
