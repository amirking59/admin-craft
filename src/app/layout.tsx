import { NotoSans } from "@/theme/_utils";
import "./global.css";
import { Providers } from "@/components/providers";
import { Suspense } from "react";
import { Toaster } from "sonner";

export default function RootLayout({ children }: { children: React.ReactNode }) {
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
