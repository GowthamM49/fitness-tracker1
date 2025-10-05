import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Layout Components
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';

// Auth Pages
import Login from './pages/Login';
import Register from './pages/Register';

// Main Pages
import Dashboard from './pages/Dashboard';
import WorkoutPage from './pages/WorkoutPage';
import DietPage from './pages/DietPage';
import ProgressPage from './pages/ProgressPage';
import CommunityPage from './pages/CommunityPage';
import ProfilePage from './pages/ProfilePage';
import AdminPanel from './pages/AdminPanel';

// Protected Route Component
import ProtectedRoute from './components/auth/ProtectedRoute';

const theme = createTheme({
  palette: {
    primary: {
      main: '#0ea5e9',
    },
    secondary: {
      main: '#d946ef',
    },
  },
});

// Layout component for authenticated pages
const AuthenticatedLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex" style={{ marginTop: '64px' }}>
        <Sidebar />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

// Layout component for public pages (login, register)
const PublicLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-1" style={{ marginTop: '64px' }}>
        {children}
      </main>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={
              <PublicLayout>
                <Login />
              </PublicLayout>
            } />
            <Route path="/register" element={
              <PublicLayout>
                <Register />
              </PublicLayout>
            } />
            
            {/* Protected Routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <Dashboard />
                </AuthenticatedLayout>
              </ProtectedRoute>
            } />
            <Route path="/workout" element={
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <WorkoutPage />
                </AuthenticatedLayout>
              </ProtectedRoute>
            } />
            <Route path="/diet" element={
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <DietPage />
                </AuthenticatedLayout>
              </ProtectedRoute>
            } />
            <Route path="/progress" element={
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <ProgressPage />
                </AuthenticatedLayout>
              </ProtectedRoute>
            } />
            <Route path="/community" element={
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <CommunityPage />
                </AuthenticatedLayout>
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <ProfilePage />
                </AuthenticatedLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute requireRole={['admin', 'faculty']}>
                <AuthenticatedLayout>
                  <AdminPanel />
                </AuthenticatedLayout>
              </ProtectedRoute>
            } />
            
            {/* Redirect to dashboard if route not found */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
