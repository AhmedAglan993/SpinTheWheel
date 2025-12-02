import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import SpinGamePage from './pages/SpinGamePage';
import DashboardPage from './pages/admin/DashboardPage';
import UsersPage from './pages/admin/UsersPage';
import PrizesPage from './pages/admin/PrizesPage';
import AdminLayout from './pages/admin/AdminLayout';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<SpinGamePage />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="prizes" element={<PrizesPage />} />
        </Route>
      </Routes>
    </HashRouter>
  );
};

export default App;