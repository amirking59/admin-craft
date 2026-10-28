import { DropdownMenuGroup, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { getLocale, locales, setLocale } from "@/paraglide/runtime.js";
import { Check, Languages } from "lucide-react";

// Each language in its own name. Add a language to project.inlang/settings.json and give it a label here.
const labels: Record<(typeof locales)[number], string> = {
  en: "English",
  ar: "العربية",
  fa: "فارسی",
};

// setLocale stores the choice and reloads the page, so every message and the page direction switch together.
export const LocaleSelect = () => {
  const currentLocale = getLocale();

  return (
    <DropdownMenuGroup>
      {locales.map((locale) => (
        <DropdownMenuItem key={locale} onClick={() => setLocale(locale)}>
          <Languages className="size-[1.2rem]" />
          {labels[locale]}
          {locale === currentLocale && <Check className="ms-auto size-[1.2rem] text-primary" />}
        </DropdownMenuItem>
      ))}
    </DropdownMenuGroup>
  );
};
