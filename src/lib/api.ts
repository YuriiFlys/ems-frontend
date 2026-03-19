const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

function getAuthHeader(): HeadersInit {
  if (typeof window === 'undefined') return {};
  const token = localStorage.getItem('ems_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
      ...options.headers,
    },
    ...options,
  });

  if (res.status === 204) return undefined as T;

  const body = await res.json().catch(() => ({}));

  if (!res.ok) {
    const message = Array.isArray(body.message)
      ? body.message.join(', ')
      : body.message || `Error ${res.status}`;
    throw new Error(message);
  }

  return body as T;
}

// ─── Auth ────────────────────────────────────────────────────────────────────

export const login = (email: string, password: string) =>
  request<{ access_token: string; user: any }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

export const register = (data: { email: string; password: string; firstName: string; lastName: string }) =>
  request<{ access_token: string; user: any }>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });

// ─── Profile ─────────────────────────────────────────────────────────────────

export const getProfile = () =>
  request<any>('/users/me');

export const updateProfile = (data: Partial<{ firstName: string; lastName: string; password: string }>) =>
  request<any>('/users/me', { method: 'PATCH', body: JSON.stringify(data) });

// ─── Events ──────────────────────────────────────────────────────────────────

export interface EventQueryParams {
  category?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface PaginatedEvents {
  data: any[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const getEvents = (params: EventQueryParams = {}): Promise<PaginatedEvents> => {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== '') qs.set(k, String(v));
  });
  return request<PaginatedEvents>(`/events?${qs.toString()}`);
};

export const getEvent = (id: string) =>
  request<any>(`/events/${id}`);

export const createEvent = (data: any) =>
  request<any>('/events', { method: 'POST', body: JSON.stringify(data) });

export const updateEvent = (id: string, data: any) =>
  request<any>(`/events/${id}`, { method: 'PATCH', body: JSON.stringify(data) });

export const deleteEvent = (id: string) =>
  request<void>(`/events/${id}`, { method: 'DELETE' });

export const getRecommendations = (id: string) =>
  request<any[]>(`/events/${id}/recommendations`);

// ─── Attendances ─────────────────────────────────────────────────────────────

export const attendEvent = (eventId: string) =>
  request<any>(`/events/${eventId}/attend`, { method: 'POST' });

export const unattendEvent = (eventId: string) =>
  request<any>(`/events/${eventId}/attend`, { method: 'DELETE' });
