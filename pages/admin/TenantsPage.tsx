import React from 'react';

const TenantsPage: React.FC = () => {
   // Note: This page requires 'tenants' and 'deleteTenant' from DataContext
   // which are not yet implemented. This is a placeholder until those features are added.

   return (
      <div className="flex flex-col gap-6">
         <div className="flex justify-between items-center">
            <div>
               <h3 className="text-lg font-bold text-slate-900 dark:text-white">Client Management</h3>
               <p className="text-sm text-slate-500 dark:text-slate-400">Manage restaurant accounts and their subscriptions.</p>
            </div>
            <button className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-bold shadow-lg shadow-primary/20 hover:bg-primary-dark transition-colors">
               <span className="material-symbols-outlined">add_business</span>
               Add New Client
            </button>
         </div>

         <div className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl p-12 text-center">
            <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-600 mb-4">group</span>
            <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Client Management Coming Soon</h4>
            <p className="text-slate-500 dark:text-slate-400">
               This feature is under development. Check back later for multi-tenant management capabilities.
            </p>
         </div>
      </div>
   );
};

export default TenantsPage;