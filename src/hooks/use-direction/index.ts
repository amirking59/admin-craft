import { useLocale } from "@/hooks/use-locale";

const rtlLocales = ["fa", "ar"];

export const useDirection = (): "ltr" | "rtl" => {
  const [locale] = useLocale();

  return rtlLocales.includes(locale) ? "rtl" : "ltr";
};
