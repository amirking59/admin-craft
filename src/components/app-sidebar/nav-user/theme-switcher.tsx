import { DropdownMenuGroup, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useTranslation } from "react-i18next";

export const ThemeSwitcher = () => {
  const { t } = useTranslation();
  const { setTheme, theme } = useTheme();

  return (
    <DropdownMenuGroup>
      <DropdownMenuItem
        onClick={() => {
          setTheme(theme === "dark" ? "light" : "dark");
        }}
      >
        {theme === "dark" ? (
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
