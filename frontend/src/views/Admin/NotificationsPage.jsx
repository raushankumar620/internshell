import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Button,
  Tabs,
  Tab,
  Badge,
  Avatar,
  Switch,
  FormControlLabel,
  Divider,
  Alert,
} from '@mui/material';
import {
  Notifications,
  Email,
  Sms,
  NotificationImportant,
  Settings,
  Delete,
  MarkEmailRead,
  Send,
  Info,
  Warning,
  Error,
  CheckCircle,
  People,
  Work,
  Assignment,
} from '@mui/icons-material';
import AdminLayout from './AdminLayout';

const NotificationsPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'New Job Application',
      message: 'Sarah Johnson applied for Software Engineer Intern position',
      type: 'info',
      timestamp: '2 minutes ago',
      read: false,
      icon: <Assignment />,
    },
    {
      id: 2,
      title: 'System Alert',
      message: 'Server backup completed successfully',
      type: 'success',
      timestamp: '1 hour ago',
      read: false,
      icon: <CheckCircle />,
    },
    {
      id: 3,
      title: 'New User Registration',
      message: 'Michael Brown created a new account',
      type: 'info',
      timestamp: '3 hours ago',
      read: true,
      icon: <People />,
    },
    {
      id: 4,
      title: 'Security Warning',
      message: 'Multiple failed login attempts detected',
      type: 'warning',
      timestamp: '5 hours ago',
      read: false,
      icon: <Warning />,
    },
    {
      id: 5,
      title: 'Job Posted',
      message: 'Marketing Intern position has been published',
      type: 'success',
      timestamp: '1 day ago',
      read: true,
      icon: <Work />,
    },
  ]);

  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    newApplications: true,
    userRegistrations: true,
    securityAlerts: true,
    systemUpdates: false,
  });

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(notif => notif.id === id ? { ...notif, read: true } : notif)
    );
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'success': return 'success';
      case 'warning': return 'warning';
      case 'error': return 'error';
      default: return 'info';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle />;
      case 'warning': return <Warning />;
      case 'error': return <Error />;
      default: return <Info />;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const TabPanel = ({ children, value, index }) => (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );

  return (
    <AdminLayout title="Notifications">
      <Box sx={{ p: 3 }}>
        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Card sx={{ background: 'linear-gradient(45deg, #2196f3 30%, #21cbf3 90%)' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', color: 'white' }}>
                  <Badge badgeContent={unreadCount} color="error">
                    <Notifications sx={{ fontSize: 40, mr: 2 }} />
                  </Badge>
                  <Box>
                    <Typography variant="h6">Unread</Typography>
                    <Typography variant="h4">{unreadCount}</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ background: 'linear-gradient(45deg, #4caf50 30%, #8bc34a 90%)' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', color: 'white' }}>
                  <Email sx={{ fontSize: 40, mr: 2 }} />
                  <Box>
                    <Typography variant="h6">Total Today</Typography>
                    <Typography variant="h4">{notifications.length}</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ background: 'linear-gradient(45deg, #ff9800 30%, #ffb74d 90%)' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', color: 'white' }}>
                  <Settings sx={{ fontSize: 40, mr: 2 }} />
                  <Box>
                    <Typography variant="h6">Active Channels</Typography>
                    <Typography variant="h4">3</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Main Content */}
        <Card>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={activeTab} onChange={handleTabChange}>
              <Tab label="All Notifications" />
              <Tab label="Settings" />
              <Tab label="Channels" />
            </Tabs>
          </Box>

          {/* Notifications List Tab */}
          <TabPanel value={activeTab} index={0}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Recent Notifications ({notifications.length})
              </Typography>
              <Button
                variant="outlined"
                startIcon={<MarkEmailRead />}
                onClick={markAllAsRead}
                disabled={unreadCount === 0}
              >
                Mark All as Read
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <List>
              {notifications.map((notification) => (
                <ListItem
                  key={notification.id}
                  sx={{
                    mb: 1,
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: notification.read ? 'grey.200' : 'primary.main',
                    backgroundColor: notification.read ? 'grey.50' : 'primary.light',
                    opacity: notification.read ? 0.7 : 1,
                  }}
                >
                  <ListItemIcon>
                    <Avatar
                      sx={{
                        bgcolor: `${getTypeColor(notification.type)}.main`,
                        width: 40,
                        height: 40,
                      }}
                    >
                      {notification.icon}
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="subtitle1" fontWeight={notification.read ? 'normal' : 'bold'}>
                          {notification.title}
                        </Typography>
                        {!notification.read && <Chip label="New" color="primary" size="small" />}
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="textSecondary">
                          {notification.message}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {notification.timestamp}
                        </Typography>
                      </Box>
                    }
                  />
                  <ListItemSecondaryAction>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {!notification.read && (
                        <IconButton
                          size="small"
                          onClick={() => markAsRead(notification.id)}
                          title="Mark as read"
                        >
                          <MarkEmailRead />
                        </IconButton>
                      )}
                      <IconButton
                        size="small"
                        onClick={() => deleteNotification(notification.id)}
                        title="Delete"
                        color="error"
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </TabPanel>

          {/* Settings Tab */}
          <TabPanel value={activeTab} index={1}>
            <Typography variant="h6" gutterBottom>
              Notification Preferences
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" gutterBottom>
                  Delivery Methods
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon><Email /></ListItemIcon>
                    <ListItemText primary="Email Notifications" />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={settings.emailNotifications}
                        onChange={(e) => setSettings(prev => ({ ...prev, emailNotifications: e.target.checked }))}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><Sms /></ListItemIcon>
                    <ListItemText primary="SMS Notifications" />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={settings.smsNotifications}
                        onChange={(e) => setSettings(prev => ({ ...prev, smsNotifications: e.target.checked }))}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><NotificationImportant /></ListItemIcon>
                    <ListItemText primary="Push Notifications" />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={settings.pushNotifications}
                        onChange={(e) => setSettings(prev => ({ ...prev, pushNotifications: e.target.checked }))}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                </List>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" gutterBottom>
                  Notification Types
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon><Assignment /></ListItemIcon>
                    <ListItemText primary="New Applications" />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={settings.newApplications}
                        onChange={(e) => setSettings(prev => ({ ...prev, newApplications: e.target.checked }))}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><People /></ListItemIcon>
                    <ListItemText primary="User Registrations" />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={settings.userRegistrations}
                        onChange={(e) => setSettings(prev => ({ ...prev, userRegistrations: e.target.checked }))}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><Warning /></ListItemIcon>
                    <ListItemText primary="Security Alerts" />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={settings.securityAlerts}
                        onChange={(e) => setSettings(prev => ({ ...prev, securityAlerts: e.target.checked }))}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><Settings /></ListItemIcon>
                    <ListItemText primary="System Updates" />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={settings.systemUpdates}
                        onChange={(e) => setSettings(prev => ({ ...prev, systemUpdates: e.target.checked }))}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                </List>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Channels Tab */}
          <TabPanel value={activeTab} index={2}>
            <Typography variant="h6" gutterBottom>
              Notification Channels
            </Typography>
            <Alert severity="info">
              Configure external notification channels like Slack, Discord, or webhooks.
            </Alert>
          </TabPanel>
        </Card>
      </Box>
    </AdminLayout>
  );
};

export default NotificationsPage;