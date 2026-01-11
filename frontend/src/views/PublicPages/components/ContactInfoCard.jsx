import React from 'react';
import { Paper, Box, Typography, useTheme } from '@mui/material';

const ContactInfoCard = ({ icon, title, details, subdetails }) => {
  const theme = useTheme();
  
  return (
    <Paper
      sx={{
        p: 4,
        textAlign: 'center',
        borderRadius: 3,
        boxShadow: theme.shadows[3],
        height: '100%',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: theme.shadows[8]
        }
      }}
    >
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
        {icon}
      </Box>
      <Typography variant="h5" sx={{ mb: 1, fontWeight: 600 }}>
        {title}
      </Typography>
      <Typography variant="body1" color="text.primary" sx={{ mb: 0.5 }}>
        {details}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {subdetails}
      </Typography>
    </Paper>
  );
};

export default ContactInfoCard;