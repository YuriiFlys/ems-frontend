'use client';
import { Card, CardContent, CardActions, Typography, Chip, Button, Box } from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';

const CATEGORY_COLORS: Record<string, 'primary' | 'secondary' | 'success' | 'warning' | 'info' | 'error'> = {
  MUSIC: 'secondary',
  SPORT: 'success',
  ART: 'info',
  FOOD: 'warning',
  IT: 'primary',
  OTHER: 'error',
};

interface Props {
  event: {
    id: string;
    title: string;
    description: string;
    date: string;
    location: string;
    category: string;
  };
}

export default function EventCard({ event }: Props) {
  const router = useRouter();
  const color = CATEGORY_COLORS[event.category] ?? 'primary';

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Chip label={event.category} color={color} size="small" />
        </Box>

        <Typography variant="h6" fontWeight={700} gutterBottom
          sx={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {event.title}
        </Typography>

        <Typography variant="body2" color="text.secondary"
          sx={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', mb: 2 }}>
          {event.description}
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CalendarTodayIcon sx={{ fontSize: 14, color: 'primary.light' }} />
            <Typography variant="caption" color="text.secondary">
              {dayjs(event.date).format('MMM D, YYYY · HH:mm')}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LocationOnIcon sx={{ fontSize: 14, color: 'error.light' }} />
            <Typography variant="caption" color="text.secondary" noWrap>{event.location}</Typography>
          </Box>
        </Box>
      </CardContent>

      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button size="small" variant="outlined" fullWidth onClick={() => router.push(`/events/${event.id}`)}>
          View Details
        </Button>
      </CardActions>
    </Card>
  );
}
