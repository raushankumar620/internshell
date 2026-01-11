import React from 'react';
import { Card, CardContent, Box, Typography, useTheme } from '@mui/material';

const ValueCard = ({ icon, title, description }) => {
  const theme = useTheme();
  
  return (
    <Card
      sx={{
        height: '100%',
        boxShadow: theme.shadows[3],
        borderRadius: 3,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: theme.shadows[8]
        }
      }}
    >
      <CardContent sx={{ p: 4, textAlign: 'center' }}>
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
          {icon}
        </Box>
        <Typography variant="h4" sx={{ mb: 2, fontWeight: 600 }}>
          {title}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ValueCard;