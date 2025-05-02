import { Alert } from '@mui/material';

const ErrorAlert = ({ message }) => {
  return message ? (
    <Alert severity="error" sx={{ mb: 2 }}>
      {message}
    </Alert>
  ) : null;
};

export default ErrorAlert;