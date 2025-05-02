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
import { Search, Refresh, Delete, Edit, Pets } from '@mui/icons-material';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import api from '../../api/api';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { toast } from 'react-toastify';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

// Species constants
const SPECIES = {
  DOG: 'Dog',
  CAT: 'Cat',
  BIRD: 'Bird',
  OTHER: 'Other'
};

const PetsPage = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [stats, setStats] = useState({ 
    total: 0,
    dogs: 0,
    cats: 0,
    birds: 0,
    others: 0,
    pending: 0,
    available: 0,
    adopted: 0
  });

  const fetchPets = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/pets/customer?limit=${rowsPerPage}&page=${page + 1}`);
      setPets(response.data.data);
      setTotal(response.data.meta.total);

      // Calculate pet statistics
      const dogsCount = response.data.data.filter(pet => pet.species === SPECIES.DOG).length;
      const catsCount = response.data.data.filter(pet => pet.species === SPECIES.CAT).length;
      const birdsCount = response.data.data.filter(pet => pet.species === SPECIES.BIRD).length;
      const othersCount = response.data.data.filter(pet => pet.species === SPECIES.OTHER).length;
      
      const pendingCount = response.data.data.filter(pet => pet.status === 'Pending').length;
      const availableCount = response.data.data.filter(pet => pet.status === 'Available').length;
      const adoptedCount = response.data.data.filter(pet => pet.status === 'Adopted').length;
      
      setStats({
        total: response.data.meta.total,
        dogs: dogsCount,
        cats: catsCount,
        birds: birdsCount,
        others: othersCount,
        pending: pendingCount,
        available: availableCount,
        adopted: adoptedCount
      });
    } catch (error) {
      console.error('Failed to fetch pets:', error);
      toast.error(error.response?.data?.message || 'Failed to load pets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPets();
  }, [page, rowsPerPage, searchTerm]);

  const handleDeleteClick = (pet) => {
    setSelectedPet(pet);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      await api.delete(`/pets/${selectedPet.id}`);
      toast.success(`Pet ${selectedPet.name} deleted successfully`);
      fetchPets();
      
      if (pets.length === 1 && page > 0) {
        setPage(page - 1);
      }
    } catch (error) {
      console.error('Failed to delete pet:', error);
      toast.error(error.response?.data?.message || 'Failed to delete pet');
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setSelectedPet(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setSelectedPet(null);
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
    fetchPets();
  };

  // Chart data configuration for species distribution
  const speciesChartData = {
    labels: ['Dogs', 'Cats', 'Birds', 'Others'],
    datasets: [
      {
        data: [stats.dogs, stats.cats, stats.birds, stats.others],
        backgroundColor: ['#4CAF50', '#2196F3', '#FFC107', '#9E9E9E'],
        borderWidth: 1,
      },
    ],
  };

  // Chart data configuration for status distribution
  const statusChartData = {
    labels: ['Pending', 'Available', 'Adopted'],
    datasets: [
      {
        data: [stats.pending, stats.available, stats.adopted],
        backgroundColor: ['#FF9800', '#4CAF50', '#607D8B'],
        borderWidth: 1,
      },
    ],
  };

  const getSpeciesColor = (species) => {
    switch (species) {
      case SPECIES.DOG: return 'success';
      case SPECIES.CAT: return 'primary';
      case SPECIES.BIRD: return 'warning';
      default: return 'default';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Available': return 'success';
      case 'Adopted': return 'info';
      case 'Pending': return 'warning';
      default: return 'default';
    }
  };

  return (
    <DashboardLayout>
      <Box sx={{ p: 3 }}>
        {/* Statistics Section */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ 
              p: 3, 
              borderRadius: 3,
              boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.08)',
              background: 'linear-gradient(135deg, #f5f7fa 0%, #ffffff 100%)'
            }}>
              <Typography variant="h5" gutterBottom sx={{ 
                fontWeight: 600,
                color: 'text.primary',
                mb: 3,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                <Pets fontSize="medium" />
                Pet Statistics Overview
              </Typography>
              
              <Grid container spacing={3}>
                {/* Total Pets Card */}
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{
                    p: 2.5,
                    borderRadius: 2,
                    bgcolor: 'background.paper',
                    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.05)',
                    textAlign: 'center',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                  }}>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                      Total Pets
                    </Typography>
                    <Typography variant="h3" sx={{ 
                      fontWeight: 700,
                      color: 'primary.main',
                      mb: 1
                    }}>
                      {stats.total}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      All registered pets
                    </Typography>
                  </Box>
                </Grid>

                {/* Dogs Card */}
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{
                    p: 2.5,
                    borderRadius: 2,
                    bgcolor: 'background.paper',
                    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.05)',
                    textAlign: 'center',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    borderBottom: '4px solid #4CAF50'
                  }}>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                      Dogs
                    </Typography>
                    <Typography variant="h3" sx={{ 
                      fontWeight: 700,
                      color: '#4CAF50',
                      mb: 1
                    }}>
                      {stats.dogs}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {stats.total > 0 ? `${Math.round((stats.dogs / stats.total) * 100)}% of total` : 'No pets'}
                    </Typography>
                  </Box>
                </Grid>

                {/* Cats Card */}
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{
                    p: 2.5,
                    borderRadius: 2,
                    bgcolor: 'background.paper',
                    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.05)',
                    textAlign: 'center',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    borderBottom: '4px solid #2196F3'
                  }}>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                      Cats
                    </Typography>
                    <Typography variant="h3" sx={{ 
                      fontWeight: 700,
                      color: '#2196F3',
                      mb: 1
                    }}>
                      {stats.cats}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {stats.total > 0 ? `${Math.round((stats.cats / stats.total) * 100)}% of total` : 'No pets'}
                    </Typography>
                  </Box>
                </Grid>

                {/* Birds Card */}
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{
                    p: 2.5,
                    borderRadius: 2,
                    bgcolor: 'background.paper',
                    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.05)',
                    textAlign: 'center',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    borderBottom: '4px solid #FFC107'
                  }}>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                      Birds
                    </Typography>
                    <Typography variant="h3" sx={{ 
                      fontWeight: 700,
                      color: '#FFC107',
                      mb: 1
                    }}>
                      {stats.birds}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {stats.total > 0 ? `${Math.round((stats.birds / stats.total) * 100)}% of total` : 'No pets'}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ 
              p: 3, 
              borderRadius: 3,
              height: '100%',
              boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.08)',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <Typography variant="h5" gutterBottom sx={{ 
                fontWeight: 600,
                color: 'text.primary',
                mb: 3,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                <Pets fontSize="medium" />
                Species Distribution
              </Typography>
              <Box sx={{ 
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}>
                <Box sx={{ height: '250px', position: 'relative' }}>
                  <Doughnut 
                    data={speciesChartData} 
                    options={{ 
                      maintainAspectRatio: false,
                      cutout: '70%',
                      plugins: {
                        legend: { 
                          position: 'bottom',
                          labels: {
                            padding: 20,
                            usePointStyle: true,
                            pointStyle: 'circle'
                          }
                        },
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
                  {stats.total > 0 && (
                    <Box sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      textAlign: 'center'
                    }}>
                      <Typography variant="h6" color="text.secondary">
                        Total
                      </Typography>
                      <Typography variant="h4" fontWeight={700}>
                        {stats.total}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Status Statistics Section */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ 
              p: 3, 
              borderRadius: 3,
              height: '100%',
              boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.08)'
            }}>
              <Typography variant="h5" gutterBottom sx={{ 
                fontWeight: 600,
                color: 'text.primary',
                mb: 3,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                <Pets fontSize="medium" />
                Adoption Status
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={6}>
                  <Box sx={{
                    p: 2,
                    borderRadius: 2,
                    bgcolor: '#FFF8E1',
                    textAlign: 'center'
                  }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Pending
                    </Typography>
                    <Typography variant="h4" color="#FF9800" fontWeight={700}>
                      {stats.pending}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <Box sx={{
                    p: 2,
                    borderRadius: 2,
                    bgcolor: '#E8F5E9',
                    textAlign: 'center'
                  }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Available
                    </Typography>
                    <Typography variant="h4" color="#4CAF50" fontWeight={700}>
                      {stats.available}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{
                    p: 2,
                    borderRadius: 2,
                    bgcolor: '#ECEFF1',
                    textAlign: 'center'
                  }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Adopted
                    </Typography>
                    <Typography variant="h4" color="#607D8B" fontWeight={700}>
                      {stats.adopted}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          <Grid item xs={12} md={8}>
            <Paper sx={{ 
              p: 3, 
              borderRadius: 3,
              height: '100%',
              boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.08)'
            }}>
              <Typography variant="h5" gutterBottom sx={{ 
                fontWeight: 600,
                color: 'text.primary',
                mb: 3,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                <Pets fontSize="medium" />
                Status Distribution
              </Typography>
              <Box sx={{ height: '300px' }}>
                <Doughnut 
                  data={statusChartData} 
                  options={{ 
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { 
                        position: 'right',
                        labels: {
                          padding: 20,
                          usePointStyle: true,
                          pointStyle: 'circle'
                        }
                      }
                    }
                  }} 
                />
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Pet Management Section */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h4">Pet Management</Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              size="small"
              placeholder="Search pets..."
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
            <Button 
              variant="contained" 
              startIcon={<Pets />}
            >
              Add Pet
            </Button>
          </Box>
        </Box>

        <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
          <Table>
            <TableHead sx={{ backgroundColor: '#f5f7fa' }}>
              <TableRow>
                <TableCell>Pet</TableCell>
                <TableCell>Species</TableCell>
                <TableCell>Breed</TableCell>
                <TableCell>Age</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Added</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : pets.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No pets found
                  </TableCell>
                </TableRow>
              ) : (
                pets.map((pet) => (
                  <TableRow key={pet.id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar 
                          src={pet.productImages} 
                          sx={{ 
                            bgcolor: pet.species === SPECIES.DOG ? '#4CAF50' : 
                                    pet.species === SPECIES.CAT ? '#2196F3' : 
                                    pet.species === SPECIES.BIRD ? '#FFC107' : '#9E9E9E'
                          }}
                        >
                          {pet.name?.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography fontWeight="medium">
                            {pet.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {pet.gender || 'Unknown'} • {pet.color || 'Unknown'}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={pet.species} 
                        color={getSpeciesColor(pet.species)} 
                        size="small"
                        sx={{ textTransform: 'capitalize' }}
                      />
                    </TableCell>
                    <TableCell>{pet.breed || '-'}</TableCell>
                    <TableCell>{pet.age || 'Unknown'} years</TableCell>
                    <TableCell>
                      <Chip 
                        label={pet.status} 
                        color={getStatusColor(pet.status)} 
                        size="small"
                        sx={{ textTransform: 'capitalize' }}
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(pet.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton size="small" color="primary">
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          color="error"
                          onClick={() => handleDeleteClick(pet)}
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
              Confirm Pet Deletion
            </Box>
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <Box display="flex" alignItems="center" mb={2}>
              <Avatar 
                src={selectedPet?.productImages}
                sx={{ 
                  bgcolor: selectedPet?.species === SPECIES.DOG ? '#4CAF50' : 
                          selectedPet?.species === SPECIES.CAT ? '#2196F3' : 
                          selectedPet?.species === SPECIES.BIRD ? '#FFC107' : '#9E9E9E',
                  mr: 2,
                  width: 56, 
                  height: 56,
                  fontSize: '1.5rem'
                }}
              >
                {selectedPet?.name?.charAt(0)}
              </Avatar>
              <Box>
                <Typography variant="h6">
                  {selectedPet?.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedPet?.breed || 'Unknown breed'} • {selectedPet?.age || 'Unknown age'}
                </Typography>
              </Box>
            </Box>
            <Typography>
              Are you sure you want to permanently delete this pet record?
            </Typography>
            <Typography variant="body2" color="error" mt={2}>
              Warning: This action cannot be undone and will permanently remove all pet data.
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

export default PetsPage;