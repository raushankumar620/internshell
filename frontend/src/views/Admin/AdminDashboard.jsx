import React, { useState, useEffect } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  Card,
  CardContent,
  Grid,
  Paper,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Container,
  Skeleton
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  People,
  Work,
  Assignment,
  Analytics,
  ExitToApp,
  TrendingUp,
  TrendingDown,
  ChevronLeft,
  ChevronRight,
  Article as ArticleIcon,
  Settings
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import UserManagement from './user';
import JobManagement from './jobs';
import ApplicationManagement from './applications';
import BlogManagement from './blogpage';
import AnalyticsPage from './AnalyticsPage';
import AdminSettings from './AdminSettings';
import AdminSidebar from './adminslidebar';

const drawerWidth = 240;

const AdminDashboard = () => {
  const [open, setOpen] = useState(true);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [dashboardData, setDashboardData] = useState(null);
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const menuItems = [
    { id: 'dashboard', text: 'Dashboard', icon: <Dashboard /> },
    { id: 'users', text: 'Users', icon: <People /> },
    { id: 'jobs', text: 'Jobs', icon: <Work /> },
    { id: 'applications', text: 'Applications', icon: <Assignment /> },
    { id: 'blog', text: 'Blog Management', icon: <ArticleIcon /> },
    { id: 'analytics', text: 'Analytics', icon: <Analytics /> },
    { id: 'settings', text: 'Settings', icon: <Settings /> }
  ];

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    // Set authorization header for all API calls
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    loadData();
  }, [navigate]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [dashboardRes, usersRes, jobsRes, applicationsRes] = await Promise.all([
        api.get('/admin/dashboard'),
        api.get('/admin/users?limit=5'),
        api.get('/admin/jobs?limit=5'),
        api.get('/admin/applications?limit=5')
      ]);

      setDashboardData(dashboardRes.data);
      setUsers(usersRes.data.users);
      setJobs(jobsRes.data.jobs);
      setApplications(applicationsRes.data.applications);
    } catch (error) {
      console.error('Failed to load data:', error);
      if (error.response?.status === 401) {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  const handleMenuClick = (sectionId) => {
    if (sectionId === 'blog') {
      navigate('/admin/blog');
    } else {
      setActiveSection(sectionId);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const renderDashboardContent = () => {
    if (loading || !dashboardData) {
      return (
        <Box sx={{ width: '100%' }}>
    

          {/* Loading Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {[1, 2, 3, 4].map((item) => (
              <Grid item xs={12} sm={6} md={3} key={item}>
                <Card sx={{ borderRadius: 2, p: 3 }}>
                  <Skeleton variant="text" width={120} height={24} sx={{ mb: 2 }} />
                  <Skeleton variant="text" width={80} height={48} sx={{ mb: 1 }} />
                  <Skeleton variant="text" width={140} height={16} />
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Loading Activity */}
          <Skeleton variant="text" width={200} height={32} sx={{ mb: 3 }} />
          <Grid container spacing={3}>
            {[1, 2, 3].map((item) => (
              <Grid item xs={12} lg={4} key={item}>
                <Card sx={{ borderRadius: 2, p: 3, height: 300 }}>
                  <Skeleton variant="text" width={150} height={24} sx={{ mb: 3 }} />
                  {[1, 2, 3].map((subItem) => (
                    <Box key={subItem} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
                      <Box sx={{ flexGrow: 1 }}>
                        <Skeleton variant="text" width={120} height={16} sx={{ mb: 0.5 }} />
                        <Skeleton variant="text" width={80} height={14} />
                      </Box>
                    </Box>
                  ))}
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      );
    }

    const { overview, recentActivity, statistics } = dashboardData;

    return (
      <Box sx={{ width: '100%' }}>
    

        {/* Overview Cards */}
        <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card 
              sx={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                borderRadius: 2,
                boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
                transition: 'transform 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 40px rgba(102, 126, 234, 0.4)',
                }
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 500, opacity: 0.9 }}>
                    Total Users
                  </Typography>
                  <People sx={{ fontSize: 32, opacity: 0.8 }} />
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                  {overview.totalUsers}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  +12% from last month
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card 
              sx={{ 
                background: 'linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%)',
                color: 'white',
                borderRadius: 2,
                boxShadow: '0 8px 32px rgba(78, 205, 196, 0.3)',
                transition: 'transform 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 40px rgba(78, 205, 196, 0.4)',
                }
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 500, opacity: 0.9 }}>
                    Total Jobs
                  </Typography>
                  <Work sx={{ fontSize: 32, opacity: 0.8 }} />
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                  {overview.totalJobs}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  +8% from last month
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card 
              sx={{ 
                background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)',
                color: 'white',
                borderRadius: 2,
                boxShadow: '0 8px 32px rgba(255, 107, 107, 0.3)',
                transition: 'transform 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 40px rgba(255, 107, 107, 0.4)',
                }
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 500, opacity: 0.9 }}>
                    Applications
                  </Typography>
                  <Assignment sx={{ fontSize: 32, opacity: 0.8 }} />
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                  {overview.totalApplications}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  +15% from last month
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card 
              sx={{ 
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                color: 'white',
                borderRadius: 2,
                boxShadow: '0 8px 32px rgba(240, 147, 251, 0.3)',
                transition: 'transform 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 40px rgba(240, 147, 251, 0.4)',
                }
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 500, opacity: 0.9 }}>
                    Success Rate
                  </Typography>
                  <TrendingUp sx={{ fontSize: 32, opacity: 0.8 }} />
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                  {overview.totalApplications > 0 
                    ? `${Math.round((overview.totalJobs / overview.totalApplications) * 100)}%`
                    : '0%'
                  }
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  +3% from last month
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Recent Activity */}
        <Typography variant="h5" sx={{ fontWeight: 600, color: '#1a1a1a', mb: 3 }}>
          Recent Activity
        </Typography>
        <Grid container spacing={{ xs: 2, sm: 3 }}>
          <Grid item xs={12} lg={4}>
            <Card 
              sx={{ 
                borderRadius: 2,
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                border: '1px solid #f0f0f0',
                height: '100%'
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <People sx={{ color: '#667eea', mr: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a1a1a' }}>
                    Recent Users
                  </Typography>
                </Box>
                {recentActivity.users.map((user, index) => (
                  <Box key={user._id} sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    mb: index === recentActivity.users.length - 1 ? 0 : 2,
                    p: 1.5,
                    borderRadius: 1,
                    '&:hover': {
                      backgroundColor: '#f8f9ff'
                    }
                  }}>
                    <Avatar sx={{ 
                      mr: 2, 
                      width: 40, 
                      height: 40,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      fontWeight: 600
                    }}>
                      {user.name.charAt(0)}
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="body1" sx={{ fontWeight: 500, color: '#1a1a1a' }}>
                        {user.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {user.userType} • {formatDate(user.createdAt)}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} lg={4}>
            <Card 
              sx={{ 
                borderRadius: 2,
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                border: '1px solid #f0f0f0',
                height: '100%'
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Work sx={{ color: '#4ECDC4', mr: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a1a1a' }}>
                    Recent Jobs
                  </Typography>
                </Box>
                {recentActivity.jobs.map((job, index) => (
                  <Box key={job._id} sx={{ 
                    mb: index === recentActivity.jobs.length - 1 ? 0 : 2,
                    p: 1.5,
                    borderRadius: 1,
                    border: '1px solid #f0f0f0',
                    '&:hover': {
                      backgroundColor: '#f8fffe'
                    }
                  }}>
                    <Typography variant="body1" sx={{ fontWeight: 600, color: '#1a1a1a', mb: 0.5 }}>
                      {job.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {job.company} • {job.location}
                    </Typography>
                    <Chip
                      label={job.status}
                      size="small"
                      color={job.status === 'active' ? 'success' : 'default'}
                      sx={{ 
                        fontWeight: 500,
                        textTransform: 'capitalize'
                      }}
                    />
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} lg={4}>
            <Card 
              sx={{ 
                borderRadius: 2,
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                border: '1px solid #f0f0f0',
                height: '100%'
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Assignment sx={{ color: '#FF6B6B', mr: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a1a1a' }}>
                    Recent Applications
                  </Typography>
                </Box>
                {recentActivity.applications.map((application, index) => (
                  <Box key={application._id} sx={{ 
                    mb: index === recentActivity.applications.length - 1 ? 0 : 2,
                    p: 1.5,
                    borderRadius: 1,
                    border: '1px solid #f0f0f0',
                    '&:hover': {
                      backgroundColor: '#fffaf8'
                    }
                  }}>
                    <Typography variant="body1" sx={{ fontWeight: 500, color: '#1a1a1a', mb: 0.5 }}>
                      {application.applicant.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Applied for: {application.job.title}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(application.createdAt)}
                      </Typography>
                      <Chip
                        label={application.status}
                        size="small"
                        color={
                          application.status === 'approved' ? 'success' :
                          application.status === 'rejected' ? 'error' : 'default'
                        }
                        sx={{ 
                          fontWeight: 500,
                          textTransform: 'capitalize'
                        }}
                      />
                    </Box>
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    );
  };

  const renderUsersContent = () => (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Users Management
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Joined</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.userType}</TableCell>
                <TableCell>
                  <Chip
                    label={user.isActive ? 'Active' : 'Inactive'}
                    color={user.isActive ? 'success' : 'error'}
                    size="small"
                  />
                </TableCell>
                <TableCell>{formatDate(user.createdAt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );

  const renderJobsContent = () => (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Jobs Management
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Company</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Posted</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {jobs.map((job) => (
              <TableRow key={job._id}>
                <TableCell>{job.title}</TableCell>
                <TableCell>{job.company}</TableCell>
                <TableCell>{job.location}</TableCell>
                <TableCell>
                  <Chip
                    label={job.status}
                    color={job.status === 'active' ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>{formatDate(job.createdAt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return renderDashboardContent();
      case 'users':
        return <UserManagement />;
      case 'jobs':
        return <JobManagement />;
      case 'applications':
        return <ApplicationManagement />;
      case 'blog':
        return <BlogManagement />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'settings':
        return <AdminSettings />;
      default:
        return renderDashboardContent();
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f5f7fa', overflow: 'hidden' }}>
      {/* Header */}
      <AppBar 
        position="fixed" 
        sx={{ 
          width: { xs: '100%', sm: `calc(100% - ${open ? drawerWidth : 64}px)` },
          ml: { xs: 0, sm: `${open ? drawerWidth : 64}px` },
          backgroundColor: '#ffffff',
          color: '#1a1a1a',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          borderBottom: '1px solid #e0e0e0',
          transition: 'margin-left 0.3s ease, width 0.3s ease'
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, sm: 3 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              color="inherit"
              aria-label="toggle drawer"
              onClick={handleDrawerToggle}
              edge="start"
              sx={{ 
                mr: 2,
                display: { xs: 'block', sm: 'none' },
                color: '#666'
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 600, 
                color: '#1a1a1a',
                textTransform: 'capitalize'
              }}
            >
              {activeSection === 'dashboard' ? 'Admin Dashboard' : activeSection.replace(/([A-Z])/g, ' $1').trim()}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Welcome back, Admin
            </Typography>
            <Button
              variant="outlined"
              startIcon={<ExitToApp />}
              onClick={handleLogout}
              sx={{
                borderColor: '#e0e0e0',
                color: '#666',
                '&:hover': {
                  borderColor: '#d32f2f',
                  color: '#d32f2f',
                  backgroundColor: '#ffeaea'
                }
              }}
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <AdminSidebar 
        open={open}
        onToggle={handleDrawerToggle}
        onLogout={handleLogout}
        onMenuClick={handleMenuClick}
        activeSection={activeSection}
        userInfo={{
          name: localStorage.getItem('adminUser') ? JSON.parse(localStorage.getItem('adminUser')).name || 'Admin User' : 'Admin User',
          email: localStorage.getItem('adminUser') ? JSON.parse(localStorage.getItem('adminUser')).email || 'admin@internshell.com' : 'admin@internshell.com',
          avatar: null
        }}
      />

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: '#f5f7fa',
          minHeight: '100vh',
          width: { xs: '100%', sm: `calc(100% - ${open ? drawerWidth : 64}px)` },
          ml: { xs: 0, sm: `${open ? drawerWidth : 64}px` },
          display: 'flex',
          flexDirection: 'column',
          overflowX: 'hidden',
          transition: 'margin-left 0.3s ease, width 0.3s ease'
        }}
      >
        <Toolbar />
        <Container 
          maxWidth={false}
          sx={{ 
            mt: 4, 
            mb: 4, 
            flexGrow: 1,
            px: { xs: 1, sm: 2, md: 3 },
            py: 2,
            maxWidth: 'none',
            width: '100%'
          }}
        >
          {renderContent()}
        </Container>
      </Box>
    </Box>
  );
};

export default AdminDashboard;