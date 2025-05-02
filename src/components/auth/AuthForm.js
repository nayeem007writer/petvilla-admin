import { Box } from '@mui/material';

const AuthForm = ({ children, onSubmit }) => {
  return (
    <Box
      component="form"
      onSubmit={onSubmit}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        width: '100%',
      }}
    >
      {children}
    </Box>
  );
};

export default AuthForm;