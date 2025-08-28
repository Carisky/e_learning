import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginForm from './LoginForm';
import { vi } from 'vitest';
// Mock hooks and API
vi.mock('@/store/hooks', () => ({
  useAppDispatch: () => (a: unknown) => a,
}));

vi.mock('../api/authApi', () => ({
  useLoginMutation: () => [
    (_body: { email: string; password: string }) => ({ unwrap: async () => ({ token: 'TOKEN' }) }),
    { isLoading: false },
  ] as const,
  authApi: {
    endpoints: {
      me: { initiate: () => ({ unwrap: async () => ({ id: 1, name: 'A', surname: 'B', email: 'e', role: 'user' }) }) },
    },
  },
}));

describe('LoginForm', () => {
  beforeEach(() => {
    localStorage.clear();
    document.cookie = '';
  });

  it('submits and stores token', async () => {
    render(<LoginForm />);

    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'user@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => expect(localStorage.getItem('token')).toBe('TOKEN'));
  });
});
