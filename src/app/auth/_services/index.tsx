import { LoginParams, LoginResponse } from "@/app/auth/_types";
import { baseApi } from "@/configs/axions";
import { LocalStorage } from "@/utils/storage";
import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

export const useLogin = () => {
  const { t } = useTranslation("auth");
  return useMutation({
    mutationFn: async (params: LoginParams) => {
      const searchParams = new URLSearchParams();

      searchParams.append("userName", params.email);
      searchParams.append("password", params.password);
      searchParams.append("googleAuthCode", params.googleAuthCode);
      searchParams.append("client_id", "webapp");
      searchParams.append("grant_type", "password");

      return baseApi.post<LoginResponse>("/api-backoffice/GetAgencyToken", searchParams, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
    },
    onSuccess: (res) => {
      LocalStorage.setItem("accessToken", res.data.access_token);
      toast.success(t("loginSuccess"));
    },
  });
};
