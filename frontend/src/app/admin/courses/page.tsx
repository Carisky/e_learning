'use client';

import { useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';
import Protected from '@/shared/ui/Protected';

export default function AdminCoursesPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: integrate API call
    console.log({ title, description, price: Number(price), duration: Number(duration) });
    setTitle('');
    setDescription('');
    setPrice('');
    setDuration('');
  };

  return (
    <Protected roles={['admin']}>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 400 }}
      >
        <Typography variant="h5">Create Course</Typography>
        <TextField label="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          multiline
          rows={4}
        />
        <TextField
          label="Price (cents)"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          type="number"
        />
        <TextField
          label="Duration (min)"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          required
          type="number"
        />
        <Button type="submit" variant="contained">
          Save
        </Button>
      </Box>
    </Protected>
  );
}
