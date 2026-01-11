import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Stack,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  Avatar,
  IconButton,
  Paper,
  alpha,
  Skeleton,
  useMediaQuery,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Collapse,
  Drawer,
  Slider,
  Badge
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WorkIcon from '@mui/icons-material/Work';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import BusinessIcon from '@mui/icons-material/Business';
import FilterListIcon from '@mui/icons-material/FilterList';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import VerifiedIcon from '@mui/icons-material/Verified';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import TuneIcon from '@mui/icons-material/Tune';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import ApartmentIcon from '@mui/icons-material/Apartment';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

import PublicNavbar from 'component/PublicNavbar';
import VideoPlayerModal from 'component/VideoPlayerModal';
import { jobAPI, applicationAPI } from 'services/api';

// Filter Section Component
const FilterSection = ({ title, children, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);
  const theme = useTheme();

  return (
    <Box sx={{ mb: 2 }}>
      <Box
        onClick={() => setOpen(!open)}
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer',
          py: 1.5,
          px: 2,
          borderRadius: 2,
          '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.05) }
        }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
          {title}
        </Typography>
        {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </Box>
      <Collapse in={open}>
        <Box sx={{ px: 2, pb: 1 }}>
          {children}
        </Box>
      </Collapse>
      <Divider />
    </Box>
  );
};

// Left Sidebar Filters
const FiltersPanel = ({
  searchQuery, setSearchQuery,
  locationFilter, setLocationFilter,
  jobTypes, setJobTypes,
  workModes, setWorkModes,
  experience, setExperience,
  stipendRange, setStipendRange,
  duration, setDuration,
  onClearFilters,
  activeFiltersCount
}) => {
  const theme = useTheme();

  const jobTypeOptions = ['Full-time', 'Part-time', 'Internship', 'Contract', 'Freelance'];
  const workModeOptions = [
    { value: 'remote', label: 'Work From Home', icon: <HomeWorkIcon fontSize="small" /> },
    { value: 'office', label: 'In Office', icon: <ApartmentIcon fontSize="small" /> },
    { value: 'hybrid', label: 'Hybrid', icon: <BusinessIcon fontSize="small" /> }
  ];
  const experienceOptions = ['Fresher', '0-1 years', '1-2 years', '2-3 years', '3+ years'];
  const durationOptions = ['1 Month', '2 Months', '3 Months', '6 Months', '12 Months'];

  const handleJobTypeChange = (type) => {
    if (jobTypes.includes(type)) {
      setJobTypes(jobTypes.filter(t => t !== type));
    } else {
      setJobTypes([...jobTypes, type]);
    }
  };

  const handleWorkModeChange = (mode) => {
    if (workModes.includes(mode)) {
      setWorkModes(workModes.filter(m => m !== mode));
    } else {
      setWorkModes([...workModes, mode]);
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        overflow: 'hidden',
        position: 'sticky',
        top: 80
      }}
    >
      {/* Header */}
      <Box sx={{
        p: 2,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid',
        borderColor: 'divider',
        bgcolor: alpha(theme.palette.primary.main, 0.03)
      }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <TuneIcon color="primary" />
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Filters
          </Typography>
          {activeFiltersCount > 0 && (
            <Chip
              size="small"
              label={activeFiltersCount}
              color="primary"
              sx={{ height: 22, fontSize: '0.75rem' }}
            />
          )}
        </Stack>
        {activeFiltersCount > 0 && (
          <Button
            size="small"
            onClick={onClearFilters}
            sx={{ textTransform: 'none', fontWeight: 600 }}
          >
            Clear All
          </Button>
        )}
      </Box>

      {/* Search */}
      <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search by title, skill..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              bgcolor: 'background.paper'
            }
          }}
        />
      </Box>

      {/* Location */}
      <FilterSection title="Location">
        <TextField
          fullWidth
          size="small"
          placeholder="e.g. Delhi, Mumbai, Bangalore"
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
          InputProps={{
            startAdornment: <LocationOnIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
          }}
          sx={{
            '& .MuiOutlinedInput-root': { borderRadius: 2 }
          }}
        />
      </FilterSection>

      {/* Work Mode */}
      <FilterSection title="Work Mode">
        <Stack spacing={0.5}>
          {workModeOptions.map((option) => (
            <FormControlLabel
              key={option.value}
              control={
                <Checkbox
                  size="small"
                  checked={workModes.includes(option.value)}
                  onChange={() => handleWorkModeChange(option.value)}
                />
              }
              label={
                <Stack direction="row" spacing={1} alignItems="center">
                  {option.icon}
                  <Typography variant="body2">{option.label}</Typography>
                </Stack>
              }
            />
          ))}
        </Stack>
      </FilterSection>

      {/* Job Type */}
      <FilterSection title="Job Type">
        <FormGroup>
          {jobTypeOptions.map((type) => (
            <FormControlLabel
              key={type}
              control={
                <Checkbox
                  size="small"
                  checked={jobTypes.includes(type)}
                  onChange={() => handleJobTypeChange(type)}
                />
              }
              label={<Typography variant="body2">{type}</Typography>}
            />
          ))}
        </FormGroup>
      </FilterSection>

      {/* Experience */}
      <FilterSection title="Experience">
        <FormControl fullWidth size="small">
          <Select
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            displayEmpty
            sx={{ borderRadius: 2 }}
          >
            <MenuItem value="">Any Experience</MenuItem>
            {experienceOptions.map((exp) => (
              <MenuItem key={exp} value={exp}>{exp}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </FilterSection>

      {/* Stipend Range */}
      <FilterSection title="Monthly Stipend">
        <Box sx={{ px: 1 }}>
          <Slider
            value={stipendRange}
            onChange={(e, newValue) => setStipendRange(newValue)}
            valueLabelDisplay="auto"
            valueLabelFormat={(value) => `₹${value / 1000}K`}
            min={0}
            max={50000}
            step={5000}
            marks={[
              { value: 0, label: '₹0' },
              { value: 25000, label: '₹25K' },
              { value: 50000, label: '₹50K' }
            ]}
          />
        </Box>
      </FilterSection>

      {/* Duration */}
      <FilterSection title="Duration" defaultOpen={false}>
        <FormControl fullWidth size="small">
          <Select
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            displayEmpty
            sx={{ borderRadius: 2 }}
          >
            <MenuItem value="">Any Duration</MenuItem>
            {durationOptions.map((dur) => (
              <MenuItem key={dur} value={dur}>{dur}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </FilterSection>
    </Paper>
  );
};

// Job Card Component
const JobCard = ({ job, onSaveJob, onViewDetails, onApplyNow, savedJobs = [], appliedJobs = [] }) => {
  const theme = useTheme();
  const isAlreadyApplied = appliedJobs.includes(job._id);
  const isSaved = savedJobs.includes(job._id);

  return (
    <Card
      component={motion.div}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ boxShadow: '0 8px 25px rgba(0,0,0,0.1)' }}
      sx={{
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        transition: 'all 0.2s ease',
        cursor: 'pointer',
        '&:hover': {
          borderColor: theme.palette.primary.main
        }
      }}
      onClick={() => onViewDetails(job)}
    >
      <CardContent sx={{ p: 2.5 }}>
        {/* Header Row */}
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <Avatar
            src={job.employer?.avatar}
            sx={{
              width: 50,
              height: 50,
              bgcolor: theme.palette.primary.main,
              fontSize: '1.2rem',
              fontWeight: 700
            }}
          >
            {job.employer?.companyName?.[0]?.toUpperCase() || 'C'}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                fontSize: '1rem',
                mb: 0.3,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              {job.title}
            </Typography>
            <Stack direction="row" spacing={0.5} alignItems="center">
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                {job.employer?.companyName || job.company || 'Company'}
              </Typography>
              {job.employer?.verified && (
                <VerifiedIcon sx={{ fontSize: 14, color: theme.palette.info.main }} />
              )}
            </Stack>
          </Box>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onSaveJob(job._id);
            }}
          >
            {isSaved ? (
              <BookmarkIcon sx={{ color: theme.palette.primary.main }} />
            ) : (
              <BookmarkBorderIcon />
            )}
          </IconButton>
        </Box>

        {/* Info Tags */}
        <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2, gap: 0.5 }}>
          <Chip
            size="small"
            icon={<LocationOnIcon sx={{ fontSize: '0.9rem !important' }} />}
            label={job.location || 'India'}
            variant="outlined"
            sx={{ fontSize: '0.75rem', height: 26 }}
          />
          <Chip
            size="small"
            icon={<HomeWorkIcon sx={{ fontSize: '0.9rem !important' }} />}
            label={job.workMode || job.jobType || 'Office'}
            sx={{
              fontSize: '0.75rem',
              height: 26,
              bgcolor: alpha(theme.palette.success.main, 0.1),
              color: theme.palette.success.dark,
              border: 'none'
            }}
          />
          <Chip
            size="small"
            icon={<CalendarTodayIcon sx={{ fontSize: '0.9rem !important' }} />}
            label={job.duration || '3 Months'}
            variant="outlined"
            sx={{ fontSize: '0.75rem', height: 26 }}
          />
        </Stack>

        {/* Stipend */}
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          mb: 2,
          p: 1.5,
          borderRadius: 2,
          bgcolor: alpha(theme.palette.warning.main, 0.08)
        }}>
          <CurrencyRupeeIcon sx={{ fontSize: 18, color: theme.palette.warning.dark }} />
          <Typography variant="body2" sx={{ fontWeight: 600, color: theme.palette.warning.dark }}>
            {job.stipend ?
              `₹${job.stipend.min?.toLocaleString?.('en-IN') || job.stipend.min} - ₹${job.stipend.max?.toLocaleString?.('en-IN') || job.stipend.max}/month` :
              (job.salary || 'Competitive Stipend')
            }
          </Typography>
        </Box>

        {/* Skills */}
        {job.skills && job.skills.length > 0 && (
          <Stack direction="row" spacing={0.5} flexWrap="wrap" sx={{ mb: 2, gap: 0.5 }}>
            {job.skills.slice(0, 3).map((skill, idx) => (
              <Chip
                key={idx}
                label={skill}
                size="small"
                sx={{
                  bgcolor: alpha(theme.palette.primary.main, 0.08),
                  color: theme.palette.primary.dark,
                  fontSize: '0.7rem',
                  height: 24
                }}
              />
            ))}
            {job.skills.length > 3 && (
              <Chip
                label={`+${job.skills.length - 3}`}
                size="small"
                sx={{
                  bgcolor: alpha(theme.palette.grey[500], 0.1),
                  fontSize: '0.7rem',
                  height: 24
                }}
              />
            )}
          </Stack>
        )}

        {/* Footer */}
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pt: 2,
          borderTop: '1px solid',
          borderColor: 'divider'
        }}>
          <Stack direction="row" spacing={0.5} alignItems="center">
            <AccessTimeIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
            <Typography variant="caption" color="text.secondary">
              {job.createdAt ?
                new Date(job.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) :
                'Recently'
              }
            </Typography>
          </Stack>
          {isAlreadyApplied ? (
            <Chip
              size="small"
              icon={<CheckCircleIcon sx={{ fontSize: '0.9rem !important' }} />}
              label="Applied"
              sx={{
                bgcolor: theme.palette.success.main,
                color: '#fff',
                fontWeight: 600,
                '& .MuiChip-icon': { color: '#fff' }
              }}
            />
          ) : (
            <Button
              size="small"
              variant="contained"
              onClick={(e) => {
                e.stopPropagation();
                onApplyNow(job);
              }}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                px: 2
              }}
            >
              Apply Now
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

// Loading Skeleton
const JobCardSkeleton = () => (
  <Card sx={{ borderRadius: 3, p: 2.5 }}>
    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
      <Skeleton variant="circular" width={50} height={50} />
      <Box sx={{ flex: 1 }}>
        <Skeleton variant="text" width="60%" height={24} />
        <Skeleton variant="text" width="40%" height={20} />
      </Box>
    </Box>
    <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
      <Skeleton variant="rounded" width={80} height={26} />
      <Skeleton variant="rounded" width={80} height={26} />
    </Stack>
    <Skeleton variant="rounded" width="100%" height={40} sx={{ mb: 2 }} />
    <Skeleton variant="text" width="100%" height={20} />
  </Card>
);

// Main Component
const JobsPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // States
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [jobTypes, setJobTypes] = useState([]);
  const [workModes, setWorkModes] = useState([]);
  const [experience, setExperience] = useState('');
  const [stipendRange, setStipendRange] = useState([0, 50000]);
  const [duration, setDuration] = useState('');

  const [savedinternship, setSavedinternship] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedJob, setSelectedJob] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const jobsPerPage = 10;
  const [internship, setinternship] = useState([]);
  const [totalinternship, setTotalinternship] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Video & Applied states
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [appliedJobs, setAppliedJobs] = useState([]);

  // Mobile filter drawer
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Calculate active filters count
  const activeFiltersCount = [
    searchQuery,
    locationFilter,
    jobTypes.length > 0,
    workModes.length > 0,
    experience,
    stipendRange[0] > 0 || stipendRange[1] < 50000,
    duration
  ].filter(Boolean).length;

  const handleOpenDetails = (job) => {
    setSelectedJob(job);
    setDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setDetailsOpen(false);
    setSelectedJob(null);
  };

  const handleApplyNow = (job) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    navigate(`/app/intern/apply-job/${job._id}`, { state: { job } });
  };

  const handleSaveJob = (jobId) => {
    if (savedinternship.includes(jobId)) {
      setSavedinternship(savedinternship.filter((id) => id !== jobId));
    } else {
      setSavedinternship([...savedinternship, jobId]);
    }
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setLocationFilter('');
    setJobTypes([]);
    setWorkModes([]);
    setExperience('');
    setStipendRange([0, 50000]);
    setDuration('');
    setCurrentPage(1);
  };

  // Initialize filters from URL
  useEffect(() => {
    const type = searchParams.get('type');
    if (type === 'wfh') {
      setWorkModes(['remote']);
    } else if (type === 'office') {
      setWorkModes(['office']);
    }
  }, []);

  // Fetch applied jobs
  useEffect(() => {
    const fetchAppliedJobs = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const response = await applicationAPI.getInternApplications();
        if (response.success && response.data) {
          const appliedJobIds = response.data.map(app => app.job?._id || app.job);
          setAppliedJobs(appliedJobIds);
        }
      } catch (err) {
        console.error('Error fetching applied jobs:', err);
      }
    };
    fetchAppliedJobs();
  }, []);

  // Fetch jobs
  useEffect(() => {
    const fetchinternship = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = {
          page: currentPage,
          limit: jobsPerPage,
          search: searchQuery,
          location: locationFilter,
          jobType: jobTypes.join(','),
          workMode: workModes.join(','),
          experience,
          minStipend: stipendRange[0],
          maxStipend: stipendRange[1],
          duration
        };
        Object.keys(params).forEach(key => {
          if (!params[key] || params[key] === '0' || params[key] === '50000') delete params[key];
        });
        const res = await jobAPI.getAllinternship(params);
        if (res.success) {
          setinternship(res.data);
          setTotalinternship(res.pagination?.totalinternship || 0);
        } else {
          setinternship([]);
          setTotalinternship(0);
          setError(res.message || 'Failed to load jobs');
        }
      } catch (err) {
        setError('Failed to load jobs. Please try again later.');
        setinternship([]);
        setTotalinternship(0);
      } finally {
        setLoading(false);
      }
    };
    fetchinternship();
  }, [searchQuery, locationFilter, jobTypes, workModes, experience, stipendRange, duration, currentPage]);

  const totalPages = Math.ceil(totalinternship / jobsPerPage);

  // Filter Panel Props
  const filterProps = {
    searchQuery, setSearchQuery,
    locationFilter, setLocationFilter,
    jobTypes, setJobTypes,
    workModes, setWorkModes,
    experience, setExperience,
    stipendRange, setStipendRange,
    duration, setDuration,
    onClearFilters: handleClearFilters,
    activeFiltersCount
  };

  return (
    <>
      <PublicNavbar />
      <Box sx={{ bgcolor: '#f5f7fa', minHeight: '100vh', pt: { xs: 8, md: 10 } }}>
        {/* Top Search Bar */}
        <Box sx={{
          bgcolor: 'white',
          borderBottom: '1px solid',
          borderColor: 'divider',
          py: 2,
          position: 'sticky',
          top: 64,
          zIndex: 100
        }}>
          <Container maxWidth="xl">
            <Stack direction="row" spacing={2} alignItems="center">
              <TextField
                fullWidth
                placeholder="Search internships by title, company, or skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
                }}
                sx={{
                  maxWidth: 600,
                  '& .MuiOutlinedInput-root': { borderRadius: 3 }
                }}
              />
              <TextField
                placeholder="Location"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                InputProps={{
                  startAdornment: <LocationOnIcon sx={{ mr: 1, color: 'text.secondary' }} />
                }}
                sx={{
                  width: 200,
                  display: { xs: 'none', md: 'block' },
                  '& .MuiOutlinedInput-root': { borderRadius: 3 }
                }}
              />
              {isMobile && (
                <Badge badgeContent={activeFiltersCount} color="primary">
                  <IconButton
                    onClick={() => setMobileFilterOpen(true)}
                    sx={{
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 2
                    }}
                  >
                    <FilterListIcon />
                  </IconButton>
                </Badge>
              )}
            </Stack>
          </Container>
        </Box>

        {/* Main Content */}
        <Container maxWidth="xl" sx={{ py: 3 }}>
          <Grid container spacing={3}>
            {/* Left Sidebar - Filters (Desktop) */}
            {!isMobile && (
              <Grid item md={3} lg={2.5}>
                <FiltersPanel {...filterProps} />
              </Grid>
            )}

            {/* Right Side - Job Listings */}
            <Grid item xs={12} md={9} lg={9.5}>
              {/* Results Header */}
              <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 3
              }}>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    {loading ? 'Searching...' : `${totalinternship} Internships`}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Find your perfect opportunity
                  </Typography>
                </Box>
                <FormControl size="small" sx={{ minWidth: 150, display: { xs: 'none', sm: 'block' } }}>
                  <Select defaultValue="recent" sx={{ borderRadius: 2 }}>
                    <MenuItem value="recent">Most Recent</MenuItem>
                    <MenuItem value="relevant">Most Relevant</MenuItem>
                    <MenuItem value="stipend">Highest Stipend</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              {/* Error */}
              {error && (
                <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                  {error}
                </Alert>
              )}

              {/* Job List */}
              {loading ? (
                <Stack spacing={2}>
                  {[...Array(5)].map((_, idx) => (
                    <JobCardSkeleton key={idx} />
                  ))}
                </Stack>
              ) : (
                <Stack spacing={2}>
                  {internship.length > 0 ? (
                    internship.map((job) => (
                      <JobCard
                        key={job._id}
                        job={job}
                        savedJobs={savedinternship}
                        onSaveJob={handleSaveJob}
                        onViewDetails={handleOpenDetails}
                        onApplyNow={handleApplyNow}
                        appliedJobs={appliedJobs}
                      />
                    ))
                  ) : (
                    <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
                      <Box
                        sx={{
                          width: 100,
                          height: 100,
                          borderRadius: '50%',
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mx: 'auto',
                          mb: 3
                        }}
                      >
                        <SearchIcon sx={{ fontSize: 50, color: theme.palette.primary.main }} />
                      </Box>
                      <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                        No Internships Found
                      </Typography>
                      <Typography color="text.secondary" sx={{ mb: 3 }}>
                        Try adjusting your filters to find more opportunities
                      </Typography>
                      <Button variant="contained" onClick={handleClearFilters} sx={{ borderRadius: 2 }}>
                        Clear All Filters
                      </Button>
                    </Paper>
                  )}
                </Stack>
              )}

              {/* Pagination */}
              {totalPages > 1 && !loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                  <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={(e, page) => setCurrentPage(page)}
                    color="primary"
                    size="large"
                    sx={{
                      '& .MuiPaginationItem-root': { borderRadius: 2 }
                    }}
                  />
                </Box>
              )}
            </Grid>
          </Grid>
        </Container>

        {/* Mobile Filter Drawer */}
        <Drawer
          anchor="left"
          open={mobileFilterOpen}
          onClose={() => setMobileFilterOpen(false)}
          PaperProps={{ sx: { width: '85%', maxWidth: 350 } }}
        >
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>Filters</Typography>
            <IconButton onClick={() => setMobileFilterOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Divider />
          <Box sx={{ p: 2, overflow: 'auto' }}>
            <FiltersPanel {...filterProps} />
          </Box>
        </Drawer>

        {/* Job Details Modal */}
        <Dialog
          open={detailsOpen}
          onClose={handleCloseDetails}
          maxWidth="md"
          fullWidth
          fullScreen={isMobile}
          PaperProps={{ sx: { borderRadius: isMobile ? 0 : 3 } }}
        >
          {selectedJob && (
            <>
              <DialogTitle sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid',
                borderColor: 'divider'
              }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>Job Details</Typography>
                <IconButton onClick={handleCloseDetails}>
                  <CloseIcon />
                </IconButton>
              </DialogTitle>
              <DialogContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'flex-start' }}>
                  <Avatar
                    src={selectedJob.employer?.avatar}
                    sx={{ width: 64, height: 64, bgcolor: theme.palette.primary.main }}
                  >
                    {selectedJob.employer?.companyName?.[0]?.toUpperCase() || 'C'}
                  </Avatar>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
                      {selectedJob.title}
                    </Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <BusinessIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                      <Typography variant="body1" color="primary" sx={{ fontWeight: 600 }}>
                        {selectedJob.employer?.companyName || 'Company'}
                      </Typography>
                    </Stack>
                  </Box>
                </Box>

                <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 3, gap: 1 }}>
                  <Chip icon={<LocationOnIcon />} label={selectedJob.location} variant="outlined" />
                  <Chip icon={<WorkIcon />} label={selectedJob.jobType || 'Internship'} color="primary" />
                  <Chip
                    icon={<CurrencyRupeeIcon />}
                    label={selectedJob.stipend ?
                      `₹${selectedJob.stipend.min?.toLocaleString?.()}-${selectedJob.stipend.max?.toLocaleString?.()}/month` :
                      'Competitive'
                    }
                    variant="outlined"
                  />
                </Stack>

                {selectedJob.videoStatus === 'completed' && selectedJob.videoUrl && (
                  <Button
                    fullWidth
                    variant="contained"
                    color="secondary"
                    startIcon={<PlayCircleOutlineIcon />}
                    onClick={() => {
                      setCurrentVideo({
                        videoUrl: selectedJob.videoUrl,
                        videoStatus: selectedJob.videoStatus,
                        title: selectedJob.title
                      });
                      setVideoModalOpen(true);
                    }}
                    sx={{ mb: 3, py: 1.5, borderRadius: 2 }}
                  >
                    Watch Job Overview Video
                  </Button>
                )}

                <Divider sx={{ my: 2 }} />

                {selectedJob.skills?.length > 0 && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>Required Skills</Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 0.5 }}>
                      {selectedJob.skills.map((skill, idx) => (
                        <Chip key={idx} label={skill} sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1) }} />
                      ))}
                    </Stack>
                  </Box>
                )}

                {selectedJob.description && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>Description</Typography>
                    <Typography color="text.secondary" sx={{ lineHeight: 1.8 }}>
                      {selectedJob.description}
                    </Typography>
                  </Box>
                )}

                {selectedJob.responsibilities && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>Responsibilities</Typography>
                    <Typography color="text.secondary" sx={{ lineHeight: 1.8 }}>
                      {selectedJob.responsibilities}
                    </Typography>
                  </Box>
                )}
              </DialogContent>
              <DialogActions sx={{ p: 3, borderTop: '1px solid', borderColor: 'divider' }}>
                <Button variant="outlined" onClick={handleCloseDetails} sx={{ borderRadius: 2 }}>
                  Close
                </Button>
                {appliedJobs.includes(selectedJob._id) ? (
                  <Button
                    variant="contained"
                    disabled
                    startIcon={<CheckCircleIcon />}
                    sx={{
                      borderRadius: 2,
                      '&.Mui-disabled': { bgcolor: theme.palette.success.main, color: '#fff' }
                    }}
                  >
                    Already Applied
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    onClick={() => { handleApplyNow(selectedJob); handleCloseDetails(); }}
                    endIcon={<ArrowForwardIcon />}
                    sx={{ borderRadius: 2 }}
                  >
                    Apply Now
                  </Button>
                )}
              </DialogActions>
            </>
          )}
        </Dialog>

        {/* Video Modal */}
        {currentVideo && (
          <VideoPlayerModal
            open={videoModalOpen}
            onClose={() => setVideoModalOpen(false)}
            videoUrl={currentVideo.videoUrl}
            videoStatus={currentVideo.videoStatus}
            jobTitle={currentVideo.title}
          />
        )}
      </Box>
    </>
  );
};

export default JobsPage;
