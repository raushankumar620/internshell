import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Stack,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Switch,
  FormControlLabel,
  Divider,
  Badge,
  Collapse
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import StarIcon from '@mui/icons-material/Star';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import GroupIcon from '@mui/icons-material/Group';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import PublicNavbar from 'component/PublicNavbar';

// Shared Components
import PageHeader from '../components/PageHeader';

// Pricing data
const pricingPlans = {
  monthly: [
    {
      id: 'free',
      name: 'Starter',
      price: 0,
      originalPrice: null,
      period: 'Forever Free',
      description: 'Perfect for individual students starting their internship journey',
      features: [
        'Access to 50+ internship opportunities',
        'Basic profile creation',
        '1 Basic Resume Template',
        'Email notifications',
        'Standard support',
        'Community access'
      ],
      limitations: [
        'Limited to 5 applications per month',
        'Only 1 resume template',
        'No priority support',
        'Basic analytics'
      ],
      buttonText: 'Get Started',
      buttonVariant: 'outlined',
      popular: false,
      icon: <GroupIcon />
    },
    {
      id: 'pro',
      name: 'Professional',
      price: 999,
      originalPrice: 1499,
      period: 'per month',
      description: 'Ideal for serious students who want to maximize their opportunities',
      features: [
        'Unlimited internship applications',
        'Premium profile with portfolio showcase',
        'All 5 Premium Resume Templates',
        'Priority listing in company searches',
        'Advanced analytics and insights',
        'Resume builder and optimization',
        'Interview preparation resources',
        'Direct messaging with recruiters',
        '24/7 priority support',
        'Early access to new opportunities'
      ],
      limitations: [],
      buttonText: 'Start Pro Trial',
      buttonVariant: 'contained',
      popular: true,
      icon: <BusinessCenterIcon />
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 2999,
      originalPrice: 4999,
      period: 'per month',
      description: 'For educational institutions and large groups',
      features: [
        'Everything in Professional',
        'Bulk student account management',
        'Custom branding',
        'Advanced reporting and analytics',
        'Dedicated account manager',
        'API access',
        'Custom integrations',
        'Training and onboarding',
        'White-label solution'
      ],
      limitations: [],
      buttonText: 'Contact Sales',
      buttonVariant: 'contained',
      popular: false,
      icon: <TrendingUpIcon />
    }
  ],
  yearly: [
    {
      id: 'free',
      name: 'Starter',
      price: 0,
      originalPrice: null,
      period: 'Forever Free',
      description: 'Perfect for individual students starting their internship journey',
      features: [
        'Access to 50+ internship opportunities',
        'Basic profile creation',
        '1 Basic Resume Template',
        'Email notifications',
        'Standard support',
        'Community access'
      ],
      limitations: [
        'Limited to 5 applications per month',
        'Only 1 resume template',
        'No priority support',
        'Basic analytics'
      ],
      buttonText: 'Get Started',
      buttonVariant: 'outlined',
      popular: false,
      icon: <GroupIcon />
    },
    {
      id: 'pro',
      name: 'Professional',
      price: 8999,
      originalPrice: 17999,
      period: 'per year',
      description: 'Ideal for serious students who want to maximize their opportunities',
      features: [
        'Unlimited internship applications',
        'Premium profile with portfolio showcase',
        'All 5 Premium Resume Templates',
        'Priority listing in company searches',
        'Advanced analytics and insights',
        'Resume builder and optimization',
        'Interview preparation resources',
        'Direct messaging with recruiters',
        '24/7 priority support',
        'Early access to new opportunities'
      ],
      limitations: [],
      buttonText: 'Start Pro Trial',
      buttonVariant: 'contained',
      popular: true,
      icon: <BusinessCenterIcon />,
      savings: '50% OFF'
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 24999,
      originalPrice: 59999,
      period: 'per year',
      description: 'For educational institutions and large groups',
      features: [
        'Everything in Professional',
        'Bulk student account management',
        'Custom branding',
        'Advanced reporting and analytics',
        'Dedicated account manager',
        'API access',
        'Custom integrations',
        'Training and onboarding',
        'White-label solution'
      ],
      limitations: [],
      buttonText: 'Contact Sales',
      buttonVariant: 'contained',
      popular: false,
      icon: <TrendingUpIcon />,
      savings: '58% OFF'
    }
  ]
};

const PricingCard = ({ plan, index, billingCycle, selectedPlan, setSelectedPlan }) => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);
  
  // Define how many features to show initially
  const maxInitialFeatures = 4;
  const hasMoreFeatures = plan.features.length > maxInitialFeatures;
  const visibleFeatures = expanded ? plan.features : plan.features.slice(0, maxInitialFeatures);
  
  const isSelected = selectedPlan === plan.id;
  
  const handleCardClick = () => {
    setSelectedPlan(isSelected ? null : plan.id);
  };
  
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, delay: index * 0.1 }
    }
  };

  const getCardSx = () => {
    const baseSx = {
      height: '100%',
      minHeight: expanded ? 'auto' : 650, // Dynamic height when expanded
      position: 'relative',
      transition: 'all 0.3s ease',
      borderRadius: 3,
      overflow: 'visible',
      display: 'flex',
      flexDirection: 'column',
      cursor: 'pointer',
      '&:hover': {
        transform: 'translateY(-12px)',
        boxShadow: theme.shadows[20]
      }
    };

    // Selected card styling
    if (isSelected) {
      return {
        ...baseSx,
        border: `3px solid ${theme.palette.primary.main}`,
        boxShadow: `0 0 30px ${theme.palette.primary.main}30`,
        transform: 'scale(1.02)',
        '&:hover': {
          transform: 'scale(1.02) translateY(-8px)',
          boxShadow: theme.shadows[24]
        }
      };
    }

    // Popular card styling (when not selected)
    if (plan.popular && !isSelected) {
      return {
        ...baseSx,
        border: `2px solid ${theme.palette.primary.main}`,
        boxShadow: `0 0 20px ${theme.palette.primary.main}15`,
      };
    }

    return baseSx;
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
    >
      <Card sx={getCardSx()} onClick={handleCardClick}>
        {/* Selected Badge */}
        {isSelected && (
          <Box
            sx={{
              position: 'absolute',
              top: -12,
              right: 20,
              zIndex: 2
            }}
          >
            <Chip
              label="Selected"
              color="primary"
              sx={{
                fontWeight: 700,
                px: 2,
                py: 1,
                bgcolor: theme.palette.primary.main,
                color: 'white',
                '& .MuiChip-label': {
                  color: 'white'
                }
              }}
            />
          </Box>
        )}
        
        {/* Popular Badge */}
        {plan.popular && (
          <Box
            sx={{
              position: 'absolute',
              top: -12,
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 1
            }}
          >
            <Chip
              icon={<StarIcon />}
              label="Most Popular"
              color="primary"
              sx={{
                fontWeight: 700,
                px: 2,
                py: 1,
                '& .MuiChip-icon': {
                  color: 'white'
                }
              }}
            />
          </Box>
        )}

        {/* Savings Badge */}
        {plan.savings && billingCycle === 'yearly' && (
          <Box
            sx={{
              position: 'absolute',
              top: 20,
              right: 20,
              zIndex: 1
            }}
          >
            <Chip
              label={plan.savings}
              color="success"
              sx={{
                fontWeight: 700,
                animation: 'pulse 2s infinite'
              }}
            />
          </Box>
        )}

        <CardContent sx={{ 
          p: 4, 
          pt: plan.popular ? 5 : 4,
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          {/* Top Section */}
          <Box>
            <Stack spacing={3} alignItems="center" textAlign="center">
              {/* Icon */}
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  bgcolor: plan.popular ? 'primary.main' : 'grey.100',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: plan.popular ? 'white' : 'primary.main',
                  fontSize: 40
                }}
              >
                {plan.icon}
              </Box>

              {/* Plan Name */}
              <Typography variant="h4" fontWeight={700} color="text.primary">
                {plan.name}
              </Typography>

              {/* Price */}
              <Box>
                {plan.originalPrice && (
                  <Typography
                    variant="h6"
                    color="text.secondary"
                    sx={{ textDecoration: 'line-through', mb: 1 }}
                  >
                    ₹{plan.originalPrice.toLocaleString()}
                  </Typography>
                )}
                <Stack direction="row" alignItems="baseline" spacing={1} justifyContent="center">
                  <Typography variant="h2" fontWeight={800} color="primary.main">
                    {plan.price === 0 ? 'Free' : `₹${plan.price.toLocaleString()}`}
                  </Typography>
                  {plan.price !== 0 && (
                    <Typography variant="body1" color="text.secondary">
                      {plan.period}
                    </Typography>
                  )}
                </Stack>
                {plan.price === 0 && (
                  <Typography variant="body2" color="text.secondary" mt={1}>
                    {plan.period}
                  </Typography>
                )}
              </Box>

              {/* Description */}
              <Typography variant="body1" color="text.secondary" sx={{ px: 2 }}>
                {plan.description}
              </Typography>
            </Stack>

            <Divider sx={{ my: 3 }} />

            {/* Features */}
            <Box sx={{ minHeight: expanded ? 'auto' : 200 }}> {/* Dynamic height for features section */}
              <List sx={{ py: 0 }}>
                {visibleFeatures.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <ListItem sx={{ px: 0, py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <CheckCircleIcon color="success" sx={{ fontSize: 20 }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary={feature}
                        primaryTypographyProps={{
                          variant: 'body2',
                          fontWeight: 500
                        }}
                      />
                    </ListItem>
                  </motion.div>
                ))}
              </List>

              {/* Additional Features (Collapsed/Expanded) */}
              {hasMoreFeatures && (
                <Collapse in={expanded} timeout={300}>
                  <List sx={{ py: 0 }}>
                    {plan.features.slice(maxInitialFeatures).map((feature, index) => (
                      <motion.div
                        key={index + maxInitialFeatures}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                      >
                        <ListItem sx={{ px: 0, py: 0.5 }}>
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            <CheckCircleIcon color="success" sx={{ fontSize: 20 }} />
                          </ListItemIcon>
                          <ListItemText 
                            primary={feature}
                            primaryTypographyProps={{
                              variant: 'body2',
                              fontWeight: 500
                            }}
                          />
                        </ListItem>
                      </motion.div>
                    ))}
                  </List>
                </Collapse>
              )}

              {/* View More/Less Button */}
              {hasMoreFeatures && (
                <Box sx={{ textAlign: 'center', mt: 2 }}>
                  <Button
                    variant="text"
                    size="small"
                    onClick={() => setExpanded(!expanded)}
                    startIcon={expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    sx={{
                      textTransform: 'none',
                      fontWeight: 600,
                      borderRadius: 2,
                      px: 2,
                      '&:hover': {
                        bgcolor: 'rgba(0, 0, 0, 0.04)'
                      }
                    }}
                  >
                    {expanded ? 'View Less' : `View More (${plan.features.length - maxInitialFeatures} more)`}
                  </Button>
                </Box>
              )}
            </Box>
          </Box>

          {/* Bottom Section - Action Button */}
          <Box sx={{ mt: 'auto' }}>
            <Button
              variant={isSelected ? 'contained' : plan.buttonVariant}
              color="primary"
              size="large"
              fullWidth
              sx={{
                py: 1.5,
                borderRadius: 3,
                textTransform: 'none',
                fontWeight: 700,
                fontSize: '1.1rem',
                boxShadow: isSelected ? theme.shadows[8] : 'none'
              }}
            >
              {isSelected ? 'Selected Plan' : plan.buttonText}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const PricingPage = () => {
  const theme = useTheme();
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [selectedPlan, setSelectedPlan] = useState(null);

  const handleBillingCycleChange = (event) => {
    setBillingCycle(event.target.checked ? 'yearly' : 'monthly');
    setSelectedPlan(null); // Reset selection when billing cycle changes
  };

  const currentPlans = pricingPlans[billingCycle];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#fafafa' }}>
      <PublicNavbar />
      
      <PageHeader
        title="Choose Your Plan"
        subtitle="Unlock your potential with our flexible pricing options designed for every student. Start free, upgrade anytime."
        center={true}
        badge="Special Launch Pricing"
        breadcrumbItems={['Pricing']}
      />

      <Container maxWidth="lg" sx={{ py: 8 }}>
        {/* Billing Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Stack direction="row" spacing={2} justifyContent="center" alignItems="center">
              <Typography variant="h6" color={billingCycle === 'monthly' ? 'primary' : 'text.secondary'}>
                Monthly
              </Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={billingCycle === 'yearly'}
                    onChange={handleBillingCycleChange}
                    color="primary"
                  />
                }
                label=""
                sx={{ mx: 0 }}
              />
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="h6" color={billingCycle === 'yearly' ? 'primary' : 'text.secondary'}>
                  Yearly
                </Typography>
                <Chip
                  label="Save up to 50%"
                  size="small"
                  color="success"
                  sx={{ fontWeight: 600 }}
                />
              </Stack>
            </Stack>
          </Box>
        </motion.div>

        {/* Pricing Cards */}
        <Grid container spacing={4}>
          {currentPlans.map((plan, index) => (
            <Grid item xs={12} md={4} key={plan.id} sx={{ display: 'flex' }}>
              <PricingCard 
                plan={plan} 
                index={index} 
                billingCycle={billingCycle}
                selectedPlan={selectedPlan}
                setSelectedPlan={setSelectedPlan}
              />
            </Grid>
          ))}
        </Grid>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Box sx={{ mt: 10, textAlign: 'center' }}>
            <Typography variant="h3" fontWeight={700} gutterBottom>
              Frequently Asked Questions
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 6 }}>
              Get answers to common questions about our pricing and features
            </Typography>
            
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Card sx={{ p: 3, height: '100%', borderRadius: 3 }}>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Can I upgrade or downgrade my plan?
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and you'll be prorated for the difference.
                  </Typography>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card sx={{ p: 3, height: '100%', borderRadius: 3 }}>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Is there a free trial available?
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Yes! We offer a 7-day free trial for our Professional plan so you can experience all the premium features before committing.
                  </Typography>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card sx={{ p: 3, height: '100%', borderRadius: 3 }}>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    What payment methods do you accept?
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    We accept all major credit cards, UPI, net banking, and digital wallets. All payments are secure and encrypted.
                  </Typography>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card sx={{ p: 3, height: '100%', borderRadius: 3 }}>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Can I cancel my subscription anytime?
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Absolutely! You can cancel your subscription at any time. Your access will continue until the end of your current billing period.
                  </Typography>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Box
            sx={{
              mt: 10,
              p: 6,
              textAlign: 'center',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: 4,
              color: 'white'
            }}
          >
            <Typography variant="h3" fontWeight={700} gutterBottom>
              Ready to Start Your Journey?
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
              Join thousands of students who have already found their dream internships
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
              <Button
                variant="contained"
                size="large"
                sx={{
                  bgcolor: 'white',
                  color: 'primary.main',
                  px: 4,
                  py: 1.5,
                  borderRadius: 3,
                  fontWeight: 700,
                  '&:hover': {
                    bgcolor: 'grey.100'
                  }
                }}
              >
                Start Free Trial
              </Button>
              <Button
                variant="outlined"
                size="large"
                sx={{
                  borderColor: 'white',
                  color: 'white',
                  px: 4,
                  py: 1.5,
                  borderRadius: 3,
                  fontWeight: 700,
                  '&:hover': {
                    borderColor: 'white',
                    bgcolor: 'rgba(255, 255, 255, 0.1)'
                  }
                }}
              >
                Contact Sales
              </Button>
            </Stack>
          </Box>
        </motion.div>
      </Container>

      <style jsx>{`
        @keyframes pulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
          100% {
            transform: scale(1);
          }
        }
      `}</style>
    </Box>
  );
};

export default PricingPage;