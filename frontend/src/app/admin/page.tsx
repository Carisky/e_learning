import { Typography } from '@mui/material';
import Protected from '@/shared/ui/Protected';

export default function AdminPage() {
  return (
    <Protected roles={['admin']}>
      <Typography variant="h4">Admin Panel</Typography>
    </Protected>
  );
}
