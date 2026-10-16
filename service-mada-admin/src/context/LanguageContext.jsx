import { createContext, useContext, useEffect, useState } from "react";
import { translations } from "../i18n";
const LanguageContext = createContext(null);
export function LanguageProvider({ children }) {
  const [locale, setLocale] = useState(() => localStorage.getItem("admin-language") || "fr");
  useEffect(() => localStorage.setItem("admin-language", locale), [locale]);
  return <LanguageContext.Provider value={{ locale, setLocale, t: translations[locale] || translations.fr }}>{children}</LanguageContext.Provider>;
}
export function useLanguage() { return useContext(LanguageContext); }
