'use client';
import { useState, useEffect } from 'react';
import { Box, Typography, Paper, Skeleton } from '@mui/material';
import EventForm, { EventFormData } from '../../../../components/events/EventForm';
import { getEvent, updateEvent } from '../../../../lib/api';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '../../../../context/AuthContext';

export default function EditEventPage() {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.push('/auth/login');
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    const load = async () => {
      try {
        const ev = await getEvent(id);
        if (user && ev.creatorId !== user.id && user.role !== 'ADMIN') {
          router.push(`/events/${id}`);
          return;
        }
        setEvent(ev);
      } catch {
        router.push('/events');
      } finally {
        setLoading(false);
      }
    };
    if (!isLoading && isAuthenticated) load();
  }, [id, isLoading, isAuthenticated, user, router]);

  const handleSubmit = async (data: EventFormData) => {
    const payload = {
      ...data,
      latitude: data.latitude ? parseFloat(data.latitude) : undefined,
      longitude: data.longitude ? parseFloat(data.longitude) : undefined,
    };
    await updateEvent(id, payload);
    router.push(`/events/${id}`);
  };

  if (loading) return <Box sx={{ maxWidth: 700, mx: 'auto', p: 4 }}><Skeleton variant="rounded" height={400} /></Box>;

  return (
    <Box sx={{ maxWidth: 700, mx: 'auto', p: { xs: 2, md: 4 } }}>
      <Typography variant="h4" fontWeight={800} gutterBottom>Edit Event</Typography>
      <Paper sx={{ p: { xs: 2, sm: 4 }, background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', border: '1px solid rgba(99,102,241,0.2)' }}>
        {event && (
          <EventForm
            initialData={{
              ...event,
              latitude: event.latitude?.toString(),
              longitude: event.longitude?.toString(),
            }}
            onSubmit={handleSubmit}
            submitLabel="Save Changes"
          />
        )}
      </Paper>
    </Box>
  );
}
