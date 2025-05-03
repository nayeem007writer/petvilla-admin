/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Chip,
  TablePagination,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
  Grid
} from '@mui/material';
import { Search, Refresh, Delete, Edit } from '@mui/icons-material';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import api from '../../api/api';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { toast } from 'react-toastify';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isTogglingStatus, setIsTogglingStatus] = useState(false);
  const [stats, setStats] = useState({ 
    total: 0, 
    active: 0, 
    inactive: 0 
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/users?limit=${rowsPerPage}&page=${page + 1}`);
      setUsers(response.data.data);
      setTotal(response.data.meta.total);

      // Calculate active/inactive counts
      const activeCount = response.data.data.filter(user => user.isActive).length;
      const inactiveCount = response.data.data.length - activeCount;
      
      setStats({
        total: response.data.meta.total,
        active: activeCount,
        inactive: inactiveCount
      });
    } catch (error) {
      console.error('Failed to fetch users:', error);
      toast.error(error.response?.data?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, rowsPerPage, searchTerm]);

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      await api.delete(`/users/${selectedUser.id}`);
      toast.success(`User ${selectedUser.firstName} ${selectedUser.lastName} deleted successfully`);
      fetchUsers();
      
      if (users.length === 1 && page > 0) {
        setPage(page - 1);
      }
    } catch (error) {
      console.error('Failed to delete user:', error);
      toast.error(error.response?.data?.message || 'Failed to delete user');
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setSelectedUser(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setSelectedUser(null);
  };

  const handleToggleStatus = async (userId) => {
    setIsTogglingStatus(true);
    setSelectedUser(users.find(user => user.id === userId));
    try {
      await api.patch(`/users/${userId}/activate`);
      toast.success('User status updated successfully');
      fetchUsers();
    } catch (error) {
      console.error('Failed to toggle user status:', error);
      toast.error(error.response?.data?.message || 'Failed to update user status');
    } finally {
      setIsTogglingStatus(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPage(0);
  };

  const handleRefresh = () => {
    fetchUsers();
  };

  // Chart data configuration
  const chartData = {
    labels: ['Active', 'Inactive'],
    datasets: [
      {
        data: [stats.active, stats.inactive],
        backgroundColor: ['#4CAF50', '#F44336'],
        borderWidth: 1,
      },
    ],
  };

  return (
    <DashboardLayout>
      <Box sx={{ p: 3 }}>
        {/* Statistics Section */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
  <Paper sx={{ 
    p: 3, 
    borderRadius: 2,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.08)',
    background: 'linear-gradient(135deg, #f5f7fa 0%, #ffffff 100%)'
  }}>
    <Typography variant="h6" gutterBottom sx={{ 
      fontWeight: 600,
      color: '#2d3748',
      mb: 3,
      display: 'flex',
      alignItems: 'center'
    }}>
      <Box component="span" sx={{
        width: 8,
        height: 8,
        bgcolor: '#30B68F',
        borderRadius: '50%',
        mr: 1.5
      }} />
                User Statistics
                </Typography>
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'space-between',
      gap: 2,
      '& > div': {
        flex: 1,
        textAlign: 'center',
        p: 2,
        borderRadius: 1,
        backgroundColor: 'rgba(245, 247, 250, 0.5)'
      }
    }}>
      <Box>
        <Typography variant="body2" color="text.secondary" sx={{ 
          mb: 1,
          fontWeight: 500,
          fontSize: '0.875rem'
        }}>
          Total
        </Typography>
        <Typography variant="h4" sx={{ 
          fontWeight: 700,
          color: '#2d3748'
        }}>
          {stats.total}
        </Typography>
      </Box>
      <Box>
        <Typography variant="body2" color="text.secondary" sx={{ 
          mb: 1,
          fontWeight: 500,
          fontSize: '0.875rem'
        }}>
          Active
        </Typography>
        <Typography variant="h4" sx={{ 
          fontWeight: 700,
          color: '#4CAF50'
        }}>
          {stats.active}
        </Typography>
      </Box>
      <Box>
        <Typography variant="body2" color="text.secondary" sx={{ 
          mb: 1,
          fontWeight: 500,
          fontSize: '0.875rem'
        }}>
          Inactive
        </Typography>
        <Typography variant="h4" sx={{ 
          fontWeight: 700,
          color: '#F44336'
        }}>
          {stats.inactive}
        </Typography>
      </Box>
    </Box>
  </Paper>
</Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, borderRadius: 2, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                User Status Distribution
              </Typography>
              <Box sx={{ height: '200px' }}>
                <Doughnut 
                  data={chartData} 
                  options={{ 
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { position: 'bottom' },
                      tooltip: {
                        callbacks: {
                          label: (context) => {
                            const label = context.label || '';
                            const value = context.raw || 0;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = Math.round((value / total) * 100);
                            return `${label}: ${value} (${percentage}%)`;
                          }
                        }
                      }
                    }
                  }} 
                />
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* User Management Section */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h4">User Management</Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              size="small"
              placeholder="Search users..."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
              onChange={handleSearch}
            />
            <IconButton onClick={handleRefresh}>
              <Refresh />
            </IconButton>
          </Box>
        </Box>

        <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
          <Table>
            <TableHead sx={{ backgroundColor: '#f5f7fa' }}>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Joined</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: '#1976d2' }}>
                          {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography fontWeight="medium">
                            {user.firstName} {user.lastName}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {user.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>{user.phoneNumber}</TableCell>
                    <TableCell>
                      {user.roles.map(role => (
                        <Chip 
                          key={role.id} 
                          label={role.title} 
                          size="small" 
                          sx={{ 
                            mr: 1,
                            backgroundColor: role.title === 'Super Admin' ? '#d32f2f' : '#1976d2',
                            color: 'white'
                          }} 
                        />
                      ))}
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={user.isActive ? 'Active' : 'Inactive'} 
                        color={user.isActive ? 'success' : 'error'} 
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton 
                          size="small" 
                          color="primary"
                          onClick={() => handleToggleStatus(user.id)}
                          disabled={isTogglingStatus}
                        >
                          {isTogglingStatus && selectedUser?.id === user.id ? (
                            <CircularProgress size={20} color="inherit" />
                          ) : (
                            <Edit fontSize="small" />
                          )}
                        </IconButton>
                        <IconButton 
                          size="small" 
                          color="error"
                          onClick={() => handleDeleteClick(user)}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={total}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{ mt: 2 }}
        />

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={handleDeleteCancel}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{ bgcolor: 'error.main', color: 'white' }}>
            <Box display="flex" alignItems="center">
              <Delete sx={{ mr: 1 }} />
              Confirm User Deletion
            </Box>
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <Box display="flex" alignItems="center" mb={2}>
              <Avatar 
                sx={{ 
                  bgcolor: 'error.light', 
                  mr: 2,
                  width: 56, 
                  height: 56,
                  fontSize: '1.5rem'
                }}
              >
                {selectedUser?.firstName?.charAt(0)}{selectedUser?.lastName?.charAt(0)}
              </Avatar>
              <Box>
                <Typography variant="h6">
                  {selectedUser?.firstName} {selectedUser?.lastName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedUser?.email}
                </Typography>
              </Box>
            </Box>
            <Typography>
              Are you sure you want to permanently delete this user account?
            </Typography>
            <Typography variant="body2" color="error" mt={2}>
              Warning: This action cannot be undone and will permanently remove all user data.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button 
              onClick={handleDeleteCancel} 
              variant="outlined"
              sx={{ mr: 2 }}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleDeleteConfirm} 
              variant="contained"
              color="error"
              startIcon={isDeleting ? <CircularProgress size={20} color="inherit" /> : <Delete />}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Confirm Delete'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </DashboardLayout>
  );
};

export default Users;