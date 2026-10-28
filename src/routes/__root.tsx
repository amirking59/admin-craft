import appCss from "@/styles.css?url";
import { useEffect } from "react";
import { z } from "zod";
import type { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, HeadContent, Scripts } from "@tanstack/react-router";
import { m } from "@/paraglide/messages.js";
import { getLocale, getTextDirection } from "@/paraglide/runtime.js";
import { ThemeProvider } from "@/theme/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { ErrorPage } from "@/components/error-page";
import { NotFoundPage } from "@/components/not-found-page";
import "@/lib/date";

// Zod's built-in validation messages in the current language. Changing the language reloads the page.
z.config(z.locales[getLocale()]());

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: m.app_name() },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico" },
    ],
  }),
  shellComponent: RootDocument,
  errorComponent: ErrorPage,
  notFoundComponent: NotFoundPage,
});

// The SPA shell is prerendered at build time in the base language, and hydration keeps the prerendered <html>
// attributes, so the effect applies the language stored in the browser.
function RootDocument({ children }: { children: React.ReactNode }) {
  const locale = getLocale();
  const direction = getTextDirection(locale);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = direction;
  }, [locale, direction]);

  return (
    <html lang={locale} dir={direction} className="font-normal" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <ThemeProvider>
          <TooltipProvider>{children}</TooltipProvider>
          <Toaster />
        </ThemeProvider>
        <Scripts />
      </body>
    </html>
  );
}
