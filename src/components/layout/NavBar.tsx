'use client';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Chip } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../../context';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function NavBar() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: 'rgba(26,26,46,0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <Toolbar sx={{ gap: 1 }}>
        {/* Logo */}
        <Link href="/events" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Typography variant="h6" fontWeight={800} color="white" sx={{ letterSpacing: '-0.5px' }}>
            Event Management System
          </Typography>
        </Link>

        <Box sx={{ flexGrow: 1 }} />

        {isAuthenticated ? (
          <>
            <Chip
              icon={<PersonIcon />}
              label={`${user?.firstName} ${user?.lastName}`}
              variant="outlined"
              size="medium"
              sx={{ border: 'none', color: 'white', cursor: 'pointer' }}
              onClick={() => router.push('/profile')}
            />
            <Button
              component={Link}
              href="/events/new"
              variant="contained"
              size="small"
              sx={{ ml: 1 }}
            >
              + Create Event
            </Button>
            <IconButton onClick={handleLogout} size="small" sx={{ color: 'grey.400', ml: 0.5 }} title="Logout">
              <LogoutIcon fontSize="small" />
            </IconButton>
          </>
        ) : (
          <>
            <Button component={Link} href="/auth/login" variant="outlined" size="small">
              Sign In
            </Button>
            <Button component={Link} href="/auth/register" variant="contained" size="small" sx={{ ml: 1 }}>
              Sign Up
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}
