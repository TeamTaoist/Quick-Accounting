import { create } from "zustand";
import { useLoading } from "./useLoading";
import axiosClient from "../utils/axios";
import {
  getBalances,
  SafeBalanceResponse,
  TokenInfo,
} from "@safe-global/safe-gateway-typescript-sdk";
import { getShortDisplay } from "../utils/number";

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
// interface WorkspaceDetails {
//   code: number;
//   msg: string;
//   data: Workspace;
// }
interface UseWorkspace {
  workspace: Workspace;
  userWorkspaces: UserWorkspaces;
  createWorkspace: (formData: FormData, navigate: any) => void;
  getUserWorkspace: () => void;
  getWorkspaceDetails: (workspaceId: number | string, navigate?: any) => void;
  updateWorkspaceName: (workspaceId: string, workspaceName: string) => void;
  getAssets: () => Promise<void>;
  totalAssetsValue: string;
  assetsList: {
    tokenInfo: TokenInfo;
    balance: string;
    fiatBalance: string;
    fiatConversion: string;
  }[];
}

export const useWorkspace = create<UseWorkspace>((set, get) => {
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
    // workspace details
    workspaceDetails: {
      code: 0,
      msg: "",
      data: {
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
          navigate(`/workspace/${data.data.ID}/assets`);
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
    // get single workspace details
    getWorkspaceDetails: async (workspaceId, navigate) => {
      try {
        setLoading(true);
        const { data } = await axiosClient.get(`/workspace/${workspaceId}`);
        set({ workspace: data.data });
        if (data.msg === "success" && data.code === 200) {
          // navigate("/assets");
          navigate(`/workspace/${data.data.ID}/assets`);
        }
      } catch (error: any) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    },

    // update workspace name
    updateWorkspaceName: async (workspaceId, workspaceName) => {
      try {
        const { data } = await axiosClient.put(`/workspace/${workspaceId}`, {
          name: workspaceName,
        });
        console.log(data.msg);
      } catch (error: any) {
        console.log(error);
      } finally {
        // setLoading(false);
      }
    },
    totalAssetsValue: "0.00",
    assetsList: [],
    getAssets: async function () {
      const { workspace } = get();
      if (workspace) {
        const data = await getBalances(
          String(workspace.chain_id),
          workspace.vault_wallet
        );
        const totalValue = getShortDisplay(data?.fiatTotal || 0) as string;
        set({ totalAssetsValue: totalValue, assetsList: data.items });
      }
    },
  };
});
