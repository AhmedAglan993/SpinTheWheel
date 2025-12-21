import React from 'react';
import { NavLink } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { useLanguage } from '../contexts/LanguageContext';

const Sidebar: React.FC = () => {
  const { currentTenant, logout } = useData();
  const { t, isRTL } = useLanguage();

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${isActive
      ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-light'
      : 'text-text-light dark:text-text-dark hover:bg-surface-elevated-light dark:hover:bg-surface-elevated-dark'
    }`;

  const iconClass = (isActive: boolean) =>
    `material-symbols-outlined ${isActive ? 'filled' : ''}`;

  if (!currentTenant) return null;

  // Check if current user is platform owner
  const isOwner = (currentTenant as any).isOwner === true;

  return (
    <aside className={`hidden md:flex flex-col w-64 bg-surface-light dark:bg-surface-dark border-${isRTL ? 'l' : 'r'} border-border-light dark:border-border-dark h-screen sticky top-0`}>
      <div className="flex flex-col h-full p-4">
        {/* Logo Area */}
        <div className="flex items-center gap-3 p-2 mb-6">
          <div
            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border border-slate-200"
            style={{ backgroundImage: `url("${currentTenant.logo}")` }}
          />
          <div className="flex flex-col overflow-hidden">
            <h1 className="text-base font-bold text-slate-900 dark:text-white truncate">{currentTenant.name}</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isOwner ? t('settings.platformOwner') : t('dashboard.title')}
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-2 flex-1">
          <NavLink to="/admin/dashboard" className={linkClass}>
            {({ isActive }) => (
              <>
                <span className={iconClass(isActive)}>dashboard</span>
                {t('nav.overview')}
              </>
            )}
          </NavLink>

          {/* Owner-only: Platform Management */}
          {isOwner && (
            <>
              <div className="px-3 py-2 mt-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {t('nav.platform')}
              </div>
              <NavLink to="/admin/tenants" className={linkClass}>
                {({ isActive }) => (
                  <>
                    <span className={iconClass(isActive)}>business</span>
                    {t('nav.clientsRestaurants')}
                  </>
                )}
              </NavLink>
              <NavLink to="/admin/contacts" className={linkClass}>
                {({ isActive }) => (
                  <>
                    <span className={iconClass(isActive)}>contact_mail</span>
                    {t('nav.contactRequests')}
                  </>
                )}
              </NavLink>
              <NavLink to="/admin/settings" className={linkClass}>
                {({ isActive }) => (
                  <>
                    <span className={iconClass(isActive)}>settings</span>
                    {t('nav.settings')}
                  </>
                )}
              </NavLink>
            </>
          )}

          {/* Tenant-only: Business items (hidden for owner) */}
          {!isOwner && (
            <>
              <div className="px-3 py-2 mt-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {t('nav.agency')}
              </div>
              <NavLink to="/admin/projects" className={linkClass}>
                {({ isActive }) => (
                  <>
                    <span className={iconClass(isActive)}>folder</span>
                    {t('nav.projects')}
                  </>
                )}
              </NavLink>

              <div className="px-3 py-2 mt-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {t('nav.gameSetup')}
              </div>
              <NavLink to="/admin/settings" className={linkClass}>
                {({ isActive }) => (
                  <>
                    <span className={iconClass(isActive)}>tune</span>
                    {t('nav.customization')}
                  </>
                )}
              </NavLink>
              <NavLink to="/admin/prizes" className={linkClass}>
                {({ isActive }) => (
                  <>
                    <span className={iconClass(isActive)}>emoji_events</span>
                    {t('nav.prizes')}
                  </>
                )}
              </NavLink>

              <div className="px-3 py-2 mt-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {t('nav.data')}
              </div>
              <NavLink to="/admin/leads" className={linkClass}>
                {({ isActive }) => (
                  <>
                    <span className={iconClass(isActive)}>group</span>
                    {t('nav.collectedLeads')}
                  </>
                )}
              </NavLink>
            </>
          )}
        </nav>

        {/* Bottom Actions */}
        <div className="mt-auto flex flex-col gap-1">
          <button onClick={logout} className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-text-light dark:text-text-dark hover:bg-surface-elevated-light dark:hover:bg-surface-elevated-dark transition-colors w-full text-left">
            <span className="material-symbols-outlined">logout</span>
            {t('common.signOut')}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;