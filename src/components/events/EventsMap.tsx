'use client';
import { useState } from 'react';
import { Box, Typography, Paper, Button } from '@mui/material';
import { APIProvider, AdvancedMarker, Map } from '@vis.gl/react-google-maps';
import { PaginatedEvents } from '../../lib/api';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';

interface Props {
  events: PaginatedEvents | null;
}

export default function EventsMap({ events }: Props) {
  const router = useRouter();
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);

  // Default center to Kyiv if no events with coordinates, else center on the first event with coordinates
  const validEvents = events?.data?.filter((e: any) => e.latitude && e.longitude) || [];
  const defaultCenter = validEvents.length > 0
    ? { lat: validEvents[0].latitude, lng: validEvents[0].longitude }
    : { lat: 50.4501, lng: 30.5234 }; // Kyiv

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}>
      <Box sx={{ width: '100%', height: '600px', borderRadius: 3, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)', position: 'relative' }}>
        <Map
          defaultZoom={6}
          defaultCenter={defaultCenter}
          mapId="DEMO_MAP_ID"
          gestureHandling={'greedy'}
          disableDefaultUI={true}
        >
          {validEvents.map((event: any) => (
            <AdvancedMarker
              key={event.id}
              position={{ lat: event.latitude, lng: event.longitude }}
              onClick={() => setSelectedEvent(event)}
            >
              <Box
                sx={{
                  bgcolor: 'primary.main',
                  color: 'white',
                  px: 1, py: 0.5,
                  borderRadius: 2,
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  boxShadow: 3,
                  border: '2px solid white',
                  '&:hover': { bgcolor: 'primary.dark' }
                }}
              >
                🎉
              </Box>
            </AdvancedMarker>
          ))}
        </Map>

        {/* Floating Info Window overlay */}
        {selectedEvent && (
          <Paper
            sx={{
              position: 'absolute',
              bottom: 20,
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 10,
              p: 2,
              width: '90%',
              maxWidth: 400,
              bgcolor: 'background.paper',
              boxShadow: 6,
              display: 'flex',
              flexDirection: 'column',
              gap: 1
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Typography variant="subtitle1" fontWeight="bold" noWrap sx={{ flexGrow: 1, mr: 1 }}>
                {selectedEvent.title}
              </Typography>
              <Box component="button" onClick={() => setSelectedEvent(null)} sx={{ background: 'transparent', border: 'none', color: 'text.secondary', cursor: 'pointer', fontSize: 16 }}>
                ✖
              </Box>
            </Box>
            <Typography variant="body2" color="text.secondary">
              {dayjs(selectedEvent.date).format('MMM D, YYYY · HH:mm')}
            </Typography>
            <Typography variant="body2" color="text.secondary" noWrap>
              {selectedEvent.location}
            </Typography>
            <Button variant="contained" size="small" onClick={() => router.push(`/events/${selectedEvent.id}`)} sx={{ mt: 1 }}>
              View Details
            </Button>
          </Paper>
        )}
      </Box>
    </APIProvider>
  );
}
