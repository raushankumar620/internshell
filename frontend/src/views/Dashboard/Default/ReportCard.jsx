import React from 'react';
import PropTypes from 'prop-types';

// material-ui
import { Card, CardContent, Grid, Typography, Box } from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';

// ==============================|| REPORT CARD ||============================== //

const ReportCard = ({ primary, secondary, iconPrimary, color }) => {
  const theme = useTheme();
  const IconPrimary = iconPrimary;
  const primaryIcon = iconPrimary ? <IconPrimary fontSize="large" /> : null;

  return (
    <Card
      sx={{
        background: color ? `linear-gradient(135deg, ${color} 0%, ${alpha(color, 0.8)} 100%)` : theme.palette.primary.main,
        position: 'relative',
        color: '#fff',
        overflow: 'hidden',
        borderRadius: 3,
        boxShadow: color ? `0 4px 20px ${alpha(color, 0.3)}` : theme.shadows[4],
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: color ? `0 8px 30px ${alpha(color, 0.4)}` : theme.shadows[8],
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: -40,
          right: -40,
          width: 100,
          height: 100,
          borderRadius: '50%',
          background: alpha('#fff', 0.1),
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: -30,
          left: -30,
          width: 80,
          height: 80,
          borderRadius: '50%',
          background: alpha('#fff', 0.08),
        },
      }}
    >
      <CardContent sx={{ position: 'relative', zIndex: 1 }}>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography variant="h3" sx={{ color: '#fff', fontWeight: 700, mb: 0.5 }}>
              {primary}
            </Typography>
            <Typography variant="subtitle1" sx={{ color: alpha('#fff', 0.9), fontWeight: 500 }}>
              {secondary}
            </Typography>
          </Grid>
          <Grid item>
            <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
                bgcolor: alpha('#fff', 0.2),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {primaryIcon}
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

ReportCard.propTypes = {
  primary: PropTypes.string,
  secondary: PropTypes.string,
  iconPrimary: PropTypes.elementType,
  color: PropTypes.string,
};

export default ReportCard;
