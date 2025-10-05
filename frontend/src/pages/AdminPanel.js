import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Assessment as ReportsIcon,
  Assessment,
  FileDownload as ExportIcon,
  TrendingUp as StatsIcon,
  People as UsersIcon,
  People,
  Dashboard as DashboardIcon,
  Refresh as RefreshIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';
import { api } from '../services/api';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedReport, setSelectedReport] = useState('');
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  });
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState({ role: '', isActive: '' });

  useEffect(() => {
    loadDashboardData();
    loadUsers();
  }, []);

  const loadDashboardData = async () => {
    try {
      const response = await api.get('/admin/dashboard');
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const loadUsers = async () => {
    try {
      const response = await api.get('/admin/users');
      setUsers(response.data.users);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const generateReport = async () => {
    if (!selectedReport) {
      alert('Please select a report type');
      return;
    }

    setLoading(true);
    try {
      let endpoint = '';
      switch (selectedReport) {
        case 'User Progress Reports':
          endpoint = '/admin/reports/user-progress';
          break;
        case 'Workout Statistics Reports':
          endpoint = '/admin/reports/workout-stats';
          break;
        case 'Diet Reports':
          endpoint = '/admin/reports/diet-analytics';
          break;
        case 'Community Participation Reports':
          endpoint = '/admin/reports/community-stats';
          break;
        default:
          throw new Error('Invalid report type');
      }

      const params = {
        startDate: dateRange.start,
        endDate: dateRange.end
      };

      const response = await api.get(endpoint, { params });
      setReportData(response.data);
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Error generating report');
    } finally {
      setLoading(false);
    }
  };

  const exportReport = async (format) => {
    if (!reportData) {
      alert('Please generate a report first');
      return;
    }

    try {
      // This would integrate with your export utilities
      alert(`${format} export functionality will be implemented with export libraries`);
    } catch (error) {
      console.error('Error exporting report:', error);
    }
  };

  const reportTypes = [
    'User Progress Reports',
    'Workout Statistics Reports',
    'Diet Reports',
    'Community Participation Reports'
  ];

  const renderDashboard = () => (
    <Grid container spacing={3}>
      {/* Overview Cards */}
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography color="textSecondary" gutterBottom variant="h6">
                  Total Users
                </Typography>
                <Typography variant="h4">
                  {dashboardData?.overview?.totalUsers || 0}
                </Typography>
              </Box>
              <UsersIcon color="primary" sx={{ fontSize: 40 }} />
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography color="textSecondary" gutterBottom variant="h6">
                  Students
                </Typography>
                <Typography variant="h4">
                  {dashboardData?.overview?.totalStudents || 0}
                </Typography>
              </Box>
              <People color="secondary" sx={{ fontSize: 40 }} />
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography color="textSecondary" gutterBottom variant="h6">
                  Total Workouts
                </Typography>
                <Typography variant="h4">
                  {dashboardData?.overview?.totalWorkouts || 0}
                </Typography>
              </Box>
              <StatsIcon color="success" sx={{ fontSize: 40 }} />
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography color="textSecondary" gutterBottom variant="h6">
                  Challenges
                </Typography>
                <Typography variant="h4">
                  {dashboardData?.overview?.totalChallenges || 0}
                </Typography>
              </Box>
              <Assessment color="warning" sx={{ fontSize: 40 }} />
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Recent Activity */}
      <Grid size={{ xs: 12, md: 6 }}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Recent Users
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Joined</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dashboardData?.recentActivity?.recentUsers?.map((user, index) => (
                    <TableRow key={index}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>
                        <Chip 
                          label={user.role} 
                          color={user.role === 'admin' ? 'error' : user.role === 'faculty' ? 'warning' : 'primary'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Recent Workouts
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>User</TableCell>
                    <TableCell>Workout</TableCell>
                    <TableCell>Duration</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dashboardData?.recentActivity?.recentWorkouts?.map((workout, index) => (
                    <TableRow key={index}>
                      <TableCell>{workout.userId?.name || 'Unknown'}</TableCell>
                      <TableCell>{workout.name}</TableCell>
                      <TableCell>{workout.duration} min</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderReports = () => (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, md: 6 }}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Generate Reports
            </Typography>
            
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Report Type</InputLabel>
              <Select
                value={selectedReport}
                onChange={(e) => setSelectedReport(e.target.value)}
              >
                {reportTypes.map((type) => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <TextField
              fullWidth
              label="Start Date"
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
              sx={{ mb: 2 }}
              InputLabelProps={{ shrink: true }}
            />
            
            <TextField
              fullWidth
              label="End Date"
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
              sx={{ mb: 2 }}
              InputLabelProps={{ shrink: true }}
            />
            
            <Button
              variant="contained"
              startIcon={loading ? <CircularProgress size={20} /> : <ReportsIcon />}
              fullWidth
              sx={{ mb: 1 }}
              onClick={generateReport}
              disabled={loading}
            >
              {loading ? 'Generating...' : 'Generate Report'}
            </Button>
            
            <Box display="flex" gap={1}>
              <Button
                variant="outlined"
                startIcon={<ExportIcon />}
                fullWidth
                onClick={() => exportReport('PDF')}
                disabled={!reportData}
              >
                Export PDF
              </Button>
              <Button
                variant="outlined"
                startIcon={<ExportIcon />}
                fullWidth
                onClick={() => exportReport('Excel')}
                disabled={!reportData}
              >
                Export Excel
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid size={{ xs: 12, md: 6 }}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Report Results
            </Typography>
            {reportData ? (
              <Box>
                <Typography variant="subtitle1" color="primary" gutterBottom>
                  {reportData.reportType}
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Generated: {new Date(reportData.generatedAt).toLocaleString()}
                </Typography>
                
                {reportData.statistics && (
                  <Box mt={2}>
                    <Typography variant="h6" gutterBottom>
                      Statistics
                    </Typography>
                    {Object.entries(reportData.statistics).map(([key, value]) => (
                      <Typography key={key} variant="body2">
                        <strong>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</strong> {value}
                      </Typography>
                    ))}
                  </Box>
                )}
              </Box>
            ) : (
              <Typography color="textSecondary">
                Generate a report to see results here
              </Typography>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderUsers = () => (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">
            User Management
          </Typography>
          <Tooltip title="Refresh">
            <IconButton onClick={loadUsers}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Joined</TableCell>
                <TableCell>Points</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Chip 
                      label={user.role} 
                      color={user.role === 'admin' ? 'error' : user.role === 'faculty' ? 'warning' : 'primary'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={user.isActive ? 'Active' : 'Inactive'} 
                      color={user.isActive ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>{user.points || 0}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Admin Panel - Reports & Analytics
      </Typography>

      <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} sx={{ mb: 3 }}>
        <Tab icon={<DashboardIcon />} label="Dashboard" />
        <Tab icon={<ReportsIcon />} label="Reports" />
        <Tab icon={<UsersIcon />} label="Users" />
      </Tabs>

      {activeTab === 0 && renderDashboard()}
      {activeTab === 1 && renderReports()}
      {activeTab === 2 && renderUsers()}
    </Box>
  );
};

export default AdminPanel;
