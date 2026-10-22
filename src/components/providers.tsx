import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { Suspense, useEffect, useState } from "react";
import "@/lib/date";
import "@/configs/i18n";
import { TooltipProvider } from "@/components/ui/tooltip";

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnMount: false,
            refetchOnReconnect: false,
            refetchOnWindowFocus: false,
            retry: 0,
          },
        },
      }),
  );

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme) {
      document.documentElement.classList.add(theme || "light");
    }
  }, []);

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="light" enableSystem={false}>
          <TooltipProvider>
            <Suspense>{children}</Suspense>
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>

      <Toaster />
    </>
  );
}
