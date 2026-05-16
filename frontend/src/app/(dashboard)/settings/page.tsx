'use client';
import { Sun, Moon, ChevronRight, Palette } from 'lucide-react';
import { useDarkMode } from '@/hooks/useDarkMode';
import { useColorTheme } from '@/hooks/useColorTheme';
import { cn } from '@/lib/utils';
import type { ColorTheme } from '@/lib/sessionStore';

const COLOR_THEMES: { id: ColorTheme; label: string; swatch: string }[] = [
  { id: 'rock',      label: 'Rock',      swatch: '#6d5035' },
  { id: 'alpine',    label: 'Alpine',    swatch: '#2563eb' },
  { id: 'forest',    label: 'Forest',    swatch: '#16a34a' },
  { id: 'sandstone', label: 'Sandstone', swatch: '#ea580c' },
  { id: 'slate',     label: 'Slate',     swatch: '#7c3aed' },
  { id: 'fuchsia',   label: 'Fuchsia',   swatch: '#c026d3' },
];

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-stone-900 rounded-2xl shadow-sm border border-stone-100 dark:border-stone-800 overflow-hidden">
      {children}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xs font-semibold text-stone-400 dark:text-stone-500 uppercase tracking-wider px-1 mb-2">
      {children}
    </h2>
  );
}

export default function SettingsPage() {
  const { isDark, toggle } = useDarkMode();
  const { colorTheme, changeTheme: setColorTheme } = useColorTheme();

  return (
    <div className="space-y-6 pb-4">
      <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-50">Settings</h1>

      {/* ── Appearance ─────────────────────────────────────────────────── */}
      <div className="space-y-2">
        <SectionTitle>Appearance</SectionTitle>
        <Card>
          {/* Dark mode */}
          <button
            onClick={toggle}
            className="w-full flex items-center gap-4 px-4 py-4 hover:bg-stone-50 dark:hover:bg-stone-800/60 transition-colors"
          >
            <div className="w-9 h-9 rounded-xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center shrink-0">
              {isDark
                ? <Moon className="w-4.5 h-4.5 text-stone-600 dark:text-stone-300" />
                : <Sun className="w-4.5 h-4.5 text-stone-600 dark:text-stone-300" />
              }
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-semibold text-stone-800 dark:text-stone-100">Dark mode</p>
              <p className="text-xs text-stone-400">{isDark ? 'On' : 'Off'}</p>
            </div>
            <div
              className={cn(
                'w-12 rounded-full transition-colors relative shrink-0',
                isDark ? 'bg-rock-600' : 'bg-stone-200 dark:bg-stone-700',
              )}
              style={{ height: 26 }}
            >
              <div
                className={cn(
                  'absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform',
                  isDark ? 'translate-x-6' : 'translate-x-0.5',
                )}
              />
            </div>
          </button>

          <div className="h-px bg-stone-100 dark:bg-stone-800 mx-4" />

          {/* Colour theme */}
          <div className="px-4 py-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-9 h-9 rounded-xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center shrink-0">
                <Palette className="w-4.5 h-4.5 text-stone-600 dark:text-stone-300" />
              </div>
              <div>
                <p className="text-sm font-semibold text-stone-800 dark:text-stone-100">Colour scheme</p>
                <p className="text-xs text-stone-400 capitalize">{colorTheme}</p>
              </div>
            </div>
            <div className="grid grid-cols-6 gap-3 pl-13" style={{ paddingLeft: 52 }}>
              {COLOR_THEMES.map(({ id, label, swatch }) => (
                <button
                  key={id}
                  onClick={() => setColorTheme(id)}
                  title={label}
                  className="flex flex-col items-center gap-1.5 group"
                >
                  <div
                    className={cn(
                      'w-9 h-9 rounded-full transition-all duration-150 flex items-center justify-center',
                      colorTheme === id ? 'scale-110' : 'opacity-60 group-hover:opacity-90 group-hover:scale-105',
                    )}
                    style={{
                      backgroundColor: swatch,
                      outline: colorTheme === id ? `2px solid ${swatch}` : 'none',
                      outlineOffset: '3px',
                    }}
                  >
                    {colorTheme === id && (
                      <svg className="w-4 h-4 text-white drop-shadow" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span className="text-[10px] text-stone-400 dark:text-stone-500 leading-none">{label}</span>
                </button>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* ── About ──────────────────────────────────────────────────────── */}
      <div className="space-y-2">
        <SectionTitle>About</SectionTitle>
        <Card>
          <div className="px-4 py-4 flex items-center justify-between">
            <p className="text-sm text-stone-600 dark:text-stone-400">CragLog</p>
            <p className="text-sm text-stone-400">Beta</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
