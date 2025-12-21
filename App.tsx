import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import { LoginPage, SignupPage } from './pages/AuthPages';
import AdminLayout from './pages/admin/AdminLayout';
import DashboardPage from './pages/admin/DashboardPage';
import SettingsPage from './pages/admin/SettingsPage';
import PrizesPage from './pages/admin/PrizesPage';
import UsersPage from './pages/admin/UsersPage';
import ContactRequestsPage from './pages/admin/ContactRequestsPage';
import ProjectsPage from './pages/admin/ProjectsPage';
import LeadsPage from './pages/admin/LeadsPage';
import TenantsPage from './pages/admin/TenantsPage';
import DemoSpinPage from './pages/DemoSpinPage';
import ContactFormPage from './pages/ContactFormPage';
import SpinGamePage from './pages/SpinGamePage';
import RedemptionPage from './pages/RedemptionPage';
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

        {/* Demo */}
        <Route path="/demo" element={<DemoSpinPage />} />

        {/* Contact Form - Public */}
        <Route path="/contact" element={<ContactFormPage />} />

        {/* Authentication - Admin Only */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Public Spin Links - No Auth Required */}
        {/* Both /spin/:projectId and /play/:tenantId use the same component */}
        <Route path="/spin/:tenantId" element={<SpinGamePage />} />
        <Route path="/play/:tenantId" element={<SpinGamePage />} />

        {/* Prize Redemption - Public */}
        <Route path="/redeem/:token" element={<RedemptionPage />} />

        {/* Admin Dashboard (Protected) */}
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="leads" element={<LeadsPage />} />
          <Route path="tenants" element={<TenantsPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="prizes" element={<PrizesPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="contacts" element={<ContactRequestsPage />} />
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
