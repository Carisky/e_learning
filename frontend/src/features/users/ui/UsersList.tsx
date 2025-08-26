'use client';
import { useGetUsersQuery } from '../api/usersApi';
import { useCreateUserMutation } from '../api/usersApi';
import { useState } from 'react';
import { Loader } from '@/shared/ui/Loader';
import { ErrorText } from '@/shared/ui/ErrorText';

export default function UsersList() {
  const { data, isLoading, error } = useGetUsersQuery();
  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
  const [name, setName] = useState('');

  if (isLoading) return <Loader />;
  if (error) return <ErrorText text="Failed to load users" />;

  return (
    <div>
      <ul>{data?.map(u => <li key={u.id}>{u.name}</li>)}</ul>

      <form onSubmit={async (e) => {
        e.preventDefault();
        await createUser({ name }).unwrap();
        setName('');
      }}>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
        <button type="submit" disabled={isCreating}>Create</button>
      </form>
    </div>
  );
}
