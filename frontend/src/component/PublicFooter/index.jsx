import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  IconButton,
  Stack,
  Divider,
  Link,
  useTheme,
  alpha
} from '@mui/material';
import {
  Facebook,
  Instagram,
  LinkedIn,
  Twitter,
  LocationOn,
  Email,
  Phone,
  ArrowForwardIos
} from '@mui/icons-material';

// Styles
const footerStyles = {
  root: {
    bgcolor: '#030712', // Deep Rich Black
    color: '#94A3B8',
    pt: { xs: 8, md: 10 },
    pb: 4,
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '1px',
      background: 'linear-gradient(90deg, transparent, rgba(37, 99, 235, 0.2), transparent)',
    }
  },
  logo: {
    fontSize: 28,
    fontWeight: 900,
    color: '#fff',
    letterSpacing: '-0.5px',
    display: 'flex',
    alignItems: 'center',
    gap: 1,
    mb: 2,
    background: 'linear-gradient(135deg, #fff 0%, #94A3B8 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  columnTitle: {
    color: '#fff',
    fontSize: '1.1rem',
    fontWeight: 700,
    mb: 3,
    position: 'relative',
    '&::after': {
      content: '""',
      position: 'absolute',
      left: 0,
      bottom: -8,
      width: 30,
      height: 2,
      bgcolor: '#2563EB',
      borderRadius: 1
    }
  },
  footerLink: {
    fontSize: '0.95rem',
    color: '#94A3B8',
    textDecoration: 'none',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: 1,
    '&:hover': {
      color: '#fff',
      transform: 'translateX(5px)',
    }
  },
  socialBtn: {
    bgcolor: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    color: '#94A3B8',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
      bgcolor: '#2563EB',
      color: '#fff',
      transform: 'translateY(-5px)',
      boxShadow: '0 10px 20px rgba(37, 99, 235, 0.2)'
    }
  }
};

const PublicFooter = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: 'Company',
      links: [
        { name: 'About Us', path: '/about' },
        { name: 'Careers', path: '/careers' },
        { name: 'Latest Jobs', path: '/internship' }
      ]
    },
    {
      title: 'For Candidates',
      links: [
        { name: 'Browse Internships', path: '/internship' },
        { name: 'Resume Builder', path: '/resume' },
        { name: 'Application Tracking', path: '/dashboard' },
        { name: 'Job Alerts', path: '/alerts' }
      ]
    },
    {
      title: 'For Employers',
      links: [
        { name: 'Post a Job', path: '/register' },
        { name: 'Talent Search', path: '/search' },
        { name: 'Pricing Plans', path: '/pricing' },
        { name: 'Resources', path: '/resources' }
      ]
    }
  ];

  return (
    <Box component="footer" sx={footerStyles.root}>
      <Container maxWidth="lg">
        <Grid container spacing={{ xs: 5, md: 8 }}>
          
          {/* Brand & Description */}
          <Grid item xs={12} md={4}>
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mb: 2,
                '& img': {
                  filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.2)) brightness(1.1)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    filter: 'drop-shadow(0 0 15px rgba(255,255,255,0.4)) brightness(1.2)',
                    transform: 'scale(1.05)'
                  }
                }
              }}
            >
              <Box
                component="img"
                src="/logo.png"
                alt="Logo"
                sx={{
                  height: '40px',
                  width: 'auto'
                }}
              />
            </Box>
            <Typography sx={{ lineHeight: 1.8, mb: 4, maxWidth: 320 }}>
              Leading the way in digital career transformation. We bridge the gap between ambitious students and world-class organizations.
            </Typography>
            <Stack direction="row" spacing={1.5}>
              {[Facebook, Instagram, LinkedIn, Twitter].map((Icon, index) => (
                <IconButton key={index} sx={footerStyles.socialBtn}>
                  <Icon fontSize="small" />
                </IconButton>
              ))}
            </Stack>
          </Grid>

          {/* Dynamic Link Columns */}
          {footerLinks.map((column, idx) => (
            <Grid item xs={6} md={2} key={idx}>
              <Typography sx={footerStyles.columnTitle}>
                {column.title}
              </Typography>
              <Stack spacing={2}>
                {column.links.map((link, linkIdx) => (
                  <Link
                    key={linkIdx}
                    component={RouterLink}
                    to={link.path}
                    sx={footerStyles.footerLink}
                  >
                    {link.name}
                  </Link>
                ))}
              </Stack>
            </Grid>
          ))}

          {/* Newsletter / Contact Info */}
          <Grid item xs={12} md={2}>
            <Typography sx={footerStyles.columnTitle}>
              Contact Us
            </Typography>
            <Stack spacing={2.5}>
              <Box sx={{ display: 'flex', gap: 1.5 }}>
                <Email sx={{ color: '#2563EB', fontSize: 20 }} />
                <Typography variant="body2">hello@internshell.com</Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1.5 }}>
                <Phone sx={{ color: '#2563EB', fontSize: 20 }} />
                <Typography variant="body2">+91 8384935940</Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1.5 }}>
                <LocationOn sx={{ color: '#2563EB', fontSize: 20 }} />
                <Typography variant="body2">Sanganer, Jaipur, RJ</Typography>
              </Box>
            </Stack>
          </Grid>

        </Grid>

        <Divider sx={{ mt: 8, mb: 4, borderColor: 'rgba(255,255,255,0.05)' }} />

        {/* Bottom Bar */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' }, 
          justifyContent: 'space-between', 
          alignItems: 'center',
          gap: 2 
        }}>
          <Typography sx={{ fontSize: '0.85rem' }}>
            © {currentYear} Your Brand. Build with ❤️ for students.
          </Typography>
          
          <Stack direction="row" spacing={4}>
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
              <Link
                key={item}
                href="#"
                sx={{ 
                  fontSize: '0.85rem', 
                  color: '#94A3B8', 
                  textDecoration: 'none',
                  '&:hover': { color: '#fff' }
                }}
              >
                {item}
              </Link>
            ))}
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default PublicFooter;