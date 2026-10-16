import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { translations } from "../i18n";

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [locale, setLocaleState] = useState(() => localStorage.getItem("app-language") || "fr");

  useEffect(() => {
    localStorage.setItem("app-language", locale);
  }, [locale]);

  const setLocale = (value) => setLocaleState(value);
  const value = useMemo(() => ({ locale, setLocale, t: translations[locale] || translations.fr }), [locale]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage doit être utilisé dans LanguageProvider");
  return context;
}
