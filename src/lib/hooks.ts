"use client";

import { useContext } from 'react';
import { LanguageContext } from '@/context/language-context';
import { translations } from '@/lib/translations';
import type { Translation } from '@/lib/translations';

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }

  const { language, toggleLanguage, setLanguage } = context;

  const t = (key: keyof Translation) => {
    return translations[key] ? translations[key][language] : key;
  };

  return { language, toggleLanguage, setLanguage, t };
};
