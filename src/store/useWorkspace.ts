import { create } from "zustand";
import { useLoading } from "./useLoading";
import axiosClient from "../utils/axios";

interface FormData {
  chain_id: number;
  name: string;
  vault_wallet: string;
}

interface Workspace {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: any;
  name: string;
  avatar: string;
  vault_wallet: string;
  chain_id: number;
  creator: string;
}
interface UserWorkspaces {
  code: number;
  msg: string;
  data: {
    page: number;
    size: number;
    total: number;
    rows: Workspace[];
  };
}
interface UseWorkspace {
  workspace: Workspace;
  userWorkspaces: UserWorkspaces;
  createWorkspace: (formData: FormData, navigate: any) => void;
  getUserWorkspace: () => void;
}

export const useWorkspace = create<UseWorkspace>((set) => {
  const { setLoading } = useLoading.getState();
  return {
    workspace: {
      ID: 0,
      CreatedAt: "",
      UpdatedAt: "",
      DeletedAt: "",
      name: "",
      avatar: "",
      vault_wallet: "",
      chain_id: 0,
      creator: "",
    },
    userWorkspaces: {
      code: 0,
      msg: "",
      data: {
        page: 0,
        size: 0,
        total: 0,
        rows: [
          {
            ID: 0,
            CreatedAt: "",
            UpdatedAt: "",
            DeletedAt: "",
            name: "",
            avatar: "",
            vault_wallet: "",
            chain_id: 0,
            creator: "",
          },
        ],
      },
    },
    createWorkspace: async (formData, navigate) => {
      const { chain_id, name, vault_wallet } = formData;

      try {
        setLoading(true);
        const { data } = await axiosClient.post("/workspace", {
          chain_id,
          name,
          vault_wallet,
        });
        set({ workspace: data.data });
        if (data.msg === "success" && data.code === 200) {
          navigate("/assets");
        }
      } catch (error: any) {
        console.log(error);
      } finally {
        setLoading(false);
        // navigate("/assets");
      }
    },
    getUserWorkspace: async () => {
      try {
        setLoading(true);
        const { data } = await axiosClient.get("/workspaces/my_workspaces");
        set({ userWorkspaces: data });
        // if (data.msg === "success" && data.code === 200) {
        //   navigate("/assets");
        // }
      } catch (error: any) {
        console.log(error);
      } finally {
        setLoading(false);
        // navigate("/assets");
      }
    },
  };
});
