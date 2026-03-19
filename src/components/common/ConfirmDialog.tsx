'use client';
import { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogContentText,
  DialogActions, Button
} from '@mui/material';

interface Props {
  open: boolean;
  title?: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function ConfirmDialog({ open, title = 'Confirm', message, onConfirm, onCancel, loading }: Props) {
  return (
    <Dialog open={open} onClose={onCancel} PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle fontWeight={700}>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button onClick={onCancel} variant="outlined" disabled={loading}>Cancel</Button>
        <Button onClick={onConfirm} variant="contained" color="error" disabled={loading}>
          {loading ? 'Deleting...' : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
