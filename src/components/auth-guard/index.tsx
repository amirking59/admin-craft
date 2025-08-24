import { useProfile } from "@/app/auth/_services";
import { FullScreenSpinner } from "@/components/full-screen-spinner";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard = ({ children }: AuthGuardProps) => {
  const { data: user, isLoading, error } = useProfile();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!user || error)) {
      return router.push("/auth");
    }
  }, [user, isLoading, error, router]);

  if (isLoading) {
    return <FullScreenSpinner className="h-screen" />;
  }

  if (user) {
    return <>{children}</>;
  }

  return null;
};
