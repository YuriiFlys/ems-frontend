'use client';
import { createTheme } from '@mui/material/styles';
import { Inter } from 'next/font/google';

export const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#6366f1',       // Indigo
      light: '#818cf8',
      dark: '#4338ca',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#f59e0b',       // Amber
      light: '#fcd34d',
      dark: '#d97706',
    },
    background: {
      default: '#0f0f1a',
      paper: '#1a1a2e',
    },
    success: { main: '#10b981' },
    error:   { main: '#ef4444' },
    warning: { main: '#f59e0b' },
    info:    { main: '#3b82f6' },
  },
  typography: {
    fontFamily: 'Inter, Roboto, Arial, sans-serif',
    h1: { fontWeight: 800 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 10,
          padding: '8px 20px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          border: '1px solid rgba(255,255,255,0.06)',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 12px 40px rgba(99,102,241,0.2)',
          },
        },
      },
    },
    MuiTextField: {
      defaultProps: { size: 'small' },
    },
    MuiChip: {
      styleOverrides: { root: { fontWeight: 600 } },
    },
  },
});

export default theme;
