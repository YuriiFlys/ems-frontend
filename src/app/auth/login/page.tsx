'use client';
import { useState } from 'react';
import { Box, Button, TextField, Typography, Paper, Alert, Link as MuiLink, Grid } from '@mui/material';
import { useAuth } from '../../../context';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      router.push('/events');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '85vh', display: 'flex', alignItems: 'center', p: { xs: 2, md: 6 } }}>
      <Grid container spacing={4} alignItems="center" justifyContent="space-between" sx={{ width: '100%' }}>
        {/* Left Column: Branding (80%) */}
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

        {/* Right Column: Login Form (20%) */}
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
              <Box sx={{ bgcolor: 'primary.main', p: 1.5, borderRadius: '50%', mb: 2 }}>
                <LockOutlinedIcon sx={{ color: 'white' }} />
              </Box>
              <Typography variant="h5" fontWeight={700}>Welcome back</Typography>
              <Typography variant="body2" color="text.secondary" mt={0.5}>Sign in to your account</Typography>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Email" type="email" required fullWidth
                value={email} onChange={e => setEmail(e.target.value)}
                autoComplete="email"
                variant="outlined"
              />
              <TextField
                label="Password" type="password" required fullWidth
                value={password} onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
                variant="outlined"
              />
              <Button type="submit" variant="contained" fullWidth size="large" disabled={loading} sx={{ mt: 2, py: 1.5, fontWeight: 700 }}>
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </Box>

            <Typography variant="body2" align="center" sx={{ mt: 4 }}>
              Don&apos;t have an account?{' '}
              <MuiLink component={Link} href="/auth/register" color="primary.light" fontWeight="bold">
                Sign Up
              </MuiLink>
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
