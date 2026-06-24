const API_URL = '/api';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'EDITOR' | 'SUBSCRIBER';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Entrepreneur {
  id: string;
  slug: string;
  name: string;
  title: string;
  photo?: string | null;
  bio?: string | null;
  quote?: string | null;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: { interviews: number; reels: number; articles: number };
}

export interface Interview {
  id: string;
  slug: string;
  title: string;
  subtitle?: string | null;
  entrepreneurId: string;
  entrepreneur?: { id: string; name: string } | null;
  coverImage?: string | null;
  videoType: 'EMBED' | 'SELF_HOSTED';
  videoUrl?: string | null;
  videoFile?: string | null;
  summary?: string | null;
  content?: string | null;
  quote?: string | null;
  isPublished: boolean;
  publishedAt?: string | null;
  metaTitle?: string | null;
  metaDesc?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Reel {
  id: string;
  slug: string;
  title: string;
  entrepreneurId?: string | null;
  entrepreneur?: { id: string; name: string } | null;
  coverImage?: string | null;
  videoType: 'EMBED' | 'SELF_HOSTED';
  videoUrl?: string | null;
  videoFile?: string | null;
  description?: string | null;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  subtitle?: string | null;
  entrepreneurId?: string | null;
  entrepreneur?: { id: string; name: string } | null;
  coverImage?: string | null;
  content: string;
  isPublished: boolean;
  publishedAt?: string | null;
  metaTitle?: string | null;
  metaDesc?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Business {
  id: string;
  slug: string;
  name: string;
  type: string;
  description?: string | null;
  address?: string | null;
  city?: string | null;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  coverImage?: string | null;
  isPublished: boolean;
  entrepreneurId: string;
  entrepreneur?: { id: string; name: string } | null;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  content: string;
  userId: string;
  user: { id: string; name: string; email: string };
  interviewId?: string | null;
  interview?: { id: string; title: string; slug: string } | null;
  articleId?: string | null;
  article?: { id: string; title: string; slug: string } | null;
  reelId?: string | null;
  reel?: { id: string; title: string; slug: string } | null;
  entrepreneurId?: string | null;
  entrepreneur?: { id: string; name: string; slug: string } | null;
  isApproved: boolean;
  createdAt: string;
}

export interface ShootingRequest {
  id: string;
  name: string;
  company?: string | null;
  phone?: string | null;
  email: string;
  message?: string | null;
  status: 'NEW' | 'IN_PROGRESS' | 'COMPLETED' | 'ARCHIVED';
  createdAt: string;
  updatedAt: string;
}

export interface Subscriber {
  id: string;
  email: string;
  isActive: boolean;
  createdAt: string;
}

export type Settings = Record<string, string>;

async function fetchJson(input: string, init?: RequestInit) {
  const isFormData = init?.body instanceof FormData;
  const headers: Record<string, string> = {
    ...(init?.headers as Record<string, string>),
  };
  if (!isFormData && (!init || !(init.body instanceof URLSearchParams))) {
    headers['Content-Type'] = 'application/json';
  }
  const res = await fetch(API_URL + input, {
    ...init,
    headers,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(err.error || 'Request failed');
  }
  return res.json();
}

async function uploadFile(type: 'image' | 'video', file: File): Promise<{ url: string }> {
  const formData = new FormData();
  formData.append('file', file);
  return fetchJson(`/admin/upload/${type}`, {
    method: 'POST',
    body: formData,
  });
}

export const api = {
  login: (email: string, password: string) =>
    fetchJson('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  logout: () => fetchJson('/auth/logout', { method: 'POST' }),
  getMe: () => fetchJson('/auth/me'),

  uploadImage: (file: File) => uploadFile('image', file),
  uploadVideo: (file: File) => uploadFile('video', file),

  users: {
    list: (): Promise<User[]> => fetchJson('/admin/users'),
    get: (id: string): Promise<User> => fetchJson(`/admin/users/${id}`),
    create: (data: Partial<User> & { password: string }) =>
      fetchJson('/admin/users', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Partial<User>) =>
      fetchJson(`/admin/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => fetchJson(`/admin/users/${id}`, { method: 'DELETE' }),
  },

  entrepreneurs: {
    list: (): Promise<Entrepreneur[]> => fetchJson('/admin/entrepreneurs'),
    get: (id: string): Promise<Entrepreneur> => fetchJson(`/admin/entrepreneurs/${id}`),
    create: (data: Partial<Entrepreneur>) =>
      fetchJson('/admin/entrepreneurs', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Partial<Entrepreneur>) =>
      fetchJson(`/admin/entrepreneurs/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => fetchJson(`/admin/entrepreneurs/${id}`, { method: 'DELETE' }),
  },

  interviews: {
    list: (): Promise<Interview[]> => fetchJson('/admin/interviews'),
    get: (id: string): Promise<Interview> => fetchJson(`/admin/interviews/${id}`),
    create: (data: Partial<Interview>) =>
      fetchJson('/admin/interviews', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Partial<Interview>) =>
      fetchJson(`/admin/interviews/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => fetchJson(`/admin/interviews/${id}`, { method: 'DELETE' }),
  },

  reels: {
    list: (): Promise<Reel[]> => fetchJson('/admin/reels'),
    get: (id: string): Promise<Reel> => fetchJson(`/admin/reels/${id}`),
    create: (data: Partial<Reel>) =>
      fetchJson('/admin/reels', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Partial<Reel>) =>
      fetchJson(`/admin/reels/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => fetchJson(`/admin/reels/${id}`, { method: 'DELETE' }),
  },

  articles: {
    list: (): Promise<Article[]> => fetchJson('/admin/articles'),
    get: (id: string): Promise<Article> => fetchJson(`/admin/articles/${id}`),
    create: (data: Partial<Article>) =>
      fetchJson('/admin/articles', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Partial<Article>) =>
      fetchJson(`/admin/articles/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => fetchJson(`/admin/articles/${id}`, { method: 'DELETE' }),
  },

  businesses: {
    list: (): Promise<Business[]> => fetchJson('/admin/businesses'),
    get: (id: string): Promise<Business> => fetchJson(`/admin/businesses/${id}`),
    create: (data: Partial<Business>) =>
      fetchJson('/admin/businesses', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Partial<Business>) =>
      fetchJson(`/admin/businesses/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => fetchJson(`/admin/businesses/${id}`, { method: 'DELETE' }),
  },

  comments: {
    list: (): Promise<Comment[]> => fetchJson('/admin/comments'),
    approve: (id: string, isApproved = true) =>
      fetchJson(`/admin/comments/${id}/approve`, { method: 'POST', body: JSON.stringify({ isApproved }) }),
    delete: (id: string) => fetchJson(`/admin/comments/${id}`, { method: 'DELETE' }),
  },

  shootingRequests: {
    list: (): Promise<ShootingRequest[]> => fetchJson('/admin/shooting-requests'),
    updateStatus: (id: string, status: ShootingRequest['status']) =>
      fetchJson(`/admin/shooting-requests/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
    delete: (id: string) => fetchJson(`/admin/shooting-requests/${id}`, { method: 'DELETE' }),
  },

  subscribers: {
    list: (): Promise<Subscriber[]> => fetchJson('/admin/subscribers'),
    exportCsv: () => {
      const link = document.createElement('a');
      link.href = API_URL + '/admin/subscribers/export.csv';
      link.download = 'subscribers.csv';
      document.body.appendChild(link);
      link.click();
      link.remove();
    },
    delete: (id: string) => fetchJson(`/admin/subscribers/${id}`, { method: 'DELETE' }),
  },

  settings: {
    get: (): Promise<Settings> => fetchJson('/admin/settings'),
    update: (data: Settings) => fetchJson('/admin/settings', { method: 'PUT', body: JSON.stringify(data) }),
  },
};
