import React, { useState, useEffect } from 'react';
import { Box, AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from './adminslidebar';

const drawerWidth = 280;

const AdminLayout = ({ children, title = 'Admin Panel' }) => {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
    }
  }, [navigate]);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  const handleMenuClick = (sectionId) => {
    // Handle navigation based on section
    switch (sectionId) {
      case 'dashboard':
        navigate('/admin/dashboard');
        break;
      case 'users':
        navigate('/admin/users');
        break;
      case 'jobs':
        navigate('/admin/jobs');
        break;
      case 'applications':
        navigate('/admin/applications');
        break;
      case 'blog':
        navigate('/admin/blog');
        break;
      case 'analytics':
        navigate('/admin/analytics');
        break;
      case 'reports':
        navigate('/admin/reports');
        break;
      case 'security':
        navigate('/admin/security');
        break;
      case 'notifications':
        navigate('/admin/notifications');
        break;
      case 'settings':
        navigate('/admin/settings');
        break;
      case 'support':
        navigate('/admin/support');
        break;
      default:
        navigate('/admin/dashboard');
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Top App Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: `calc(100% - ${open ? drawerWidth : 72}px)`,
          ml: `${open ? drawerWidth : 72}px`,
          transition: (theme) => theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
          boxShadow: 'none',
          borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="toggle drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
            {title}
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <AdminSidebar 
        open={open}
        onToggle={handleDrawerToggle}
        onLogout={handleLogout}
        onMenuClick={handleMenuClick}
        userInfo={{
          name: localStorage.getItem('adminUser') 
            ? JSON.parse(localStorage.getItem('adminUser')).name || 'Admin User' 
            : 'Admin User',
          email: localStorage.getItem('adminUser') 
            ? JSON.parse(localStorage.getItem('adminUser')).email || 'admin@internshell.com' 
            : 'admin@internshell.com',
          avatar: null
        }}
      />

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: 'background.default',
          minHeight: '100vh',
          marginLeft: 0,
          transition: (theme) => theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        <Toolbar /> {/* Spacer for app bar */}
        {children}
      </Box>
    </Box>
  );
};

export default AdminLayout;