'use client';
import { useState } from 'react';
import { Box, Button, TextField, Typography, Paper, Alert, Link as MuiLink } from '@mui/material';
import { useAuth } from '../../../context/AuthContext';
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
    <Box sx={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
      <Paper
        sx={{
          p: { xs: 3, sm: 5 }, width: '100%', maxWidth: 420,
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
          border: '1px solid rgba(99,102,241,0.2)',
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
          />
          <TextField
            label="Password" type="password" required fullWidth
            value={password} onChange={e => setPassword(e.target.value)}
            autoComplete="current-password"
          />
          <Button type="submit" variant="contained" fullWidth size="large" disabled={loading} sx={{ mt: 1 }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </Box>

        <Typography variant="body2" align="center" sx={{ mt: 3 }}>
          Don&apos;t have an account?{' '}
          <MuiLink component={Link} href="/auth/register" color="primary.light">
            Sign Up
          </MuiLink>
        </Typography>
      </Paper>
    </Box>
  );
}
