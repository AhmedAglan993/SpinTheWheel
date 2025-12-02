import React from 'react';
import { useData } from '../../contexts/DataContext';

const TenantsPage: React.FC = () => {
  const { tenants, deleteTenant } = useData();

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

      <div className="grid grid-cols-1 gap-4">
         {tenants.map(tenant => (
            <div key={tenant.id} className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center gap-6 shadow-sm hover:shadow-md transition-shadow">
               <div className="size-16 rounded-full bg-slate-100 dark:bg-slate-700 flex-shrink-0 overflow-hidden border border-slate-200 dark:border-slate-600">
                  <img src={tenant.logo} alt={tenant.name} className="w-full h-full object-cover" />
               </div>
               
               <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                     <h4 className="text-lg font-bold text-slate-900 dark:text-white truncate">{tenant.name}</h4>
                     <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${
                        tenant.status === 'Active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                        tenant.status === 'Trial' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                        'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                     }`}>
                        {tenant.status}
                     </span>
                  </div>
                  <div className="text-sm text-slate-500 dark:text-slate-400 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                     <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined !text-base">person</span>
                        {tenant.ownerName}
                     </span>
                     <span className="hidden sm:inline">•</span>
                     <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined !text-base">mail</span>
                        {tenant.email}
                     </span>
                  </div>
               </div>

               <div className="flex flex-col items-end gap-1 min-w-[140px]">
                  <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide font-semibold">Current Plan</p>
                  <p className="text-primary font-bold">{tenant.plan}</p>
                  <p className="text-xs text-slate-400">Next billing: {tenant.nextBillingDate}</p>
               </div>

               <div className="flex items-center gap-2 border-l border-slate-200 dark:border-slate-700 pl-6 ml-2">
                  <button className="p-2 text-slate-400 hover:text-primary transition-colors">
                     <span className="material-symbols-outlined">edit_square</span>
                  </button>
                  <button onClick={() => deleteTenant(tenant.id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                     <span className="material-symbols-outlined">delete</span>
                  </button>
                  <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
                     <span className="material-symbols-outlined">more_vert</span>
                  </button>
               </div>
            </div>
         ))}
      </div>
    </div>
  );
};

export default TenantsPage;