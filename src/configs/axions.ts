import { LocalStorage } from "@/utils/storage";
import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "sonner";

export const baseApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 30000,
});

baseApi.interceptors.request.use(
  (config) => {
    const token = LocalStorage.getItem("authToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

baseApi.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (
    error: AxiosError<{
      error: string;
    }>,
  ) => {
    if (error.response?.data["error"]) {
      toast.error(error.response.data["error"]);
    }

    return Promise.reject(error);
  },
);
