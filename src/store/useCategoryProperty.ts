import { create } from "zustand";
import { useLoading } from "./useLoading";
import axiosClient from "../utils/axios";
import { toast } from "react-toastify";
import { CategoryPropertyBody } from "../pages/workspace/category/Category";
export interface CategoryProperties {
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
      archived?: boolean;
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
    archived: boolean;
  };
}
interface UpdatedPropertyBody {
  name: string;
  type: string;
  values: string;
}
interface UseCategoryProperty {
  workspaceCategoryProperties: CategoryProperties[];
  categoryProperty: CategoryProperty;
  archivedCategoryProperty: ICategoryProperties[];
  getWorkspaceCategoryProperties: (
    workspaceId: number,
    includeArchived?: boolean
  ) => void;
  createWorkspaceCategoryProperties: (
    propertyValues: CategoryPropertyBody
  ) => Promise<void>;
  updateWorkspaceCategoryProperties: (
    workspaceId: number | undefined,
    workspaceCategoryId: number | undefined,
    workspaceCategoryPropertyId: number | undefined,
    updatedPropertyBody: UpdatedPropertyBody
  ) => Promise<boolean | undefined>;
  editCategoryNameAndProperties: (
    workspaceId: number | undefined,
    workspaceCategoryId: number | undefined,
    updatedPropertyBody: UpdatedPropertyBody
  ) => Promise<boolean | undefined>;
  archiveWorkspaceCategoryProperties: (
    workspaceId: number | undefined,
    workspaceCategoryId: number | undefined,
    workspaceCategoryPropertyId: string | undefined
  ) => Promise<boolean | undefined>;
  getCategoryPropertyByCategoryId: (
    workspaceId: number,
    categoryId: number,
    archive?: boolean
  ) => Promise<boolean | undefined>;
  unArchiveCategoryProperties: (
    workspaceId: number | undefined,
    workspaceCategoryId: number | undefined,
    workspaceCategoryPropertyId: number[] | undefined
  ) => Promise<boolean | undefined>;
}

export const useCategoryProperty = create<UseCategoryProperty>((set) => {
  const { setLoading } = useLoading.getState();
  return {
    workspaceCategoryProperties: [],
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
        archived: false,
      },
    },
    archivedCategoryProperty: [],
    getWorkspaceCategoryProperties: async (
      workspaceId,
      includeArchived = false
    ) => {
      try {
        setLoading(true);
        const { data } = await axiosClient.get(
          `/workspace_categories/category_and_property_by_workspace_id/${workspaceId}?include_archived=${includeArchived}`
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
        toast("Property created successfully");
      } catch (error: any) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    },
    updateWorkspaceCategoryProperties: async (
      workspaceId,
      workspaceCategoryId,
      workspaceCategoryPropertyId,
      updatedPropertyBody
    ) => {
      try {
        setLoading(true);
        const { data } = await axiosClient.put(
          `/workspace_category_property/${workspaceId}/${workspaceCategoryId}/update/${workspaceCategoryPropertyId}`,
          updatedPropertyBody
        );
        set({ categoryProperty: data });
        toast("Property updated successfully");
        return true;
      } catch (error: any) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    },
    // update category name & properties
    editCategoryNameAndProperties: async (
      workspaceId,
      workspaceCategoryId,
      updatedPropertyBody
    ) => {
      try {
        // setLoading(true);
        const { data } = await axiosClient.put(
          `/workspace_category_property/${workspaceId}/${workspaceCategoryId}/edit`,
          updatedPropertyBody
        );
        set({ categoryProperty: data });
        toast("Property updated successfully");
        return true;
      } catch (error: any) {
        console.log(error);
      } finally {
        // setLoading(false);
      }
    },
    // archive property
    archiveWorkspaceCategoryProperties: async (
      workspaceId,
      workspaceCategoryId,
      workspaceCategoryPropertyId
    ) => {
      try {
        setLoading(true);
        await axiosClient.put(
          `/workspace_category_property/${workspaceId}/${workspaceCategoryId}/archive?ids=${workspaceCategoryPropertyId}`
        );
        toast("Archived successfully");
        return true;
      } catch (error: any) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    },
    // get archive category property list
    getCategoryPropertyByCategoryId: async (
      workspaceId,
      categoryId,
      archive
    ) => {
      try {
        setLoading(true);
        const { data } = await axiosClient.get(
          `/workspace_category_properties/category_properties_by_workspace_id_and_category_id/${workspaceId}/${categoryId}?archived=${archive}`
        );
        set({ archivedCategoryProperty: data.data.rows });
        return true;
      } catch (error: any) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    },
    // un-archive property
    unArchiveCategoryProperties: async (
      workspaceId,
      workspaceCategoryId,
      workspaceCategoryPropertyId
    ) => {
      try {
        setLoading(true);
        await axiosClient.put(
          `/workspace_category_property/${workspaceId}/${workspaceCategoryId}/unarchive?ids=${workspaceCategoryPropertyId}`
        );
        toast("Un-Archived successfully");
        return true;
      } catch (error: any) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    },
  };
});
