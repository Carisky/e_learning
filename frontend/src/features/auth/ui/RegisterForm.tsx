'use client';
import { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useRegisterMutation } from '../api/authApi';
import { useRouter } from 'next/navigation';
import { useSpring, animated } from '@react-spring/web';

const encode = (s: string) => (typeof window === 'undefined' ? Buffer.from(s).toString('base64') : btoa(s));

export default function RegisterForm() {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [register, { isLoading }] = useRegisterMutation();
  const router = useRouter();
  const styles = useSpring({ from: { opacity: 0, y: -20 }, to: { opacity: 1, y: 0 } });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = {
      name: encode(name),
      surname: encode(surname),
      email: encode(email),
      password: encode(password),
    };
    try {
      await register(body).unwrap();
      router.push('/login');
    } catch (e) {
      console.error(e);
    }
  };

  return (

      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: 300, mx: 'auto', mt: 4 }}>
        <Typography variant="h5">Register</Typography>
        <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <TextField label="Surname" value={surname} onChange={(e) => setSurname(e.target.value)} />
        <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Button type="submit" variant="contained" disabled={isLoading}>Register</Button>
      </Box>

  );
}
