import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Chip,
  Stack,
  CircularProgress,
  Autocomplete,
  Tooltip,
  IconButton,
  Alert
} from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import RefreshIcon from '@mui/icons-material/Refresh';
import { aiAPI } from 'services/api';
import { debounce } from 'lodash';

const SmartSkillsInput = ({ 
  skills = [], 
  onSkillsChange, 
  jobTitle = '',
  jobDescription = '',
  label = "Skills Required"
}) => {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState(null);
  const [showAiAlert, setShowAiAlert] = useState(false);

  // Debounced function to get AI suggestions
  const debouncedGetSuggestions = useCallback(
    debounce(async (value, context) => {
      if (value.length >= 2 && context.jobTitle) {
        setLoading(true);
        try {
          const response = await aiAPI.getSmartSuggestions('skills', value, context);
          setSuggestions(response.data.suggestions || []);
        } catch (error) {
          console.error('Error getting smart suggestions:', error);
          setSuggestions([]);
        } finally {
          setLoading(false);
        }
      } else {
        setSuggestions([]);
      }
    }, 300),
    []
  );

  // Get comprehensive AI skill suggestions
  const getAiSkillSuggestions = async () => {
    if (!jobTitle) {
      setShowAiAlert(true);
      return;
    }

    setLoading(true);
    try {
      const response = await aiAPI.suggestSkills(jobTitle, jobDescription);
      setAiSuggestions(response.data);
      setShowAiAlert(false);
    } catch (error) {
      console.error('Error getting AI skill suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle input change
  const handleInputChange = (event, newValue) => {
    setInputValue(newValue);
    if (newValue.trim()) {
      debouncedGetSuggestions(newValue, { jobTitle, jobDescription });
    } else {
      setSuggestions([]);
    }
  };

  // Handle skill selection
  const handleSkillSelect = (event, newValue) => {
    if (newValue && !skills.includes(newValue)) {
      onSkillsChange([...skills, newValue]);
      setInputValue('');
      setSuggestions([]);
    }
  };

  // Handle manual skill addition
  const handleAddSkill = () => {
    const skill = inputValue.trim();
    if (skill && !skills.includes(skill)) {
      onSkillsChange([...skills, skill]);
      setInputValue('');
    }
  };

  // Remove skill
  const handleRemoveSkill = (skillToRemove) => {
    onSkillsChange(skills.filter(skill => skill !== skillToRemove));
  };

  // Add AI suggested skill
  const addAiSkill = (skill) => {
    if (!skills.includes(skill)) {
      onSkillsChange([...skills, skill]);
    }
  };

  // Handle key press
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleAddSkill();
    }
  };

  useEffect(() => {
    return () => {
      debouncedGetSuggestions.cancel();
    };
  }, [debouncedGetSuggestions]);

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          {label}
        </Typography>
        <Tooltip title="Get AI-powered skill suggestions based on your job title">
          <IconButton 
            size="small" 
            color="primary" 
            onClick={getAiSkillSuggestions}
            disabled={loading || !jobTitle}
          >
            {loading ? <CircularProgress size={16} /> : <AutoAwesomeIcon />}
          </IconButton>
        </Tooltip>
      </Box>

      {/* Alert for missing job title */}
      {showAiAlert && (
        <Alert severity="info" sx={{ mb: 2 }} onClose={() => setShowAiAlert(false)}>
          Please enter a job title first to get AI-powered skill suggestions
        </Alert>
      )}

      {/* Skill Input with Autocomplete */}
      <Autocomplete
        freeSolo
        inputValue={inputValue}
        onInputChange={handleInputChange}
        onChange={handleSkillSelect}
        options={suggestions}
        loading={loading}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="Type a skill or select from suggestions..."
            fullWidth
            onKeyPress={handleKeyPress}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <React.Fragment>
                  {loading ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </React.Fragment>
              ),
            }}
            sx={{ mb: 2 }}
          />
        )}
        renderOption={(props, option) => (
          <Box component="li" {...props} sx={{ fontSize: '0.875rem' }}>
            {option}
          </Box>
        )}
      />

      <Button 
        variant="outlined" 
        onClick={handleAddSkill} 
        disabled={!inputValue.trim()}
        sx={{ mb: 2, mr: 1 }}
      >
        Add Skill
      </Button>

      {/* Current Skills */}
      {skills.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Selected Skills ({skills.length}):
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
            {skills.map((skill, index) => (
              <Chip
                key={index}
                label={skill}
                onDelete={() => handleRemoveSkill(skill)}
                color="primary"
                size="small"
                sx={{ mb: 1 }}
              />
            ))}
          </Stack>
        </Box>
      )}

      {/* AI Skill Suggestions */}
      {aiSuggestions && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle2" color="primary" gutterBottom>
            🤖 AI Skill Suggestions:
          </Typography>
          
          {aiSuggestions.technicalSkills?.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Technical Skills:
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                {aiSuggestions.technicalSkills.map((skill, index) => (
                  <Chip
                    key={index}
                    label={skill}
                    onClick={() => addAiSkill(skill)}
                    variant={skills.includes(skill) ? "filled" : "outlined"}
                    color="primary"
                    size="small"
                    sx={{ 
                      cursor: 'pointer',
                      '&:hover': { 
                        backgroundColor: skills.includes(skill) ? undefined : 'primary.light',
                        color: skills.includes(skill) ? undefined : 'white'
                      }
                    }}
                  />
                ))}
              </Stack>
            </Box>
          )}

          {aiSuggestions.tools?.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Tools & Technologies:
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                {aiSuggestions.tools.map((tool, index) => (
                  <Chip
                    key={index}
                    label={tool}
                    onClick={() => addAiSkill(tool)}
                    variant={skills.includes(tool) ? "filled" : "outlined"}
                    color="secondary"
                    size="small"
                    sx={{ 
                      cursor: 'pointer',
                      '&:hover': { 
                        backgroundColor: skills.includes(tool) ? undefined : 'secondary.light',
                        color: skills.includes(tool) ? undefined : 'white'
                      }
                    }}
                  />
                ))}
              </Stack>
            </Box>
          )}

          {aiSuggestions.frameworks?.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Frameworks & Libraries:
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                {aiSuggestions.frameworks.map((framework, index) => (
                  <Chip
                    key={index}
                    label={framework}
                    onClick={() => addAiSkill(framework)}
                    variant={skills.includes(framework) ? "filled" : "outlined"}
                    color="info"
                    size="small"
                    sx={{ 
                      cursor: 'pointer',
                      '&:hover': { 
                        backgroundColor: skills.includes(framework) ? undefined : 'info.light',
                        color: skills.includes(framework) ? undefined : 'white'
                      }
                    }}
                  />
                ))}
              </Stack>
            </Box>
          )}

          {aiSuggestions.softSkills?.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Soft Skills:
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                {aiSuggestions.softSkills.map((skill, index) => (
                  <Chip
                    key={index}
                    label={skill}
                    onClick={() => addAiSkill(skill)}
                    variant={skills.includes(skill) ? "filled" : "outlined"}
                    color="success"
                    size="small"
                    sx={{ 
                      cursor: 'pointer',
                      '&:hover': { 
                        backgroundColor: skills.includes(skill) ? undefined : 'success.light',
                        color: skills.includes(skill) ? undefined : 'white'
                      }
                    }}
                  />
                ))}
              </Stack>
            </Box>
          )}

          {aiSuggestions.trending?.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                🔥 Trending Skills:
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                {aiSuggestions.trending.map((skill, index) => (
                  <Chip
                    key={index}
                    label={skill}
                    onClick={() => addAiSkill(skill)}
                    variant={skills.includes(skill) ? "filled" : "outlined"}
                    color="warning"
                    size="small"
                    sx={{ 
                      cursor: 'pointer',
                      '&:hover': { 
                        backgroundColor: skills.includes(skill) ? undefined : 'warning.light',
                        color: skills.includes(skill) ? undefined : 'white'
                      }
                    }}
                  />
                ))}
              </Stack>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default SmartSkillsInput;