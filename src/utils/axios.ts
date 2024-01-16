import axios from "axios";

const axiosClient = axios.create({
  baseURL: `https://quick-accounting-be.vercel.app`,
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
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
