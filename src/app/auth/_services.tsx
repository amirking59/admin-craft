import { LoginParams, LoginResponse, User } from "@/app/auth/_types";
import { LocalStorage } from "@/lib/storage";
import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export const useLogin = () => {
  const { t } = useTranslation("auth");
  const router = useRouter();

  return useMutation({
    mutationFn: async (_params: LoginParams): Promise<LoginResponse> => {
      return {
        access_token: "demo-access-token",
        expires_in: 3600,
        token_type: "Bearer",
        refresh_token: "demo-refresh-token",
        scope: "*",
        resellerId: "1",
      };
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
      return {
        firstName: "Demo",
        lastName: "User",
        phone: "1234567890",
        dialingCode: "+1",
        email: "demo@example.com",
        id: 1,
        pictureFileName: null,
        nationalCode: null,
        shebaNumber: "",
        cardNumber: null,
        accountNumber: null,
        resellerId: 1,
        permissions: ["*"],
        roles: ["admin"],
        createDate: new Date().toISOString(),
        hasPassword: true,
        dialingCountryIso: "US",
        secretKey: "",
      };
    },
    staleTime: Infinity,
    gcTime: Infinity,
  });
};

export const logout = () => {
  LocalStorage.removeItem("accessToken");
  window.location.href = "/auth";
};
