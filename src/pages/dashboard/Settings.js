import { Typography } from '@mui/material';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { useNavigate } from 'react-router-dom';
const Settings = () => {
  const navigate = useNavigate();
  // ... existing state and functions ...

  // Add this function
  const handleSettingsClick = () => {
    navigate('/dashboard'); // Navigate to dashboard
  };
  return (
    <DashboardLayout>
      <Typography variant="h4" onClick={handleSettingsClick}>Settings</Typography>
    </DashboardLayout>
  );
};

export default Settings;