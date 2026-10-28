import { m } from "@/paraglide/messages.js";
import { DropdownMenuGroup, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export const ThemeSwitcher = () => {
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

            <div>{m.light()}</div>
          </>
        ) : (
          <>
            <Moon className="size-[1.2rem]" />

            <div>{m.dark()}</div>
          </>
        )}
      </DropdownMenuItem>
    </DropdownMenuGroup>
  );
};
