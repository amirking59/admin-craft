"use client";

import { NotoSans } from "@/theme/_utils";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Suspense } from "react";
import { useDocumentTitle } from "usehooks-ts";
import { useTranslation } from "react-i18next";
import { useDirection } from "@/hooks/use-direction";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation();
  const direction = useDirection();

  useDocumentTitle(t("appName"));

  return (
    <html dir={direction} className={`${NotoSans.className} font-normal`} suppressHydrationWarning>
      <body>
        <Suspense>
          <Providers>{children}</Providers>
        </Suspense>
      </body>
    </html>
  );
}
