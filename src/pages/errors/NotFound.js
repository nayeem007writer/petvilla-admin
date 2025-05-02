import { Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <Typography variant="h3" gutterBottom>404 - Page Not Found</Typography>
      <Button component={Link} to="/" variant="contained">
        Go to Dashboard
      </Button>
    </div>
  );
};

export default NotFound;