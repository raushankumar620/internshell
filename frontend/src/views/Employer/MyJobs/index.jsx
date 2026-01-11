import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Box,
  Button,
  CircularProgress,
  Alert,
  Stack,
  Divider,
  Paper,
  Tooltip,
  Fab
} from '@mui/material';

// project import
import { gridSpacing } from 'config.js';
import { jobAPI } from 'services/api';

// assets
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import AddIcon from '@mui/icons-material/Add';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PeopleIcon from '@mui/icons-material/People';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';

// ==============================|| MYjobs ||============================== //

const Myinternship = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [internship, setinternship] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Responsive breakpoints
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    fetchinternship();
  }, []);

  const fetchinternship = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await jobAPI.getEmployerinternship();
      if (response.success) {
        setinternship(response.data);
      }
    } catch (err) {
      console.error('Error fetchingjobs:', err);
      setError(err.response?.data?.message || 'Failed to fetchjobs');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        const response = await jobAPI.deleteJob(jobId);
        if (response.success) {
          alert('Job deleted successfully');
          fetchinternship();
        }
      } catch (err) {
        console.error('Error deleting job:', err);
        alert(err.response?.data?.message || 'Failed to delete job');
      }
    }
  };

  const getStatusColor = (status) => {
    return status === 'active' ? 'success' : 'default';
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'full-time':
        return 'primary';
      case 'part-time':
        return 'secondary';
      case 'contract':
        return 'warning';
      case 'internship':
        return 'info';
      default:
        return 'default';
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Mobile Card Component for each job
  const MobileJobCard = ({ job }) => (
    <Paper
      elevation={2}
      sx={{
        p: 2,
        mb: 2,
        borderRadius: 2,
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: theme.shadows[6],
          transform: 'translateY(-2px)'
        },
        cursor: 'pointer',
        border: `1px solid ${theme.palette.divider}`
      }}
      onClick={() => navigate(`/app/employer/internship/${job._id}`)}
    >
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1.5}>
        <Box flex={1} pr={1}>
          <Typography 
            variant="h5" 
            fontWeight={600} 
            sx={{ 
              mb: 0.5,
              wordBreak: 'break-word',
              lineHeight: 1.3
            }}
          >
            {job.title}
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" gap={0.5}>
            <Chip 
              label={job.type} 
              color={getTypeColor(job.type)} 
              size="small" 
              sx={{ fontSize: '0.7rem', height: 24 }}
            />
            <Chip 
              label={job.status} 
              color={getStatusColor(job.status)} 
              size="small" 
              sx={{ fontSize: '0.7rem', height: 24 }}
            />
          </Stack>
        </Box>
      </Box>

      <Divider sx={{ my: 1.5 }} />

      {/* Info Grid */}
      <Grid container spacing={1.5} sx={{ mb: 2 }}>
        <Grid item xs={6}>
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <LocationOnIcon sx={{ fontSize: 16, color: theme.palette.text.secondary }} />
            <Typography variant="body2" color="text.secondary" noWrap>
              {job.location || 'Remote'}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={6}>
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <BusinessCenterIcon sx={{ fontSize: 16, color: theme.palette.text.secondary }} />
            <Typography variant="body2" color="text.secondary">
              {job.openings || 1} {(job.openings || 1) > 1 ? 'positions' : 'position'}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={6}>
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <PeopleIcon sx={{ fontSize: 16, color: theme.palette.primary.main }} />
            <Typography variant="body2" color="primary" fontWeight={500}>
              {job.stats?.totalApplications || 0} applicants
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={6}>
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <CalendarTodayIcon sx={{ fontSize: 16, color: theme.palette.text.secondary }} />
            <Typography variant="body2" color="text.secondary">
              {formatDate(job.createdAt)}
            </Typography>
          </Stack>
        </Grid>
      </Grid>

      {/* Action Buttons */}
      <Stack 
        direction="row" 
        spacing={1} 
        justifyContent="flex-end"
        sx={{ mt: 1 }}
      >
        <Tooltip title="View Details">
          <IconButton 
            size="small" 
            color="primary"
            sx={{ 
              bgcolor: theme.palette.primary.lighter,
              '&:hover': { bgcolor: theme.palette.primary.light }
            }}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/app/employer/internship/${job._id}`);
            }}
          >
            <VisibilityIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Edit Job">
          <IconButton 
            size="small" 
            color="secondary"
            sx={{ 
              bgcolor: theme.palette.secondary.lighter,
              '&:hover': { bgcolor: theme.palette.secondary.light }
            }}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/app/employer/internship/${job._id}/edit`);
            }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete Job">
          <IconButton 
            size="small" 
            color="error"
            sx={{ 
              bgcolor: theme.palette.error.lighter,
              '&:hover': { bgcolor: theme.palette.error.light }
            }}
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(job._id);
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Stack>
    </Paper>
  );

  if (loading) {
    return (
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="center" alignItems="center" py={5}>
                <CircularProgress />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  }

  return (
    <Grid container spacing={gridSpacing}>
      <Grid item xs={12}>
        <Card sx={{ borderRadius: { xs: 2, md: 3 } }}>
          <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
            {/* Header Section - Responsive */}
            <Box 
              display="flex" 
              flexDirection={{ xs: 'column', sm: 'row' }}
              justifyContent="space-between" 
              alignItems={{ xs: 'flex-start', sm: 'center' }}
              gap={2}
              mb={3}
            >
              <Box display="flex" alignItems="center" gap={1}>
                <WorkOutlineIcon 
                  sx={{ 
                    color: theme.palette.primary.main,
                    fontSize: { xs: 24, sm: 28 }
                  }} 
                />
                <Typography 
                  variant={isMobile ? 'h4' : 'h3'}
                  sx={{ fontWeight: 600 }}
                >
                  My Posted Jobs
                </Typography>
              </Box>
              {!isMobile && (
                <Button 
                  variant="contained" 
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={() => navigate('/app/employer/post-job')}
                  sx={{
                    px: 3,
                    py: 1,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600
                  }}
                >
                  Post New Job
                </Button>
              )}
            </Box>
            
            {error && (
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 2,
                  borderRadius: 2
                }}
              >
                {error}
              </Alert>
            )}

            {internship.length === 0 ? (
              <Box 
                textAlign="center" 
                py={{ xs: 4, md: 6 }}
                px={2}
              >
                <WorkOutlineIcon 
                  sx={{ 
                    fontSize: { xs: 60, md: 80 }, 
                    color: theme.palette.grey[300],
                    mb: 2
                  }} 
                />
                <Typography 
                  variant={isMobile ? 'h5' : 'h4'} 
                  color="textSecondary"
                  sx={{ mb: 1 }}
                >
                  No jobs posted yet
                </Typography>
                <Typography 
                  variant="body2" 
                  color="textSecondary"
                  sx={{ mb: 3, maxWidth: 400, mx: 'auto' }}
                >
                  Start attracting top talent by posting your first job opportunity
                </Typography>
                <Button 
                  variant="contained" 
                  color="primary"
                  size={isMobile ? 'medium' : 'large'}
                  startIcon={<AddIcon />}
                  onClick={() => navigate('/app/employer/post-job')}
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600
                  }}
                >
                  Post Your First Job
                </Button>
              </Box>
            ) : (
              <>
                {/* Mobile View - Card Layout */}
                {isTablet ? (
                  <Box sx={{ mt: 2 }}>
                    {internship.map((job) => (
                      <MobileJobCard key={job._id} job={job} />
                    ))}
                  </Box>
                ) : (
                  /* Desktop View - Table Layout */
                  <TableContainer 
                    component={Paper} 
                    elevation={0}
                    sx={{ 
                      border: `1px solid ${theme.palette.divider}`,
                      borderRadius: 2,
                      overflow: 'hidden'
                    }}
                  >
                    <Table>
                      <TableHead>
                        <TableRow sx={{ bgcolor: theme.palette.grey[50] }}>
                          <TableCell sx={{ fontWeight: 600, py: 2 }}>Job Title</TableCell>
                          <TableCell sx={{ fontWeight: 600, py: 2 }}>Location</TableCell>
                          <TableCell sx={{ fontWeight: 600, py: 2 }}>Type</TableCell>
                          <TableCell align="center" sx={{ fontWeight: 600, py: 2 }}>Openings</TableCell>
                          <TableCell align="center" sx={{ fontWeight: 600, py: 2 }}>Applicants</TableCell>
                          <TableCell sx={{ fontWeight: 600, py: 2 }}>Status</TableCell>
                          <TableCell sx={{ fontWeight: 600, py: 2 }}>Posted Date</TableCell>
                          <TableCell align="center" sx={{ fontWeight: 600, py: 2 }}>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {internship.map((job) => (
                          <TableRow 
                            key={job._id} 
                            hover
                            sx={{ 
                              cursor: 'pointer',
                              '&:hover': {
                                bgcolor: theme.palette.action.hover
                              }
                            }}
                            onClick={() => navigate(`/app/employer/internship/${job._id}`)}
                          >
                            <TableCell>
                              <Typography variant="subtitle1" fontWeight={600}>
                                {job.title}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Stack direction="row" alignItems="center" spacing={0.5}>
                                <LocationOnIcon sx={{ fontSize: 16, color: theme.palette.text.secondary }} />
                                <Typography variant="body2">{job.location || 'Remote'}</Typography>
                              </Stack>
                            </TableCell>
                            <TableCell>
                              <Chip 
                                label={job.type} 
                                color={getTypeColor(job.type)} 
                                size="small" 
                              />
                            </TableCell>
                            <TableCell align="center">
                              <Typography variant="body2" fontWeight={500}>
                                {job.openings || 1} {(job.openings || 1) > 1 ? 'positions' : 'position'}
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Chip 
                                label={`${job.stats?.totalApplications || 0} applicants`} 
                                color="primary" 
                                variant="outlined" 
                                size="small" 
                              />
                            </TableCell>
                            <TableCell>
                              <Chip 
                                label={job.status} 
                                color={getStatusColor(job.status)} 
                                size="small" 
                              />
                            </TableCell>
                            <TableCell>{formatDate(job.createdAt)}</TableCell>
                            <TableCell align="center">
                              <Stack direction="row" spacing={0.5} justifyContent="center">
                                <Tooltip title="View Details">
                                  <IconButton 
                                    size="small" 
                                    color="primary"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      navigate(`/app/employer/internship/${job._id}`);
                                    }}
                                  >
                                    <VisibilityIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Edit Job">
                                  <IconButton 
                                    size="small" 
                                    color="secondary"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      navigate(`/app/employer/internship/${job._id}/edit`);
                                    }}
                                  >
                                    <EditIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete Job">
                                  <IconButton 
                                    size="small" 
                                    color="error"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDelete(job._id);
                                    }}
                                  >
                                    <DeleteIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </Stack>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </Grid>

      {/* Floating Action Button for Mobile */}
      {isMobile && internship.length > 0 && (
        <Fab
          color="primary"
          aria-label="post new job"
          onClick={() => navigate('/app/employer/post-job')}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 1000,
            boxShadow: theme.shadows[8]
          }}
        >
          <AddIcon />
        </Fab>
      )}
    </Grid>
  );
};

export default Myinternship;
