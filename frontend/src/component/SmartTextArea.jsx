import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip
} from '@mui/material';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import RefreshIcon from '@mui/icons-material/Refresh';
import { aiAPI } from 'services/api';

const SmartTextArea = ({ 
  value, 
  onChange, 
  label, 
  placeholder, 
  rows = 4,
  jobTitle = '',
  company = '',
  type = 'description', // 'description', 'requirements', 'responsibilities'
  ...textFieldProps
}) => {
  const [loading, setLoading] = useState(false);
  const [enhanced, setEnhanced] = useState('');
  const [showEnhanced, setShowEnhanced] = useState(false);
  const [error, setError] = useState('');

  const enhanceText = async () => {
    if (!value?.trim()) {
      setError('Please enter some text first to enhance');
      return;
    }

    if (!jobTitle?.trim()) {
      setError('Please enter a job title first');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      let enhancedText = '';
      
      if (type === 'description') {
        const response = await aiAPI.enhanceDescription(value, jobTitle, company);
        enhancedText = response.data.enhancedDescription;
      } else {
        // For other types, we can use the general enhancement or create specific endpoints
        const response = await aiAPI.enhanceDescription(value, jobTitle, company);
        enhancedText = response.data.enhancedDescription;
      }
      
      setEnhanced(enhancedText);
      setShowEnhanced(true);
    } catch (err) {
      console.error('Error enhancing text:', err);
      setError(err.response?.data?.message || 'Failed to enhance text');
    } finally {
      setLoading(false);
    }
  };

  const applyEnhancement = () => {
    onChange({ target: { value: enhanced } });
    setShowEnhanced(false);
    setEnhanced('');
  };

  const discardEnhancement = () => {
    setShowEnhanced(false);
    setEnhanced('');
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          {label}
        </Typography>
        <Tooltip title={`AI-enhance this ${type} based on your job title`}>
          <IconButton 
            size="small" 
            color="primary" 
            onClick={enhanceText}
            disabled={loading || !value?.trim() || !jobTitle?.trim()}
          >
            {loading ? <CircularProgress size={16} /> : <AutoFixHighIcon />}
          </IconButton>
        </Tooltip>
      </Box>

      <TextField
        fullWidth
        multiline
        rows={rows}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        {...textFieldProps}
      />

      {error && (
        <Alert severity="error" sx={{ mt: 1 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {showEnhanced && enhanced && (
        <Box sx={{ mt: 2 }}>
          <Alert 
            severity="info" 
            sx={{ mb: 2 }}
            action={
              <Box>
                <Button 
                  color="inherit" 
                  size="small" 
                  onClick={applyEnhancement}
                  sx={{ mr: 1 }}
                >
                  Apply
                </Button>
                <Button 
                  color="inherit" 
                  size="small" 
                  onClick={discardEnhancement}
                >
                  Discard
                </Button>
              </Box>
            }
          >
            AI has enhanced your {type}. Review and apply if you like it!
          </Alert>

          <Box sx={{ 
            p: 2, 
            border: '2px solid', 
            borderColor: 'primary.main',
            borderRadius: 2,
            bgcolor: 'primary.lighter',
            maxHeight: 300,
            overflow: 'auto'
          }}>
            <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
              {enhanced}
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default SmartTextArea;