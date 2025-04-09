import { create } from 'zustand';
import { themes } from '../config/themes';
import { ThemeConfig } from '../config/theme.config';

interface ThemeState {
  currentTheme: string;
  theme: ThemeConfig;
  themes: typeof themes;
  setTheme: (themeName: string) => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  currentTheme: 'default',
  theme: themes.default,
  themes,
  setTheme: (themeName: string) => {
    if (themes[themeName]) {
      set({ currentTheme: themeName, theme: themes[themeName] });
      localStorage.setItem('theme', themeName);
    }
  },
})); 