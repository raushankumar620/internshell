import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

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
  Divider,
  Button,
  IconButton,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText
} from '@mui/material';

// project import
import { gridSpacing } from 'config.js';
import { jobAPI } from 'services/api';

// assets
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PeopleIcon from '@mui/icons-material/People';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';

// components
import VideoPlayerModal from '../../../component/VideoPlayerModal';

// ==============================|| JOB DETAILS ||============================== //

const JobDetails = () => {
  const theme = useTheme();
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [videoModalOpen, setVideoModalOpen] = useState(false);

  useEffect(() => {
    fetchJobDetails();
  }, [id]);

  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await jobAPI.getJobById(id);
      if (response.success) {
        setJob(response.data);
      }
    } catch (err) {
      console.error('Error fetching job details:', err);
      setError(err.response?.data?.message || 'Failed to fetch job details');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        const response = await jobAPI.deleteJob(id);
        if (response.success) {
          alert('Job deleted successfully');
          navigate('/app/employer/my-internship');
        }
      } catch (err) {
        console.error('Error deleting job:', err);
        alert(err.response?.data?.message || 'Failed to delete job');
      }
    }
  };

  const handleToggleStatus = async () => {
    try {
      const newStatus = job.status === 'active' ? 'closed' : 'active';
      const response = await jobAPI.updateJob(id, { status: newStatus });
      if (response.success) {
        setJob(response.data);
        alert(`Job ${newStatus === 'active' ? 'activated' : 'closed'} successfully`);
      }
    } catch (err) {
      console.error('Error updating job status:', err);
      alert(err.response?.data?.message || 'Failed to update job status');
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

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

  if (error || !job) {
    return (
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Alert severity="error">{error || 'Job not found'}</Alert>
              <Button
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate('/app/employer/my-internship')}
                sx={{ mt: 2 }}
              >
                Back to Myjobs
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  }

  return (
    <Grid container spacing={gridSpacing}>
      {/* Header */}
      <Grid item xs={12}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/app/employer/my-internship')}
          >
            Back
          </Button>
          <Box display="flex" gap={1}>
            <Button
              variant="outlined"
              color={job.status === 'active' ? 'warning' : 'success'}
              onClick={handleToggleStatus}
            >
              {job.status === 'active' ? 'Mark as Inactive' : 'Mark as Active'}
            </Button>
            <Button
              variant="contained"
              color="primary"
              startIcon={<EditIcon />}
              onClick={() => navigate(`/app/employer/internship/${id}/edit`)}
            >
              Edit Job
            </Button>
            <IconButton color="error" onClick={handleDelete}>
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>
      </Grid>

      {/* Job Details Card */}
      <Grid item xs={12} md={8}>
        <Card>
          <CardHeader
            title={
              <Box display="flex" alignItems="center" gap={2}>
                <Typography variant="h2">{job.title}</Typography>
                <Chip
                  label={job.status}
                  color={job.status === 'active' ? 'success' : 'default'}
                  size="small"
                />
              </Box>
            }
            subheader={
              <Typography variant="h4" color="primary">
                {job.company}
              </Typography>
            }
          />
          <Divider />
          <CardContent>
            {/* Quick Info */}
            <Box display="flex" flexWrap="wrap" gap={2} mb={3}>
              <Chip icon={<LocationOnIcon />} label={job.location} variant="outlined" />
              <Chip icon={<WorkOutlineIcon />} label={job.type} color="primary" />
              {job.salary && <Chip label={job.salary} variant="outlined" />}
              {job.experience && <Chip label={job.experience} variant="outlined" />}
              <Chip label={`${job.openings} ${job.openings > 1 ? 'openings' : 'opening'}`} variant="outlined" />
            </Box>

            {/* Video Preview - Only show if video is completed with URL */}
            {job.videoStatus === 'completed' && job.videoUrl && (
              <Box mb={3}>
                <Card sx={{ bgcolor: theme.palette.mode === 'dark' ? 'dark.800' : 'grey.50' }}>
                  <CardContent>
                    <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                      <Box display="flex" alignItems="center" gap={1}>
                        <VideoLibraryIcon color="primary" />
                        <Typography variant="h4">
                          Job Video
                        </Typography>
                      </Box>
                      {job.videoStatus === 'completed' && (
                        <Chip label="Ready" color="success" size="small" />
                      )}
                      {job.videoStatus === 'processing' && (
                        <Chip label="Processing..." color="warning" size="small" />
                      )}
                      {job.videoStatus === 'failed' && (
                        <Chip label="Failed" color="error" size="small" />
                      )}
                      {job.videoStatus === 'pending' && (
                        <Chip label="Pending" color="info" size="small" />
                      )}
                    </Box>
                    
                    {job.videoStatus === 'completed' && job.videoUrl && (
                      <Button
                        variant="contained"
                        color="secondary"
                        size="large"
                        fullWidth
                        startIcon={<PlayCircleOutlineIcon />}
                        onClick={() => setVideoModalOpen(true)}
                        sx={{ py: 1.5, fontWeight: 600 }}
                      >
                        Watch Job Overview Video
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </Box>
            )}

            {/* Description */}
            <Box mb={3}>
              <Typography variant="h4" mb={1}>
                Job Description
              </Typography>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                {job.description}
              </Typography>
            </Box>

            {/* Responsibilities */}
            {job.responsibilities && job.responsibilities.length > 0 && (
              <Box mb={3}>
                <Typography variant="h4" mb={1}>
                  Key Responsibilities
                </Typography>
                <List>
                  {job.responsibilities.map((resp, index) => (
                    <ListItem key={index}>
                      <ListItemText primary={`• ${resp}`} />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}

            {/* Requirements */}
            {job.requirements && job.requirements.length > 0 && (
              <Box mb={3}>
                <Typography variant="h4" mb={1}>
                  Requirements
                </Typography>
                <List>
                  {job.requirements.map((req, index) => (
                    <ListItem key={index}>
                      <ListItemText primary={`• ${req}`} />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}

            {/* Skills */}
            {job.skills && job.skills.length > 0 && (
              <Box>
                <Typography variant="h4" mb={1}>
                  Required Skills
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {job.skills.map((skill, index) => (
                    <Chip key={index} label={skill} color="info" size="small" />
                  ))}
                </Box>
              </Box>
            )}
          </CardContent>
        </Card>
      </Grid>

      {/* Sidebar */}
      <Grid item xs={12} md={4}>
        <Card>
          <CardHeader title="Job Information" />
          <Divider />
          <CardContent>
            <Box display="flex" flexDirection="column" gap={2}>
              <Box>
                <Typography variant="subtitle2" color="textSecondary">
                  Category
                </Typography>
                <Typography variant="body1">{job.category || 'N/A'}</Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="textSecondary">
                  Posted On
                </Typography>
                <Box display="flex" alignItems="center" gap={1}>
                  <CalendarTodayIcon fontSize="small" />
                  <Typography variant="body1">{formatDate(job.createdAt)}</Typography>
                </Box>
              </Box>

              {job.deadline && (
                <Box>
                  <Typography variant="subtitle2" color="textSecondary">
                    Application Deadline
                  </Typography>
                  <Box display="flex" alignItems="center" gap={1}>
                    <CalendarTodayIcon fontSize="small" />
                    <Typography variant="body1">{formatDate(job.deadline)}</Typography>
                  </Box>
                </Box>
              )}

              <Box>
                <Typography variant="subtitle2" color="textSecondary">
                  Total Applicants
                </Typography>
                <Box display="flex" alignItems="center" gap={1}>
                  <PeopleIcon fontSize="small" />
                  <Typography variant="body1">{job.applicants?.length || 0}</Typography>
                </Box>
              </Box>

              <Divider />

              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={() => navigate(`/app/employer/applicants?jobId=${id}`)}
              >
                View Applicants
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Video Player Modal */}
      {job.videoUrl && (
        <VideoPlayerModal
          open={videoModalOpen}
          onClose={() => setVideoModalOpen(false)}
          videoUrl={job.videoUrl}
          videoStatus={job.videoStatus}
          jobTitle={job.title}
        />
      )}
    </Grid>
  );
};

export default JobDetails;
