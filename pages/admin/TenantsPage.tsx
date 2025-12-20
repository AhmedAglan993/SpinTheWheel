import React, { useState, useEffect } from 'react';
import { ownerAPI } from '../../src/services/api';

interface TenantData {
   id: string;
   name: string;
   ownerName: string;
   email: string;
   status: string;
   logo: string | null;
   createdAt: string;
   _count: {
      projects: number;
      spinHistory: number;
   };
}

const TenantsPage: React.FC = () => {
   const [tenants, setTenants] = useState<TenantData[]>([]);
   const [loading, setLoading] = useState(true);
   const [searchTerm, setSearchTerm] = useState('');

   useEffect(() => {
      loadTenants();
   }, []);

   const loadTenants = async () => {
      try {
         const data = await ownerAPI.getTenants();
         setTenants(data);
      } catch (error) {
         console.error('Failed to load tenants:', error);
      } finally {
         setLoading(false);
      }
   };

   const filteredTenants = tenants.filter(t =>
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.email.toLowerCase().includes(searchTerm.toLowerCase())
   );

   const getStatusColor = (status: string) => {
      switch (status) {
         case 'Active': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
         case 'Trial': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
         case 'Suspended': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
         default: return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400';
      }
   };

   const exportToCSV = () => {
      const headers = ['Name', 'Owner', 'Email', 'Status', 'Projects', 'Total Spins', 'Signup Date'];
      const rows = tenants.map(t => [
         t.name,
         t.ownerName,
         t.email,
         t.status,
         t._count.projects,
         t._count.spinHistory,
         new Date(t.createdAt).toLocaleDateString()
      ]);

      const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'tenants-export.csv';
      a.click();
   };

   if (loading) return <div className="p-8 text-center">Loading tenants...</div>;

   return (
      <div className="flex flex-col gap-6">
         {/* Header */}
         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
               <h2 className="text-xl font-bold text-slate-900 dark:text-white">All Tenants</h2>
               <p className="text-sm text-slate-500 dark:text-slate-400">
                  Manage all platform signups ({tenants.length} total)
               </p>
            </div>
            <div className="flex items-center gap-4">
               <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 text-slate-900 dark:text-white w-64"
               />
               <button
                  onClick={exportToCSV}
                  className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-green-700 transition-colors"
               >
                  <span className="material-symbols-outlined !text-lg">download</span>
                  Export CSV
               </button>
            </div>
         </div>

         {/* Stats */}
         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-surface-light dark:bg-surface-dark p-4 rounded-xl border border-border-light dark:border-border-dark">
               <p className="text-sm text-slate-500 dark:text-slate-400">Total Tenants</p>
               <p className="text-2xl font-bold text-slate-900 dark:text-white">{tenants.length}</p>
            </div>
            <div className="bg-surface-light dark:bg-surface-dark p-4 rounded-xl border border-border-light dark:border-border-dark">
               <p className="text-sm text-slate-500 dark:text-slate-400">Active</p>
               <p className="text-2xl font-bold text-green-600">
                  {tenants.filter(t => t.status === 'Active').length}
               </p>
            </div>
            <div className="bg-surface-light dark:bg-surface-dark p-4 rounded-xl border border-border-light dark:border-border-dark">
               <p className="text-sm text-slate-500 dark:text-slate-400">Total Projects</p>
               <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {tenants.reduce((sum, t) => sum + t._count.projects, 0)}
               </p>
            </div>
            <div className="bg-surface-light dark:bg-surface-dark p-4 rounded-xl border border-border-light dark:border-border-dark">
               <p className="text-sm text-slate-500 dark:text-slate-400">Total Spins</p>
               <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {tenants.reduce((sum, t) => sum + t._count.spinHistory, 0)}
               </p>
            </div>
         </div>

         {/* Table */}
         <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
               <table className="w-full text-left">
                  <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                     <tr>
                        <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Tenant</th>
                        <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Email</th>
                        <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Status</th>
                        <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Projects</th>
                        <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Spins</th>
                        <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Signed Up</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                     {filteredTenants.length === 0 ? (
                        <tr><td colSpan={6} className="p-8 text-center text-slate-500">No tenants found</td></tr>
                     ) : filteredTenants.map((tenant) => (
                        <tr key={tenant.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                           <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-3">
                                 <div
                                    className="w-10 h-10 rounded-full bg-cover bg-center border border-slate-200"
                                    style={{ backgroundImage: `url("${tenant.logo || `https://placehold.co/100x100/2bbdee/ffffff?text=${tenant.name.charAt(0)}`}")` }}
                                 />
                                 <div>
                                    <p className="font-medium text-slate-900 dark:text-white">{tenant.name}</p>
                                    <p className="text-xs text-slate-500">{tenant.ownerName}</p>
                                 </div>
                              </div>
                           </td>
                           <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">
                              <a href={`mailto:${tenant.email}`} className="hover:text-primary">{tenant.email}</a>
                           </td>
                           <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(tenant.status)}`}>
                                 {tenant.status}
                              </span>
                           </td>
                           <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">
                              {tenant._count.projects}
                           </td>
                           <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">
                              {tenant._count.spinHistory}
                           </td>
                           <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                              {new Date(tenant.createdAt).toLocaleDateString()}
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>
      </div>
   );
};

export default TenantsPage;