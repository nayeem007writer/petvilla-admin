import React from 'react';
import { 
  Box, 
  Typography, 
  Tabs, 
  Tab, 
  Card, 
  CardContent, 
  TextField, 
  Button,
  FormControlLabel,
  Switch,
  Divider
} from '@mui/material';
import DashboardLayout from './DashboardLayout';
import {
  Settings as SettingsIcon,
  Security as SecurityIcon,
  Notifications as NotificationsIcon
} from '@mui/icons-material';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `settings-tab-${index}`,
    'aria-controls': `settings-tabpanel-${index}`,
  };
}

const Settings = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <DashboardLayout>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          System Settings
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Configure your application preferences
        </Typography>
      </Box>

      <Card sx={{ borderRadius: 2 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={value} 
            onChange={handleChange} 
            aria-label="settings tabs"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="General" icon={<SettingsIcon />} iconPosition="start" {...a11yProps(0)} />
            <Tab label="Security" icon={<SecurityIcon />} iconPosition="start" {...a11yProps(1)} />
            <Tab label="Notifications" icon={<NotificationsIcon />} iconPosition="start" {...a11yProps(2)} />
          </Tabs>
        </Box>
        
        <TabPanel value={value} index={0}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              General Settings
            </Typography>
            <Box component="form" sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Application Name"
                defaultValue="Admin Panel"
                margin="normal"
              />
              <TextField
                fullWidth
                label="Timezone"
                select
                defaultValue="UTC"
                margin="normal"
              >
                <option value="UTC">UTC</option>
                <option value="EST">Eastern Time</option>
                <option value="PST">Pacific Time</option>
              </TextField>
              <FormControlLabel
                control={<Switch defaultChecked />}
                label="Enable dark mode"
                sx={{ mt: 1 }}
              />
              <Box sx={{ mt: 3 }}>
                <Button variant="contained" color="primary">
                  Save Changes
                </Button>
              </Box>
            </Box>
          </CardContent>
        </TabPanel>
        
        <TabPanel value={value} index={1}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Security Settings
            </Typography>
            <Box component="form" sx={{ mt: 2 }}>
              <FormControlLabel
                control={<Switch defaultChecked />}
                label="Enable two-factor authentication"
              />
              <Divider sx={{ my: 2 }} />
              <TextField
                fullWidth
                label="Password Change"
                type="password"
                placeholder="Enter new password"
                margin="normal"
              />
              <TextField
                fullWidth
                label="Confirm Password"
                type="password"
                placeholder="Confirm new password"
                margin="normal"
              />
              <Box sx={{ mt: 3 }}>
                <Button variant="contained" color="primary">
                  Update Security Settings
                </Button>
              </Box>
            </Box>
          </CardContent>
        </TabPanel>
        
        <TabPanel value={value} index={2}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Notification Settings
            </Typography>
            <Box component="form" sx={{ mt: 2 }}>
              <FormControlLabel
                control={<Switch defaultChecked />}
                label="Email Notifications"
              />
              <FormControlLabel
                control={<Switch defaultChecked />}
                label="Push Notifications"
              />
              <FormControlLabel
                control={<Switch />}
                label="SMS Notifications"
              />
              <Box sx={{ mt: 3 }}>
                <Button variant="contained" color="primary">
                  Save Notification Preferences
                </Button>
              </Box>
            </Box>
          </CardContent>
        </TabPanel>
      </Card>
    </DashboardLayout>
  );
};

export default Settings;