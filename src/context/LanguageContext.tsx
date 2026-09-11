import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AVAILABLE_LANGUAGES, LanguageOption } from '../i18n/languages';
import { TRANSLATIONS } from '../i18n/translations';

interface LanguageContextType {
  currentLanguage: LanguageOption;
  setLanguage: (code: string) => void;
  t: (key: string, defaultText?: string) => string;
  languages: LanguageOption[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize language from localStorage or default to Tamil ('ta') since user prompted in Tamil
  const [langCode, setLangCode] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('smartmove_language');
      if (saved && AVAILABLE_LANGUAGES.some(l => l.code === saved)) {
        return saved;
      }
    } catch {
      // fallback
    }
    return 'ta'; // default to Tamil as requested by user
  });

  const currentLanguage = AVAILABLE_LANGUAGES.find(l => l.code === langCode) || AVAILABLE_LANGUAGES[0];

  const setLanguage = (code: string) => {
    if (AVAILABLE_LANGUAGES.some(l => l.code === code)) {
      setLangCode(code);
      try {
        localStorage.setItem('smartmove_language', code);
      } catch {
        // ignore
      }
    }
  };

  const t = (key: string, defaultText?: string): string => {
    const langDict = TRANSLATIONS[langCode] || TRANSLATIONS['en'];
    if (langDict && langDict[key]) {
      return langDict[key];
    }
    // Fallback to English
    if (TRANSLATIONS['en'] && TRANSLATIONS['en'][key]) {
      return TRANSLATIONS['en'][key];
    }
    return defaultText || key;
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage, t, languages: AVAILABLE_LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
