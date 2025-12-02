import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';

const AdminLayout: React.FC = () => {
  const location = useLocation();

  const getPageTitle = () => {
    if (location.pathname.includes('users')) return 'User Management';
    if (location.pathname.includes('prizes')) return 'Prize Management';
    return 'Admin Dashboard';
  };

  return (
    <div className="flex min-h-screen w-full bg-background-light dark:bg-background-dark font-display text-text-light dark:text-text-dark">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header (Only visible on small screens) */}
        <div className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
           <div className="flex items-center gap-2">
             <div 
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-8" 
                style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDFdq24kBzGT70B2mU4hnGiMLSSS_7-bOVcC0XCUz7JUlscw6Znhe1JgRqeAmpApyE41WV-78xKOju3C0OGwpzvTfSEVT-DEZ6zuAoi4BnaUQuIRC_UYEyz0uyueOHe1HH5eKSTInthr7QJAOpbTWbt8iHATRu3bRk9N3N3wVXxX_7_LMqLO2aGdFfK3knW7ZUhUAfb0g9nCRQxIulNWBSduu57hQiclDYePyxhRc4eoN5wcfiEjE1cFo2uzaLFBMlPzzGw3Bz4Vso")' }}
              />
              <span className="font-bold">Prize Admin</span>
           </div>
           <button className="p-2">
             <span className="material-symbols-outlined">menu</span>
           </button>
        </div>

        <div className="flex-1 overflow-y-auto">
           {/* Top Bar / Header for Search & Profile (visible on desktop) */}
           <header className="hidden md:flex items-center justify-between px-6 py-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10">
             <h2 className="text-xl font-bold">{getPageTitle()}</h2>
             <div className="flex items-center gap-4">
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                  <input 
                    type="text" 
                    placeholder="Search..." 
                    className="pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary w-64"
                  />
                </div>
                <div className="flex gap-2">
                   <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 relative">
                     <span className="material-symbols-outlined">notifications</span>
                     <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                   </button>
                   <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400">
                     <span className="material-symbols-outlined">help</span>
                   </button>
                </div>
                <div className="w-px h-8 bg-slate-200 dark:bg-slate-700 mx-2"></div>
                <div 
                  className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-9 cursor-pointer border border-slate-200 dark:border-slate-700" 
                  style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuA8iBOY9nsE_rg_L9VyY5W_GL3o8EHh0sGvOSU8c6O0zkrCa4Lk2X2iutSgo7WE4tjeLZtvi3fZ5EJnroF9YDia6ToEtST07B8W5zxhGON9dgmkwkHN6KNWU-fW6NtFk40lT0QY92ofF4D5l_x660fzaF4OuMeruReEnE6CegWvOHHJl2FA_oGVgEHTWpZy8Sktv3W--29RrXxGlA6zrTOHSWocB56vhMay3UciQiW1zdNGd2OaodkYgL2G1RIqVryiNSJ4mnFYH2w")' }}
                />
             </div>
           </header>

           {/* Page Content */}
           <div className="p-6 md:p-8 lg:p-10 max-w-7xl mx-auto">
             <Outlet />
           </div>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;