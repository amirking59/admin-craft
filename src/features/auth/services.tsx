import { m } from "@/paraglide/messages.js";
import { LoginParams, LoginResponse, User } from "@/features/auth/types";
import { storage } from "@/lib/storage";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";

const tokenKey = "accessToken";

export const getAccessToken = () => storage.get(tokenKey);

let onLogout = () => {};

/** src/router.tsx sets this: clear the old session's cached data and go to the login page. */
export const setLogoutHandler = (handler: () => void) => {
  onLogout = handler;
};

export const logout = () => {
  storage.remove(tokenKey);
  onLogout();
};

export const useLogin = () => {
  const navigate = useNavigate();

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
      storage.set(tokenKey, res.access_token);
      toast.success(m.auth_login_success());
      navigate({ to: "/" });
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
