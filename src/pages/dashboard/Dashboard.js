import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/api';
import { Typography, Button, Box } from '@mui/material';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
const Dashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);

  const fetchData = async () => {
    try {
      const response = await api.get('/protected-data');
      setData(response.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };

  return (
    <DashboardLayout>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4">Welcome, {user?.id}</Typography>
        <Typography variant="subtitle1">Role: {user?.roles?.join(', ')}</Typography>
        
        <Button 
          variant="contained" 
          onClick={fetchData} 
          sx={{ mt: 2 }}
        >
          Fetch Protected Data
        </Button>

        {data && (
          <Box sx={{ mt: 4 }}>
            <pre>{JSON.stringify(data, null, 2)}</pre>
          </Box>
        )}
      </Box>
    </DashboardLayout>
  );
};

export default Dashboard;