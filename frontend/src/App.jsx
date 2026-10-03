import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { useAuth } from './hooks/useAuth';

// Layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

// Pages
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import NetworkTopologyPage from './pages/NetworkTopologyPage';
import VpcsPage from './pages/VpcsPage';
import TransitGatewayPage from './pages/TransitGatewayPage';
import RouteTablesPage from './pages/RouteTablesPage';
import Ec2Page from './pages/Ec2Page';
import ConnectivityPage from './pages/ConnectivityPage';
import SecurityPage from './pages/SecurityPage';
import MonitoringPage from './pages/MonitoringPage';
import AiAssistantPage from './pages/AiAssistantPage';
import AuditLogsPage from './pages/AuditLogsPage';
import NotFoundPage from './pages/NotFoundPage';

// Protected Route Guard
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Public Route Guard (redirects to dashboard if already logged in)
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

export const App = () => {
  return (
    <AuthProvider>
      <ToastProvider>
        <Routes>
          {/* Public Auth Routes */}
          <Route element={<AuthLayout />}>
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <LoginPage />
                </PublicRoute>
              }
            />
          </Route>

          {/* Protected Enterprise Console Routes */}
          <Route
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/network-topology" element={<NetworkTopologyPage />} />
            <Route path="/vpcs" element={<VpcsPage />} />
            <Route path="/transit-gateway" element={<TransitGatewayPage />} />
            <Route path="/route-tables" element={<RouteTablesPage />} />
            <Route path="/ec2" element={<Ec2Page />} />
            <Route path="/connectivity" element={<ConnectivityPage />} />
            <Route path="/security" element={<SecurityPage />} />
            <Route path="/monitoring" element={<MonitoringPage />} />
            <Route path="/ai-assistant" element={<AiAssistantPage />} />
            <Route path="/audit-logs" element={<AuditLogsPage />} />
          </Route>

          {/* Catch-all 404 Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </ToastProvider>
    </AuthProvider>
  );
};

export default App;
