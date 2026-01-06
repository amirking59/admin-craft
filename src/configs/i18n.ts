import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import { en } from "@/locales/en";
import { ar } from "@/locales/ar";
import { LocalStorage } from "@/utils/storage";

const resources = {
  en,
  ar,
};

i18n.use(initReactI18next).init({
  resources,
  ns: ["base"],
  defaultNS: "base",
  lng: LocalStorage.getItem("locale") || "en",
  interpolation: {
    escapeValue: false,
  },
});

i18n.services.formatter?.add("lowercase", (value) => {
  return value.toLowerCase();
});
