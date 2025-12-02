import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
      isActive
        ? 'bg-primary/10 text-primary dark:bg-primary dark:text-white'
        : 'text-text-light dark:text-text-dark hover:bg-slate-100 dark:hover:bg-slate-800'
    }`;

  const iconClass = (isActive: boolean) => 
    `material-symbols-outlined ${isActive ? 'filled' : ''}`;

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-background-dark border-r border-slate-200 dark:border-slate-800 h-screen sticky top-0">
      <div className="flex flex-col h-full p-4">
        {/* Logo Area */}
        <div className="flex items-center gap-3 p-2 mb-6">
          <div 
            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10" 
            style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDFdq24kBzGT70B2mU4hnGiMLSSS_7-bOVcC0XCUz7JUlscw6Znhe1JgRqeAmpApyE41WV-78xKOju3C0OGwpzvTfSEVT-DEZ6zuAoi4BnaUQuIRC_UYEyz0uyueOHe1HH5eKSTInthr7QJAOpbTWbt8iHATRu3bRk9N3N3wVXxX_7_LMqLO2aGdFfK3knW7ZUhUAfb0g9nCRQxIulNWBSduu57hQiclDYePyxhRc4eoN5wcfiEjE1cFo2uzaLFBMlPzzGw3Bz4Vso")' }}
          />
          <div className="flex flex-col">
            <h1 className="text-base font-bold text-slate-900 dark:text-white">Prize Admin</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">The Grand Eatery</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-2 flex-1">
          <NavLink to="/admin/dashboard" className={linkClass}>
            {({ isActive }) => (
              <>
                <span className={iconClass(isActive)}>dashboard</span>
                Dashboard
              </>
            )}
          </NavLink>
          <NavLink to="/admin/users" className={linkClass}>
             {({ isActive }) => (
              <>
                <span className={iconClass(isActive)}>group</span>
                User Management
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
          <div className="my-2 border-t border-slate-100 dark:border-slate-800"></div>
          <NavLink to="#" className={({isActive}) => linkClass({isActive: false})}> {/* Placeholder */}
             <span className="material-symbols-outlined">assessment</span>
             Reports
          </NavLink>
          <NavLink to="#" className={({isActive}) => linkClass({isActive: false})}> {/* Placeholder */}
             <span className="material-symbols-outlined">settings</span>
             Settings
          </NavLink>
        </nav>

        {/* Bottom Actions */}
        <div className="mt-auto flex flex-col gap-1">
           <NavLink to="#" className={({isActive}) => linkClass({isActive: false})}>
            <span className="material-symbols-outlined">help</span>
            Help Center
          </NavLink>
          <NavLink to="/" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-text-light dark:text-text-dark hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <span className="material-symbols-outlined">logout</span>
            Exit to App
          </NavLink>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;