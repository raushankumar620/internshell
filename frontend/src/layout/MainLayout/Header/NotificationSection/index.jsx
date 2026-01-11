import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Button,
  Chip,
  ClickAwayListener,
  Fade,
  Grid,
  Paper,
  Popper,
  Avatar,
  List,
  ListItemAvatar,
  ListItemText,
  ListSubheader,
  ListItemSecondaryAction,
  Typography,
  ListItemButton,
  Badge,
  Box,
  IconButton,
  Divider
} from '@mui/material';

// third party
import PerfectScrollbar from 'react-perfect-scrollbar';

// assets
import QueryBuilderTwoToneIcon from '@mui/icons-material/QueryBuilderTwoTone';
import NotificationsNoneTwoToneIcon from '@mui/icons-material/NotificationsNoneTwoTone';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';

// services
import api from '../../../../services/api';
import { getSocket } from '../../../../services/socket';

// ==============================|| NOTIFICATION ||============================== //

const NotificationSection = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const anchorRef = React.useRef(null);

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await api.get('/notifications?limit=10');
      if (response.data.success) {
        setNotifications(response.data.data);
        setUnreadCount(response.data.unreadCount);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch unread count
  const fetchUnreadCount = async () => {
    try {
      const response = await api.get('/notifications/unread-count');
      if (response.data.success) {
        setUnreadCount(response.data.unreadCount);
      }
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    
    // Listen for real-time notifications via socket
    const socket = getSocket();
    if (socket) {
      socket.on('notification', (notification) => {
        setNotifications((prev) => [notification, ...prev.slice(0, 9)]);
        setUnreadCount((prev) => prev + 1);
      });
    }

    // Poll for unread count every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);

    return () => {
      clearInterval(interval);
      if (socket) {
        socket.off('notification');
      }
    };
  }, []);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
    if (!open) {
      fetchNotifications();
    }
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const handleMarkAsRead = async (notificationId, event) => {
    event.stopPropagation();
    try {
      await api.put(`/notifications/${notificationId}/read`);
      setNotifications((prev) =>
        prev.map((notif) =>
          notif._id === notificationId ? { ...notif, isRead: true } : notif
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications((prev) => prev.map((notif) => ({ ...notif, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const handleNotificationClick = async (notification) => {
    // Mark as read if unread
    if (!notification.isRead) {
      await handleMarkAsRead(notification._id, { stopPropagation: () => {} });
    }
    
    // Navigate to the link if available
    if (notification.link) {
      navigate(notification.link);
      setOpen(false);
    }
  };

  const getNotificationIcon = (type) => {
    const sender = type.sender;
    const initials = sender?.name
      ? sender.name
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase()
      : '?';

    return (
      <Avatar
        className="notification-avatar"
        sx={{
          bgcolor: !type.isRead ? theme.palette.primary.main : theme.palette.grey[300],
          color: !type.isRead ? '#fff' : theme.palette.grey[600]
        }}
      >
        {initials}
      </Avatar>
    );
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const notifTime = new Date(timestamp);
    const diffMs = now - notifTime;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'now';
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }
    prevOpen.current = open;
  }, [open]);

  return (
    <>
      <IconButton
        sx={{
          minWidth: { sm: 50, xs: 35 },
          borderRadius: 2,
          transition: theme.transitions.create(['background-color', 'transform'], {
            duration: theme.transitions.duration.short
          }),
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            transform: 'scale(1.05)'
          }
        }}
        ref={anchorRef}
        aria-controls={open ? 'menu-list-grow' : undefined}
        aria-haspopup="true"
        aria-label="Notification"
        onClick={handleToggle}
        color="inherit"
      >
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsNoneTwoToneIcon sx={{ fontSize: '1.5rem' }} />
        </Badge>
      </IconButton>
      <Popper
        placement="bottom-end"
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        sx={{ 
          zIndex: 1300,
          mt: 1.5
        }}
        modifiers={[
          {
            name: 'offset',
            options: {
              offset: [0, 25]
            }
          },
          {
            name: 'preventOverflow',
            options: {
              altAxis: true,
              boundary: 'viewport',
              padding: 8
            }
          },
          {
            name: 'arrow',
            enabled: true,
            options: {
              element: '[data-popper-arrow]',
              padding: 8
            }
          }
        ]}
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps}>
            <Paper 
              className="notification-dropdown"
              sx={{ 
                boxShadow: theme.shadows[12],
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 2,
                overflow: 'hidden'
              }}
            >
              <ClickAwayListener onClickAway={handleClose}>
                <Box>
                  <Box className="notification-header">
                    <Typography variant="subtitle1" fontWeight={600}>Notifications</Typography>
                    {unreadCount > 0 && (
                      <Button
                        size="small"
                        onClick={handleMarkAllAsRead}
                        startIcon={<MarkEmailReadIcon />}
                      >
                        Mark all read
                      </Button>
                    )}
                  </Box>
                  <List
                    className="notification-list"
                    sx={{
                      width: '100%',
                      maxWidth: 260,
                      minWidth: 240,
                      backgroundColor: theme.palette.background.paper,
                      pb: 0,
                      m: 0
                    }}
                  >
                    <PerfectScrollbar style={{ height: 200, overflowX: 'hidden' }}>
                      {loading ? (
                        <Box sx={{ p: 1.5, textAlign: 'center' }}>
                          <Typography variant="caption" color="textSecondary">
                            Loading notifications...
                          </Typography>
                        </Box>
                      ) : notifications.length === 0 ? (
                        <Box sx={{ p: 1.5, textAlign: 'center' }}>
                          <Typography variant="caption" color="textSecondary">
                            No notifications yet
                          </Typography>
                        </Box>
                      ) : (
                        <>
                          {notifications.filter((n) => !n.isRead).length > 0 && (
                            <>
                              <ListSubheader disableSticky sx={{ bgcolor: 'transparent' }}>
                                <Chip size="small" color="primary" label="Unread" />
                              </ListSubheader>
                              {notifications
                                .filter((n) => !n.isRead)
                                .map((notification) => (
                                  <React.Fragment key={notification._id}>
                                    <ListItemButton
                                      className={`notification-item ${!notification.isRead ? 'unread' : ''}`}
                                      alignItems="flex-start"
                                      onClick={() => handleNotificationClick(notification)}
                                      sx={{
                                        py: 0.5,
                                        px: 1,
                                        '&:hover': {
                                          bgcolor: 'transparent'
                                        }
                                      }}
                                    >
                                      <ListItemAvatar>{getNotificationIcon(notification)}</ListItemAvatar>
                                      <ListItemText
                                        primary={
                                          <Typography variant="body2" fontWeight={600} sx={{ lineHeight: 1.2 }}>
                                            {notification.title}
                                          </Typography>
                                        }
                                        secondary={
                                          <Typography variant="caption" color="textSecondary" sx={{ lineHeight: 1.1 }}>
                                            {notification.message}
                                          </Typography>
                                        }
                                      />
                                      <ListItemSecondaryAction>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                          <Typography
                                            variant="caption"
                                            color="textSecondary"
                                            sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}
                                          >
                                            <QueryBuilderTwoToneIcon sx={{ fontSize: '0.75rem', mr: 0.3 }} />
                                            {formatTime(notification.createdAt)}
                                          </Typography>
                                          {!notification.isRead && (
                                            <IconButton
                                              size="small"
                                              onClick={(e) => handleMarkAsRead(notification._id, e)}
                                              title="Mark as read"
                                            >
                                              <CheckCircleIcon fontSize="small" />
                                            </IconButton>
                                          )}
                                        </Box>
                                      </ListItemSecondaryAction>
                                    </ListItemButton>
                                    <Divider />
                                  </React.Fragment>
                                ))}
                            </>
                          )}
                          {notifications.filter((n) => n.isRead).length > 0 && (
                            <>
                              <ListSubheader disableSticky sx={{ bgcolor: 'transparent', mt: 1 }}>
                                <Chip size="small" variant="outlined" label="Earlier" />
                              </ListSubheader>
                              {notifications
                                .filter((n) => n.isRead)
                                .map((notification) => (
                                  <React.Fragment key={notification._id}>
                                    <ListItemButton
                                      className="notification-item"
                                      alignItems="flex-start"
                                      onClick={() => handleNotificationClick(notification)}
                                      sx={{
                                        py: 0.5,
                                        px: 1,
                                        opacity: 0.7,
                                        '&:hover': {
                                          bgcolor: 'transparent',
                                          opacity: 1
                                        }
                                      }}
                                    >
                                      <ListItemAvatar>{getNotificationIcon(notification)}</ListItemAvatar>
                                      <ListItemText
                                        primary={
                                          <Typography variant="body2" sx={{ lineHeight: 1.2 }}>{notification.title}</Typography>
                                        }
                                        secondary={
                                          <Typography variant="caption" color="textSecondary" sx={{ lineHeight: 1.1 }}>
                                            {notification.message}
                                          </Typography>
                                        }
                                      />
                                      <ListItemSecondaryAction>
                                        <Typography
                                          variant="caption"
                                          color="textSecondary"
                                          sx={{ display: 'flex', alignItems: 'center' }}
                                        >
                                          <QueryBuilderTwoToneIcon sx={{ fontSize: '0.75rem', mr: 0.3 }} />
                                          {formatTime(notification.createdAt)}
                                        </Typography>
                                      </ListItemSecondaryAction>
                                    </ListItemButton>
                                    <Divider />
                                  </React.Fragment>
                                ))}
                            </>
                          )}
                        </>
                      )}
                    </PerfectScrollbar>
                  </List>
                </Box>
              </ClickAwayListener>
            </Paper>
          </Fade>
        )}
      </Popper>
    </>
  );
};

export default NotificationSection;
