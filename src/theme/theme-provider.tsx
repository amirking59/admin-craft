import { ThemeProvider as NextThemeProvider } from "next-themes";
import { DirectionProvider } from "@base-ui/react";
import { getTextDirection } from "@/paraglide/runtime.js";

// next-themes persists the choice under localStorage "theme" and toggles the `dark`/`light` class on <html>.
// `dir`/`lang` on <html> are set in src/routes/__root.tsx.
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemeProvider defaultTheme="system" attribute="class" disableTransitionOnChange>
      <DirectionProvider direction={getTextDirection()}>{children}</DirectionProvider>
    </NextThemeProvider>
  );
}
