import { UpdateData } from "../UpdateData";

export default interface ApplicationConfigContextProps {
    currentTheme: string,
    currentThemeValue: string,
    setTheme: (theme: string) => void,
    setupLanguage: () => void,
    currentLanguageValue: string,
    setLanguage: (lng: string) => void,
    updateData: UpdateData | null
};