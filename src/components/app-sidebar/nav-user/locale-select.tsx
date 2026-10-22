import { DropdownMenuGroup, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useLocale } from "@/hooks/use-locale";
import { Locale } from "@/hooks/use-locale/_types";
import { Check, Languages } from "lucide-react";

const locales: {
  code: Locale;
  label: string;
}[] = [
  {
    code: "en",
    label: "English",
  },
  {
    code: "ar",
    label: "عربی",
  },
];

export const LocaleSelect = () => {
  const [currentLocale, setLocale] = useLocale();

  return (
    <DropdownMenuGroup>
      {locales.map((localeItem) => {
        const isSelected = currentLocale === localeItem.code;

        return (
          <DropdownMenuItem
            key={localeItem.code}
            onClick={() => {
              setLocale(localeItem.code);
            }}
          >
            <Languages className="size-[1.2rem]" />
            {localeItem.label}
            {isSelected && <Check className="ms-auto size-[1.2rem] text-primary" />}
          </DropdownMenuItem>
        );
      })}
    </DropdownMenuGroup>
  );
};
