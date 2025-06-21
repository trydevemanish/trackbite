import { createContext, ReactNode, useState } from 'react';

type themeContextType = {
    currentTheme : string;
    toggleTheme: (newTheme : string) => void;
}

export const ThemeContext = createContext<themeContextType>({
    currentTheme: 'light',
    toggleTheme: () => {}
});

const ThemeProvider = ({children}: { children : ReactNode}) => {
    const [theme,setTheme] = useState<string>('light')

    const toggleTheme = (newTheme:string) => {
        setTheme(newTheme);
    }

    return (
        <ThemeContext.Provider value={{ currentTheme : theme,toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}

export default ThemeProvider