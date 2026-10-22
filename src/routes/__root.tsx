import appCss from "@/styles.css?url";
import { Providers } from "@/components/providers";
import { useEffect } from "react";
import { useDocumentTitle } from "usehooks-ts";
import { useTranslation } from "react-i18next";
import { useDirection } from "@/hooks/use-direction";
import { createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { ErrorPage } from "@/components/error-page";
import { NotFoundPage } from "@/components/not-found-page";

export const Route = createRootRoute({
  head: () => ({
    meta: [{ charSet: "utf-8" }, { name: "viewport", content: "width=device-width, initial-scale=1" }],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico" },
    ],
  }),
  shellComponent: RootDocument,
  errorComponent: ErrorPage,
  notFoundComponent: NotFoundPage,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation();
  const direction = useDirection();
  const { i18n } = useTranslation();

  useDocumentTitle(t("appName"));

  useEffect(() => {
    document.documentElement.dir = direction;
  }, [direction]);

  useEffect(() => {
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  return (
    <html className="font-normal" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <Providers>{children}</Providers>
        <Scripts />
      </body>
    </html>
  );
}
