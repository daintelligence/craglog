// Persists lightweight app state across page navigations using localStorage
// — active crag session, recently visited crags, favourite crags

import type { Crag } from '@/types';

const KEYS = {
  session: 'craglog_active_session',
  recent:  'craglog_recent_crags',
  favs:    'craglog_fav_crags',
  theme:   'craglog_theme',
  onboarded: 'craglog_onboarded',
};

export interface ActiveSession {
  crag: Crag;
  startedAt: string;
}

// ─── Active session (currently at a crag) ─────────────────────────────────────

export function getActiveSession(): ActiveSession | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(KEYS.session);
    if (!raw) return null;
    const s: ActiveSession = JSON.parse(raw);
    // expire after 12 hours
    if (Date.now() - new Date(s.startedAt).getTime() > 12 * 60 * 60 * 1000) {
      clearActiveSession();
      return null;
    }
    return s;
  } catch { return null; }
}

export function setActiveSession(crag: Crag) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(KEYS.session, JSON.stringify({ crag, startedAt: new Date().toISOString() }));
}

export function clearActiveSession() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(KEYS.session);
}

// ─── Recent crags ─────────────────────────────────────────────────────────────

export function getRecentCrags(): Crag[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(KEYS.recent) || '[]');
  } catch { return []; }
}

export function addRecentCrag(crag: Crag) {
  if (typeof window === 'undefined') return;
  const list = getRecentCrags().filter((c) => c.id !== crag.id);
  list.unshift(crag);
  localStorage.setItem(KEYS.recent, JSON.stringify(list.slice(0, 5)));
}

// ─── Favourite crags ──────────────────────────────────────────────────────────

export function getFavouriteCrags(): Crag[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(KEYS.favs) || '[]');
  } catch { return []; }
}

export function toggleFavouriteCrag(crag: Crag) {
  if (typeof window === 'undefined') return;
  const list = getFavouriteCrags();
  const idx  = list.findIndex((c) => c.id === crag.id);
  if (idx >= 0) list.splice(idx, 1);
  else list.unshift(crag);
  localStorage.setItem(KEYS.favs, JSON.stringify(list.slice(0, 10)));
}

export function isFavouriteCrag(cragId: string): boolean {
  return getFavouriteCrags().some((c) => c.id === cragId);
}

// ─── Theme ────────────────────────────────────────────────────────────────────

export function getTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  return (localStorage.getItem(KEYS.theme) as 'light' | 'dark') || 'light';
}

export function setTheme(theme: 'light' | 'dark') {
  if (typeof window === 'undefined') return;
  localStorage.setItem(KEYS.theme, theme);
  if (theme === 'dark') document.documentElement.classList.add('dark');
  else document.documentElement.classList.remove('dark');
}

// ─── Onboarding ───────────────────────────────────────────────────────────────

export function isOnboarded(): boolean {
  if (typeof window === 'undefined') return true;
  return localStorage.getItem(KEYS.onboarded) === 'true';
}

export function markOnboarded() {
  if (typeof window === 'undefined') return;
  localStorage.setItem(KEYS.onboarded, 'true');
}
