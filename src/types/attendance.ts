import type { Event } from './event'

export interface Attendance {
  id: string;
  userId: string;
  eventId: string;
  event: Event;
}
