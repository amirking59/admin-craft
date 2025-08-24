import { DropdownMenuGroup, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useLocale } from "@/hooks/use-locale";
import { Languages } from "lucide-react";

export const LocaleSelect = () => {
  const [locale, setLocale] = useLocale();

  return (
    <DropdownMenuGroup>
      <DropdownMenuItem
        onClick={() => {
          setLocale(locale === "fa" ? "en" : "fa");
        }}
      >
        <Languages className="size-[1.2rem]" />

        {locale === "en" && <div>فارسی</div>}

        {locale === "fa" && <div>English</div>}
      </DropdownMenuItem>
    </DropdownMenuGroup>
  );
};
