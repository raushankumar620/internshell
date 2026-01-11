import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Switch,
  FormControlLabel,
  TextField,
  Button,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Avatar,
  Chip,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Snackbar
} from '@mui/material';
import {
  Security,
  Shield,
  Key,
  Visibility,
  Block,
  CheckCircle,
  Warning,
  Edit,
  Delete,
  Add,
  VpnKey,
  AdminPanelSettings,
  History,
} from '@mui/icons-material';
import AdminLayout from './AdminLayout';
import api from '../../services/api';

const SecurityPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: true,
    passwordPolicy: true,
    loginAttempts: true,
    emailNotifications: true,
    auditLogs: true,
  });

  const [securityData, setSecurityData] = useState({
    securityScore: 95,
    securityAlerts: 2,
    activeApiKeys: 2
  });

  const [openApiDialog, setOpenApiDialog] = useState(false);
  const [newApiKey, setNewApiKey] = useState({ name: '', permissions: ['read'] });
  const [apiKeys, setApiKeys] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);

  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    loadSecurityData();
  }, []);

  const loadSecurityData = async () => {
    try {
      setLoading(true);
      const [settingsResponse, apiKeysResponse, auditLogsResponse] = await Promise.all([
        api.get('/admin/security/settings'),
        api.get('/admin/security/api-keys'),
        api.get('/admin/security/audit-logs')
      ]);

      setSettings(settingsResponse.data.settings);
      setSecurityData({
        securityScore: settingsResponse.data.securityScore,
        securityAlerts: settingsResponse.data.securityAlerts,
        activeApiKeys: settingsResponse.data.activeApiKeys
      });
      setApiKeys(apiKeysResponse.data.apiKeys);
      setAuditLogs(auditLogsResponse.data.logs);
    } catch (error) {
      console.error('Failed to load security data:', error);
      setNotification({
        open: true,
        message: 'Failed to load security data',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSettingChange = async (setting) => {
    try {
      const newSettings = { ...settings, [setting]: !settings[setting] };
      setSettings(newSettings);

      await api.put('/admin/security/settings', newSettings);
      
      setNotification({
        open: true,
        message: 'Security settings updated successfully',
        severity: 'success'
      });
    } catch (error) {
      console.error('Failed to update security settings:', error);
      // Revert the change
      setSettings(prev => ({ ...prev, [setting]: !prev[setting] }));
      setNotification({
        open: true,
        message: 'Failed to update security settings',
        severity: 'error'
      });
    }
  };

  const handleCreateApiKey = async () => {
    try {
      const response = await api.post('/admin/security/api-keys', newApiKey);
      setApiKeys(prev => [...prev, response.data.apiKey]);
      setOpenApiDialog(false);
      setNewApiKey({ name: '', permissions: ['read'] });
      
      setNotification({
        open: true,
        message: 'API key created successfully',
        severity: 'success'
      });

      // Refresh security data
      loadSecurityData();
    } catch (error) {
      console.error('Failed to create API key:', error);
      setNotification({
        open: true,
        message: 'Failed to create API key',
        severity: 'error'
      });
    }
  };

  const handleDeleteApiKey = async (keyId) => {
    try {
      await api.delete(`/admin/security/api-keys/${keyId}`);
      setApiKeys(prev => prev.filter(key => key.id !== keyId));
      
      setNotification({
        open: true,
        message: 'API key deleted successfully',
        severity: 'success'
      });

      // Refresh security data
      loadSecurityData();
    } catch (error) {
      console.error('Failed to delete API key:', error);
      setNotification({
        open: true,
        message: 'Failed to delete API key',
        severity: 'error'
      });
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const TabPanel = ({ children, value, index }) => (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );

  return (
    <AdminLayout title="Security Settings">
      <Box sx={{ p: 3 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
            <CircularProgress size={60} />
          </Box>
        ) : (
          <>
            {/* Security Overview */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} md={4}>
                <Card sx={{ background: 'linear-gradient(45deg, #4caf50 30%, #8bc34a 90%)' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', color: 'white' }}>
                      <Shield sx={{ fontSize: 40, mr: 2 }} />
                      <Box>
                        <Typography variant="h6">Security Score</Typography>
                        <Typography variant="h4">{securityData.securityScore}/100</Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card sx={{ background: 'linear-gradient(45deg, #f44336 30%, #e91e63 90%)' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', color: 'white' }}>
                      <Warning sx={{ fontSize: 40, mr: 2 }} />
                      <Box>
                        <Typography variant="h6">Security Alerts</Typography>
                        <Typography variant="h4">{securityData.securityAlerts}</Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card sx={{ background: 'linear-gradient(45deg, #2196f3 30%, #21cbf3 90%)' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', color: 'white' }}>
                      <Key sx={{ fontSize: 40, mr: 2 }} />
                      <Box>
                        <Typography variant="h6">Active API Keys</Typography>
                        <Typography variant="h4">{securityData.activeApiKeys}</Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Security Tabs */}
            <Card>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={activeTab} onChange={handleTabChange}>
                  <Tab label="General Settings" />
                  <Tab label="API Keys" />
                  <Tab label="Audit Logs" />
                  <Tab label="Access Control" />
                </Tabs>
              </Box>

          {/* General Settings Tab */}
          <TabPanel value={activeTab} index={0}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Authentication Settings
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <Security />
                    </ListItemIcon>
                    <ListItemText
                      primary="Two-Factor Authentication"
                      secondary="Add an extra layer of security to admin accounts"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={settings.twoFactorAuth}
                        onChange={() => handleSettingChange('twoFactorAuth')}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Key />
                    </ListItemIcon>
                    <ListItemText
                      primary="Strong Password Policy"
                      secondary="Enforce minimum 8 characters with special symbols"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={settings.passwordPolicy}
                        onChange={() => handleSettingChange('passwordPolicy')}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Block />
                    </ListItemIcon>
                    <ListItemText
                      primary="Login Attempt Limits"
                      secondary="Block users after 5 failed login attempts"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={settings.loginAttempts}
                        onChange={() => handleSettingChange('loginAttempts')}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                </List>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Session & Monitoring
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <Visibility />
                    </ListItemIcon>
                    <ListItemText
                      primary="Session Timeout"
                      secondary="Auto logout after 30 minutes of inactivity"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={settings.sessionTimeout}
                        onChange={() => handleSettingChange('sessionTimeout')}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <History />
                    </ListItemIcon>
                    <ListItemText
                      primary="Audit Logs"
                      secondary="Keep detailed logs of all admin actions"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={settings.auditLogs}
                        onChange={() => handleSettingChange('auditLogs')}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                </List>
              </Grid>
            </Grid>
          </TabPanel>

          {/* API Keys Tab */}
          <TabPanel value={activeTab} index={1}>
            <Box sx={{ display: 'flex', justifyContent: 'between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">API Keys Management</Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setOpenApiDialog(true)}
              >
                Create API Key
              </Button>
            </Box>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Key</TableCell>
                    <TableCell>Permissions</TableCell>
                    <TableCell>Last Used</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {apiKeys.map((key) => (
                    <TableRow key={key.id}>
                      <TableCell>{key.name}</TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                          {key.key}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {key.permissions.map((permission) => (
                          <Chip key={permission} label={permission} size="small" sx={{ mr: 0.5 }} />
                        ))}
                      </TableCell>
                      <TableCell>
                        {key.lastUsed ? new Date(key.lastUsed).toLocaleDateString() : 'Never'}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={key.status}
                          color={key.status === 'active' ? 'success' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton size="small" color="primary">
                          <Edit />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          color="error"
                          onClick={() => handleDeleteApiKey(key.id)}
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>

          {/* Audit Logs Tab */}
          <TabPanel value={activeTab} index={2}>
            <Typography variant="h6" gutterBottom>
              Recent Activity
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Timestamp</TableCell>
                    <TableCell>User</TableCell>
                    <TableCell>Action</TableCell>
                    <TableCell>IP Address</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {auditLogs.map((log, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        {new Date(log.timestamp).toLocaleString()}
                      </TableCell>
                      <TableCell>{log.user}</TableCell>
                      <TableCell>{log.action}</TableCell>
                      <TableCell>{log.ip}</TableCell>
                      <TableCell>
                        <Chip
                          label={log.status}
                          color={log.status === 'success' ? 'success' : 'error'}
                          size="small"
                          icon={log.status === 'success' ? <CheckCircle /> : <Warning />}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>

          {/* Access Control Tab */}
          <TabPanel value={activeTab} index={3}>
            <Typography variant="h6" gutterBottom>
              Admin Role Management
            </Typography>
            <Alert severity="info" sx={{ mb: 3 }}>
              Configure access levels and permissions for different admin roles.
            </Alert>
            <Typography variant="body1">
              This feature will be available in the next update.
            </Typography>
          </TabPanel>
        </Card>

        {/* Create API Key Dialog */}
        <Dialog open={openApiDialog} onClose={() => setOpenApiDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Create New API Key</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Key Name"
              value={newApiKey.name}
              onChange={(e) => setNewApiKey(prev => ({ ...prev, name: e.target.value }))}
              margin="normal"
            />
            <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
              Permissions
            </Typography>
            {/* Add permission checkboxes here */}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenApiDialog(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleCreateApiKey}>
              Create Key
            </Button>
          </DialogActions>
        </Dialog>

        {/* Notification Snackbar */}
        <Snackbar
          open={notification.open}
          autoHideDuration={6000}
          onClose={() => setNotification({ ...notification, open: false })}
        >
          <Alert 
            onClose={() => setNotification({ ...notification, open: false })} 
            severity={notification.severity}
            variant="filled"
          >
            {notification.message}
          </Alert>
        </Snackbar>
        </>
        )}
      </Box>
    </AdminLayout>
  );
};

export default SecurityPage;