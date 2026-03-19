import type { Metadata } from 'next';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from '../context/AuthContext';
import NavBar from '../components/layout/NavBar';
import ThemeRegistry from '../components/ThemeRegistry';

export const metadata: Metadata = {
  title: 'EMS — Event Management System',
  description: 'Discover, create, and manage events near you.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry>
          <CssBaseline />
          <AuthProvider>
            <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#0f0f1a' }}>
              <NavBar />
              <main style={{ flexGrow: 1 }}>
                {children}
              </main>
            </div>
          </AuthProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}

