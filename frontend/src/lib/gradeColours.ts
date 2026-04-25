import type { GradeSystem } from '@/types';

const UK_TRAD_BAND: Record<string, string> = {
  M: 'grade-green', D: 'grade-green', VD: 'grade-green', HVD: 'grade-green',
  S: 'grade-lime', MS: 'grade-lime', HS: 'grade-lime', MHS: 'grade-lime', MVS: 'grade-lime',
  VS: 'grade-amber',
  HVS: 'grade-orange',
  E1: 'grade-red', E2: 'grade-red',
  E3: 'grade-crimson', E4: 'grade-crimson',
  E5: 'grade-purple', E6: 'grade-purple',
  E7: 'grade-black', E8: 'grade-black', E9: 'grade-black',
};

const FRENCH_DIFFICULTY: Record<string, number> = {
  '3': 1, '4': 2, '4+': 3, '5': 4, '5+': 5,
  '6a': 6, '6a+': 7, '6b': 8, '6b+': 9, '6c': 10, '6c+': 11,
  '7a': 12, '7a+': 13, '7b': 14, '7b+': 15, '7c': 16, '7c+': 17,
  '8a': 18, '8a+': 19, '8b': 20, '8b+': 21, '8c': 22, '8c+': 23,
  '9a': 24, '9a+': 25, '9b': 26, '9b+': 27, '9c': 28,
};

export function getGradeColour(grade: string, gradeSystem?: string): string {
  const sys = (gradeSystem || '').toLowerCase();

  if (sys === 'uk_trad' || sys === 'uk trad') {
    return UK_TRAD_BAND[grade?.trim()] || 'grade-default';
  }

  if (sys === 'french') {
    const d = FRENCH_DIFFICULTY[grade?.trim()] ?? 0;
    if (d <= 4)  return 'grade-green';
    if (d <= 7)  return 'grade-lime';
    if (d <= 11) return 'grade-amber';
    if (d <= 15) return 'grade-orange';
    if (d <= 19) return 'grade-red';
    if (d <= 23) return 'grade-crimson';
    return 'grade-purple';
  }

  if (sys === 'font') {
    const lower = (grade || '').toLowerCase();
    if (lower <= '5c') return 'grade-green';
    if (lower <= '6b') return 'grade-lime';
    if (lower <= '6c') return 'grade-amber';
    if (lower <= '7a') return 'grade-orange';
    if (lower <= '7c') return 'grade-red';
    return 'grade-crimson';
  }

  if (sys === 'vgrade') {
    const num = parseInt((grade || '').replace(/^V/i, '').replace(/[^0-9]/g, ''), 10);
    if (isNaN(num) || num <= 2) return 'grade-green';
    if (num <= 4)  return 'grade-lime';
    if (num <= 6)  return 'grade-amber';
    if (num <= 8)  return 'grade-orange';
    if (num <= 11) return 'grade-red';
    if (num <= 14) return 'grade-crimson';
    return 'grade-purple';
  }

  return 'grade-default';
}

export const ROCK_TYPE_STYLES: Record<string, { bg: string; dot: string; label: string }> = {
  gritstone:  { bg: 'from-amber-800  to-amber-600',  dot: 'bg-amber-600',  label: 'Gritstone'  },
  limestone:  { bg: 'from-slate-600  to-slate-400',  dot: 'bg-slate-500',  label: 'Limestone'  },
  granite:    { bg: 'from-stone-600  to-stone-400',  dot: 'bg-stone-500',  label: 'Granite'    },
  sandstone:  { bg: 'from-orange-700 to-orange-500', dot: 'bg-orange-500', label: 'Sandstone'  },
  basalt:     { bg: 'from-stone-800  to-stone-600',  dot: 'bg-stone-700',  label: 'Basalt'     },
  quartzite:  { bg: 'from-cyan-700   to-cyan-500',   dot: 'bg-cyan-500',   label: 'Quartzite'  },
  other:      { bg: 'from-rock-700   to-rock-500',   dot: 'bg-rock-500',   label: 'Rock'       },
};
