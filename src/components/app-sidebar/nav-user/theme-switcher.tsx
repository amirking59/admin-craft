import { DropdownMenuGroup, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useTranslation } from "react-i18next";

export const ThemeSwitcher = () => {
  const { t } = useTranslation();
  // resolvedTheme, not theme: with defaultTheme="system", theme is "system" until the user picks one.
  const { setTheme, resolvedTheme } = useTheme();

  return (
    <DropdownMenuGroup>
      <DropdownMenuItem
        onClick={() => {
          setTheme(resolvedTheme === "dark" ? "light" : "dark");
        }}
      >
        {resolvedTheme === "dark" ? (
          <>
            <Sun className="size-[1.2rem]" />

            <div>{t("light")}</div>
          </>
        ) : (
          <>
            <Moon className="size-[1.2rem]" />

            <div>{t("dark")}</div>
          </>
        )}
      </DropdownMenuItem>
    </DropdownMenuGroup>
  );
};
