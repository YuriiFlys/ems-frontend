'use client';
import { useState } from 'react';
import { Box, Button, TextField, Typography, Paper, Alert, Link as MuiLink } from '@mui/material';
import { useAuth } from '../../../context/AuthContext';
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
    <Box sx={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
      <Paper
        sx={{
          p: { xs: 3, sm: 5 }, width: '100%', maxWidth: 440,
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
          border: '1px solid rgba(99,102,241,0.2)',
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
            <TextField label="First Name" required fullWidth value={form.firstName} onChange={set('firstName')} />
            <TextField label="Last Name" required fullWidth value={form.lastName} onChange={set('lastName')} />
          </Box>
          <TextField label="Email" type="email" required fullWidth value={form.email} onChange={set('email')} />
          <TextField
            label="Password" type="password" required fullWidth
            value={form.password} onChange={set('password')}
            helperText="Minimum 6 characters"
          />
          <Button type="submit" variant="contained" fullWidth size="large" disabled={loading} sx={{ mt: 1 }}>
            {loading ? 'Creating account...' : 'Sign Up'}
          </Button>
        </Box>

        <Typography variant="body2" align="center" sx={{ mt: 3 }}>
          Already have an account?{' '}
          <MuiLink component={Link} href="/auth/login" color="primary.light">
            Sign In
          </MuiLink>
        </Typography>
      </Paper>
    </Box>
  );
}
