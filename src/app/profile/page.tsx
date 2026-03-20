'use client';
import { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, TextField, Button,
  Alert, Snackbar, Divider, Skeleton, Grid
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import { EventCard } from '../../components';
import { useAuth } from '../../context';
import { updateProfile } from '../../lib';
import type { User, Attendance } from '../../types';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({ firstName: '', lastName: '', password: '' });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [snack, setSnack] = useState('');

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.push('/auth/login');
    if (user) setForm(prev => ({ ...prev, firstName: user.firstName, lastName: user.lastName }));
  }, [isLoading, isAuthenticated, user, router]);

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const payload: Partial<User & { password?: string }> = { firstName: form.firstName, lastName: form.lastName };
      if (form.password) payload.password = form.password;
      await updateProfile(payload);
      setSnack('Profile updated!');
      setForm(prev => ({ ...prev, password: '' }));
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) return <Box sx={{ maxWidth: 500, mx: 'auto', p: 4 }}><Skeleton variant="rounded" height={300} /></Box>;

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Typography variant="h4" textAlign='center' fontWeight={800} gutterBottom>My Profile</Typography>

      <Paper sx={{ maxWidth: 500, mx: 'auto', p: { xs: 2, sm: 4 }, mb: 4, background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', border: '1px solid rgba(99,102,241,0.2)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Box sx={{ bgcolor: 'primary.main', p: 1.5, borderRadius: '50%' }}>
            <PersonIcon sx={{ color: 'white' }} />
          </Box>
          <Box>
            <Typography fontWeight={700}>{user?.firstName} {user?.lastName}</Typography>
            <Typography variant="body2" color="text.secondary">{user?.email}</Typography>
            <Typography variant="caption" color="primary.light">{user?.role}</Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Box component="form" onSubmit={handleSave} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <TextField label="First Name" required fullWidth value={form.firstName} onChange={set('firstName')} />
            <TextField label="Last Name" required fullWidth value={form.lastName} onChange={set('lastName')} />
          </Box>
          <TextField
            label="New Password" type="password" fullWidth
            value={form.password} onChange={set('password')}
            helperText="Leave blank to keep current password"
          />
          <Button type="submit" variant="contained" size="large" disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </Box>
      </Paper>

      {/* Attended Events Section */}
      <Box mt={4}>
        <Typography variant="h5" textAlign='center' fontWeight={800} mb={2}>My Events</Typography>
        {user?.attendances && user.attendances.length > 0 ? (
          <Grid justifyContent='center' container spacing={2}>
            {user.attendances.map((attendance: Attendance) => (
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={attendance.id}>
                <EventCard event={attendance.event} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Paper sx={{ p: 4, textAlign: 'center', bgcolor: 'transparent', border: '1px dashed rgba(255,255,255,0.2)' }}>
            <Typography color="text.secondary">You haven't RSVP'd to any events yet.</Typography>
            <Button variant="outlined" href="/events" sx={{ mt: 2 }}>Browse Events</Button>
          </Paper>
        )}
      </Box>

      <Snackbar open={!!snack} autoHideDuration={3000} onClose={() => setSnack('')} message={snack} />
    </Box>
  );
}
