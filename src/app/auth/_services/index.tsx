import { LoginParams } from "@/app/auth/_types";
import { baseApi } from "@/configs/axions";
import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

export const useLogin = () => {
  const { t } = useTranslation("auth");
  return useMutation({
    mutationFn: async (params: LoginParams) => {
      baseApi.post("/api-backoffice/GetAgencyToken", {
        ...params,
        client_id: "webapp",
        grant_type: "password",
      });
    },
    onSuccess: () => {
      toast.success(t("loginSuccess"));
    },
  });
};
