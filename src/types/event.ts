import type { User } from './user'
import type { Attendance } from './attendance'


export enum EventCategory {
  MUSIC = 'MUSIC',
  SPORT = 'SPORT',
  ART = 'ART',
  FOOD = 'FOOD',
  IT = 'IT',
  OTHER = 'OTHER',
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  latitude?: number | null;
  longitude?: number | null;
  category: EventCategory;
  creatorId: string;
  creator?: Pick<User, 'id' | 'firstName' | 'lastName'>;
  attendances?: Pick<Attendance, 'userId'>[];
}

export interface EventQueryParams {
  page?: number;
  limit?: number;
  sortBy?: 'date' | 'title';
  order?: 'asc' | 'desc';
  search?: string;
  category?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface PaginatedEvents {
  data: Event[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface EventFormData {
  title: string;
  description: string;
  date: string;
  location: string;
  category: string;
  latitude?: number;
  longitude?: number;
}
