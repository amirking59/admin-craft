"use client";

import { ThemeProvider as NextThemeProvider } from "next-themes";
import { useLocale } from "@/hooks/use-locale";
import { useEffect } from "react";
import { DirectionProvider } from "@radix-ui/react-direction";
import { LocalStorage } from "@/utils/storage";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [locale] = useLocale();

  const direction = locale === "fa" ? "rtl" : "ltr";

  useEffect(() => {
    document.documentElement.setAttribute("dir", direction);
    document.documentElement.setAttribute("lang", locale);
  }, [locale]);

  useEffect(() => {
    const theme = LocalStorage.getItem("theme");
    if (theme) {
      document.documentElement.classList.add(theme || "light");
    }
  }, []);

  return (
    <NextThemeProvider defaultTheme="light" enableSystem={false}>
      <DirectionProvider dir={direction}>{children}</DirectionProvider>
    </NextThemeProvider>
  );
}
