"use client";

import { createContext, useContext, useState, ReactNode, FC, useEffect } from 'react';
import ApplicationConfigContextProps from '../model/contextProps/ApplicationConfigContextProps';
import ApplicationConfigService from './ApplicationConfigService';
import i18next from 'i18next';

const applicationConfigService = new ApplicationConfigService();

const ApplicationConfigContext = createContext<ApplicationConfigContextProps | undefined>(undefined);

export const useApplicationConfig = (): ApplicationConfigContextProps => {
  const context = useContext(ApplicationConfigContext);
  if (!context) {
    throw new Error('useApplicationConfig doit être utilisé à l\'intérieur d\'un ApplicationConfigProvider');
  }
  return context;
};

interface ApplicationConfigProviderProps {
  children: ReactNode;
}

export const ApplicationConfigProvider: FC<ApplicationConfigProviderProps> = ({ children }) => {
  // State: current theme (light/dark)
  const [currentTheme, setCurrentTheme] = useState("dark");
  // State: theme setting (auto/dark/light)
  const [currentThemeValue, setCurrentThemeValue] = useState("auto");
  // State: current language
  const [currentLanguageValue, setCurrentLanguageValue] = useState("en");

  useEffect(() => {
    setCurrentTheme(applicationConfigService.getCurrentTheme());
    setCurrentThemeValue(applicationConfigService.getCurrentThemePreference());
  }, []);

  const setTheme = (theme: string) => {
    applicationConfigService.setCurrentTheme(theme);
    setCurrentTheme(applicationConfigService.getCurrentTheme());
    setCurrentThemeValue(applicationConfigService.getCurrentThemePreference());
  };

  const setupLanguage = () => {
    const lng = applicationConfigService.getCurrentLanguagePreference();
    i18next.changeLanguage(lng);
    setCurrentLanguageValue(lng)
  };

  const setLanguage = (lng: string) => {
    applicationConfigService.setCurrentLanguage(lng);
    setupLanguage();
  };

  return (
    <ApplicationConfigContext.Provider value={{
      currentTheme, currentThemeValue, setTheme, setupLanguage, currentLanguageValue, setLanguage
    }}>
      {children}
    </ApplicationConfigContext.Provider>
  );
};