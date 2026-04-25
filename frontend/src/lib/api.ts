import axios, { AxiosError } from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT from localStorage on every request
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('craglog_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 — redirect to login
api.interceptors.response.use(
  (res) => res,
  (err: AxiosError) => {
    if (err.response?.status === 401 && typeof window !== 'undefined') {
      if (!window.location.pathname.includes('/login')) {
        localStorage.removeItem('craglog_token');
        localStorage.removeItem('craglog_user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  },
);

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const authApi = {
  register: (data: { email: string; name: string; password: string; username?: string }) =>
    api.post('/auth/register', data).then((r) => r.data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data).then((r) => r.data),
  me: () => api.get('/auth/me').then((r) => r.data),
};

// ─── Crags ────────────────────────────────────────────────────────────────────
export const cragsApi = {
  search: (params: { q?: string; lat?: number; lng?: number; radiusKm?: number; limit?: number }) =>
    api.get('/crags', { params }).then((r) => r.data),
  getById: (id: string) => api.get(`/crags/${id}`).then((r) => r.data),
  getButtresses: (id: string) => api.get(`/crags/${id}/buttresses`).then((r) => r.data),
  getRegions: () => api.get('/crags/regions').then((r) => r.data),
  getConditions: (id: string) => api.get(`/crags/${id}/conditions`).then((r) => r.data),
  nearby: (lat: number, lng: number, radiusKm = 30) =>
    api.get('/crags/nearby', { params: { lat, lng, radiusKm } }).then((r) => r.data),
};

// ─── Routes ───────────────────────────────────────────────────────────────────
export const routesApi = {
  byButtress: (buttressId: string) =>
    api.get(`/routes/by-buttress/${buttressId}`).then((r) => r.data),
  getById: (id: string) => api.get(`/routes/${id}`).then((r) => r.data),
  search: (q: string) => api.get('/routes/search', { params: { q } }).then((r) => r.data),
};

// ─── Ascents ──────────────────────────────────────────────────────────────────
export const ascentsApi = {
  create: (data: any) => api.post('/ascents', data).then((r) => r.data),
  bulkCreate: (ascents: any[]) => api.post('/ascents/bulk', { ascents }).then((r) => r.data),
  list: (params?: any) => api.get('/ascents', { params }).then((r) => r.data),
  getById: (id: string) => api.get(`/ascents/${id}`).then((r) => r.data),
  update: (id: string, data: any) => api.put(`/ascents/${id}`, data).then((r) => r.data),
  delete: (id: string) => api.delete(`/ascents/${id}`),
};

// ─── Stats ────────────────────────────────────────────────────────────────────
export const statsApi = {
  dashboard: () => api.get('/stats/dashboard').then((r) => r.data),
  yearComparison: () => api.get('/stats/year-comparison').then((r) => r.data),
  heatmap: () => api.get('/stats/heatmap').then((r) => r.data),
  personalBests: () => api.get('/stats/personal-bests').then((r) => r.data),
};

// ─── Projects ─────────────────────────────────────────────────────────────────
export const projectsApi = {
  list: () => api.get('/projects').then((r) => r.data),
  add: (data: { routeId: string; priority?: string; notes?: string }) =>
    api.post('/projects', data).then((r) => r.data),
  update: (id: string, data: { priority?: string; notes?: string; attempts?: number }) =>
    api.patch(`/projects/${id}`, data).then((r) => r.data),
  incrementAttempt: (id: string) => api.post(`/projects/${id}/attempt`).then((r) => r.data),
  remove: (id: string) => api.delete(`/projects/${id}`),
};

// ─── Users ────────────────────────────────────────────────────────────────────
export const usersApi = {
  updateProfile: (data: { name?: string; bio?: string }) =>
    api.patch('/users/me', data).then((r) => r.data),
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.post('/users/me/password', data).then((r) => r.data),
};

// ─── Badges ───────────────────────────────────────────────────────────────────
export const badgesApi = {
  all: () => api.get('/badges').then((r) => r.data),
  mine: () => api.get('/badges/mine').then((r) => r.data),
};

// ─── Geo ──────────────────────────────────────────────────────────────────────
export const geoApi = {
  nearby: (lat: number, lng: number, radiusKm = 25, limit = 5) =>
    api.get('/geo/nearby', { params: { lat, lng, radiusKm, limit } }).then((r) => r.data),
  bounds: () => api.get('/geo/bounds').then((r) => r.data),
};

// ─── Export ───────────────────────────────────────────────────────────────────
export const exportApi = {
  download: async (format: string, startDate?: string, endDate?: string) => {
    const response = await api.get('/export', {
      params: { format, startDate, endDate },
      responseType: 'blob',
    });
    const url = URL.createObjectURL(new Blob([response.data]));
    const a = document.createElement('a');
    a.href = url;
    a.download = `craglog-${format}-${new Date().toISOString().slice(0, 10)}.${format === 'json' ? 'json' : 'csv'}`;
    a.click();
    URL.revokeObjectURL(url);
  },
};

export function getErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    return err.response?.data?.message || err.message;
  }
  return String(err);
}
