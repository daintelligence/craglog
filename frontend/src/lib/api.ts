import axios, { AxiosError } from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

// Attach JWT from localStorage on every request
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('craglog_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let refreshQueue: Array<(token: string | null) => void> = [];

function drainQueue(token: string | null) {
  refreshQueue.forEach((cb) => cb(token));
  refreshQueue = [];
}

// Handle 401 — try refresh, then retry; on second 401 redirect to login
api.interceptors.response.use(
  (res) => res,
  async (err: AxiosError) => {
    const original = err.config as any;
    if (
      err.response?.status !== 401 ||
      original?._retry ||
      typeof window === 'undefined' ||
      window.location.pathname.includes('/login')
    ) {
      return Promise.reject(err);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        refreshQueue.push((token) => {
          if (!token) return reject(err);
          original.headers.Authorization = `Bearer ${token}`;
          resolve(api(original));
        });
      });
    }

    original._retry = true;
    isRefreshing = true;

    try {
      const { data } = await axios.post(
        `${BASE_URL}/api/auth/refresh`,
        {},
        { withCredentials: true },
      );
      const newToken: string = data.accessToken;
      localStorage.setItem('craglog_token', newToken);
      api.defaults.headers.common.Authorization = `Bearer ${newToken}`;
      original.headers.Authorization = `Bearer ${newToken}`;
      drainQueue(newToken);
      return api(original);
    } catch {
      drainQueue(null);
      localStorage.removeItem('craglog_token');
      localStorage.removeItem('craglog_user');
      window.location.href = '/login';
      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  },
);

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const authApi = {
  register: (data: { email: string; name: string; password: string; username?: string; inviteToken?: string }) =>
    api.post('/auth/register', data).then((r) => r.data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data).then((r) => r.data),
  refresh: () => api.post('/auth/refresh').then((r) => r.data),
  logout: () => api.post('/auth/logout').catch(() => {}),
  me: () => api.get('/auth/me').then((r) => r.data),
};

// ─── Crags ────────────────────────────────────────────────────────────────────
export const cragsApi = {
  search: (params: { q?: string; lat?: number; lng?: number; radiusKm?: number; limit?: number; climbingType?: string; country?: string; regionId?: string }) =>
    api.get('/crags', { params }).then((r) => r.data),
  getById: (id: string) => api.get(`/crags/${id}`).then((r) => r.data),
  getButtresses: (id: string) => api.get(`/crags/${id}/buttresses`).then((r) => r.data),
  getRegions: () => api.get('/crags/regions').then((r) => r.data),
  getMapPins: (): Promise<{ id: string; name: string; latitude: number; longitude: number; rockType: string; regionName: string }[]> =>
    api.get('/crags/map').then((r) => r.data),
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
  gymLog: (data: { grade: string; style: string; date: string; ascentType?: string }) =>
    api.post('/ascents/gym', data).then((r) => r.data),
  bulkCreate: (ascents: any[]) => api.post('/ascents/bulk', { ascents }).then((r) => r.data),
  list: (params?: any) => api.get('/ascents', { params }).then((r) => r.data),
  getById: (id: string) => api.get(`/ascents/${id}`).then((r) => r.data),
  update: (id: string, data: any) => api.put(`/ascents/${id}`, data).then((r) => r.data),
  delete: (id: string) => api.delete(`/ascents/${id}`),
  ticksForCrag: (cragId: string): Promise<Record<string, string>> =>
    api.get('/ascents/ticks', { params: { cragId } }).then((r) => r.data),
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

// ─── Invites ──────────────────────────────────────────────────────────────────
export const invitesApi = {
  create: (data: { email?: string; note?: string }) =>
    api.post('/invites', data).then((r) => r.data),
  list: () => api.get('/invites').then((r) => r.data),
  validate: (token: string) => api.get(`/invites/validate/${token}`).then((r) => r.data),
  revoke: (id: string) => api.delete(`/invites/${id}`),
};

// ─── Feedback ─────────────────────────────────────────────────────────────────
export const feedbackApi = {
  submit: (data: { category: string; message: string; rating?: number; context?: string }) =>
    api.post('/feedback', data).then((r) => r.data),
  mine: () => api.get('/feedback/mine').then((r) => r.data),
  list: () => api.get('/feedback').then((r) => r.data),
  resolve: (id: string) => api.patch(`/feedback/${id}/resolve`).then((r) => r.data),
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
