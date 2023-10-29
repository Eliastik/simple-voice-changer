export default interface ApplicationConfigContextProps {
    currentTheme: string,
    currentThemeValue: string,
    setTheme: (theme: string) => void,
    setupLanguage: () => void,
    currentLanguageValue: string,
    setLanguage: (lng: string) => void
};