import axios from "axios";
import { useAuthStore } from "../store/useAuthStore";

// const { user } = useAuthStore.getState();
const token = localStorage.getItem("token") || "";

const axiosClient = axios.create({
  baseURL: `https://quick-accounting-be.vercel.app`,
});

axiosClient.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response.status === 401) {
    }
    throw error;
  }
);

export default axiosClient;
