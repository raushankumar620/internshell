import React from 'react';
import { Paper, Box, Typography, Avatar, useTheme } from '@mui/material';

const StatCard = ({ icon, value, label, color = 'primary' }) => {
  const theme = useTheme();
  
  return (
    <Paper
      sx={{
        p: 3,
        textAlign: 'center',
        borderRadius: 3,
        boxShadow: theme.shadows[3],
        transition: 'all 0.3s ease',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: theme.shadows[8]
        }
      }}
    >
      <Box sx={{ 
        mb: 2,
        display: 'flex',
        justifyContent: 'center'
      }}>
        <Avatar
          sx={{
            width: 70,
            height: 70,
            bgcolor: theme.palette[color].lighter,
            color: theme.palette[color].main,
            mx: 'auto'
          }}
        >
          {icon}
        </Avatar>
      </Box>
      <Typography 
        variant="h2" 
        sx={{ 
          mb: 1, 
          fontWeight: 700, 
          color: theme.palette[color].main 
        }}
      >
        {value}
      </Typography>
      <Typography 
        variant="h6" 
        color="text.secondary"
        sx={{ mt: 'auto' }}
      >
        {label}
      </Typography>
    </Paper>
  );
};

export default StatCard;