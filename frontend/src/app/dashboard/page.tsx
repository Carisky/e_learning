import { Typography } from '@mui/material';
import Protected from '@/shared/ui/Protected';
import { useAppSelector } from '@/store/hooks';
import { useSpring, animated } from '@react-spring/web';

function DashboardContent() {
  const user = useAppSelector((s) => s.auth.user)!;
  const styles = useSpring({ from: { opacity: 0, y: -20 }, to: { opacity: 1, y: 0 } });
  return (
    <animated.div style={styles}>
      <Typography variant="h4">Welcome {user.name} {user.surname}</Typography>
    </animated.div>
  );
}

export default function DashboardPage() {
  return (
    <Protected>
      <DashboardContent />
    </Protected>
  );
}
