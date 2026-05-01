'use client';
import { useState, useEffect } from 'react';
import { getColorTheme, setColorTheme, type ColorTheme } from '@/lib/sessionStore';

export function useColorTheme() {
  const [colorTheme, setColorThemeState] = useState<ColorTheme>('rock');

  useEffect(() => {
    const stored = getColorTheme();
    setColorThemeState(stored);
    document.documentElement.setAttribute('data-theme', stored);
  }, []);

  const changeTheme = (theme: ColorTheme) => {
    setColorTheme(theme);
    setColorThemeState(theme);
  };

  return { colorTheme, changeTheme };
}
