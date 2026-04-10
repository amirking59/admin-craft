"use client";

import { ThemeProvider as NextThemeProvider } from "next-themes";
import { useLocale } from "@/hooks/use-locale";
import { useEffect } from "react";
import { DirectionProvider } from "@base-ui/react";
import { LocalStorage } from "@/utils/storage";
import { useDirection } from "@/hooks/use-direction";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [locale] = useLocale();
  const direction = useDirection();

  useEffect(() => {
    document.documentElement.setAttribute("dir", direction);
    document.documentElement.setAttribute("lang", locale);
  }, [locale, direction]);

  useEffect(() => {
    const theme = LocalStorage.getItem("theme");
    if (theme) {
      document.documentElement.classList.add(theme || "light");
    }
  }, []);

  return (
    <NextThemeProvider defaultTheme="light" enableSystem={false}>
      <DirectionProvider key={"direction-provider"} direction={direction}>
        {children}
      </DirectionProvider>
    </NextThemeProvider>
  );
}
