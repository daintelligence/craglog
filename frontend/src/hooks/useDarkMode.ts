'use client';
import { useState, useEffect, useCallback } from 'react';
import { getTheme, setTheme } from '@/lib/sessionStore';

export function useDarkMode() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const stored = getTheme();
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = stored || (prefersDark ? 'dark' : 'light');
    setIsDark(theme === 'dark');
    if (theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, []);

  const toggle = useCallback(() => {
    setIsDark((prev) => {
      const next = !prev;
      setTheme(next ? 'dark' : 'light');
      return next;
    });
  }, []);

  return { isDark, toggle };
}
