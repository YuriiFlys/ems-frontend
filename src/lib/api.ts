import type { User, Event, EventQueryParams, PaginatedEvents, EventFormData } from '../types';
const API_URL = process.env.NEXT_PUBLIC_API_URL;

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
  request<{ access_token: string; user: User }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

export const register = (data: { email: string; password: string; firstName: string; lastName: string }) =>
  request<{ access_token: string; user: User }>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });

// ─── Profile ─────────────────────────────────────────────────────────────────

export const getProfile = () =>
  request<User>('/users/me');

export const updateProfile = (data: Partial<{ firstName: string; lastName: string; password: string }>) =>
  request<User>('/users/me', { method: 'PATCH', body: JSON.stringify(data) });

// ─── Events ──────────────────────────────────────────────────────────────────

export const getEvents = (params: EventQueryParams = {}): Promise<PaginatedEvents> => {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== '') qs.set(k, String(v));
  });
  return request<PaginatedEvents>(`/events?${qs.toString()}`);
};

export const getEvent = (id: string) =>
  request<Event>(`/events/${id}`);

export const createEvent = (data: EventFormData) =>
  request<Event>('/events', { method: 'POST', body: JSON.stringify(data) });

export const updateEvent = (id: string, data: Partial<EventFormData>) =>
  request<Event>(`/events/${id}`, { method: 'PATCH', body: JSON.stringify(data) });

export const deleteEvent = (id: string) =>
  request<void>(`/events/${id}`, { method: 'DELETE' });

export const getRecommendations = (id: string) =>
  request<Event[]>(`/events/${id}/recommendations`);

// ─── Attendances ─────────────────────────────────────────────────────────────

export const attendEvent = (eventId: string) =>
  request<{ id: string; userId: string; eventId: string }>(`/events/${eventId}/attend`, { method: 'POST' });

export const unattendEvent = (eventId: string) =>
  request<{ success: boolean }>(`/events/${eventId}/attend`, { method: 'DELETE' });
