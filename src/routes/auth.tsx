import { m } from "@/paraglide/messages.js";
import { LayoutDashboard } from "lucide-react";

import { LoginForm } from "@/features/auth/components/login-form";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { getAccessToken } from "@/features/auth/services";

export const Route = createFileRoute("/auth")({
  // Already logged in: nothing to do here.
  beforeLoad: () => {
    if (getAccessToken()) throw redirect({ to: "/" });
  },
  head: () => ({ meta: [{ title: `${m.auth_login()} · ${m.app_name()}` }] }),
  component: LoginPage,
});

function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <div className="flex items-center gap-2 font-medium">
            <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <LayoutDashboard className="size-4" />
            </div>
            {m.app_name()}
          </div>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        {/* <img
          src="/placeholder.svg"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        /> */}
      </div>
    </div>
  );
}
