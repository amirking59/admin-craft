import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { zodI18nMap } from "zod-i18n-map";

import { en } from "@/locales/en";
import { fa } from "@/locales/ar";
import { z } from "zod";
import { LocalStorage } from "@/utils/storage";

const resources = {
  en,
  fa,
};

i18n.use(initReactI18next).init({
  resources,
  ns: ["base", "coins"],
  defaultNS: "base",
  lng: LocalStorage.getItem("locale") || "en",
  interpolation: {
    escapeValue: false,
  },
});

i18n.services.formatter?.add("lowercase", (value) => {
  return value.toLowerCase();
});

z.setErrorMap(zodI18nMap);
