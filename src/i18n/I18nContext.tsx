import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { en } from "./locales/en";
import { es } from "./locales/es";
import type { Locale, TranslationSchema } from "./types";

const LOCAL_STORAGE_KEY = "app_locale";

interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: TranslationSchema;
  formatCurrency: (value: number) => string;
  formatDate: (dateInput: string | Date | number) => string;
}

const dictionaries: Record<Locale, TranslationSchema> = {
  es,
  en,
};

const I18nContext = createContext<I18nContextValue | null>(null);

export interface I18nProviderProps {
  children: React.ReactNode;
}

export function I18nProvider({ children }: I18nProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY) as Locale | null;
      if (saved && (saved === "es" || saved === "en")) {
        return saved;
      }
    } catch {
      // ignore storage access errors
    }
    return "es";
  });

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, newLocale);
    } catch {
      // ignore
    }
  }, []);

  const t = useMemo(() => {
    return dictionaries[locale] || es;
  }, [locale]);

  const formatCurrency = useCallback(
    (value: number): string => {
      const num = Number(value) || 0;
      if (locale === "es") {
        return (
          "$ " +
          num.toLocaleString("es-AR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })
        );
      }
      return (
        "$" +
        num.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      );
    },
    [locale],
  );

  const formatDate = useCallback(
    (dateInput: string | Date | number): string => {
      if (!dateInput) return "";
      const d = new Date(dateInput);
      if (isNaN(d.getTime())) return String(dateInput);

      if (locale === "es") {
        return d.toLocaleString("es-AR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
      }

      return d.toLocaleString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    },
    [locale],
  );

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      t,
      formatCurrency,
      formatDate,
    }),
    [locale, setLocale, t, formatCurrency, formatDate],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useTranslation(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useTranslation must be used within an I18nProvider");
  }
  return ctx;
}
