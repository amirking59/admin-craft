import { DropdownMenuGroup, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";

export const ThemeSwitcher = () => {
  const { t } = useTranslation();
  const { setTheme, theme } = useTheme();

  const ref = useRef<HTMLDivElement>(null);

  const animateCircle = (triggerBtn: HTMLDivElement) => {
    const { top, left, width, height } = triggerBtn.getBoundingClientRect();
    const x = left + width / 2;
    const y = top + height / 2;
    const right = (window.innerWidth - left) * 3;
    const bottom = (window.innerHeight - top) * 3;
    const maxRadius = Math.hypot(Math.max(left, right), Math.max(top, bottom));

    document.documentElement.animate(
      {
        clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${maxRadius}px at ${x}px ${y}px)`],
      },
      {
        duration: 1000,
        easing: "ease-in-out",
        pseudoElement: "::view-transition-new(root)",
      } as KeyframeAnimationOptions & { pseudoElement?: string },
    );
  };

  const toggleTheme = useCallback(
    async (triggerBtn: HTMLDivElement) => {
      await document.startViewTransition(() => {
        document.documentElement.classList.toggle("dark");
        document.documentElement.classList.toggle("light");
      }).ready;

      animateCircle(triggerBtn);
    },
    [theme],
  );
  return (
    <DropdownMenuGroup>
      <DropdownMenuItem
        onClick={() => {
          if (ref.current) toggleTheme(ref.current);
          setTheme(theme === "dark" ? "light" : "dark");
        }}
        ref={ref}
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
