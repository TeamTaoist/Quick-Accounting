import { create } from "zustand";
import { useLoading } from "./useLoading";
import axiosClient from "../utils/axios";
import {
  getBalances,
  SafeBalanceResponse,
  TokenInfo,
} from "@safe-global/safe-gateway-typescript-sdk";
import { getShortDisplay } from "../utils/number";
import { toast } from "react-toastify";

interface FormData {
  chain_id: number;
  name: string;
  vault_wallet: string;
}

export interface Workspace {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: any;
  name: string;
  avatar: string;
  vault_wallet: string;
  chain_id: number;
  creator: string;
  name_service?: string;
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
interface AssetsHideList {
  assert_contract_address: string;
  createdAt: string;
  UpdatedAt: string;
  deletedAt: {
    time: string;
    valid: boolean;
  };
  ID: number;
  workspace_id: string;
  safe_wallet: string;
}
interface UseWorkspace {
  workspace: Workspace;
  userWorkspaces: UserWorkspaces;
  createWorkspace: (formData: FormData, navigate: any) => void;
  getUserWorkspace: () => Promise<UserWorkspaces | undefined>;
  getWorkspaceDetails: (workspaceId: number | string, navigate?: any) => void;
  updateWorkspaceName: (
    workspaceId: string,
    workspaceName: string
  ) => Promise<boolean | undefined>;
  getAssets: () => Promise<void>;
  totalAssetsValue: string;
  assetsList: {
    tokenInfo: TokenInfo;
    balance: string;
    fiatBalance: string;
    fiatConversion: string;
    hidden?: boolean;
  }[];
  updateWorkspace: (data: any) => void;
  hideAssets: (contractAddress: string) => Promise<void>;
  getHideAssets: () => Promise<void>;
  assetsHideList: AssetsHideList[];
  unHideAssets: (contractAddress: string) => Promise<void>;
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
    updateWorkspace: (data: any) => {
      set({ workspace: data });
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
        toast.error(error?.response?.data?.msg || error?.status || error);
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
        if (data.msg === "success" && data.code === 200) {
          return data;
        }
      } catch (error: any) {
        toast.error(error?.response?.data?.msg || error?.status || error);
      } finally {
        setLoading(false);
        // navigate("/assets");
      }
    },
    // get single workspace details
    getWorkspaceDetails: async (workspaceId, navigate = undefined) => {
      try {
        setLoading(true);
        const { data } = await axiosClient.get(`/workspace/${workspaceId}`);
        set({ workspace: data.data });
        if (data.msg === "success" && data.code === 200) {
          // navigate("/assets");
          navigate(`/workspace/${data.data.ID}/assets`);
        }
      } catch (error: any) {
        toast.error(error?.data?.msg || error?.status || error);
      } finally {
        setLoading(false);
      }
    },

    // update workspace name
    updateWorkspaceName: async (workspaceId, workspaceName) => {
      const { workspace } = get();
      try {
        const { data } = await axiosClient.put(`/workspace/${workspaceId}`, {
          name: workspaceName,
        });
        if (data.msg === "success" && data.code === 200) {
          if (workspaceName !== workspace.name) {
            set((state) => {
              // update workspace state
              const updatedWorkspace = {
                ...state.workspace,
                name: workspaceName,
              };
              // update userWorkspaces state
              const updatedUserWorkspaces = {
                ...state.userWorkspaces,
                data: {
                  ...state.userWorkspaces.data,
                  rows: state.userWorkspaces.data.rows.map((workspace) =>
                    workspace.ID === Number(workspaceId)
                      ? { ...workspace, name: workspaceName }
                      : workspace
                  ),
                },
              };
              return {
                workspace: updatedWorkspace,
                userWorkspaces: updatedUserWorkspaces,
              };
            });
          }
          return true;
        }
      } catch (error: any) {
        toast.error(error?.data?.msg || error?.status || error);
      } finally {
        // setLoading(false);
      }
    },
    totalAssetsValue: "0.00",
    assetsList: [],
    getAssets: async function () {
      const { workspace } = get();
      if (workspace.chain_id) {
        const data = await getBalances(
          String(workspace.chain_id),
          workspace.vault_wallet
        );
        const totalValue = getShortDisplay(data?.fiatTotal || 0) as string;
        set({ totalAssetsValue: totalValue, assetsList: data.items });
      }
    },
    // hide assets
    hideAssets: async (contractAddress) => {
      const { workspace } = get();
      try {
        setLoading(true);
        const { data } = await axiosClient.post(
          `/workspace_assert/${workspace.ID}/hide_assert`,
          {
            assert_contract_address: contractAddress,
          }
        );
        // set({ workspace: data.data });

        if (data.msg === "success" && data.code === 200) {
          toast.success("Hide assets successfully");
        }
      } catch (error: any) {
        toast.error(error?.response?.data?.msg || error?.status || error);
      } finally {
        setLoading(false);
        // navigate("/assets");
      }
    },
    // get hide assets
    assetsHideList: [],
    getHideAssets: async () => {
      const { workspace, assetsList } = get();
      try {
        setLoading(true);
        const { data } = await axiosClient.get(
          `/workspace_assert/${workspace.ID}/hided_asserts`
        );
        // set({ assetsHideList: data.data });
        const updateAssets = assetsList.map((asset) => {
          const isHidden = data.data.find(
            (hideAsset: AssetsHideList) =>
              hideAsset.assert_contract_address === asset.tokenInfo.address
          );
          if (isHidden) {
            return { ...asset, hidden: true };
          } else {
            return { ...asset, hidden: false };
          }
        });
        // set({ assetsHideList: data.data });
        console.log(updateAssets);

        set({ assetsHideList: data.data, assetsList: updateAssets });
      } catch (error: any) {
        toast.error(error?.response?.data?.msg || error?.status || error);
      } finally {
        setLoading(false);
        // navigate("/assets");
      }
    },
    // hide assets
    unHideAssets: async (contractAddress) => {
      const { workspace } = get();
      try {
        setLoading(true);
        const { data } = await axiosClient.post(
          `/workspace_assert/${workspace.ID}/unhide_assert`,
          {
            assert_contract_address: contractAddress,
          }
        );
        if (data.msg === "success" && data.code === 200) {
          toast.success("Un-hide assets successfully");
        }
      } catch (error: any) {
        toast.error(error?.response?.data?.msg || error?.status || error);
      } finally {
        setLoading(false);
        // navigate("/assets");
      }
    },
  };
});
