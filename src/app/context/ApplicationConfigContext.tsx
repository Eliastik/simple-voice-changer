"use client";

import { createContext, useContext, useState, ReactNode, FC, useEffect } from 'react';
import ApplicationConfigContextProps from '../model/contextProps/ApplicationConfigContextProps';
import ApplicationConfigService from './ApplicationConfigService';
import i18next from 'i18next';
import { UpdateData } from '../model/UpdateData';
import ApplicationObjectsSingleton from './ApplicationObjectsSingleton';

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

const getService = (): ApplicationConfigService => {
  return ApplicationObjectsSingleton.getConfigServiceInstance()!;
}

export const ApplicationConfigProvider: FC<ApplicationConfigProviderProps> = ({ children }) => {
  // State: current theme (light/dark)
  const [currentTheme, setCurrentTheme] = useState("dark");
  // State: theme setting (auto/dark/light)
  const [currentThemeValue, setCurrentThemeValue] = useState("auto");
  // State: current language
  const [currentLanguageValue, setCurrentLanguageValue] = useState("en");
  // State: current language
  const [updateData, setUpdateData] = useState<UpdateData | null>(null);
  // State: true if the user already used the time one time
  const [alreadyUsed, setAlreadyUsed] = useState(false);

  useEffect(() => {
    setCurrentTheme(getService().getCurrentTheme());
    setCurrentThemeValue(getService().getCurrentThemePreference());
    setAlreadyUsed(getService().hasAlreadyUsedApp());
    getService().checkAppUpdate().then(result => setUpdateData(result));
  }, []);

  const setTheme = (theme: string) => {
    getService().setCurrentTheme(theme);
    setCurrentTheme(getService().getCurrentTheme());
    setCurrentThemeValue(getService().getCurrentThemePreference());
  };

  const setupLanguage = () => {
    const lng = getService().getCurrentLanguagePreference();
    i18next.changeLanguage(lng);
    setCurrentLanguageValue(lng)
  };

  const setLanguage = (lng: string) => {
    getService().setCurrentLanguage(lng);
    setupLanguage();
  };

  const closeFirstLaunchModal = () => {
    getService().setAlreadyUsedApp();
    setAlreadyUsed(true);
  };

  return (
    <ApplicationConfigContext.Provider value={{
      currentTheme, currentThemeValue, setTheme, setupLanguage, currentLanguageValue, setLanguage,
      updateData, alreadyUsed, closeFirstLaunchModal
    }}>
      {children}
    </ApplicationConfigContext.Provider>
  );
};