import { create } from "zustand";
import { useLoading } from "./useLoading";
import axiosClient from "../utils/axios";
import { toast } from "react-toastify";

interface UseCategoryProperty {
  workspaceCategoryProperties: any;
  getWorkspaceCategoryProperties: (workspaceId: number) => void;
}

export const useCategoryProperty = create<UseCategoryProperty>((set) => {
  const { setLoading } = useLoading.getState();
  return {
    workspaceCategoryProperties: [
      {
        ID: 0,
        CreatedAt: "",
        UpdatedAt: "",
        DeletedAt: "",
        workspace_id: 0,
        name: "",
        archived: false,
        properties: [
          {
            ID: 0,
            CreatedAt: "",
            UpdatedAt: "",
            DeletedAt: "",
            workspace_id: 0,
            category_id: 0,
            name: "",
            type: "",
            values: "",
          },
        ],
      },
    ],
    getWorkspaceCategoryProperties: async (workspaceId) => {
      try {
        setLoading(true);
        const { data } = await axiosClient.get(
          `/workspace_categories/category_and_property_by_workspace_id/${workspaceId}`
        );
        set({ workspaceCategoryProperties: data.data });
      } catch (error: any) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    },
  };
});
