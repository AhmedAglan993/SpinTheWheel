import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import { LoginPage, SignupPage } from './pages/AuthPages';
import AdminLayout from './pages/admin/AdminLayout';
import DashboardPage from './pages/admin/DashboardPage';
import SettingsPage from './pages/admin/SettingsPage';
import PrizesPage from './pages/admin/PrizesPage';
import UsersPage from './pages/admin/UsersPage';
import ProjectsPage from './pages/admin/ProjectsPage';
import SubscriptionPage from './pages/admin/SubscriptionPage';
import SpinGamePage from './pages/SpinGamePage';
import { useData } from './contexts/DataContext';

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactElement }) => {
  const { currentTenant } = useData();
  if (!currentTenant) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        {/* Marketing Site */}
        <Route path="/" element={<LandingPage />} />

        {/* Authentication */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* The Public Game Link */}
        <Route path="/play/:tenantId" element={<SpinGamePage />} />

        {/* Client Admin Dashboard (Protected) */}
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="prizes" element={<PrizesPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="subscription" element={<SubscriptionPage />} />
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
};

export default App;