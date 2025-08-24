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
    code: "fa",
    label: "فارسی",
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
            {localeItem.label}123
            {isSelected && <Check className="size-[1.2rem] ms-auto text-primary" />}
          </DropdownMenuItem>
        );
      })}
    </DropdownMenuGroup>
  );
};
