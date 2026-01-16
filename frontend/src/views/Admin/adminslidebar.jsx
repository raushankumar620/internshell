import React from 'react';
import {
  Box,
  Drawer,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Chip,
  useTheme,
  alpha,
  Tooltip,
} from '@mui/material';
import {
  Dashboard,
  People,
  Work,
  Assignment,
  Analytics,
  ExitToApp,
  ChevronLeft,
  ChevronRight,
  Article as ArticleIcon,
  Notifications,
  TrendingUp,
  Security,
  Support,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const drawerWidth = 240;
const drawerWidthClosed = 64;

const AdminSidebar = ({ 
  open, 
  onToggle, 
  onLogout, 
  userInfo = { name: 'Admin User', email: 'admin@internshell.com', avatar: null },
  onMenuClick 
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { 
      id: 'dashboard', 
      text: 'Dashboard', 
      icon: <Dashboard />, 
      path: '/admin/dashboard',
      badge: null 
    },
    { 
      id: 'users', 
      text: 'User Management', 
      icon: <People />, 
      path: '/admin/users',
      badge: null 
    },
    { 
      id: 'jobs', 
      text: 'Job Management', 
      icon: <Work />, 
      path: '/admin/jobs',
      badge: 'New' 
    },
    { 
      id: 'applications', 
      text: 'Applications', 
      icon: <Assignment />, 
      path: '/admin/applications',
      badge: '12' 
    },
    { 
      id: 'blog', 
      text: 'Blog Management', 
      icon: <ArticleIcon />, 
      path: '/admin/blog',
      badge: null 
    },
    { 
      id: 'analytics', 
      text: 'Analytics', 
      icon: <Analytics />, 
      path: '/admin/analytics',
      badge: null 
    },
    { 
      id: 'security', 
      text: 'Security', 
      icon: <Security />, 
      path: '/admin/security',
      badge: null 
    },
    { 
      id: 'notifications', 
      text: 'Notifications', 
      icon: <Notifications />, 
      path: '/admin/notifications',
      badge: '3' 
    },
  ];

  const getCurrentSection = () => {
    const currentPath = location.pathname;
    const currentItem = menuItems.find(item => currentPath.startsWith(item.path));
    return currentItem?.id || 'dashboard';
  };

  const handleMenuClick = (item) => {
    if (onMenuClick) {
      onMenuClick(item.id);
    }
    if (item.path) {
      navigate(item.path);
    }
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      navigate('/admin/login');
    }
  };

  const activeSection = getCurrentSection();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: open ? drawerWidth : drawerWidthClosed,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: open ? drawerWidth : drawerWidthClosed,
          boxSizing: 'border-box',
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          overflowX: 'hidden',
          background: `linear-gradient(180deg, 
            ${theme.palette.primary.dark} 0%, 
            ${theme.palette.primary.main} 50%, 
            ${theme.palette.primary.light} 100%
          )`,
          color: theme.palette.primary.contrastText,
          boxShadow: theme.shadows[8],
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-track': {
            background: alpha(theme.palette.common.white, 0.1),
          },
          '&::-webkit-scrollbar-thumb': {
            background: alpha(theme.palette.common.white, 0.3),
            borderRadius: '3px',
          },
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: theme.spacing(2),
          minHeight: '70px',
          background: alpha(theme.palette.common.black, 0.1),
          backdropFilter: 'blur(10px)',
          borderBottom: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
        }}
      >
        {open && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              component="img"
              src="/logo.png"
              alt="Logo"
              sx={{
                height: '32px',
                width: 'auto',
                filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.3)) brightness(1.1)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  filter: 'drop-shadow(0 0 15px rgba(255,255,255,0.5)) brightness(1.2)',
                  transform: 'scale(1.05)'
                }
              }}
            />
          </Box>
        )}
        <IconButton
          onClick={onToggle}
          sx={{
            color: theme.palette.primary.contrastText,
            backgroundColor: alpha(theme.palette.common.white, 0.1),
            '&:hover': {
              backgroundColor: alpha(theme.palette.common.white, 0.2),
            },
          }}
        >
          {open ? <ChevronLeft /> : <ChevronRight />}
        </IconButton>
      </Box>


      

      {/* Navigation Menu */}
      <Box sx={{ flexGrow: 1, py: 1 }}>
        <List sx={{ padding: 0 }}>
          {menuItems.map((item) => (
            <Tooltip
              key={item.id}
              title={!open ? item.text : ''}
              placement="right"
              arrow
            >
              <ListItem
                button
                onClick={() => handleMenuClick(item)}
                sx={{
                  mx: 1,
                  my: 0.5,
                  borderRadius: 2,
                  minHeight: 48,
                  backgroundColor: activeSection === item.id 
                    ? alpha(theme.palette.common.white, 0.15)
                    : 'transparent',
                  color: activeSection === item.id 
                    ? theme.palette.common.white
                    : alpha(theme.palette.primary.contrastText, 0.8),
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  '&:before': {
                    content: '""',
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    height: '100%',
                    width: activeSection === item.id ? '4px' : '0px',
                    backgroundColor: theme.palette.secondary.main,
                    transition: 'width 0.3s ease',
                  },
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.common.white, 0.1),
                    color: theme.palette.common.white,
                    transform: 'translateX(4px)',
                    '&:before': {
                      width: '4px',
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: 'inherit',
                    minWidth: open ? 40 : 56,
                    justifyContent: 'center',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                {open && (
                  <ListItemText
                    primary={item.text}
                    sx={{
                      '& .MuiListItemText-primary': {
                        fontSize: '0.875rem',
                        fontWeight: activeSection === item.id ? 600 : 500,
                      },
                    }}
                  />
                )}
                {open && item.badge && (
                  <Chip
                    label={item.badge}
                    size="small"
                    sx={{
                      height: 20,
                      fontSize: '0.6875rem',
                      fontWeight: 600,
                      backgroundColor: theme.palette.error.main,
                      color: theme.palette.error.contrastText,
                      ml: 1,
                    }}
                  />
                )}
              </ListItem>
            </Tooltip>
          ))}
        </List>
      </Box>

      {/* Footer/Logout Section */}
      <Box
        sx={{
          borderTop: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
          p: 1,
        }}
      >
        <Tooltip title={!open ? 'Logout' : ''} placement="right" arrow>
          <ListItem
            button
            onClick={handleLogout}
            sx={{
              borderRadius: 2,
              minHeight: 48,
              mx: 1,
              my: 0.5,
              color: alpha(theme.palette.primary.contrastText, 0.8),
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: alpha(theme.palette.error.main, 0.2),
                color: theme.palette.error.main,
                transform: 'translateX(4px)',
              },
            }}
          >
            <ListItemIcon
              sx={{
                color: 'inherit',
                minWidth: open ? 40 : 56,
                justifyContent: 'center',
              }}
            >
              <ExitToApp />
            </ListItemIcon>
            {open && (
              <ListItemText
                primary="Logout"
                sx={{
                  '& .MuiListItemText-primary': {
                    fontSize: '0.875rem',
                    fontWeight: 500,
                  },
                }}
              />
            )}
          </ListItem>
        </Tooltip>
      </Box>
    </Drawer>
  );
};

export default AdminSidebar;
