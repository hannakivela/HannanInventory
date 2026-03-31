import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Theme } from '../types';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  themeClasses: ThemeClasses;
}

export interface ThemeClasses {
  bg: string;
  bgCard: string;
  bgCardHover: string;
  bgInput: string;
  text: string;
  textMuted: string;
  textAccent: string;
  border: string;
  accent: string;
  accentText: string;
  accentBg: string;
  accentBgHover: string;
  btnPrimary: string;
  btnDanger: string;
  btnSecondary: string;
  badge: string;
  glow: string;
  header: string;
}

const themeMap: Record<Theme, ThemeClasses> = {
  dark: {
    bg: 'bg-slate-950',
    bgCard: 'bg-slate-900',
    bgCardHover: 'hover:bg-slate-800',
    bgInput: 'bg-slate-800',
    text: 'text-slate-100',
    textMuted: 'text-slate-400',
    textAccent: 'text-sky-400',
    border: 'border-slate-700',
    accent: 'sky-400',
    accentText: 'text-sky-400',
    accentBg: 'bg-sky-500',
    accentBgHover: 'hover:bg-sky-400',
    btnPrimary: 'bg-sky-500 hover:bg-sky-400 text-white',
    btnDanger: 'bg-red-600 hover:bg-red-500 text-white',
    btnSecondary: 'bg-slate-700 hover:bg-slate-600 text-slate-200',
    badge: 'bg-sky-900 text-sky-300',
    glow: 'glow-blue',
    header: 'bg-slate-900/80 border-slate-700',
  },
  light: {
    bg: 'bg-slate-100',
    bgCard: 'bg-white',
    bgCardHover: 'hover:bg-slate-50',
    bgInput: 'bg-white',
    text: 'text-slate-800',
    textMuted: 'text-slate-500',
    textAccent: 'text-blue-600',
    border: 'border-slate-200',
    accent: 'blue-600',
    accentText: 'text-blue-600',
    accentBg: 'bg-blue-600',
    accentBgHover: 'hover:bg-blue-500',
    btnPrimary: 'bg-blue-600 hover:bg-blue-500 text-white',
    btnDanger: 'bg-red-500 hover:bg-red-400 text-white',
    btnSecondary: 'bg-slate-200 hover:bg-slate-300 text-slate-700',
    badge: 'bg-blue-100 text-blue-700',
    glow: '',
    header: 'bg-white/90 border-slate-200',
  },
  neon: {
    bg: 'bg-black',
    bgCard: 'bg-zinc-950',
    bgCardHover: 'hover:bg-zinc-900',
    bgInput: 'bg-zinc-900',
    text: 'text-cyan-50',
    textMuted: 'text-cyan-400/70',
    textAccent: 'text-cyan-300',
    border: 'border-cyan-500/30',
    accent: 'cyan-400',
    accentText: 'text-cyan-400',
    accentBg: 'bg-cyan-500',
    accentBgHover: 'hover:bg-cyan-400',
    btnPrimary: 'bg-cyan-500 hover:bg-cyan-400 text-black font-bold',
    btnDanger: 'bg-pink-600 hover:bg-pink-500 text-white',
    btnSecondary: 'bg-zinc-800 hover:bg-zinc-700 text-cyan-300 border border-cyan-500/30',
    badge: 'bg-cyan-900/50 text-cyan-300 border border-cyan-500/30',
    glow: 'glow-blue',
    header: 'bg-black/80 border-cyan-500/20',
  },
  nature: {
    bg: 'bg-emerald-950',
    bgCard: 'bg-emerald-900/60',
    bgCardHover: 'hover:bg-emerald-900/80',
    bgInput: 'bg-emerald-900',
    text: 'text-emerald-50',
    textMuted: 'text-emerald-300/70',
    textAccent: 'text-green-400',
    border: 'border-emerald-700/50',
    accent: 'green-400',
    accentText: 'text-green-400',
    accentBg: 'bg-green-500',
    accentBgHover: 'hover:bg-green-400',
    btnPrimary: 'bg-green-500 hover:bg-green-400 text-white',
    btnDanger: 'bg-red-600 hover:bg-red-500 text-white',
    btnSecondary: 'bg-emerald-800 hover:bg-emerald-700 text-emerald-200',
    badge: 'bg-green-900/60 text-green-300',
    glow: 'glow-green',
    header: 'bg-emerald-950/80 border-emerald-700/30',
  },
};

const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  setTheme: () => {},
  themeClasses: themeMap.dark,
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem('car-inventory-theme');
    return (saved as Theme) || 'dark';
  });

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('car-inventory-theme', newTheme);
  };

  useEffect(() => {
    document.documentElement.className = `theme-${theme}`;
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themeClasses: themeMap[theme] }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
