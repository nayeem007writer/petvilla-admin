import { Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const Unauthorized = () => {
  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <Typography variant="h3" gutterBottom>403 - Unauthorized</Typography>
      <Typography variant="body1" gutterBottom>
        You don't have permission to access this page
      </Typography>
      <Button component={Link} to="/login" variant="contained">
        Go to Login
      </Button>
    </div>
  );
};

export default Unauthorized;