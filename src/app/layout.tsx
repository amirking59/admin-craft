"use client";

import { NotoSans } from "@/theme/_utils";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Suspense } from "react";
import { Toaster } from "sonner";
import { useDocumentTitle } from "usehooks-ts";
import { useTranslation } from "react-i18next";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation();

  useDocumentTitle(t("appName"));

  return (
    <html className={`${NotoSans.className} font-normal`} suppressHydrationWarning>
      <body>
        <Suspense>
          <Providers>{children}</Providers>
          <Toaster />
        </Suspense>
      </body>
    </html>
  );
}
