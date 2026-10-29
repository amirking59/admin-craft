import { m } from "@/paraglide/messages.js";
import { LoginParams, LoginResponse, User } from "@/features/auth/types";
import { setTokens } from "@/features/auth/session";
import { api } from "@/configs/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";

export { getAccessToken, logout, setLogoutHandler } from "@/features/auth/session";

export const useLogin = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (params: LoginParams) => api<LoginResponse>("/auth/login", { method: "POST", body: params }),
    onSuccess: (res) => {
      setTokens(res);
      toast.success(m.auth_login_success());
      navigate({ to: "/" });
    },
  });
};

export const useProfile = () => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: () => api<User>("/auth/me"),
    staleTime: Infinity,
    gcTime: Infinity,
  });
};
