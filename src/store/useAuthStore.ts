import { create } from "zustand";
import axiosClient from "../utils/axios";
import { useLoading } from "./useLoading";
// import { LoginForm } from "../pages/auth/login/LoginPopup";
import { toast } from "react-toastify";

interface AuthResponse {
  wallet: string;
  token: string;
  token_expired: number;
  CreatedAt: string;
  UpdatedAt: string;
}

interface Auth {
  user: AuthResponse;
  setAuthData: (data: AuthResponse) => void;
  loginAsync: (formValue: any, navigate: any) => void;
  logout: (navigate: any) => void;
  clearAuth: () => void;
  refreshNounce: (wallet: string) => Promise<string>;
}

export const useAuthStore = create<Auth>((set) => {
  const { setLoading } = useLoading.getState();

  return {
    user: {
      wallet: "",
      token: "",
      token_expired: 0,
      CreatedAt: "",
      UpdatedAt: "",
    },
    setAuthData: (newData) => set({ user: newData }),
    // login
    loginAsync: async (formValue, callback) => {
      try {
        setLoading(true);
        const { data } = await axiosClient.post("/user/login2", formValue);
        set({ user: data.data });
        console.log(data);

        localStorage.setItem("qa-user", JSON.stringify(data.data));
        callback && callback();
      } catch (error: any) {
        console.log(error);
        toast(error?.data?.msg || error?.status || error);
        throw error;
      } finally {
        setLoading(false);
        // navigate("/user");
      }
    },
    // logout
    logout: (navigate) => {
      set({
        user: {
          wallet: "",
          token: "",
          token_expired: 0,
          CreatedAt: "",
          UpdatedAt: "",
        },
      });
      localStorage.removeItem("qa-user");
      navigate("/");
    },
    clearAuth() {
      set({
        user: {
          wallet: "",
          token: "",
          token_expired: 0,
          CreatedAt: "",
          UpdatedAt: "",
        },
      });
    },
    // get new nonce
    refreshNounce: async (wallet: string): Promise<string> => {
      try {
        setLoading(true);
        const { data } = await axiosClient.get(`/user/refresh_nonce/${wallet}`);
        return data?.nonce;
      } catch (error: any) {
        console.error(error);
        toast(error?.data?.msg || error?.status || error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
  };
});
