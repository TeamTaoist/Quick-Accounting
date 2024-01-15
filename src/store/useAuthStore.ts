import { create } from "zustand";
import axiosClient from "../utils/axios";
import { useLoading } from "./useLoading";
import { LoginForm } from "../pages/auth/login/LoginPopup";

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
  loginAsync: (formValue: LoginForm, navigate: any) => void;
  logout: (navigate: any) => void;
}

export const useAuthStore = create<Auth>((set) => {
  const { setLoading } = useLoading.getState();

  return {
    user: {
      wallet: "",
      token: localStorage.getItem("token") || "",
      token_expired: 0,
      CreatedAt: "",
      UpdatedAt: "",
    },
    setAuthData: (newData) => set({ user: newData }),
    // login
    loginAsync: async (formValue, navigate) => {
      try {
        setLoading(true);
        const { data } = await axiosClient.post("/user/login2", { formValue });
        set({ user: data.data });
        localStorage.setItem("token", data.data.token);
      } catch (error: any) {
        console.log(error);
      } finally {
        setLoading(false);
        navigate("/user");
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
      localStorage.removeItem("token");
      navigate("/");
    },
  };
});
