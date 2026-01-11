import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  LinearProgress,
  IconButton,
  Tooltip,
  Button,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  People,
  Work,
  Assignment,
  Visibility,
  Download,
  Refresh,
} from '@mui/icons-material';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import AdminLayout from './AdminLayout';

const AnalyticsPage = () => {
  const [analyticsData, setAnalyticsData] = useState({
    overview: {
      totalUsers: 1248,
      totalJobs: 89,
      totalApplications: 456,
      activeUsers: 987,
    },
    userGrowth: [
      { month: 'Jan', users: 400, jobs: 20, applications: 80 },
      { month: 'Feb', users: 500, jobs: 25, applications: 120 },
      { month: 'Mar', users: 650, jobs: 30, applications: 160 },
      { month: 'Apr', users: 800, jobs: 35, applications: 200 },
      { month: 'May', users: 950, jobs: 45, applications: 280 },
      { month: 'Jun', users: 1100, jobs: 55, applications: 350 },
      { month: 'Jul', users: 1248, jobs: 65, applications: 456 },
    ],
    deviceStats: [
      { name: 'Desktop', value: 45, color: '#8884d8' },
      { name: 'Mobile', value: 35, color: '#82ca9d' },
      { name: 'Tablet', value: 20, color: '#ffc658' },
    ],
    topJobs: [
      { title: 'Software Engineer Intern', applications: 45, views: 234 },
      { title: 'Marketing Intern', applications: 38, views: 189 },
      { title: 'Data Science Intern', applications: 32, views: 156 },
      { title: 'Design Intern', applications: 28, views: 145 },
      { title: 'Business Analyst Intern', applications: 25, views: 134 },
    ],
  });

  const StatCard = ({ title, value, change, icon, color }) => (
    <Card sx={{ height: '100%', background: `linear-gradient(45deg, ${color}20, ${color}10)` }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography color="textSecondary" gutterBottom variant="overline">
              {title}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
              {value}
            </Typography>
            {change && (
              <Chip
                icon={change > 0 ? <TrendingUp /> : <TrendingDown />}
                label={`${change > 0 ? '+' : ''}${change}%`}
                color={change > 0 ? 'success' : 'error'}
                size="small"
                variant="outlined"
              />
            )}
          </Box>
          <Box sx={{ color, opacity: 0.8 }}>
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <AdminLayout title="Analytics Dashboard">
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
              Analytics Dashboard
            </Typography>
            <Typography variant="body2" color="text.secondary">
            Monitor platform performance and user engagement
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            sx={{
              borderColor: '#e0e0e0',
              color: '#666'
            }}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<Download />}
            sx={{
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #e084f0 0%, #ec4a5f 100%)'
              }
            }}
          >
            Export Report
          </Button>
        </Box>
      </Box>
        {/* Overview Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Users"
              value="1,248"
              change={12}
              icon={<People sx={{ fontSize: 40 }} />}
              color="#1976d2"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Active Jobs"
              value="89"
              change={8}
              icon={<Work sx={{ fontSize: 40 }} />}
              color="#388e3c"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Applications"
              value="456"
              change={15}
              icon={<Assignment sx={{ fontSize: 40 }} />}
              color="#f57c00"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Active Users"
              value="987"
              change={-2}
              icon={<TrendingUp sx={{ fontSize: 40 }} />}
              color="#7b1fa2"
            />
          </Grid>
        </Grid>

        {/* Charts */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* User Growth Chart */}
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Growth Trends
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={analyticsData.userGrowth}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <RechartsTooltip />
                    <Area type="monotone" dataKey="users" stackId="1" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="jobs" stackId="1" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="applications" stackId="1" stroke="#ffc658" fill="#ffc658" fillOpacity={0.6} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Device Stats */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Device Usage
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analyticsData.deviceStats}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {analyticsData.deviceStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Top Jobs Table */}
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Top Performing Jobs
              </Typography>
              <Box>
                <Tooltip title="Refresh">
                  <IconButton size="small">
                    <Refresh />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Export">
                  <IconButton size="small">
                    <Download />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
            <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Job Title</TableCell>
                    <TableCell align="right">Applications</TableCell>
                    <TableCell align="right">Views</TableCell>
                    <TableCell align="right">Conversion Rate</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {analyticsData.topJobs.map((job, index) => (
                    <TableRow key={index}>
                      <TableCell component="th" scope="row">
                        {job.title}
                      </TableCell>
                      <TableCell align="right">{job.applications}</TableCell>
                      <TableCell align="right">{job.views}</TableCell>
                      <TableCell align="right">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <LinearProgress
                            variant="determinate"
                            value={(job.applications / job.views) * 100}
                            sx={{ flexGrow: 1, height: 8, borderRadius: 4 }}
                          />
                          <Typography variant="body2" color="textSecondary">
                            {((job.applications / job.views) * 100).toFixed(1)}%
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Box>
    </AdminLayout>
  );
}

export default AnalyticsPage;