import React from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import { 
  Fade, 
  Button, 
  ClickAwayListener, 
  Paper, 
  Popper, 
  List, 
  ListItemText, 
  ListItemIcon, 
  ListItemButton,
  Box,
  Typography,
  Divider,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Avatar
} from '@mui/material';

// assets
import PersonTwoToneIcon from '@mui/icons-material/PersonTwoTone';
import DraftsTwoToneIcon from '@mui/icons-material/DraftsTwoTone';
import LockOpenTwoTone from '@mui/icons-material/LockOpenTwoTone';
import SettingsTwoToneIcon from '@mui/icons-material/SettingsTwoTone';
import AccountCircleTwoToneIcon from '@mui/icons-material/AccountCircleTwoTone';
import MeetingRoomTwoToneIcon from '@mui/icons-material/MeetingRoomTwoTone';
import LogoutIcon from '@mui/icons-material/Logout';
import HomeIcon from '@mui/icons-material/Home';

// services
import { authAPI } from 'services/api';

// ==============================|| PROFILE SECTION ||============================== //

const ProfileSection = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const [selectedIndex, setSelectedIndex] = React.useState(1);
  const [open, setOpen] = React.useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = React.useState(false);
  const [user, setUser] = React.useState(null);
  const anchorRef = React.useRef(null);

  // Get user from localStorage
  React.useEffect(() => {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        setUser(JSON.parse(userStr));
      }
    } catch (error) {
      console.error('Error getting user:', error);
    }
  }, []);

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
  };

  const handleLogoutClick = () => {
    setOpen(false);
    setLogoutDialogOpen(true);
  };

  const handleLogoutConfirm = () => {
    // Clear localStorage
    authAPI.logout();
    
    // Close dialog
    setLogoutDialogOpen(false);
    
    // Redirect to login page
    navigate('/login');
  };

  const handleLogoutCancel = () => {
    setLogoutDialogOpen(false);
  };

  const handleProfileClick = () => {
    setOpen(false);
    const profilePath = user?.role === 'employer' ? '/app/employer/profile' : '/app/intern/profile';
    navigate(profilePath);
  };

  const handleGoToHome = () => {
    setOpen(false);
    navigate('/');
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
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
      <Button
        sx={{ 
          minWidth: { sm: 50, xs: 35 },
          borderRadius: 2,
          '&:hover': {
            bgcolor: 'rgba(255, 255, 255, 0.1)'
          }
        }}
        ref={anchorRef}
        aria-controls={open ? 'menu-list-grow' : undefined}
        aria-haspopup="true"
        aria-label="Profile"
        onClick={handleToggle}
        color="inherit"
      >
        <Avatar 
          sx={{ 
            width: 36, 
            height: 36, 
            bgcolor: theme.palette.primary.main,
            fontSize: '1rem',
            fontWeight: 600
          }}
        >
          {user?.name?.charAt(0)?.toUpperCase() || 'U'}
        </Avatar>
      </Button>
      <Popper
        placement="bottom-end"
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        modifiers={[
          {
            name: 'offset',
            options: {
              offset: [0, 10]
            }
          },
          {
            name: 'preventOverflow',
            options: {
              altAxis: true
            }
          }
        ]}
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps}>
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <List
                  sx={{
                    width: '100%',
                    maxWidth: 350,
                    minWidth: 250,
                    backgroundColor: theme.palette.background.paper,
                    pb: 0,
                    borderRadius: '10px'
                  }}
                >
                  {/* User Info Header */}
                  {user && (
                    <>
                      <Box sx={{ p: 2.5, pb: 1.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar 
                            sx={{ 
                              width: 56, 
                              height: 56, 
                              bgcolor: theme.palette.primary.main,
                              fontSize: '1.5rem',
                              fontWeight: 600
                            }}
                          >
                            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                          </Avatar>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="h4" sx={{ fontWeight: 600, mb: 0.5 }}>
                              {user.name}
                            </Typography>
                            <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                              {user.email}
                            </Typography>
                            <Chip 
                              label={user.role === 'employer' ? 'Employer' : 'Intern'} 
                              size="small" 
                              color="primary"
                              sx={{ textTransform: 'capitalize', fontWeight: 500 }}
                            />
                          </Box>
                        </Box>
                      </Box>
                      <Divider />
                    </>
                  )}
                  
                  <ListItemButton 
                    selected={selectedIndex === 0} 
                    onClick={handleProfileClick}
                    sx={{
                      py: 1.5,
                      '&:hover': {
                        bgcolor: theme.palette.primary.light + '20'
                      }
                    }}
                  >
                    <ListItemIcon>
                      <PersonTwoToneIcon sx={{ color: theme.palette.primary.main }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary={<Typography variant="body1" fontWeight={500}>My Profile</Typography>} 
                    />
                  </ListItemButton>
                  
                  <ListItemButton 
                    onClick={handleGoToHome}
                    sx={{
                      py: 1.5,
                      '&:hover': {
                        bgcolor: theme.palette.primary.light + '20'
                      }
                    }}
                  >
                    <ListItemIcon>
                      <HomeIcon sx={{ color: theme.palette.info.main }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary={<Typography variant="body1" fontWeight={500}>Back to Home</Typography>} 
                    />
                  </ListItemButton>
                  
                  <Divider sx={{ my: 0.5 }} />
                  
                  <ListItemButton 
                    selected={selectedIndex === 1} 
                    onClick={handleLogoutClick}
                    sx={{
                      py: 1.5,
                      '&:hover': {
                        bgcolor: theme.palette.error.light + '20'
                      }
                    }}
                  >
                    <ListItemIcon>
                      <LogoutIcon sx={{ color: theme.palette.secondary.dark }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary={<Typography variant="body1" fontWeight={500} color="error">Logout</Typography>} 
                    />
                  </ListItemButton>
                </List>
              </ClickAwayListener>
            </Paper>
          </Fade>
        )}
      </Popper>

      {/* Logout Confirmation Dialog */}
      <Dialog
        open={logoutDialogOpen}
        onClose={handleLogoutCancel}
        aria-labelledby="logout-dialog-title"
        aria-describedby="logout-dialog-description"
        PaperProps={{
          sx: {
            borderRadius: 2,
            minWidth: 320
          }
        }}
      >
        <DialogTitle 
          id="logout-dialog-title"
          sx={{ 
            pb: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 1.5
          }}
        >
          <Avatar sx={{ bgcolor: theme.palette.secondary.dark }}>
            <LogoutIcon />
          </Avatar>
          <Typography variant="h3">Confirm Logout</Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="logout-dialog-description" sx={{ fontSize: '1rem' }}>
            Are you sure you want to logout? You will need to login again to access your account.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, pt: 1 }}>
          <Button 
            onClick={handleLogoutCancel} 
            variant="outlined"
            sx={{ 
              borderRadius: 1.5,
              textTransform: 'none',
              fontWeight: 500,
              px: 3
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleLogoutConfirm} 
            variant="contained" 
            color="error"
            autoFocus
            sx={{ 
              borderRadius: 1.5,
              textTransform: 'none',
              fontWeight: 500,
              px: 3
            }}
          >
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ProfileSection;
