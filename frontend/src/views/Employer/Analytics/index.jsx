import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; // Added useNavigate import

// material-ui
import { useTheme } from '@mui/material/styles';
import { Grid, Card, CardContent, Typography, Box, CircularProgress, IconButton } from '@mui/material';

// API imports
import { jobAPI, applicationAPI } from 'services/api';
import { initSocket, getSocket } from 'services/socket';

// Recharts imports for better visualization
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
  RadialBarChart,
  RadialBar,
  FunnelChart,
  Funnel
} from 'recharts';

// project import
import ReportCard from 'views/Dashboard/Default/ReportCard';
import { gridSpacing } from 'config.js';

// assets
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BarChartIcon from '@mui/icons-material/BarChart';
import RefreshIcon from '@mui/icons-material/Refresh';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

// ==============================|| ANALYTICS ||============================== //

// Custom tooltip component for charts
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ backgroundColor: '#fff', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}>
        <p style={{ margin: 0, fontWeight: 'bold' }}>{label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ margin: 0, color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Custom pie chart label
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name, value }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
  const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const Analytics = () => {
  const theme = useTheme();
  const navigate = useNavigate(); // Added navigate hook
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [stats, setStats] = useState({
    totalinternship: 0,
    totalApplicants: 0,
    profileViews: 0,
    hired: 0,
    pending: 0,
    shortlisted: 0,
    rejected: 0
  });
  const [chartData, setChartData] = useState({
    applications: [],
    views: [],
    recentActivity: [],
    applicationStatus: [],
    jobPerformance: [],
    radialData: [],
    funnelData: []
  });
  const socketRef = useRef(null);

  // Colors for charts
  const COLORS = [
    theme.palette.primary.main,
    theme.palette.success.main,
    theme.palette.warning.main,
    theme.palette.error.main,
    theme.palette.info.main,
    theme.palette.secondary.main
  ];

  // Function to fetch analytics data
  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      
      // Fetch analytics data
      const analyticsResponse = await jobAPI.getAnalytics();
      
      if (analyticsResponse.success) {
        const data = analyticsResponse.data;
        
        setStats({
          totalinternship: data.internship?.total || 0,
          totalApplicants: data.applications?.total || 0,
          profileViews: data.internship?.views || 0,
          hired: data.applications?.accepted || 0,
          pending: data.applications?.pending || 0,
          shortlisted: data.applications?.shortlisted || 0,
          rejected: data.applications?.rejected || 0
        });
        
        // Process applications trend data for charts
        const trendData = data.applicationsTrend || [];
        
        // Generate monthly data for charts
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        
        const applicationData = months.map((month, index) => {
          const monthData = trendData.filter(item => {
            const date = new Date(item._id);
            return date.getMonth() === index;
          }).reduce((sum, item) => sum + item.count, 0);
          return {
            name: month,
            applications: monthData
          };
        });
        
        const viewData = months.map((month, index) => {
          const monthApplications = applicationData[index].applications;
          // Simulate view data based on applications for now
          const views = Math.floor(monthApplications * 1.5) + Math.floor(Math.random() * 50);
          return {
            name: month,
            views: views
          };
        });
        
        // Process recent applications for activity chart
        const recentApplications = data.recentApplications || [];
        const activityMap = {};
        
        // Group by date
        recentApplications.forEach(app => {
          const date = new Date(app.createdAt);
          const dateStr = `${date.getDate()}/${date.getMonth()+1}`;
          if (!activityMap[dateStr]) {
            activityMap[dateStr] = 0;
          }
          activityMap[dateStr]++;
        });
        
        // Convert to array format
        const activityData = Object.keys(activityMap).map(date => ({
          name: date,
          applications: activityMap[date]
        }));
        
        // Application status data for pie chart
        const statusData = [
          { name: 'Pending', value: data.applications?.pending || 0 },
          { name: 'Shortlisted', value: data.applications?.shortlisted || 0 },
          { name: 'Rejected', value: data.applications?.rejected || 0 },
          { name: 'Accepted', value: data.applications?.accepted || 0 }
        ];
        
        // Job performance data
        const topinternship = data.topinternship || [];
        const jobPerformanceData = topinternship.map(job => ({
          name: job.title.length > 15 ? `${job.title.substring(0, 15)}...` : job.title,
          applications: job.applicationCount
        }));
        
        // Radial bar data
        const radialData = [
          { name: 'Applications', value: data.applications?.total || 0, fill: theme.palette.primary.main },
          { name: 'Shortlisted', value: data.applications?.shortlisted || 0, fill: theme.palette.success.main },
          { name: 'Hired', value: data.applications?.accepted || 0, fill: theme.palette.info.main },
          { name: 'Views', value: data.internship?.views || 0, fill: theme.palette.warning.main }
        ];
        
        // Funnel data (Pyramid Chart)
        const funnelData = [
          { value: data.applications?.total || 0, name: 'Total Applications', fill: theme.palette.primary.main },
          { value: data.applications?.shortlisted || 0, name: 'Shortlisted', fill: theme.palette.success.main },
          { value: data.applications?.accepted || 0, name: 'Hired', fill: theme.palette.info.main }
        ];
        
        setChartData({
          applications: applicationData,
          views: viewData,
          recentActivity: activityData,
          applicationStatus: statusData,
          jobPerformance: jobPerformanceData,
          radialData: radialData,
          funnelData: funnelData
        });
        
        setLastUpdated(new Date());
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Refresh data
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAnalytics();
  };

  // Initialize WebSocket connection
  useEffect(() => {
    // Get current user from localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const employerId = user._id;
    const userRole = user.role;
    
    if (employerId) {
      // Initialize socket connection with userId and role
      socketRef.current = initSocket(employerId, userRole);
      
      // Listen for analytics updates (only if socket is available)
      if (socketRef.current) {
        socketRef.current.on('analytics-update', (data) => {
          console.log('📈 Real-time analytics update received:', data);
          // Refresh data when we receive an update
          fetchAnalytics();
        });
      }
    }
    
    // Fetch initial data
    fetchAnalytics();
    
    // Set up interval for auto-refresh every 5 minutes
    const interval = setInterval(() => {
      fetchAnalytics();
    }, 300000); // 5 minutes
    
    // Cleanup function
    return () => {
      if (socketRef.current) {
        socketRef.current.off('analytics-update');
      }
      clearInterval(interval);
    };
  }, []);

  if (loading && !refreshing) {
    return (
      <Grid container spacing={3} sx={{ minHeight: '400px', alignItems: 'center', justifyContent: 'center' }}>
        <Grid item>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <CircularProgress size={60} />
            <Typography variant="h4">Loading analytics...</Typography>
          </Box>
        </Grid>
      </Grid>
    );
  }

  return (
    <Grid container spacing={gridSpacing}>
      <Grid item xs={12}>
        <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2}>
          <Box display="flex" alignItems="center" gap={1}>
            <BarChartIcon sx={{ color: theme.palette.primary.main }} />
            <Typography variant="h3">Job Analytics</Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <IconButton 
              onClick={handleRefresh} 
              disabled={refreshing}
              color="primary"
              sx={{ 
                backgroundColor: theme.palette.grey[100],
                '&:hover': {
                  backgroundColor: theme.palette.grey[200]
                }
              }}
            >
              {refreshing ? <CircularProgress size={20} /> : <RefreshIcon />}
            </IconButton>
            <Box display="flex" alignItems="center" gap={0.5}>
              <AccessTimeIcon fontSize="small" sx={{ color: theme.palette.text.secondary }} />
              <Typography variant="body2" color="textSecondary">
                Updated: {lastUpdated.toLocaleTimeString()}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Grid>

      {/* Report Cards */}
      <Grid item lg={3} sm={6} xs={12}>
        <div onClick={() => navigate('/app/employer/my-internship')} style={{ cursor: 'pointer' }}>
          <ReportCard
            primary={stats.totalinternship.toString()}
            secondary="Total Jobs Posted"
            color={theme.palette.primary.main}
            iconPrimary={WorkOutlineIcon}
            linkTo="/app/employer/my-internship"
          />
        </div>
      </Grid>
      <Grid item lg={3} sm={6} xs={12}>
        <div onClick={() => navigate('/app/employer/applicants')} style={{ cursor: 'pointer' }}>
          <ReportCard
            primary={stats.totalApplicants.toString()}
            secondary="Total Applicants"
            color={theme.palette.success.main}
            iconPrimary={PeopleAltIcon}
            linkTo="/app/employer/applicants"
          />
        </div>
      </Grid>
      <Grid item lg={3} sm={6} xs={12}>
        <ReportCard
          primary={stats.profileViews.toString()}
          secondary="Profile Views"
          color={theme.palette.warning.main}
          iconPrimary={VisibilityIcon}
        />
      </Grid>
      <Grid item lg={3} sm={6} xs={12}>
        <div onClick={() => navigate('/app/employer/applicants?status=accepted')} style={{ cursor: 'pointer' }}>
          <ReportCard 
            primary={stats.hired.toString()} 
            secondary="Hired Candidates" 
            color={theme.palette.info.main} 
            iconPrimary={CheckCircleIcon} 
            linkTo="/app/employer/applicants?status=accepted"
          />
        </div>
      </Grid>

      {/* Top Row Charts */}
      {/* Pie Chart - Left Side */}
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h4" gutterBottom align="center">
              Application Status Distribution
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={chartData.applicationStatus}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {chartData.applicationStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Radial Bar Chart - Center */}
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h4" gutterBottom align="center">
              Key Metrics Overview
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height={300}>
                <RadialBarChart 
                  innerRadius="10%" 
                  outerRadius="80%" 
                  barSize={10} 
                  data={chartData.radialData}
                  startAngle={180} 
                  endAngle={0}
                >
                  <RadialBar
                    minAngle={15}
                    label={{ fill: '#666', position: 'insideStart' }}
                    background
                    dataKey="value"
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend iconSize={10} width={120} height={140} layout='vertical' verticalAlign='middle' align="right" />
                </RadialBarChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Bar Chart - Right Side */}
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h4" gutterBottom align="center">
              Monthly Applications
            </Typography>
            <Box sx={{ height: 350 }}>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart
                  data={chartData.applications}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="applications" 
                    fill={theme.palette.primary.main} 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Bottom Row Charts */}
      {/* Line Chart - Left Side */}
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h4" gutterBottom align="center">
              Recent Activity Trend
            </Typography>
            <Box sx={{ height: 350 }}>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart
                  data={chartData.recentActivity}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="applications" 
                    stroke={theme.palette.warning.main} 
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Area Chart - Center */}
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h4" gutterBottom align="center">
              Job Views Over Time
            </Typography>
            <Box sx={{ height: 350 }}>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart
                  data={chartData.views}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="views" 
                    stroke={theme.palette.success.main} 
                    fill={theme.palette.success.light} 
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Pyramid Chart (Funnel) - Right Side */}
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h4" gutterBottom align="center">
              Application Funnel
            </Typography>
            <Box sx={{ height: 350 }}>
              <ResponsiveContainer width="100%" height={350}>
                <FunnelChart>
                  <Tooltip content={<CustomTooltip />} />
                  <Funnel
                    dataKey="value"
                    data={chartData.funnelData}
                    isAnimationActive
                  >
                    {chartData.funnelData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Funnel>
                </FunnelChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Performance Metrics */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h4" gutterBottom>
              Performance Metrics
            </Typography>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ cursor: 'pointer' }} onClick={() => navigate('/app/employer/applicants?status=pending')}>
                  <CardContent>
                    <Typography variant="h3" color="primary">
                      {stats.pending}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Pending Review
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ cursor: 'pointer' }} onClick={() => navigate('/app/employer/applicants?status=shortlisted')}>
                  <CardContent>
                    <Typography variant="h3" color="success.main">
                      {stats.shortlisted}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Shortlisted
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ cursor: 'pointer' }} onClick={() => navigate('/app/employer/applicants?status=rejected')}>
                  <CardContent>
                    <Typography variant="h3" color="warning.main">
                      {stats.rejected}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Rejected
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ cursor: 'pointer' }} onClick={() => navigate('/app/employer/applicants?status=accepted')}>
                  <CardContent>
                    <Typography variant="h3" color="error.main">
                      {stats.totalApplicants > 0 ? ((stats.hired / stats.totalApplicants) * 100).toFixed(1) : 0}%
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Hire Rate
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default Analytics;