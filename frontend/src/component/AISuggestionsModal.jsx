import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  CircularProgress,
  Alert,
  Chip,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import SkillsIcon from '@mui/icons-material/Code';
import RequirementsIcon from '@mui/icons-material/CheckCircle';
import ResponsibilitiesIcon from '@mui/icons-material/Assignment';
import SalaryIcon from '@mui/icons-material/AttachMoney';
import CategoryIcon from '@mui/icons-material/Category';
import { aiAPI } from 'services/api';

const AISuggestionsModal = ({ 
  open, 
  onClose, 
  jobTitle, 
  onApplySuggestions 
}) => {
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState(null);
  const [error, setError] = useState('');

  const generateSuggestions = async () => {
    if (!jobTitle?.trim()) {
      setError('Please enter a job title first');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await aiAPI.getJobSuggestions(jobTitle);
      setSuggestions(response.data);
    } catch (err) {
      console.error('Error getting AI suggestions:', err);
      setError(err.response?.data?.message || 'Failed to get AI suggestions');
    } finally {
      setLoading(false);
    }
  };

  const handleApplySection = (section, data) => {
    onApplySuggestions(section, data);
  };

  const handleApplyAll = () => {
    onApplySuggestions('all', suggestions);
    onClose();
  };

  React.useEffect(() => {
    if (open && jobTitle) {
      generateSuggestions();
    }
  }, [open, jobTitle]);

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="lg" 
      fullWidth
      PaperProps={{
        sx: { minHeight: '70vh' }
      }}
    >
      <DialogTitle sx={{ 
        bgcolor: 'primary.main', 
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        gap: 1
      }}>
        <AutoAwesomeIcon />
        AI Job Suggestions for "{jobTitle}"
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        {loading ? (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center', 
            justifyContent: 'center',
            minHeight: 400,
            gap: 2
          }}>
            <CircularProgress size={50} />
            <Typography color="text.secondary">
              AI is analyzing your job title and generating smart suggestions...
            </Typography>
          </Box>
        ) : error ? (
          <Box sx={{ p: 3 }}>
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
            <Button 
              variant="contained" 
              onClick={generateSuggestions}
              startIcon={<AutoAwesomeIcon />}
            >
              Try Again
            </Button>
          </Box>
        ) : suggestions ? (
          <Box sx={{ p: 0 }}>
            {/* Enhanced Description */}
            {suggestions.description && (
              <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="h6">📝 Enhanced Job Description</Typography>
                    <Button 
                      size="small" 
                      variant="outlined"
                      onClick={() => handleApplySection('description', suggestions.description)}
                    >
                      Apply
                    </Button>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography sx={{ 
                    p: 2, 
                    bgcolor: 'grey.50', 
                    borderRadius: 1,
                    whiteSpace: 'pre-line'
                  }}>
                    {suggestions.description}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            )}

            {/* Required Skills */}
            {suggestions.requiredSkills?.length > 0 && (
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                    <SkillsIcon color="primary" />
                    <Typography variant="h6">Required Skills ({suggestions.requiredSkills.length})</Typography>
                    <Box sx={{ ml: 'auto' }}>
                      <Button 
                        size="small" 
                        variant="outlined"
                        onClick={() => handleApplySection('skills', suggestions.requiredSkills)}
                      >
                        Apply All
                      </Button>
                    </Box>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                    {suggestions.requiredSkills.map((skill, index) => (
                      <Chip 
                        key={index}
                        label={skill} 
                        color="primary" 
                        variant="outlined"
                        size="small"
                      />
                    ))}
                  </Stack>
                </AccordionDetails>
              </Accordion>
            )}

            {/* Preferred Skills */}
            {suggestions.preferredSkills?.length > 0 && (
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                    <SkillsIcon color="secondary" />
                    <Typography variant="h6">Preferred Skills ({suggestions.preferredSkills.length})</Typography>
                    <Box sx={{ ml: 'auto' }}>
                      <Button 
                        size="small" 
                        variant="outlined"
                        onClick={() => handleApplySection('preferredSkills', suggestions.preferredSkills)}
                      >
                        Apply All
                      </Button>
                    </Box>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                    {suggestions.preferredSkills.map((skill, index) => (
                      <Chip 
                        key={index}
                        label={skill} 
                        color="secondary" 
                        variant="outlined"
                        size="small"
                      />
                    ))}
                  </Stack>
                </AccordionDetails>
              </Accordion>
            )}

            {/* Responsibilities */}
            {suggestions.responsibilities?.length > 0 && (
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                    <ResponsibilitiesIcon color="info" />
                    <Typography variant="h6">Key Responsibilities</Typography>
                    <Box sx={{ ml: 'auto' }}>
                      <Button 
                        size="small" 
                        variant="outlined"
                        onClick={() => handleApplySection('responsibilities', suggestions.responsibilities.join('\n• '))}
                      >
                        Apply
                      </Button>
                    </Box>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <List dense>
                    {suggestions.responsibilities.map((resp, index) => (
                      <ListItem key={index}>
                        <ListItemIcon sx={{ minWidth: 20 }}>
                          <Typography>•</Typography>
                        </ListItemIcon>
                        <ListItemText primary={resp} />
                      </ListItem>
                    ))}
                  </List>
                </AccordionDetails>
              </Accordion>
            )}

            {/* Qualifications */}
            {suggestions.qualifications?.length > 0 && (
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                    <RequirementsIcon color="success" />
                    <Typography variant="h6">Qualifications & Requirements</Typography>
                    <Box sx={{ ml: 'auto' }}>
                      <Button 
                        size="small" 
                        variant="outlined"
                        onClick={() => handleApplySection('requirements', suggestions.qualifications.join('\n• '))}
                      >
                        Apply
                      </Button>
                    </Box>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <List dense>
                    {suggestions.qualifications.map((qual, index) => (
                      <ListItem key={index}>
                        <ListItemIcon sx={{ minWidth: 20 }}>
                          <Typography>•</Typography>
                        </ListItemIcon>
                        <ListItemText primary={qual} />
                      </ListItem>
                    ))}
                  </List>
                </AccordionDetails>
              </Accordion>
            )}

            {/* Salary Information */}
            {suggestions.salaryRange && (
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <SalaryIcon color="warning" />
                    <Typography variant="h6">Suggested Salary Range</Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Box>
                    <Typography variant="body1" gutterBottom>
                      <strong>Range:</strong> ₹{suggestions.salaryRange.min} - ₹{suggestions.salaryRange.max}
                    </Typography>
                    {suggestions.salaryRange.note && (
                      <Typography variant="body2" color="text.secondary">
                        {suggestions.salaryRange.note}
                      </Typography>
                    )}
                  </Box>
                </AccordionDetails>
              </Accordion>
            )}

            {/* Additional Information */}
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CategoryIcon />
                  <Typography variant="h6">Additional Insights</Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {suggestions.experienceLevel && (
                    <Box>
                      <Typography variant="subtitle2" color="primary">
                        Experience Level:
                      </Typography>
                      <Typography>{suggestions.experienceLevel}</Typography>
                    </Box>
                  )}
                  
                  {suggestions.categories?.length > 0 && (
                    <Box>
                      <Typography variant="subtitle2" color="primary">
                        Suggested Categories:
                      </Typography>
                      <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                        {suggestions.categories.map((cat, index) => (
                          <Chip key={index} label={cat} size="small" />
                        ))}
                      </Stack>
                    </Box>
                  )}

                  {suggestions.workMode?.length > 0 && (
                    <Box>
                      <Typography variant="subtitle2" color="primary">
                        Work Modes:
                      </Typography>
                      <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                        {suggestions.workMode.map((mode, index) => (
                          <Chip key={index} label={mode} size="small" color="secondary" />
                        ))}
                      </Stack>
                    </Box>
                  )}

                  {suggestions.duration && (
                    <Box>
                      <Typography variant="subtitle2" color="primary">
                        Suggested Duration:
                      </Typography>
                      <Typography>{suggestions.duration}</Typography>
                    </Box>
                  )}
                </Box>
              </AccordionDetails>
            </Accordion>
          </Box>
        ) : (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="text.secondary">
              Enter a job title and click "Get AI Suggestions" to see AI-powered recommendations
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, bgcolor: 'grey.50' }}>
        <Button onClick={onClose}>
          Close
        </Button>
        {suggestions && (
          <Button 
            variant="contained" 
            onClick={handleApplyAll}
            startIcon={<AutoAwesomeIcon />}
          >
            Apply All Suggestions
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default AISuggestionsModal;