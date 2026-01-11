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
  InputAdornment,
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
  useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WorkIcon from '@mui/icons-material/Work';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import BusinessIcon from '@mui/icons-material/Business';
import FilterListIcon from '@mui/icons-material/FilterList';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import GroupsIcon from '@mui/icons-material/Groups';
import VerifiedIcon from '@mui/icons-material/Verified';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CloseIcon from '@mui/icons-material/Close';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import SchoolIcon from '@mui/icons-material/School';

import PublicNavbar from 'component/PublicNavbar';
import VideoPlayerModal from 'component/VideoPlayerModal';
import { jobAPI, applicationAPI } from 'services/api';

// Modern Full-Width Hero Header
const HeroHeader = ({ totalJobs }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      sx={{
        width: '100%',
        background: `linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)`,
        position: 'relative',
        overflow: 'hidden',
        pt: { xs: 10, md: 12 },
        pb: { xs: 6, md: 8 },
      }}
    >
      {/* Animated Background Elements */}
      <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
        zIndex: 0
      }}>
        {[...Array(6)].map((_, i) => (
          <Box
            key={i}
            component={motion.div}
            animate={{
              y: [0, -30, 0],
              opacity: [0.1, 0.3, 0.1],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              delay: i * 0.5
            }}
            sx={{
              position: 'absolute',
              width: { xs: 80 + i * 20, md: 150 + i * 30 },
              height: { xs: 80 + i * 20, md: 150 + i * 30 },
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.1)',
              top: `${10 + i * 15}%`,
              left: `${5 + i * 15}%`,
            }}
          />
        ))}
      </Box>

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={7}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Chip
                icon={<TrendingUpIcon sx={{ color: '#fff !important' }} />}
                label="🔥 1000+ New Internships Daily"
                sx={{
                  bgcolor: 'rgba(255,255,255,0.2)',
                  color: '#fff',
                  fontWeight: 600,
                  mb: 3,
                  backdropFilter: 'blur(10px)',
                  fontSize: { xs: '0.8rem', md: '0.9rem' },
                  py: 2.5,
                  px: 1
                }}
              />
              <Typography
                variant="h1"
                sx={{
                  color: '#fff',
                  fontWeight: 800,
                  fontSize: { xs: '2rem', sm: '2.5rem', md: '3.5rem', lg: '4rem' },
                  lineHeight: 1.2,
                  mb: 2,
                  textShadow: '0 4px 20px rgba(0,0,0,0.2)'
                }}
              >
                Find Your Dream
                <Box component="span" sx={{
                  background: 'linear-gradient(90deg, #ffd700, #ffb700)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  display: 'inline'
                }}> Internship </Box>
                Today
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  color: 'rgba(255,255,255,0.9)',
                  fontWeight: 400,
                  mb: 4,
                  fontSize: { xs: '1rem', md: '1.25rem' },
                  maxWidth: 600
                }}
              >
                Explore thousands of opportunities from top companies and kickstart your career
              </Typography>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Stack direction="row" spacing={{ xs: 2, md: 4 }} flexWrap="wrap" sx={{ gap: 2 }}>
                {[
                  { icon: <WorkIcon />, value: totalJobs || '5000+', label: 'Active Jobs' },
                  { icon: <BusinessIcon />, value: '500+', label: 'Companies' },
                  { icon: <GroupsIcon />, value: '10K+', label: 'Students Placed' }
                ].map((stat, idx) => (
                  <Box key={idx} sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    bgcolor: 'rgba(255,255,255,0.15)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: 3,
                    px: { xs: 2, md: 3 },
                    py: 1.5
                  }}>
                    <Box sx={{ color: '#ffd700' }}>{stat.icon}</Box>
                    <Box>
                      <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: { xs: '1.1rem', md: '1.3rem' } }}>
                        {stat.value}
                      </Typography>
                      <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.75rem' }}>
                        {stat.label}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Stack>
            </motion.div>
          </Grid>

          {!isMobile && (
            <Grid item md={5}>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Box sx={{
                  position: 'relative',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  minHeight: 300
                }}>
                  {/* Floating Cards */}
                  {[
                    { top: '0%', left: '10%', delay: 0, icon: <HomeWorkIcon />, text: 'Work From Home' },
                    { top: '30%', right: '0%', delay: 0.2, icon: <SchoolIcon />, text: 'Learn & Earn' },
                    { bottom: '10%', left: '20%', delay: 0.4, icon: <VerifiedIcon />, text: 'Certificate' }
                  ].map((card, idx) => (
                    <Paper
                      key={idx}
                      component={motion.div}
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 3, repeat: Infinity, delay: card.delay }}
                      elevation={8}
                      sx={{
                        position: 'absolute',
                        top: card.top,
                        left: card.left,
                        right: card.right,
                        bottom: card.bottom,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        px: 2.5,
                        py: 1.5,
                        borderRadius: 3,
                        bgcolor: 'rgba(255,255,255,0.95)',
                        backdropFilter: 'blur(10px)'
                      }}
                    >
                      <Box sx={{ color: theme.palette.primary.main }}>{card.icon}</Box>
                      <Typography sx={{ fontWeight: 600, fontSize: '0.9rem' }}>{card.text}</Typography>
                    </Paper>
                  ))}
                </Box>
              </motion.div>
            </Grid>
          )}
        </Grid>
      </Container>
    </Box>
  );
};

// Modern Search Bar Component
const SearchFilters = ({
  searchQuery, setSearchQuery,
  locationFilter, setLocationFilter,
  jobType, setJobType,
  experience, setExperience,
  salaryRange, setSalaryRange,
  onClearFilters, onApplyFilters
}) => {
  const theme = useTheme();
  const [showMoreFilters, setShowMoreFilters] = useState(false);

  return (
    <Paper
      component={motion.div}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      elevation={4}
      sx={{
        p: { xs: 2, md: 3 },
        borderRadius: 4,
        mt: -5,
        position: 'relative',
        zIndex: 10,
        background: 'rgba(255,255,255,0.98)',
        backdropFilter: 'blur(20px)',
        border: '1px solid',
        borderColor: alpha(theme.palette.primary.main, 0.1)
      }}
    >
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            placeholder="🔍 Job title, skills, or company..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                bgcolor: alpha(theme.palette.primary.main, 0.04),
                '&:hover': {
                  bgcolor: alpha(theme.palette.primary.main, 0.08)
                }
              }
            }}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            placeholder="📍 Location..."
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                bgcolor: alpha(theme.palette.primary.main, 0.04)
              }
            }}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <FormControl fullWidth>
            <Select
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
              displayEmpty
              sx={{
                borderRadius: 3,
                bgcolor: alpha(theme.palette.primary.main, 0.04)
              }}
            >
              <MenuItem value="">🎯 All Job Types</MenuItem>
              <MenuItem value="Full-time">Full-time</MenuItem>
              <MenuItem value="Part-time">Part-time</MenuItem>
              <MenuItem value="Internship">Internship</MenuItem>
              <MenuItem value="Contract">Contract</MenuItem>
              <MenuItem value="Remote">Work From Home</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={2}>
          <Button
            fullWidth
            variant="contained"
            size="large"
            startIcon={<SearchIcon />}
            onClick={onApplyFilters}
            sx={{
              py: 1.8,
              borderRadius: 3,
              fontWeight: 600,
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              boxShadow: `0 4px 15px ${alpha(theme.palette.primary.main, 0.4)}`
            }}
          >
            Search
          </Button>
        </Grid>
      </Grid>

      {/* More Filters Toggle */}
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
        <Button
          variant="text"
          onClick={() => setShowMoreFilters(!showMoreFilters)}
          endIcon={<FilterListIcon />}
          sx={{ textTransform: 'none' }}
        >
          {showMoreFilters ? 'Hide Filters' : 'More Filters'}
        </Button>
      </Box>

      {/* Additional Filters */}
      <AnimatePresence>
        {showMoreFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Experience Level</InputLabel>
                  <Select
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    label="Experience Level"
                    sx={{ borderRadius: 3 }}
                  >
                    <MenuItem value="">Any Experience</MenuItem>
                    <MenuItem value="Entry Level">Fresher / Entry Level</MenuItem>
                    <MenuItem value="Mid Level">1-3 Years</MenuItem>
                    <MenuItem value="Senior Level">3+ Years</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Stipend Range</InputLabel>
                  <Select
                    value={salaryRange}
                    onChange={(e) => setSalaryRange(e.target.value)}
                    label="Stipend Range"
                    sx={{ borderRadius: 3 }}
                  >
                    <MenuItem value="">Any Stipend</MenuItem>
                    <MenuItem value="0-5000">Up to ₹5,000/month</MenuItem>
                    <MenuItem value="5000-10000">₹5,000 - ₹10,000/month</MenuItem>
                    <MenuItem value="10000-20000">₹10,000 - ₹20,000/month</MenuItem>
                    <MenuItem value="20000+">₹20,000+/month</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={onClearFilters}
                  sx={{
                    py: 1.8,
                    borderRadius: 3,
                    fontWeight: 600
                  }}
                >
                  Clear All Filters
                </Button>
              </Grid>
            </Grid>
          </motion.div>
        )}
      </AnimatePresence>
    </Paper>
  );
};

// Modern Job Card Component
const ModernJobCard = ({ job, onSaveJob, onViewDetails, onApplyNow, savedJobs = [], appliedJobs = [], index }) => {
  const theme = useTheme();
  const isAlreadyApplied = appliedJobs.includes(job._id);
  const isSaved = savedJobs.includes(job._id);

  return (
    <Card
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(0,0,0,0.12)' }}
      sx={{
        borderRadius: 4,
        overflow: 'hidden',
        border: '1px solid',
        borderColor: alpha(theme.palette.divider, 0.1),
        transition: 'all 0.3s ease',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
        }
      }}
    >
      <CardContent sx={{ p: { xs: 2.5, md: 3 }, flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', flex: 1 }}>
            <Avatar
              src={job.employer?.avatar}
              sx={{
                width: 56,
                height: 56,
                bgcolor: theme.palette.primary.main,
                fontSize: '1.3rem',
                fontWeight: 700,
                boxShadow: '0 4px 14px rgba(0,0,0,0.1)'
              }}
            >
              {job.employer?.companyName?.[0]?.toUpperCase() || 'C'}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: '1.1rem', md: '1.25rem' },
                  mb: 0.5,
                  color: theme.palette.text.primary,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}
              >
                {job.title}
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                <BusinessIcon sx={{ fontSize: 16, color: theme.palette.primary.main }} />
                <Typography
                  variant="body2"
                  sx={{
                    color: theme.palette.primary.main,
                    fontWeight: 600
                  }}
                >
                  {job.employer?.companyName || job.company || 'Company'}
                </Typography>
                {job.employer?.verified && (
                  <VerifiedIcon sx={{ fontSize: 16, color: theme.palette.info.main }} />
                )}
              </Stack>
            </Box>
          </Box>
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              onSaveJob(job._id);
            }}
            sx={{
              bgcolor: isSaved ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
              '&:hover': {
                bgcolor: alpha(theme.palette.primary.main, 0.15)
              }
            }}
          >
            {isSaved ? (
              <BookmarkIcon sx={{ color: theme.palette.primary.main }} />
            ) : (
              <BookmarkBorderIcon />
            )}
          </IconButton>
        </Box>

        {/* Tags */}
        <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2, gap: 0.5 }}>
          <Chip
            size="small"
            icon={<LocationOnIcon sx={{ fontSize: '1rem !important' }} />}
            label={job.location || 'India'}
            sx={{
              bgcolor: alpha(theme.palette.info.main, 0.1),
              color: theme.palette.info.dark,
              fontWeight: 500,
              '& .MuiChip-icon': { color: theme.palette.info.main }
            }}
          />
          <Chip
            size="small"
            icon={<WorkIcon sx={{ fontSize: '1rem !important' }} />}
            label={job.jobType || 'Internship'}
            sx={{
              bgcolor: alpha(theme.palette.success.main, 0.1),
              color: theme.palette.success.dark,
              fontWeight: 500,
              '& .MuiChip-icon': { color: theme.palette.success.main }
            }}
          />
          <Chip
            size="small"
            icon={<CurrencyRupeeIcon sx={{ fontSize: '1rem !important' }} />}
            label={job.stipend ?
              `₹${job.stipend.min?.toLocaleString?.('en-IN') || job.stipend.min} - ₹${job.stipend.max?.toLocaleString?.('en-IN') || job.stipend.max}/month` :
              (job.salary || 'Competitive')
            }
            sx={{
              bgcolor: alpha(theme.palette.warning.main, 0.1),
              color: theme.palette.warning.dark,
              fontWeight: 500,
              '& .MuiChip-icon': { color: theme.palette.warning.main }
            }}
          />
        </Stack>

        {/* Skills */}
        {job.skills && job.skills.length > 0 && (
          <Box sx={{ mb: 2, flex: 1 }}>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block', fontWeight: 600 }}>
              Required Skills:
            </Typography>
            <Stack direction="row" spacing={0.5} flexWrap="wrap" sx={{ gap: 0.5 }}>
              {job.skills.slice(0, 4).map((skill, idx) => (
                <Chip
                  key={idx}
                  label={skill}
                  size="small"
                  sx={{
                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                    color: theme.palette.primary.dark,
                    fontSize: '0.75rem',
                    height: 26
                  }}
                />
              ))}
              {job.skills.length > 4 && (
                <Chip
                  label={`+${job.skills.length - 4} more`}
                  size="small"
                  sx={{
                    bgcolor: alpha(theme.palette.grey[500], 0.1),
                    color: theme.palette.text.secondary,
                    fontSize: '0.75rem',
                    height: 26
                  }}
                />
              )}
            </Stack>
          </Box>
        )}

        {/* Footer */}
        <Box sx={{ mt: 'auto', pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack direction="row" spacing={1} alignItems="center">
              <AccessTimeIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary">
                {job.createdAt ?
                  new Date(job.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) :
                  'Recently'
                }
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1}>
              <Button
                size="small"
                variant="outlined"
                onClick={(e) => {
                  e.stopPropagation();
                  onViewDetails(job);
                }}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600
                }}
              >
                Details
              </Button>
              {isAlreadyApplied ? (
                <Button
                  size="small"
                  variant="contained"
                  disabled
                  startIcon={<CheckCircleIcon />}
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    '&.Mui-disabled': {
                      bgcolor: theme.palette.success.main,
                      color: '#fff'
                    }
                  }}
                >
                  Applied
                </Button>
              ) : (
                <Button
                  size="small"
                  variant="contained"
                  onClick={(e) => {
                    e.stopPropagation();
                    onApplyNow(job);
                  }}
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                    '&:hover': {
                      background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`
                    }
                  }}
                >
                  Apply
                </Button>
              )}
            </Stack>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
};

// Loading Skeleton for Job Cards
const JobCardSkeleton = () => {
  return (
    <Card sx={{ borderRadius: 4, p: 3 }}>
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <Skeleton variant="circular" width={56} height={56} />
        <Box sx={{ flex: 1 }}>
          <Skeleton variant="text" width="70%" height={28} />
          <Skeleton variant="text" width="40%" height={20} />
        </Box>
      </Box>
      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
        <Skeleton variant="rounded" width={80} height={24} />
        <Skeleton variant="rounded" width={80} height={24} />
        <Skeleton variant="rounded" width={100} height={24} />
      </Stack>
      <Skeleton variant="text" width="100%" height={20} />
      <Skeleton variant="text" width="60%" height={20} />
    </Card>
  );
};

const JobsPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [jobType, setJobType] = useState('');
  const [savedinternship, setSavedinternship] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedJob, setSelectedJob] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const jobsPerPage = 9;
  const [internship, setinternship] = useState([]);
  const [totalinternship, setTotalinternship] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // New state for filters
  const [experience, setExperience] = useState('');
  const [salaryRange, setSalaryRange] = useState('');

  // Video player state
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(null);

  // Applied jobs state
  const [appliedJobs, setAppliedJobs] = useState([]);

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

  // Initialize filters from URL parameters
  useEffect(() => {
    const type = searchParams.get('type');
    if (type === 'wfh') {
      setJobType('remote');
      setLocationFilter('Work From Home');
    } else if (type === 'office') {
      setJobType('full-time');
      setLocationFilter('');
    }
  }, []);

  // Fetch applied jobs for logged in user
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

  // Fetch jobs from backend
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
          jobType,
          experience,
          salaryRange
        };
        Object.keys(params).forEach(key => {
          if (!params[key]) delete params[key];
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
  }, [searchQuery, locationFilter, jobType, experience, salaryRange, currentPage]);

  const totalPages = Math.ceil(totalinternship / jobsPerPage);

  // Clear all filters
  const handleClearFilters = () => {
    setSearchQuery('');
    setLocationFilter('');
    setJobType('');
    setExperience('');
    setSalaryRange('');
    setCurrentPage(1);
  };

  return (
    <>
      <PublicNavbar />
      <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc' }}>
        {/* Full Width Hero Header */}
        <HeroHeader totalJobs={totalinternship} />

        {/* Main Content */}
        <Container maxWidth="xl" sx={{ py: 4 }}>
          {/* Search & Filters */}
          <SearchFilters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            locationFilter={locationFilter}
            setLocationFilter={setLocationFilter}
            jobType={jobType}
            setJobType={setJobType}
            experience={experience}
            setExperience={setExperience}
            salaryRange={salaryRange}
            setSalaryRange={setSalaryRange}
            onClearFilters={handleClearFilters}
            onApplyFilters={() => setCurrentPage(1)}
          />

          {/* Results Count */}
          <Box sx={{ my: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            {error ? (
              <Alert severity="error" sx={{ width: '100%', borderRadius: 3 }}>
                {error}
              </Alert>
            ) : (
              <>
                <Typography variant="h5" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
                  {loading ? 'Searching...' : `${totalinternship} Internships Found`}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Showing page {currentPage} of {totalPages || 1}
                </Typography>
              </>
            )}
          </Box>

          {/* Job Listings Grid */}
          {loading ? (
            <Grid container spacing={3}>
              {[...Array(6)].map((_, idx) => (
                <Grid item xs={12} sm={6} lg={4} key={idx}>
                  <JobCardSkeleton />
                </Grid>
              ))}
            </Grid>
          ) : !error && (
            <Grid container spacing={3}>
              {internship.length > 0 ? (
                internship.map((job, index) => (
                  <Grid item xs={12} sm={6} lg={4} key={job._id}>
                    <ModernJobCard
                      job={job}
                      index={index}
                      savedJobs={savedinternship}
                      onSaveJob={handleSaveJob}
                      onViewDetails={handleOpenDetails}
                      onApplyNow={handleApplyNow}
                      appliedJobs={appliedJobs}
                    />
                  </Grid>
                ))
              ) : (
                <Grid item xs={12}>
                  <Box
                    component={motion.div}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    sx={{
                      textAlign: 'center',
                      py: 8,
                      px: 3,
                      bgcolor: 'white',
                      borderRadius: 4,
                      boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
                    }}
                  >
                    <Box
                      sx={{
                        width: 120,
                        height: 120,
                        borderRadius: '50%',
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 3
                      }}
                    >
                      <SearchIcon sx={{ fontSize: 60, color: theme.palette.primary.main }} />
                    </Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
                      No Jobs Found
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 400, mx: 'auto' }}>
                      We couldn't find any jobs matching your criteria. Try adjusting your filters or search query.
                    </Typography>
                    <Button
                      variant="contained"
                      onClick={handleClearFilters}
                      sx={{
                        borderRadius: 3,
                        px: 4,
                        py: 1.5,
                        textTransform: 'none',
                        fontWeight: 600
                      }}
                    >
                      Clear All Filters
                    </Button>
                  </Box>
                </Grid>
              )}
            </Grid>
          )}

          {/* Pagination */}
          {totalPages > 1 && !loading && !error && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={(e, page) => setCurrentPage(page)}
                color="primary"
                size={isMobile ? 'medium' : 'large'}
                sx={{
                  '& .MuiPaginationItem-root': {
                    borderRadius: 2,
                    fontWeight: 600
                  }
                }}
              />
            </Box>
          )}
        </Container>

        {/* Job Details Modal */}
        <Dialog
          open={detailsOpen}
          onClose={handleCloseDetails}
          maxWidth="md"
          fullWidth
          fullScreen={isMobile}
          PaperProps={{
            sx: {
              borderRadius: isMobile ? 0 : 4,
              m: isMobile ? 0 : 2
            }
          }}
        >
          {selectedJob && (
            <>
              <DialogTitle sx={{
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                color: '#fff',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>Job Details</Typography>
                <IconButton onClick={handleCloseDetails} sx={{ color: '#fff' }}>
                  <CloseIcon />
                </IconButton>
              </DialogTitle>
              <DialogContent sx={{ p: { xs: 2, md: 4 }, mt: 2 }}>
                <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'flex-start' }}>
                  <Avatar
                    src={selectedJob.employer?.avatar}
                    sx={{
                      width: 72,
                      height: 72,
                      bgcolor: theme.palette.primary.main,
                      fontSize: '1.5rem'
                    }}
                  >
                    {selectedJob.employer?.companyName?.[0]?.toUpperCase() || 'C'}
                  </Avatar>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, fontSize: { xs: '1.5rem', md: '2rem' } }}>
                      {selectedJob.title}
                    </Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <BusinessIcon sx={{ color: theme.palette.primary.main }} />
                      <Typography variant="h6" color="primary" sx={{ fontWeight: 600 }}>
                        {selectedJob.employer?.companyName || selectedJob.company || 'Company'}
                      </Typography>
                    </Stack>
                  </Box>
                </Box>

                <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 3, gap: 1 }}>
                  <Chip icon={<LocationOnIcon />} label={selectedJob.location} variant="outlined" />
                  <Chip icon={<WorkIcon />} label={selectedJob.jobType || 'N/A'} color="primary" />
                  <Chip
                    icon={<CurrencyRupeeIcon />}
                    label={selectedJob.stipend ?
                      `₹${selectedJob.stipend.min?.toLocaleString?.() || selectedJob.stipend.min}-${selectedJob.stipend.max?.toLocaleString?.() || selectedJob.stipend.max}` :
                      (selectedJob.salary || 'Not specified')
                    }
                    variant="outlined"
                  />
                </Stack>

                {/* Watch Video Button */}
                {selectedJob.videoStatus === 'completed' && selectedJob.videoUrl && (
                  <Button
                    fullWidth
                    variant="contained"
                    color="secondary"
                    size="large"
                    startIcon={<PlayCircleOutlineIcon />}
                    onClick={() => {
                      setCurrentVideo({
                        videoUrl: selectedJob.videoUrl,
                        videoStatus: selectedJob.videoStatus,
                        title: selectedJob.title
                      });
                      setVideoModalOpen(true);
                    }}
                    sx={{
                      py: 1.5,
                      mb: 3,
                      borderRadius: 3,
                      fontWeight: 600,
                      textTransform: 'none'
                    }}
                  >
                    🎬 Watch Job Overview Video
                  </Button>
                )}

                <Divider sx={{ my: 2 }} />

                {selectedJob.skills && selectedJob.skills.length > 0 && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1.5 }}>
                      Required Skills
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 0.5 }}>
                      {selectedJob.skills.map((skill, idx) => (
                        <Chip
                          key={idx}
                          label={skill}
                          sx={{
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            color: theme.palette.primary.main
                          }}
                        />
                      ))}
                    </Stack>
                  </Box>
                )}

                {selectedJob.description && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1.5 }}>
                      Description
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                      {selectedJob.description}
                    </Typography>
                  </Box>
                )}

                {selectedJob.responsibilities && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1.5 }}>
                      Responsibilities
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                      {selectedJob.responsibilities}
                    </Typography>
                  </Box>
                )}

                <Typography variant="body2" color="text.secondary">
                  📅 Posted: {selectedJob.createdAt ?
                    new Date(selectedJob.createdAt).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }) : 'N/A'}
                </Typography>
              </DialogContent>
              <DialogActions sx={{ p: 3, gap: 2 }}>
                <Button
                  variant="outlined"
                  onClick={handleCloseDetails}
                  sx={{ borderRadius: 3, px: 4 }}
                >
                  Close
                </Button>
                {appliedJobs.includes(selectedJob._id) ? (
                  <Button
                    variant="contained"
                    disabled
                    startIcon={<CheckCircleIcon />}
                    sx={{
                      borderRadius: 3,
                      px: 4,
                      '&.Mui-disabled': {
                        bgcolor: theme.palette.success.main,
                        color: '#fff'
                      }
                    }}
                  >
                    Already Applied
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    onClick={() => {
                      handleApplyNow(selectedJob);
                      handleCloseDetails();
                    }}
                    endIcon={<ArrowForwardIcon />}
                    sx={{
                      borderRadius: 3,
                      px: 4,
                      background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`
                    }}
                  >
                    Apply Now
                  </Button>
                )}
              </DialogActions>
            </>
          )}
        </Dialog>

        {/* Video Player Modal */}
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