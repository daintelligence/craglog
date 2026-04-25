// Client-side persistence for the tick list / projects
// Stored in localStorage until backend endpoint is added

export interface Project {
  id: string;
  routeId?: string;
  routeName: string;
  grade: string;
  gradeSystem: string;
  cragName: string;
  cragId?: string;
  notes: string;
  priority: 'low' | 'medium' | 'high';
  addedAt: string;
}

const KEY = 'craglog_projects';

export function getProjects(): Project[] {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem(KEY) || '[]'); }
  catch { return []; }
}

export function addProject(p: Omit<Project, 'id' | 'addedAt'>): Project {
  const project: Project = { ...p, id: crypto.randomUUID(), addedAt: new Date().toISOString() };
  const list = getProjects();
  list.unshift(project);
  localStorage.setItem(KEY, JSON.stringify(list));
  return project;
}

export function removeProject(id: string) {
  const list = getProjects().filter((p) => p.id !== id);
  localStorage.setItem(KEY, JSON.stringify(list));
}

export function updateProject(id: string, updates: Partial<Pick<Project, 'notes' | 'priority'>>) {
  const list = getProjects().map((p) => p.id === id ? { ...p, ...updates } : p);
  localStorage.setItem(KEY, JSON.stringify(list));
}
