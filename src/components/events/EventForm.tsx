'use client';
import { useState } from 'react';
import {
  Box, TextField, Button, MenuItem, Select, FormControl,
  InputLabel, Alert, Typography
} from '@mui/material';

const CATEGORIES = ['MUSIC', 'SPORT', 'ART', 'FOOD', 'IT', 'OTHER'];

export interface EventFormData {
  title: string;
  description: string;
  date: string;
  location: string;
  category: string;
  latitude?: string;
  longitude?: string;
}

interface Props {
  initialData?: Partial<EventFormData>;
  onSubmit: (data: EventFormData) => Promise<void>;
  submitLabel?: string;
}

export default function EventForm({ initialData = {}, onSubmit, submitLabel = 'Save Event' }: Props) {
  const [form, setForm] = useState<EventFormData>({
    title: initialData.title ?? '',
    description: initialData.description ?? '',
    date: initialData.date ? new Date(initialData.date).toISOString().slice(0, 16) : '',
    location: initialData.location ?? '',
    category: initialData.category ?? 'OTHER',
    latitude: initialData.latitude ?? '',
    longitude: initialData.longitude ?? '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (field: keyof EventFormData) => (e: React.ChangeEvent<HTMLInputElement | { value: unknown }>) =>
    setForm(prev => ({ ...prev, [field]: (e.target as HTMLInputElement).value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.date || !form.location.trim()) {
      setError('Title, date, and location are required.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await onSubmit(form);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
      {error && <Alert severity="error">{error}</Alert>}

      <TextField
        label="Title" required fullWidth value={form.title}
        onChange={set('title')} inputProps={{ maxLength: 200 }}
      />

      <TextField
        label="Description" required fullWidth multiline rows={4}
        value={form.description} onChange={set('description')}
      />

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
        <TextField
          label="Date & Time" type="datetime-local" required fullWidth
          value={form.date} onChange={set('date')}
          InputLabelProps={{ shrink: true }}
        />
        <FormControl fullWidth required>
          <InputLabel>Category</InputLabel>
          <Select value={form.category} label="Category" onChange={set('category') as any}>
            {CATEGORIES.map(c => (
              <MenuItem key={c} value={c}>{c}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <TextField
        label="Location" required fullWidth value={form.location}
        onChange={set('location')} placeholder="City, Country"
      />

      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
        <TextField
          label="Latitude (optional)" type="number" fullWidth
          value={form.latitude} onChange={set('latitude')}
          inputProps={{ step: 'any' }}
        />
        <TextField
          label="Longitude (optional)" type="number" fullWidth
          value={form.longitude} onChange={set('longitude')}
          inputProps={{ step: 'any' }}
        />
      </Box>

      <Typography variant="caption" color="text.secondary">
        Latitude/Longitude enables map view and location-based recommendations.
      </Typography>

      <Button type="submit" variant="contained" size="large" disabled={loading} sx={{ mt: 1 }}>
        {loading ? 'Saving...' : submitLabel}
      </Button>
    </Box>
  );
}
