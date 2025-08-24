"use client";

import { LocalStorage } from "@/utils/storage";
import { Locale } from "./_types";
import { useTranslation } from "react-i18next";

export const useLocale = (): [Locale, (locale: Locale) => void] => {
  const { i18n } = useTranslation();

  return [
    i18n.language as Locale,
    (locale) => {
      LocalStorage.setItem("locale", locale);
      i18n.changeLanguage(locale);
    },
  ];
};
