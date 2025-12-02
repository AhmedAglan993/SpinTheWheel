import React from 'react';
import { NavLink } from 'react-router-dom';
import { useData } from '../contexts/DataContext';

const Sidebar: React.FC = () => {
  const { currentTenant, logout } = useData();

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
      isActive
        ? 'bg-primary/10 text-primary dark:bg-primary dark:text-white'
        : 'text-text-light dark:text-text-dark hover:bg-slate-100 dark:hover:bg-slate-800'
    }`;

  const iconClass = (isActive: boolean) => 
    `material-symbols-outlined ${isActive ? 'filled' : ''}`;

  if (!currentTenant) return null;

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-background-dark border-r border-slate-200 dark:border-slate-800 h-screen sticky top-0">
      <div className="flex flex-col h-full p-4">
        {/* Logo Area */}
        <div className="flex items-center gap-3 p-2 mb-6">
          <div 
            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border border-slate-200" 
            style={{ backgroundImage: `url("${currentTenant.logo}")` }}
          />
          <div className="flex flex-col overflow-hidden">
            <h1 className="text-base font-bold text-slate-900 dark:text-white truncate">{currentTenant.name}</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Dashboard</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-2 flex-1">
          <NavLink to="/admin/dashboard" className={linkClass}>
            {({ isActive }) => (
              <>
                <span className={iconClass(isActive)}>dashboard</span>
                Overview
              </>
            )}
          </NavLink>
          
          <div className="px-3 py-2 mt-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Game Setup
          </div>
          <NavLink to="/admin/settings" className={linkClass}>
             {({ isActive }) => (
              <>
                <span className={iconClass(isActive)}>tune</span>
                Customization
              </>
            )}
          </NavLink>
          <NavLink to="/admin/prizes" className={linkClass}>
             {({ isActive }) => (
              <>
                <span className={iconClass(isActive)}>emoji_events</span>
                Prizes
              </>
            )}
          </NavLink>

          <div className="px-3 py-2 mt-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Data
          </div>
          <NavLink to="/admin/users" className={linkClass}>
             {({ isActive }) => (
              <>
                <span className={iconClass(isActive)}>group</span>
                Collected Leads
              </>
            )}
          </NavLink>

          <div className="px-3 py-2 mt-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Account
          </div>
          <NavLink to="/admin/subscription" className={linkClass}>
             {({ isActive }) => (
              <>
                <span className={iconClass(isActive)}>credit_card</span>
                Billing
              </>
            )}
          </NavLink>
        </nav>

        {/* Bottom Actions */}
        <div className="mt-auto flex flex-col gap-1">
          <button onClick={logout} className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-text-light dark:text-text-dark hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors w-full text-left">
            <span className="material-symbols-outlined">logout</span>
            Sign Out
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;