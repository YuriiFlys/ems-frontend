'use client';
import { useState } from 'react';
import { Box, Button, TextField, Typography, Paper, Alert, Link as MuiLink, Grid } from '@mui/material';
import { useAuth } from '../../../context';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setError('');
    setLoading(true);
    try {
      await register(form);
      router.push('/events');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '85vh', display: 'flex', alignItems: 'center', p: { xs: 2, md: 6 } }}>
      <Grid container spacing={4} alignItems="center" justifyContent="space-between" sx={{ width: '100%' }}>
        {/* Left Column: Branding (50%) */}
        <Grid size={{ xs: 12 }} sx={{ flex: { md: '0 0 50%' }, textAlign: 'center', p: { xs: 2, md: 4 } }}>
          <Typography 
            variant="h2" 
            fontWeight={900} 
            gutterBottom 
            sx={{ 
              background: 'linear-gradient(45deg, #6366f1 30%, #a855f7 90%)', 
              WebkitBackgroundClip: 'text', 
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-1.5px',
              lineHeight: 1.1
            }}
          >
            Event Management System
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 800, mx: 'auto', mt: 3, fontWeight: 400, lineHeight: 1.6 }}>
            Your one-stop destination to discover, create, and manage amazing events. Join our community and never miss out on what's happening around you!
          </Typography>
        </Grid>

        {/* Right Column: Register Form (40%) */}
        <Grid size={{ xs: 12 }} sx={{ flex: { md: '0 0 40%' }, display: 'flex', justifyContent: 'center' }}>
          <Paper
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              p: { xs: 3, sm: 4 }, width: '100%', maxWidth: 450, minHeight: 600,
              background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
              border: '1px solid rgba(99,102,241,0.2)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
              borderRadius: 3
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
              <Box sx={{ bgcolor: 'secondary.main', p: 1.5, borderRadius: '50%', mb: 2 }}>
                <PersonAddIcon sx={{ color: 'white' }} />
              </Box>
              <Typography variant="h5" fontWeight={700}>Create account</Typography>
              <Typography variant="body2" color="text.secondary" mt={0.5}>Join EMS today</Typography>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <TextField label="First Name" required fullWidth value={form.firstName} onChange={set('firstName')} variant="outlined" />
                <TextField label="Last Name" required fullWidth value={form.lastName} onChange={set('lastName')} variant="outlined" />
              </Box>
              <TextField label="Email" type="email" required fullWidth value={form.email} onChange={set('email')} variant="outlined" />
              <TextField
                label="Password" type="password" required fullWidth
                value={form.password} onChange={set('password')}
                helperText="Minimum 6 characters"
                variant="outlined"
              />
              <Button type="submit" variant="contained" fullWidth size="large" disabled={loading} sx={{ mt: 2, py: 1.5, fontWeight: 700 }}>
                {loading ? 'Creating account...' : 'Sign Up'}
              </Button>
            </Box>

            <Typography variant="body2" align="center" sx={{ mt: 4 }}>
              Already have an account?{' '}
              <MuiLink component={Link} href="/auth/login" color="primary.light" fontWeight="bold">
                Sign In
              </MuiLink>
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
