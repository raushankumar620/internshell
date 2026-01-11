import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Switch,
  FormControlLabel,
  Button,
  Divider,
  Alert,
  TextField,
  MenuItem,
  Chip,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tab,
  Tabs,
  FormControl,
  InputLabel,
  Select
} from '@mui/material';
import {
  Settings,
  Security,
  Notifications,
  Email,
  Sms,
  Language,
  Palette,
  Save,
  RestartAlt,
  Edit,
  Delete,
  Add,
  Backup,
  CloudDownload,
  Update,
  AdminPanelSettings
} from '@mui/icons-material';
import api from '../../services/api';

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [settings, setSettings] = useState({
    // General Settings
    siteName: 'InternShell',
    siteDescription: 'Professional Internship Platform',
    siteUrl: 'https://internshell.com',
    contactEmail: 'contact@internshell.com',
    timezone: 'UTC',
    dateFormat: 'MM/DD/YYYY',
    language: 'en',
    
    // Security Settings
    enableTwoFactor: true,
    sessionTimeout: 30,
    passwordExpiry: 90,
    loginAttempts: 5,
    enableCaptcha: true,
    enableAuditLog: true,
    
    // Email Settings
    emailNotifications: true,
    emailProvider: 'smtp',
    smtpHost: '',
    smtpPort: 587,
    smtpUser: '',
    smtpPassword: '',
    enableSsl: true,
    
    // Notification Settings
    newUserNotification: true,
    newJobNotification: true,
    applicationNotification: true,
    systemAlerts: true,
    maintenanceMode: false,
    
    // Appearance Settings
    darkMode: false,
    primaryColor: '#667eea',
    secondaryColor: '#764ba2',
    logoUrl: '',
    faviconUrl: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  const [openDialog, setOpenDialog] = useState(false);
  const [backupData, setBackupData] = useState(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/settings');
      setSettings(response.data.settings || settings);
    } catch (error) {
      console.error('Failed to load settings:', error);
      showAlert('error', 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      await api.put('/admin/settings', settings);
      showAlert('success', 'Settings saved successfully!');
    } catch (error) {
      console.error('Failed to save settings:', error);
      showAlert('error', 'Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setOpenDialog(true);
  };

  const confirmReset = async () => {
    try {
      setLoading(true);
      await api.delete('/admin/settings');
      await loadSettings();
      showAlert('success', 'Settings reset to defaults');
      setOpenDialog(false);
    } catch (error) {
      console.error('Failed to reset settings:', error);
      showAlert('error', 'Failed to reset settings');
    } finally {
      setLoading(false);
    }
  };

  const handleBackup = async () => {
    try {
      const response = await api.get('/admin/backup');
      const blob = new Blob([JSON.stringify(response.data, null, 2)], {
        type: 'application/json'
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `internshell-backup-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      window.URL.revokeObjectURL(url);
      showAlert('success', 'Backup downloaded successfully');
    } catch (error) {
      console.error('Failed to create backup:', error);
      showAlert('error', 'Failed to create backup');
    }
  };

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(() => setAlert({ show: false, type: '', message: '' }), 5000);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleSettingChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const TabPanel = ({ children, value, index }) => (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );

  const renderGeneralSettings = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Site Name"
          value={settings.siteName}
          onChange={(e) => handleSettingChange('siteName', e.target.value)}
          variant="outlined"
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Contact Email"
          value={settings.contactEmail}
          onChange={(e) => handleSettingChange('contactEmail', e.target.value)}
          variant="outlined"
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Site Description"
          value={settings.siteDescription}
          onChange={(e) => handleSettingChange('siteDescription', e.target.value)}
          variant="outlined"
          multiline
          rows={3}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <FormControl fullWidth>
          <InputLabel>Timezone</InputLabel>
          <Select
            value={settings.timezone}
            onChange={(e) => handleSettingChange('timezone', e.target.value)}
            label="Timezone"
          >
            <MenuItem value="UTC">UTC</MenuItem>
            <MenuItem value="America/New_York">Eastern Time</MenuItem>
            <MenuItem value="America/Chicago">Central Time</MenuItem>
            <MenuItem value="America/Denver">Mountain Time</MenuItem>
            <MenuItem value="America/Los_Angeles">Pacific Time</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} md={6}>
        <FormControl fullWidth>
          <InputLabel>Language</InputLabel>
          <Select
            value={settings.language}
            onChange={(e) => handleSettingChange('language', e.target.value)}
            label="Language"
          >
            <MenuItem value="en">English</MenuItem>
            <MenuItem value="es">Spanish</MenuItem>
            <MenuItem value="fr">French</MenuItem>
            <MenuItem value="de">German</MenuItem>
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );

  const renderSecuritySettings = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          Authentication & Security
        </Typography>
      </Grid>
      <Grid item xs={12} md={6}>
        <FormControlLabel
          control={
            <Switch
              checked={settings.enableTwoFactor}
              onChange={(e) => handleSettingChange('enableTwoFactor', e.target.checked)}
            />
          }
          label="Enable Two-Factor Authentication"
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <FormControlLabel
          control={
            <Switch
              checked={settings.enableCaptcha}
              onChange={(e) => handleSettingChange('enableCaptcha', e.target.checked)}
            />
          }
          label="Enable CAPTCHA"
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Session Timeout (minutes)"
          type="number"
          value={settings.sessionTimeout}
          onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e.target.value))}
          variant="outlined"
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Max Login Attempts"
          type="number"
          value={settings.loginAttempts}
          onChange={(e) => handleSettingChange('loginAttempts', parseInt(e.target.value))}
          variant="outlined"
        />
      </Grid>
      <Grid item xs={12}>
        <FormControlLabel
          control={
            <Switch
              checked={settings.enableAuditLog}
              onChange={(e) => handleSettingChange('enableAuditLog', e.target.checked)}
            />
          }
          label="Enable Audit Logging"
        />
      </Grid>
    </Grid>
  );

  const renderNotificationSettings = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          System Notifications
        </Typography>
      </Grid>
      <Grid item xs={12} md={6}>
        <FormControlLabel
          control={
            <Switch
              checked={settings.newUserNotification}
              onChange={(e) => handleSettingChange('newUserNotification', e.target.checked)}
            />
          }
          label="New User Registrations"
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <FormControlLabel
          control={
            <Switch
              checked={settings.newJobNotification}
              onChange={(e) => handleSettingChange('newJobNotification', e.target.checked)}
            />
          }
          label="New Job Postings"
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <FormControlLabel
          control={
            <Switch
              checked={settings.applicationNotification}
              onChange={(e) => handleSettingChange('applicationNotification', e.target.checked)}
            />
          }
          label="Job Applications"
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <FormControlLabel
          control={
            <Switch
              checked={settings.systemAlerts}
              onChange={(e) => handleSettingChange('systemAlerts', e.target.checked)}
            />
          }
          label="System Alerts"
        />
      </Grid>
      <Grid item xs={12}>
        <Divider sx={{ my: 2 }} />
        <Typography variant="h6" gutterBottom>
          Maintenance
        </Typography>
        <FormControlLabel
          control={
            <Switch
              checked={settings.maintenanceMode}
              onChange={(e) => handleSettingChange('maintenanceMode', e.target.checked)}
              color="warning"
            />
          }
          label="Maintenance Mode"
        />
        {settings.maintenanceMode && (
          <Alert severity="warning" sx={{ mt: 2 }}>
            Maintenance mode is enabled. Users will see a maintenance page.
          </Alert>
        )}
      </Grid>
    </Grid>
  );

  const renderEmailSettings = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          Email Configuration
        </Typography>
      </Grid>
      <Grid item xs={12} md={6}>
        <FormControl fullWidth>
          <InputLabel>Email Provider</InputLabel>
          <Select
            value={settings.emailProvider}
            onChange={(e) => handleSettingChange('emailProvider', e.target.value)}
            label="Email Provider"
          >
            <MenuItem value="smtp">SMTP</MenuItem>
            <MenuItem value="sendgrid">SendGrid</MenuItem>
            <MenuItem value="mailgun">Mailgun</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="SMTP Host"
          value={settings.smtpHost}
          onChange={(e) => handleSettingChange('smtpHost', e.target.value)}
          variant="outlined"
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="SMTP Port"
          type="number"
          value={settings.smtpPort}
          onChange={(e) => handleSettingChange('smtpPort', parseInt(e.target.value))}
          variant="outlined"
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="SMTP Username"
          value={settings.smtpUser}
          onChange={(e) => handleSettingChange('smtpUser', e.target.value)}
          variant="outlined"
        />
      </Grid>
      <Grid item xs={12}>
        <FormControlLabel
          control={
            <Switch
              checked={settings.enableSsl}
              onChange={(e) => handleSettingChange('enableSsl', e.target.checked)}
            />
          }
          label="Enable SSL/TLS"
        />
      </Grid>
    </Grid>
  );

  return (
    <Box sx={{ p: 3 }}>
      {/* Enhanced Header */}
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 3,
          p: 2,
          backgroundColor: '#fff',
          borderRadius: 2,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}
      >
        <Box>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 700, 
              color: '#1a1a1a',
              mb: 0.5
            }}
          >
            System Settings
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Configure your application settings and preferences
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<RestartAlt />}
            onClick={handleReset}
            sx={{
              borderColor: '#e0e0e0',
              color: '#ff9800'
            }}
          >
            Reset to Defaults
          </Button>
          <Button
            variant="contained"
            startIcon={<Save />}
            onClick={handleSave}
            disabled={loading}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
              }
            }}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </Box>
      </Box>

      {/* Alert */}
      {alert.show && (
        <Alert severity={alert.type} sx={{ mb: 3 }}>
          {alert.message}
        </Alert>
      )}

      {/* Settings Card */}
      <Card sx={{ borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab icon={<Settings />} label="General" />
            <Tab icon={<Security />} label="Security" />
            <Tab icon={<Notifications />} label="Notifications" />
            <Tab icon={<Email />} label="Email" />
          </Tabs>
        </Box>

        <TabPanel value={activeTab} index={0}>
          {renderGeneralSettings()}
        </TabPanel>

        <TabPanel value={activeTab} index={1}>
          {renderSecuritySettings()}
        </TabPanel>

        <TabPanel value={activeTab} index={2}>
          {renderNotificationSettings()}
        </TabPanel>

        <TabPanel value={activeTab} index={3}>
          {renderEmailSettings()}
        </TabPanel>

        {/* Action Buttons */}
        <Box sx={{ p: 3, borderTop: 1, borderColor: 'divider', bgcolor: '#f8f9fa' }}>
          <Grid container spacing={2} justifyContent="space-between">
            <Grid item>
              <Button
                variant="outlined"
                startIcon={<Backup />}
                onClick={handleBackup}
                sx={{ mr: 2 }}
              >
                Backup Settings
              </Button>
              <Button
                variant="outlined"
                color="warning"
                startIcon={<RestartAlt />}
                onClick={handleReset}
              >
                Reset to Defaults
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                startIcon={<Save />}
                onClick={handleSave}
                disabled={loading}
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                  }
                }}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Card>

      {/* Reset Confirmation Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Reset Settings</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to reset all settings to their default values? 
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={confirmReset} color="warning" variant="contained">
            Reset
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminSettings;