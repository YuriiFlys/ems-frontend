'use client';
import { useState, useEffect, useCallback } from 'react';
import {
  Box, Grid, Typography, Pagination, ToggleButton, ToggleButtonGroup,
  TextField, Select, MenuItem, FormControl, InputLabel, Skeleton, Alert, Button
} from '@mui/material';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import MapIcon from '@mui/icons-material/Map';
import EventCard from '../../components/events/EventCard';
import EventsMap from '../../components/events/EventsMap';
import { getEvents, PaginatedEvents, EventQueryParams } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';

const CATEGORIES = ['', 'MUSIC', 'SPORT', 'ART', 'FOOD', 'IT', 'OTHER'];

export default function EventsPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [view, setView] = useState<'grid' | 'map'>('grid');
  const [events, setEvents] = useState<PaginatedEvents | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [query, setQuery] = useState<EventQueryParams>({
    page: 1, limit: 9, sortBy: 'date', order: 'asc',
  });

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) { router.push('/auth/login'); return; }

      const fetchEvents = async () => {
        setLoading(true);
        setError('');
        try {
          const params = { ...query };
          if (view === 'map') {
            params.limit = 1000;
            params.page = 1;
          }
          const data = await getEvents(params);
          setEvents(data);
        } catch (err: any) {
          setError(err.message || 'Failed to load events');
        } finally {
          setLoading(false);
        }
      };
      fetchEvents();
    }
  }, [authLoading, isAuthenticated, query, view, router]);

  const setQ = (field: keyof EventQueryParams) => (e: any) => {
    setQuery(prev => ({ ...prev, [field]: e.target.value || undefined, page: 1 }));
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: { xs: 2, md: 4 } }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={800}>Events</Typography>
          {events && (
            <Typography variant="body2" color="text.secondary">
              {events.total} event{events.total !== 1 ? 's' : ''} found
            </Typography>
          )}
        </Box>
        <ToggleButtonGroup value={view} exclusive onChange={(_, v) => v && setView(v)} size="small">
          <ToggleButton value="grid" aria-label="grid view"><ViewModuleIcon /></ToggleButton>
          <ToggleButton value="map" aria-label="map view"><MapIcon /></ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Filters */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mb: 3, p: 2, bgcolor: 'background.paper', borderRadius: 3, border: '1px solid rgba(255,255,255,0.06)' }}>
        <TextField
          label="Search" size="small" sx={{ minWidth: 180 }}
          onChange={e => {
            const val = e.target.value;
            setQuery(prev => ({ ...prev, search: val || undefined, page: 1 }));
          }}
        />
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel>Category</InputLabel>
          <Select value={query.category ?? ''} label="Category" onChange={setQ('category')}>
            {CATEGORIES.map(c => <MenuItem key={c} value={c}>{c || 'All'}</MenuItem>)}
          </Select>
        </FormControl>
        <TextField label="From" type="date" size="small" slotProps={{ inputLabel: { shrink: true } }} onChange={setQ('dateFrom')} />
        <TextField label="To" type="date" size="small" slotProps={{ inputLabel: { shrink: true } }} onChange={setQ('dateTo')} />
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Sort by</InputLabel>
          <Select value={query.sortBy ?? 'date'} label="Sort by" onChange={setQ('sortBy')}>
            <MenuItem value="date">Date</MenuItem>
            <MenuItem value="title">Title</MenuItem>
            <MenuItem value="createdAt">Created</MenuItem>
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 100 }}>
          <InputLabel>Order</InputLabel>
          <Select value={query.order ?? 'asc'} label="Order" onChange={setQ('order')}>
            <MenuItem value="asc">Asc</MenuItem>
            <MenuItem value="desc">Desc</MenuItem>
          </Select>
        </FormControl>
        <Button variant="outlined" size="small" onClick={() => setQuery({ page: 1, limit: 9, sortBy: 'date', order: 'asc' })}>
          Reset
        </Button>
      </Box>

      {/* Error */}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {/* Event Grid / List */}
      {loading ? (
        <Grid container spacing={2}>
          {[...Array(6)].map((_, i) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}>
              <Skeleton variant="rounded" height={220} />
            </Grid>
          ))}
        </Grid>
      ) : events?.data.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 10 }}>
          <Typography variant="h6" color="text.secondary">No events found</Typography>
          <Typography variant="body2" color="text.secondary">Try adjusting your filters or create a new event.</Typography>
          <Button variant="contained" href="/events/new" sx={{ mt: 2 }}>Create Event</Button>
        </Box>
      ) : view === 'map' ? (
        <EventsMap events={events} />
      ) : (
        <Grid container spacing={2}>
          {events?.data.map(event => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={event.id}>
              <EventCard event={event} />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Pagination */}
      {view !== 'map' && events && events.totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={events.totalPages}
            page={events.page}
            onChange={(_, page) => setQuery(prev => ({ ...prev, page }))}
            color="primary"
            size="large"
          />
        </Box>
      )}
    </Box>
  );
}
