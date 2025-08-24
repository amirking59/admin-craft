import { LocalStorage } from "@/utils/storage";
import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "sonner";
import i18n from "i18next";
import { logout } from "@/app/auth/_services";

export const baseApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 30000,
});

baseApi.interceptors.request.use(
  (config) => {
    const token = LocalStorage.getItem("accessToken");

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
    if (error.response?.status === 401) {
      logout();
    } else if (error.response?.data["error"]) {
      toast.error(error.response.data["error"]);
    } else {
      toast.error(i18n.t("somethingWentWrong"));
    }

    return Promise.reject(error);
  },
);
