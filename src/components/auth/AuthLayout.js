import { Box, Container } from '@mui/material';

const AuthLayout = ({ children }) => {
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          py: 4,
        }}
      >
        <Box
          sx={{
            width: '100%',
            p: 4,
            boxShadow: 3,
            borderRadius: 2,
            bgcolor: 'background.paper',
          }}
        >
          {children}
        </Box>
      </Box>
    </Container>
  );
};

export default AuthLayout;