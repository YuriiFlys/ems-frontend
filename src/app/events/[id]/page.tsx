'use client';
import { useState, useEffect } from 'react';
import {
  Box, Typography, Chip, Button, Paper, Divider, Alert,
  Grid, Skeleton
} from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import dayjs from 'dayjs';
import { useParams, useRouter } from 'next/navigation';
import { getEvent, deleteEvent, getRecommendations, attendEvent, unattendEvent } from '../../../lib';
import { useAuth } from '../../../context';
import { useFetchEventDetails, useToast } from '../../../hooks';
import { EventCard, ConfirmDialog } from '../../../components';

const CATEGORY_COLORS: Record<string, any> = {
  MUSIC: 'secondary', SPORT: 'success', ART: 'info', FOOD: 'warning', IT: 'primary', OTHER: 'error',
};

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const { data, isLoading: queryLoading, isError } = useFetchEventDetails(
    id,
    !!isAuthenticated && !authLoading
  );

  const event = data?.event ?? null;
  const recs = data?.recommendations ?? [];

  const [attending, setAttending] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    if (event && user) {
      setAttending(!!event.attendances?.some((a: any) => a.userId === user.id));
    }
  }, [event, user]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
    if (isError) {
      router.push('/events');
    }
  }, [authLoading, isAuthenticated, isError, router]);

  const loading = authLoading || queryLoading;

  const toggleAttend = async () => {
    try {
      if (attending) {
        await unattendEvent(id);
        showToast('RSVP cancelled', 'info');
      } else {
        await attendEvent(id);
        showToast("You're attending!", 'success');
      }
      setAttending(!attending);
    } catch (e: any) {
      showToast(e.message, 'error');
    }
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await deleteEvent(id);
      showToast('Event deleted', 'info');
      router.push('/events');
    } catch (e: any) {
      showToast(e.message, 'error');
    } finally {
      setDeleteLoading(false);
      setDeleteOpen(false);
    }
  };

  const isOwner = user && event && (event.creatorId === user.id || user.role === 'ADMIN');

  if (loading || !event) return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 4 }}>
      <Skeleton variant="rounded" height={300} />
    </Box>
  );

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: { xs: 2, md: 4 } }}>
      <Paper sx={{ p: { xs: 2, sm: 4 }, mb: 4, background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1, mb: 2 }}>
          <Chip label={event.category} color={CATEGORY_COLORS[event.category]} />
          {isOwner && (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button startIcon={<EditIcon />} size="small" variant="outlined"
                onClick={() => router.push(`/events/${id}/edit`)}>
                Edit
              </Button>
              <Button startIcon={<DeleteIcon />} size="small" variant="outlined" color="error"
                onClick={() => setDeleteOpen(true)}>
                Delete
              </Button>
            </Box>
          )}
        </Box>

        <Typography variant="h4" fontWeight={800} gutterBottom>{event.title}</Typography>

        {/* Meta */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <CalendarTodayIcon sx={{ fontSize: 16, color: 'primary.light' }} />
            <Typography variant="body2">{dayjs(event.date).format('MMMM D, YYYY · HH:mm')}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <LocationOnIcon sx={{ fontSize: 16, color: 'error.light' }} />
            <Typography variant="body2">{event.location}</Typography>
          </Box>
          {event.creator && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <PersonIcon sx={{ fontSize: 16, color: 'success.light' }} />
              <Typography variant="body2">{event.creator.firstName} {event.creator.lastName}</Typography>
            </Box>
          )}
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Typography variant="body1" sx={{ lineHeight: 1.8, mb: 3 }}>{event.description}</Typography>

        {/* Attend button */}
        <Button
          variant={attending ? 'outlined' : 'contained'}
          startIcon={attending ? <EventBusyIcon /> : <EventAvailableIcon />}
          onClick={toggleAttend}
          color={attending ? 'error' : 'primary'}
        >
          {attending ? 'Cancel RSVP' : 'Attend Event'}
        </Button>

        {event.attendances && (
          <Typography variant="caption" color="text.secondary" sx={{ ml: 2 }}>
            {event.attendances.length} attendee{event.attendances.length !== 1 ? 's' : ''}
          </Typography>
        )}
      </Paper>

      {/* Recommendations */}
      {recs.length > 0 && (
        <Box>
          <Typography variant="h5" fontWeight={700} gutterBottom>Similar Events</Typography>
          <Grid container spacing={2}>
            {recs.map(rec => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={rec.id}>
                <EventCard event={rec} />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      <ConfirmDialog
        open={deleteOpen}
        title="Delete Event"
        message={`Are you sure you want to delete "${event?.title}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteOpen(false)}
        loading={deleteLoading}
      />
    </Box>
  );
}
