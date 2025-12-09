import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';

const AdminLayout: React.FC = () => {
  const location = useLocation();

  const getPageTitle = () => {
    if (location.pathname.includes('users')) return 'User Management';
    if (location.pathname.includes('prizes')) return 'Prize Management';
    if (location.pathname.includes('tenants')) return 'Clients & Restaurants';
    if (location.pathname.includes('contacts')) return 'Contact Requests';
    if (location.pathname.includes('projects')) return 'Projects';
    if (location.pathname.includes('settings')) return 'Settings';
    return 'Admin Dashboard';
  };

  const getPageDescription = () => {
    if (location.pathname.includes('users')) return 'View and manage user leads collected from spins';
    if (location.pathname.includes('prizes')) return 'Configure prizes for your spin wheel';
    if (location.pathname.includes('tenants')) return 'Manage client accounts and restaurants';
    if (location.pathname.includes('contacts')) return 'Manage custom experience requests';
    if (location.pathname.includes('projects')) return 'Manage your spin wheel projects and campaigns';
    if (location.pathname.includes('settings')) return 'Customize your spin wheel appearance';
    return 'Overview of your spin wheel performance';
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-background-dark overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                {getPageTitle()}
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                {getPageDescription()}
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-3">
              <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                <span className="material-symbols-outlined text-slate-600 dark:text-slate-400">notifications</span>
              </button>
              <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                <span className="material-symbols-outlined text-slate-600 dark:text-slate-400">settings</span>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;