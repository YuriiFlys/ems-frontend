'use client';
import { Box, Typography, Paper } from '@mui/material';
import EventForm, { EventFormData } from '../../../components/events/EventForm';
import { createEvent } from '../../../lib/api';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import { useEffect } from 'react';

export default function CreateEventPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.push('/auth/login');
  }, [isLoading, isAuthenticated, router]);

  const handleSubmit = async (data: EventFormData) => {
    const payload = {
      ...data,
      latitude: data.latitude ? parseFloat(data.latitude) : undefined,
      longitude: data.longitude ? parseFloat(data.longitude) : undefined,
    };
    const event = await createEvent(payload);
    router.push(`/events/${event.id}`);
  };

  return (
    <Box sx={{ maxWidth: 700, mx: 'auto', p: { xs: 2, md: 4 } }}>
      <Typography variant="h4" fontWeight={800} gutterBottom>Create Event</Typography>
      <Paper sx={{ p: { xs: 2, sm: 4 }, background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', border: '1px solid rgba(99,102,241,0.2)' }}>
        <EventForm onSubmit={handleSubmit} submitLabel="Create Event" />
      </Paper>
    </Box>
  );
}
