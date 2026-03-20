import { useQuery } from '@tanstack/react-query';
import { getEvents, getEvent, getRecommendations } from '../lib';
import type { EventQueryParams } from '../types';

export const useFetchEvents = (query: EventQueryParams, view: 'grid' | 'map', isEnabled: boolean) => {
  return useQuery({
    queryKey: ['events', query, view],
    queryFn: async () => {
      const params = { ...query };
      if (view === 'map') {
        params.limit = 1000;
        params.page = 1;
      }
      return getEvents(params);
    },
    enabled: isEnabled,
  });
};

export const useFetchEventDetails = (id: string, isEnabled: boolean) => {
  return useQuery({
    queryKey: ['event', id],
    queryFn: async () => {
      const [event, recommendations] = await Promise.all([
        getEvent(id),
        getRecommendations(id),
      ]);
      return { event, recommendations: recommendations ?? [] };
    },
    enabled: isEnabled,
  });
};
