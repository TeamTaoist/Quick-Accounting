import { create } from "zustand";
import { useLoading } from "./useLoading";
import axiosClient from "../utils/axios";
import { toast } from "react-toastify";
interface CategoryProperties {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: string;
  workspace_id: number;
  name: string;
  archived: boolean;
  properties?: [
    {
      ID: number;
      CreatedAt: string;
      UpdatedAt: string;
      DeletedAt: string;
      workspace_id: number;
      category_id: number;
      name: string;
      type: string;
      values: string;
    }
  ];
}
interface CategoryProperty {
  code: number;
  msg: string;
  data: {
    ID: number;
    CreatedAt: string;
    UpdatedAt: string;
    DeletedAt: string;
    workspace_id: number;
    category_id: number;
    name: string;
    type: string;
    values: string;
  };
}
interface UseCategoryProperty {
  workspaceCategoryProperties: CategoryProperties[];
  categoryProperty: CategoryProperty;
  getWorkspaceCategoryProperties: (workspaceId: number) => void;
  createWorkspaceCategoryProperties: (propertyValues: any) => void;
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
    categoryProperty: {
      code: 0,
      msg: "",
      data: {
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
    },
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
    createWorkspaceCategoryProperties: async (propertyValues) => {
      const { category_id, name, type, values, workspace_id } = propertyValues;
      try {
        setLoading(true);
        const { data } = await axiosClient.post(
          `/workspace_category_property`,
          {
            category_id,
            name,
            type,
            values,
            workspace_id,
          }
        );
        set({ categoryProperty: data });
      } catch (error: any) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    },
  };
});
