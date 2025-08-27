import { LoginParams, LoginResponse, ProfileResponse, User } from "@/app/auth/_types";
import { baseApi } from "@/configs/axions";
import { LocalStorage } from "@/utils/storage";
import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export const useLogin = () => {
  const { t } = useTranslation("auth");
  const router = useRouter();

  return useMutation({
    mutationFn: async (params: LoginParams) => {
      const searchParams = new URLSearchParams();

      searchParams.append("userName", params.email);
      searchParams.append("password", params.password);
      searchParams.append("googleAuthCode", params.googleAuthCode);
      searchParams.append("client_id", "webapp");
      searchParams.append("grant_type", "password");

      const response = await baseApi.post<LoginResponse>("/api-backoffice/GetAgencyToken", searchParams, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      return response.data;
    },
    onSuccess: (res) => {
      LocalStorage.setItem("accessToken", res.access_token);
      toast.success(t("loginSuccess"));
      router.push("/");
    },
  });
};

export const useProfile = () => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: async (): Promise<User> => {
      const response = await baseApi.get<ProfileResponse>("/api-backoffice/CurrentUser");

      return response.data.data;
    },
    staleTime: Infinity,
    gcTime: Infinity,
  });
};

export const logout = () => {
  LocalStorage.removeItem("accessToken");
  window.location.href = "/auth";
};
