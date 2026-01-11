import React, { useState, useEffect } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Grid,
  Card,
  CardHeader,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Divider,
  Avatar,
  Tab,
  Tabs,
  CircularProgress,
  Alert
} from '@mui/material';

// project import
import { gridSpacing } from 'config.js';
import { applicationAPI } from '../../../services/api';

// assets
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import BusinessIcon from '@mui/icons-material/Business';

// ==============================|| APPLIEDjobs ||============================== //

const Appliedinternship = () => {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch applications from backend
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await applicationAPI.getInternApplications();
        if (response.success) {
          setApplications(response.data);
        } else {
          setError(response.message || 'Failed to fetch applications');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching applications');
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'reviewed':
        return 'info';
      case 'shortlisted':
        return 'success';
      case 'rejected':
        return 'error';
      case 'accepted':
        return 'success';
      default:
        return 'default';
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const filteredApplications = applications.filter((app) => {
    const matchesSearch = (app.job?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.job?.company?.toLowerCase().includes(searchTerm.toLowerCase())) || 
      (app.employer?.companyName?.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (tabValue === 0) return matchesSearch; // All
    if (tabValue === 1) return matchesSearch && app.status === 'pending';
    if (tabValue === 2) return matchesSearch && (app.status === 'reviewed' || app.status === 'shortlisted');
    if (tabValue === 3) return matchesSearch && app.status === 'shortlisted'; // Using shortlisted for interview
    if (tabValue === 4) return matchesSearch && app.status === 'rejected';
    return matchesSearch;
  });

  return (
    <Grid container spacing={gridSpacing}>
      <Grid item xs={12}>
        <Card>
          <CardHeader
            title={
              <Box display="flex" alignItems="center" gap={1}>
                <WorkOutlineIcon sx={{ color: theme.palette.primary.main }} />
                <Typography variant="h3">Appliedjobs</Typography>
              </Box>
            }
            subheader={`${filteredApplications.length} applications found`}
          />
          <Divider />
          <CardContent>
            {/* Error Message */}
            {error && (
              <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
                {error}
              </Alert>
            )}
            
            {/* Loading Indicator */}
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
                <CircularProgress />
              </Box>
            ) : (
              <>
                {/* Search and Filter */}
                <Box sx={{ mb: 3 }}>
                  <TextField
                    fullWidth
                    placeholder="Search by job title or company..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      )
                    }}
                  />
                </Box>

                {/* Tabs */}
                <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                  <Tabs value={tabValue} onChange={handleTabChange}>
                    <Tab label="All" />
                    <Tab label="Applied" />
                    <Tab label="In Review" />
                    <Tab label="Interview" />
                    <Tab label="Rejected" />
                  </Tabs>
                </Box>

                {/* Applications Table */}
                <TableContainer component={Paper} variant="outlined">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Job Details</TableCell>
                        <TableCell>Company</TableCell>
                        <TableCell>Applied Date</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell align="center">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredApplications.length > 0 ? (
                        filteredApplications.map((app) => (
                          <TableRow key={app._id} hover>
                            <TableCell>
                              <Box>
                                <Typography variant="h6" sx={{ mb: 0.5 }}>
                                  {app.job?.title || 'Job Title Not Available'}
                                </Typography>
                                <Box display="flex" gap={1} alignItems="center" flexWrap="wrap">
                                  {app.job?.jobType && (
                                    <Chip label={app.job.jobType} size="small" variant="outlined" />
                                  )}
                                  {app.job?.location && (
                                    <Typography variant="caption" color="textSecondary">
                                      {app.job.location}
                                    </Typography>
                                  )}
                                </Box>
                                {app.job?.stipend && (app.job.stipend.min || app.job.stipend.max) && (
                                  <Typography variant="body2" color="primary" sx={{ mt: 0.5 }}>
                                    ₹{app.job.stipend.min?.toLocaleString?.() || 0}-{app.job.stipend.max?.toLocaleString?.() || 0}/month
                                  </Typography>
                                )}
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Box display="flex" alignItems="center" gap={1}>
                                <Avatar 
                                  src={app.job?.employer?.avatar || null}
                                  sx={{ bgcolor: theme.palette.primary.light, width: 32, height: 32 }}
                                >
                                  <BusinessIcon sx={{ fontSize: 18, color: theme.palette.primary.main }} />
                                </Avatar>
                                <Typography variant="body2">
                                  {app.job?.employer?.companyName || app.employer?.companyName || app.job?.company || 'Company'}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2">
                                {new Date(app.createdAt).toLocaleDateString('en-IN', { 
                                  year: 'numeric', 
                                  month: 'short', 
                                  day: 'numeric' 
                                })}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Box>
                                <Chip 
                                  label={app.status.charAt(0).toUpperCase() + app.status.slice(1)} 
                                  color={getStatusColor(app.status)} 
                                  size="small" 
                                />
                                {/* Show rejection reason if rejected */}
                                {app.status === 'rejected' && app.rejectionReason && (
                                  <Typography 
                                    variant="caption" 
                                    color="error" 
                                    sx={{ 
                                      display: 'block', 
                                      mt: 0.5,
                                      fontStyle: 'italic'
                                    }}
                                  >
                                    Reason: {app.rejectionReason}
                                  </Typography>
                                )}
                              </Box>
                            </TableCell>
                            <TableCell align="center">
                              <IconButton size="small" color="primary" title="View Details">
                                <VisibilityIcon fontSize="small" />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} align="center" sx={{ py: 5 }}>
                            <Typography variant="h6" color="textSecondary">
                              No applications found
                            </Typography>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default Appliedinternship;
