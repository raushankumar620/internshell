import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  Avatar,
  IconButton,
  Stack,
  Box,
  useTheme
} from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WorkIcon from '@mui/icons-material/Work';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const JobCard = ({ job, onSaveJob, onViewDetails, onApplyNow, savedinternship = [], appliedJobs = [] }) => {
  const theme = useTheme();
  const isAlreadyApplied = appliedJobs.includes(job._id);
  
  const handleSaveJob = (e) => {
    e.stopPropagation();
    onSaveJob(job._id);
  };

  const handleViewDetails = (e) => {
    e.stopPropagation();
    onViewDetails(job);
  };

  const handleApplyNow = (e) => {
    e.stopPropagation();
    onApplyNow(job);
  };

  return (
    <Card
      sx={{
        boxShadow: theme.shadows[2],
        borderRadius: 3,
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: theme.shadows[8],
          transform: 'translateY(-4px)'
        }
      }}
    >
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2 
        }}>
          {/* Company Logo and Header Section */}
          <Box sx={{ 
            display: 'flex',
            gap: 2,
            width: '100%'
          }}>
            <Avatar
              src={job.employer?.avatar || null}
              sx={{
                width: { xs: 48, sm: 64 },
                height: { xs: 48, sm: 64 },
                bgcolor: theme.palette.primary.main,
                fontSize: { xs: '1.2rem', sm: '1.5rem' },
                fontWeight: 700,
                flexShrink: 0
              }}
            >
              {job.employer?.companyName?.[0]?.toUpperCase() || job.company?.[0]?.toUpperCase() || 'J'}
            </Avatar>
            
            {/* Job Title and Company */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                <Box sx={{ flex: 1, minWidth: 0, pr: 1 }}>
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      mb: 0.5, 
                      fontWeight: 600,
                      fontSize: { xs: '1.1rem', sm: '1.5rem' },
                      wordBreak: 'break-word'
                    }}
                  >
                    {job.title}
                  </Typography>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1, flexWrap: 'wrap' }}>
                    <BusinessIcon fontSize="small" color="action" />
                    <Typography 
                      variant="subtitle1" 
                      color="primary"
                      sx={{
                        fontSize: { xs: '0.9rem', sm: '1rem' },
                        wordBreak: 'break-word'
                      }}
                    >
                      {job.employer?.companyName || job.company || 'Company'}
                    </Typography>
                  </Stack>
                </Box>
                <IconButton
                  onClick={handleSaveJob}
                  color="primary"
                  sx={{ flexShrink: 0 }}
                >
                  {savedinternship.includes(job._id) ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                </IconButton>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Job Details Section */}
        <Box sx={{ mt: 2 }}>
          <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2, gap: 0.5 }}>
            <Chip
              icon={<LocationOnIcon />}
              label={job.location}
              variant="outlined"
              size="small"
              sx={{ mb: 0.5 }}
            />
            <Chip
              icon={<WorkIcon />}
              label={job.jobType || job.type || 'N/A'}
              color="primary"
              size="small"
              sx={{ mb: 0.5 }}
            />
            <Chip
              icon={<CurrencyRupeeIcon />}
              label={job.stipend ? `₹${job.stipend.min?.toLocaleString?.('en-IN') || job.stipend.min}-${job.stipend.max?.toLocaleString?.('en-IN') || job.stipend.max}` : (job.salary || 'Not specified')}
              variant="outlined"
              size="small"
              sx={{ mb: 0.5 }}
            />
            <Chip
              label={job.experience || 'N/A'}
              variant="outlined"
              size="small"
              sx={{ mb: 0.5 }}
            />
          </Stack>

          <Box sx={{ mb: 2 }}>
            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ 
                mb: 1,
                fontSize: { xs: '0.8rem', sm: '0.875rem' }
              }}
            >
              Required Skills:
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 0.5 }}>
              {(job.skills || []).slice(0, 6).map((skill, index) => (
                <Chip
                  key={index}
                  label={skill}
                  size="small"
                  sx={{
                    bgcolor: theme.palette.primary.lighter,
                    color: theme.palette.primary.main,
                    mb: 0.5,
                    fontSize: { xs: '0.7rem', sm: '0.8125rem' }
                  }}
                />
              ))}
              {job.skills && job.skills.length > 6 && (
                <Chip
                  label={`+${job.skills.length - 6} more`}
                  size="small"
                  sx={{
                    bgcolor: theme.palette.grey[200],
                    color: theme.palette.text.secondary,
                    mb: 0.5,
                    fontSize: { xs: '0.7rem', sm: '0.8125rem' }
                  }}
                />
              )}
            </Stack>
          </Box>

          {/* Posted Date and Action Buttons */}
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between', 
            alignItems: { xs: 'stretch', sm: 'center' },
            gap: { xs: 2, sm: 0 }
          }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: { xs: 0, sm: 0 } }}>
              <AccessTimeIcon fontSize="small" color="action" />
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
              >
                Posted {job.createdAt ? new Date(job.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}
              </Typography>
            </Stack>
            
            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={{ xs: 1, sm: 2 }}
              sx={{ width: { xs: '100%', sm: 'auto' } }}
            >
              <Button 
                variant="outlined" 
                onClick={handleViewDetails}
                sx={{
                  fontSize: { xs: '0.85rem', sm: '0.875rem' },
                  width: { xs: '100%', sm: 'auto' }
                }}
              >
                View Details
              </Button>
              {isAlreadyApplied ? (
                <Button
                  variant="contained"
                  disabled
                  startIcon={<CheckCircleIcon />}
                  sx={{
                    fontSize: { xs: '0.85rem', sm: '0.875rem' },
                    width: { xs: '100%', sm: 'auto' },
                    '&.Mui-disabled': {
                      background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
                      color: '#fff'
                    }
                  }}
                >
                  Already Applied
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleApplyNow}
                  sx={{
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                    fontSize: { xs: '0.85rem', sm: '0.875rem' },
                    width: { xs: '100%', sm: 'auto' }
                  }}
                >
                  Apply Now
                </Button>
              )}
            </Stack>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default JobCard;