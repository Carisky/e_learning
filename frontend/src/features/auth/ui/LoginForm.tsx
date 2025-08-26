'use client';
import { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useLoginMutation, authApi } from '../api/authApi';
import { useAppDispatch } from '@/store/hooks';
import { setCredentials, setUser } from '../model/authSlice';
import { useRouter } from 'next/navigation';
import { useSpring, animated } from '@react-spring/web';

const encode = (s: string) => (typeof window === 'undefined' ? Buffer.from(s).toString('base64') : btoa(s));

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const styles = useSpring({ from: { opacity: 0, y: -20 }, to: { opacity: 1, y: 0 } });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = { email: encode(email), password: encode(password) };
    try {
      const { token } = await login(body).unwrap();
      localStorage.setItem('token', token);
      dispatch(setCredentials({ token }));
      const user = await dispatch(authApi.endpoints.me.initiate()).unwrap();
      dispatch(setUser(user));
      router.push('/dashboard');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <animated.div style={styles}>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: 300, mx: 'auto', mt: 4 }}>
        <Typography variant="h5">Login</Typography>
        <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Button type="submit" variant="contained" disabled={isLoading}>Login</Button>
      </Box>
    </animated.div>
  );
}
