import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Stack,
  Button,
  Avatar,
  Fade,
  Slide,
  Grow
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import PublicNavbar from 'component/PublicNavbar';
import PublicFooter from 'component/PublicFooter';
import WorkIcon from '@mui/icons-material/Work';
import PeopleIcon from '@mui/icons-material/People';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import VerifiedIcon from '@mui/icons-material/Verified';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import GroupsIcon from '@mui/icons-material/Groups';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ConnectWithoutContactIcon from '@mui/icons-material/ConnectWithoutContact';

// Shared Components
import TypingAnimation from 'component/TypingAnimation';
import PageHeader from '../components/PageHeader';
import { useImageService } from '../../../services/imageService';

const AboutPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [inView, setInView] = useState({});
  
  // Use shared image service
  const { images } = useImageService();
  const aboutImages = images.about || [];
  const heroImages = images.hero || [];
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(prev => ({
              ...prev,
              [entry.target.id]: true
            }));
          }
        });
      },
      { threshold: 0.1 }
    );

    // Observe all sections
    const sections = document.querySelectorAll('[data-section]');
    sections.forEach(section => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const stats = [
    { 
      icon: <WorkIcon sx={{ fontSize: { xs: 35, md: 40 } }} />, 
      value: '10,000+', 
      label: 'Active Jobs',
      description: 'Verified opportunities across industries'
    },
    { 
      icon: <PeopleIcon sx={{ fontSize: { xs: 35, md: 40 } }} />, 
      value: '50,000+', 
      label: 'Job Seekers',
      description: 'Talented professionals registered'
    },
    { 
      icon: <TrendingUpIcon sx={{ fontSize: { xs: 35, md: 40 } }} />, 
      value: '5,000+', 
      label: 'Companies',
      description: 'Trusted employers partnered with us'
    },
    { 
      icon: <VerifiedIcon sx={{ fontSize: { xs: 35, md: 40 } }} />, 
      value: '95%', 
      label: 'Success Rate',
      description: 'Successful job placements achieved'
    }
  ];

  const values = [
    {
      icon: <EmojiEventsIcon sx={{ fontSize: { xs: 45, md: 55 } }} />,
      title: 'Excellence',
      description: 'We strive for excellence in connecting talent with opportunities, ensuring quality matches that benefit both parties.'
    },
    {
      icon: <ConnectWithoutContactIcon sx={{ fontSize: { xs: 45, md: 55 } }} />,
      title: 'Connection',
      description: 'Building meaningful connections between talented individuals and innovative companies for mutual growth.'
    },
    {
      icon: <AutoAwesomeIcon sx={{ fontSize: { xs: 45, md: 55 } }} />,
      title: 'Innovation',
      description: 'Constantly evolving our platform with cutting-edge technology to provide the best user experience.'
    }
  ];

  const teamMembers = [
    {
      name: 'Visionary Leadership',
      role: 'Guiding Innovation',
      image: aboutImages[0]?.url || '/home4.png'
    },
    {
      name: 'Expert Development',
      role: 'Technical Excellence',
      image: aboutImages[1]?.url || '/home3.png'
    },
    {
      name: 'Strategic Planning',
      role: 'Future Growth',
      image: aboutImages[2]?.url || '/home2.png'
    }
  ];

  return (
    <>
      <PublicNavbar />
      
      {/* Page Header */}
      <PageHeader
        title="About InternShell"
        subtitle="Connecting talented professionals with innovative companies. We believe that finding the right job should be simple, transparent, and rewarding."
        center={true}
        badge="Our Story"
      />

      {/* Hero Image Section */}
      <Box
        sx={{
          background: theme.palette.background.default,
          position: 'relative',
          overflow: 'hidden',
          py: { xs: 4, md: 6 }
        }}
      >
        <Container maxWidth="lg">
          <Fade in={true} timeout={1000}>
            <Box
              sx={{
                position: 'relative',
                height: { xs: 250, sm: 350, md: 450 },
                borderRadius: 4,
                overflow: 'hidden',
                boxShadow: theme.shadows[10],
                mx: 'auto',
                maxWidth: 900,
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}20, transparent)`,
                  zIndex: 1
                }
              }}
            >
              <Box
                component="img"
                src="/home4.png"
                alt="About Internshell"
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.5s ease',
                  '&:hover': {
                    transform: 'scale(1.05)'
                  }
                }}
              />
            </Box>
          </Fade>
        </Container>
      </Box>

      {/* Statistics Section */}
      <Box
        id="stats-section"
        data-section
        sx={{
          py: { xs: 8, md: 12 },
          background: theme.palette.grey[50] || '#fafafa'
        }}
      >
        <Container maxWidth="lg">
          <Fade in={inView['stats-section']} timeout={800}>
            <Box sx={{ textAlign: 'center', mb: 6 }}>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  color: theme.palette.text.primary
                }}
              >
                Our Impact in Numbers
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Building success stories across the industry
              </Typography>
            </Box>
          </Fade>

          <Grid container spacing={4}>
            {stats.map((stat, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Grow in={inView['stats-section']} timeout={800 + index * 200}>
                  <Card
                    sx={{
                      p: 4,
                      textAlign: 'center',
                      height: '100%',
                      background: 'white',
                      borderRadius: 3,
                      boxShadow: theme.shadows[2],
                      border: `1px solid ${theme.palette.grey[200]}`,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: theme.shadows[8],
                        borderColor: theme.palette.primary.main
                      }
                    }}
                  >
                    <Box
                      sx={{
                        mb: 2,
                        color: theme.palette.primary.main,
                        display: 'flex',
                        justifyContent: 'center'
                      }}
                    >
                      {stat.icon}
                    </Box>
                    <Typography
                      variant="h3"
                      sx={{
                        fontWeight: 700,
                        mb: 1,
                        color: theme.palette.text.primary
                      }}
                    >
                      {stat.value}
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        mb: 1,
                        color: theme.palette.text.primary
                      }}
                    >
                      {stat.label}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontSize: '0.9rem' }}
                    >
                      {stat.description}
                    </Typography>
                  </Card>
                </Grow>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Our Story Section */}
      <Box
        id="story-section"
        data-section
        sx={{ py: { xs: 8, md: 12 } }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={{ xs: 4, md: 8 }} alignItems="center">
            {/* Left Side - Content */}
            <Grid item xs={12} md={6}>
              <Slide direction="right" in={inView['story-section']} timeout={800}>
                <Box>
                  <Typography
                    variant="h6"
                    sx={{
                      color: theme.palette.primary.main,
                      fontWeight: 600,
                      mb: 2,
                      textTransform: 'uppercase',
                      letterSpacing: 1
                    }}
                  >
                    Our Journey
                  </Typography>
                  
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 700,
                      mb: 3,
                      color: theme.palette.text.primary
                    }}
                  >
                    Our Story of Growth
                  </Typography>

                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ mb: 3, lineHeight: 1.8, fontSize: '1.1rem' }}
                  >
                    Founded in 2024, Internshell started with a simple vision: to revolutionize the way people
                    find jobs and companies discover talent. What began as a small platform has grown into a
                    comprehensive career ecosystem serving thousands of users across India.
                  </Typography>
                  
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ mb: 4, lineHeight: 1.8, fontSize: '1.1rem' }}
                  >
                    Today, we're proud to be one of the leading job portals in the country, helping fresh
                    graduates land their first jobs, experienced professionals find their next career
                    move, and companies discover exceptional talent that drives their growth.
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <RocketLaunchIcon sx={{ color: theme.palette.primary.main, fontSize: 30 }} />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Launching careers, Building futures
                    </Typography>
                  </Box>
                </Box>
              </Slide>
            </Grid>

            {/* Right Side - Image */}
            <Grid item xs={12} md={6}>
              <Slide direction="left" in={inView['story-section']} timeout={800}>
                <Box
                  sx={{
                    position: 'relative',
                    height: { xs: 300, sm: 400, md: 450 },
                    borderRadius: 4,
                    overflow: 'hidden',
                    boxShadow: theme.shadows[8]
                  }}
                >
                  <Box
                    component="img"
                    src="/home3.png"
                    alt="Our Story"
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.5s ease',
                      '&:hover': {
                        transform: 'scale(1.05)'
                      }
                    }}
                  />
                </Box>
              </Slide>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Core Values Section */}
      <Box
        id="values-section"
        data-section
        sx={{
          py: { xs: 8, md: 12 },
          background: theme.palette.grey[50] || '#fafafa'
        }}
      >
        <Container maxWidth="lg">
          <Fade in={inView['values-section']} timeout={800}>
            <Box sx={{ textAlign: 'center', mb: 8 }}>
              <Typography
                variant="h6"
                sx={{
                  color: theme.palette.primary.main,
                  fontWeight: 600,
                  mb: 2,
                  textTransform: 'uppercase',
                  letterSpacing: 1
                }}
              >
                What Drives Us
              </Typography>
              
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 700,
                  mb: 3,
                  color: theme.palette.text.primary
                }}
              >
                Our Core Values
              </Typography>
              
              <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
                The principles that guide our mission to connect talent with opportunity
              </Typography>
            </Box>
          </Fade>

          <Grid container spacing={4}>
            {values.map((value, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Grow in={inView['values-section']} timeout={800 + index * 200}>
                  <Card
                    sx={{
                      p: 4,
                      height: '100%',
                      textAlign: 'center',
                      background: 'white',
                      borderRadius: 3,
                      boxShadow: theme.shadows[2],
                      border: `1px solid ${theme.palette.grey[200]}`,
                      transition: 'all 0.4s ease',
                      '&:hover': {
                        transform: 'translateY(-12px)',
                        boxShadow: theme.shadows[12],
                        borderColor: theme.palette.primary.main,
                        '& .value-icon': {
                          transform: 'scale(1.1) rotate(5deg)',
                          color: theme.palette.primary.main
                        }
                      }
                    }}
                  >
                    <Box
                      className="value-icon"
                      sx={{
                        mb: 3,
                        color: theme.palette.text.secondary,
                        transition: 'all 0.3s ease',
                        display: 'flex',
                        justifyContent: 'center'
                      }}
                    >
                      {value.icon}
                    </Box>
                    
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 700,
                        mb: 2,
                        color: theme.palette.text.primary
                      }}
                    >
                      {value.title}
                    </Typography>
                    
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      sx={{ lineHeight: 1.7, fontSize: '1rem' }}
                    >
                      {value.description}
                    </Typography>
                  </Card>
                </Grow>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Team Section */}
      <Box
        id="team-section"
        data-section
        sx={{ py: { xs: 8, md: 12 } }}
      >
        <Container maxWidth="lg">
          <Fade in={inView['team-section']} timeout={800}>
            <Box sx={{ textAlign: 'center', mb: 8 }}>
              <Typography
                variant="h6"
                sx={{
                  color: theme.palette.primary.main,
                  fontWeight: 600,
                  mb: 2,
                  textTransform: 'uppercase',
                  letterSpacing: 1
                }}
              >
                Our Team
              </Typography>
              
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 700,
                  mb: 3,
                  color: theme.palette.text.primary
                }}
              >
                Meet the Experts
              </Typography>
              
              <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
                Dedicated professionals working to transform the job market
              </Typography>
            </Box>
          </Fade>

          <Grid container spacing={4} justifyContent="center">
            {teamMembers.map((member, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Grow in={inView['team-section']} timeout={800 + index * 150}>
                  <Card
                    sx={{
                      textAlign: 'center',
                      background: 'white',
                      borderRadius: 3,
                      boxShadow: theme.shadows[2],
                      border: `1px solid ${theme.palette.grey[200]}`,
                      overflow: 'hidden',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: theme.shadows[8],
                        borderColor: theme.palette.primary.main
                      }
                    }}
                  >
                    <Box sx={{ p: 3 }}>
                      <Avatar
                        src={member.image}
                        sx={{
                          width: 120,
                          height: 120,
                          mx: 'auto',
                          mb: 2,
                          border: `4px solid ${theme.palette.primary.main}20`
                        }}
                      />
                      
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                          mb: 1,
                          color: theme.palette.text.primary
                        }}
                      >
                        {member.name}
                      </Typography>
                      
                      <Typography
                        variant="body1"
                        sx={{
                          color: theme.palette.primary.main,
                          fontWeight: 600
                        }}
                      >
                        {member.role}
                      </Typography>
                    </Box>
                  </Card>
                </Grow>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <PublicFooter />
    </>
  );
};

export default AboutPage;