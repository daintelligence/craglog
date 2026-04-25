// ─── Auth ─────────────────────────────────────────────────────────────────────
export interface User {
  id: string;
  email: string;
  name: string;
  username?: string;
  bio?: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

// ─── Geography ────────────────────────────────────────────────────────────────
export interface Region {
  id: string;
  name: string;
  country: string;
  description?: string;
}

export interface Crag {
  id: string;
  name: string;
  description?: string;
  latitude?: number;
  longitude?: number;
  rockType: RockType;
  approach?: string;
  parkingInfo?: string;
  imageUrl?: string;
  region?: Region;
  regionId?: string;
  buttresses?: Buttress[];
  distanceMetres?: number;
}

export interface Buttress {
  id: string;
  name: string;
  description?: string;
  cragId: string;
  sortOrder: number;
  routes?: Route[];
}

// ─── Routes ───────────────────────────────────────────────────────────────────
export interface Route {
  id: string;
  name: string;
  description?: string;
  climbingType: ClimbingType;
  gradeSystem: GradeSystem;
  grade: string;
  gradeDifficulty: number;
  technicalGrade?: string;
  pitches?: number;
  heightMetres?: number;
  protection?: string;
  buttressId: string;
  buttress?: Buttress & { crag?: Crag };
}

// ─── Ascents ──────────────────────────────────────────────────────────────────
export interface Ascent {
  id: string;
  userId: string;
  routeId: string;
  cragId?: string;
  route?: Route;
  crag?: Crag;
  ascentType: AscentType;
  date: string;
  notes?: string;
  partner?: string;
  starRating?: number;
  isFavourite: boolean;
  attempts: number;
  conditions?: string;
  createdAt: string;
}

export interface CreateAscentPayload {
  routeId: string;
  cragId?: string;
  ascentType: AscentType;
  date: string;
  notes?: string;
  partner?: string;
  starRating?: number;
  isFavourite?: boolean;
  attempts?: number;
  conditions?: string;
}

// ─── Badges ───────────────────────────────────────────────────────────────────
export interface BadgeDefinition {
  id: string;
  name: string;
  description: string;
  tier: BadgeTier;
  icon: string;
  category: string;
}

export interface UserBadge {
  badge: BadgeDefinition;
  earnedAt: string;
}

// ─── Stats ────────────────────────────────────────────────────────────────────
export interface DashboardStats {
  totals: {
    totalAscents: number;
    uniqueCrags: number;
    uniqueRoutes: number;
    totalDays: number;
    maxDifficulty: number;
  };
  byType: { type: string; count: number }[];
  gradeDistribution: { grade: string; gradeSystem: string; difficulty: number; count: number }[];
  topCrags: { id: string; name: string; latitude: number; longitude: number; visits: number }[];
  progression: { month: string; total: number; maxDifficulty: number; onsights: number }[];
  recentAscents: RecentAscent[];
  onsightRate: {
    total: number;
    onsights: number;
    flashes: number;
    redpoints: number;
    onsightRate: number;
  };
}

export interface RecentAscent {
  id: string;
  date: string;
  ascent_type: string;
  route_name: string;
  grade: string;
  grade_system: string;
  climbing_type: string;
  crag_name: string;
  notes?: string;
}

// ─── Enums ────────────────────────────────────────────────────────────────────
export type ClimbingType = 'sport' | 'trad' | 'mixed' | 'boulder' | 'alpine' | 'dws';
export type GradeSystem = 'uk_trad' | 'french' | 'font' | 'vgrade' | 'ewbank' | 'yds';
export type AscentType = 'onsight' | 'flash' | 'redpoint' | 'pinkpoint' | 'repeat' | 'dog' | 'second' | 'abseil' | 'solo';
export type BadgeTier = 'bronze' | 'silver' | 'gold' | 'platinum';
export type RockType = 'gritstone' | 'limestone' | 'granite' | 'sandstone' | 'basalt' | 'quartzite' | 'other';

// ─── Projects ─────────────────────────────────────────────────────────────────
export interface Project {
  id: string;
  userId: string;
  routeId: string;
  priority: 'high' | 'medium' | 'low';
  notes: string | null;
  attempts: number;
  lastAttempted: string | null;
  route?: Route & { buttress?: Buttress & { crag?: Crag } };
  createdAt: string;
  updatedAt: string;
}

// ─── UI ───────────────────────────────────────────────────────────────────────
export interface OfflineAscent extends CreateAscentPayload {
  _offlineId: string;
  _createdAt: string;
  _routeName?: string;
  _cragName?: string;
  _grade?: string;
}

export const ASCENT_TYPE_LABELS: Record<AscentType, string> = {
  onsight:   'Onsight',
  flash:     'Flash',
  redpoint:  'Redpoint',
  pinkpoint: 'Pinkpoint',
  repeat:    'Repeat',
  dog:       'Fell/Dog',
  second:    'Second',
  abseil:    'Abseil',
  solo:      'Solo',
};

export const CLIMBING_TYPE_LABELS: Record<ClimbingType, string> = {
  sport:  'Sport',
  trad:   'Trad',
  mixed:  'Mixed',
  boulder:'Boulder',
  alpine: 'Alpine',
  dws:    'Deep Water Solo',
};

export const GRADE_SYSTEM_LABELS: Record<GradeSystem, string> = {
  uk_trad: 'UK Trad',
  french:  'French Sport',
  font:    'Fontainebleau',
  vgrade:  'V-Grade',
  ewbank:  'Ewbank',
  yds:     'YDS (US)',
};

export const UK_TRAD_GRADES = [
  'M','D','VD','HVD','MVS','S','MS','HS','MHS','VS','HVS','E1','E2','E3','E4','E5','E6','E7','E8','E9',
];

export const FRENCH_GRADES = [
  '3','4','4+','5','5+','6a','6a+','6b','6b+','6c','6c+',
  '7a','7a+','7b','7b+','7c','7c+',
  '8a','8a+','8b','8b+','8c','8c+',
  '9a','9a+','9b','9b+','9c',
];

export const FONT_GRADES = [
  '3','4','4+','5','5+','6A','6A+','6B','6B+','6C','6C+',
  '7A','7A+','7B','7B+','7C','7C+',
  '8A','8A+','8B','8B+','8C','8C+',
];

export const V_GRADES = [
  'VB','V0','V0+','V1','V2','V3','V4','V5','V6','V7','V8','V9',
  'V10','V11','V12','V13','V14','V15','V16','V17',
];

export const BADGE_TIER_COLORS: Record<BadgeTier, string> = {
  bronze:   'from-amber-600 to-yellow-700',
  silver:   'from-slate-400 to-slate-500',
  gold:     'from-yellow-400 to-amber-500',
  platinum: 'from-cyan-300 to-teal-400',
};
