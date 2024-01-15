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
interface CreateWorkspace {
  workspace: Workspace;
  createWorkspace: (formData: FormData, navigate: any) => void;
}

export const useWorkspace = create<CreateWorkspace>((set) => {
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
    createWorkspace: async (formData, navigate) => {
      console.log(formData);

      try {
        setLoading(true);
        const { data } = await axiosClient.post("/workspace", { formData });
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
  };
});
