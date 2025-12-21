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

interface ProjectData {
   id: string;
   name: string;
   status: string;
   currentSpins: number;
   createdAt: string;
   tenant: { id: string; name: string; email: string; };
   _count: { prizes: number; spinHistory: number; };
}

interface PrizeData {
   id: string;
   name: string;
   type: string;
   status: string;
   isUnlimited: boolean;
   quantity: number | null;
   tenant: { id: string; name: string; email: string; };
   project: { id: string; name: string; } | null;
}

interface LeadData {
   id: string;
   userName: string | null;
   userEmail: string | null;
   userPhone: string | null;
   prizeWon: string;
   timestamp: string;
   tenant: { id: string; name: string; email: string; };
   project: { id: string; name: string; } | null;
}

type TabType = 'tenants' | 'projects' | 'prizes' | 'leads';

const TenantsPage: React.FC = () => {
   const [activeTab, setActiveTab] = useState<TabType>('tenants');
   const [tenants, setTenants] = useState<TenantData[]>([]);
   const [projects, setProjects] = useState<ProjectData[]>([]);
   const [prizes, setPrizes] = useState<PrizeData[]>([]);
   const [leads, setLeads] = useState<LeadData[]>([]);
   const [loading, setLoading] = useState(true);
   const [searchTerm, setSearchTerm] = useState('');

   useEffect(() => {
      loadData();
   }, []);

   const loadData = async () => {
      try {
         setLoading(true);
         const [tenantsData, projectsData, prizesData, leadsData] = await Promise.all([
            ownerAPI.getTenants(),
            ownerAPI.getAllProjects(),
            ownerAPI.getAllPrizes(),
            ownerAPI.getAllLeads()
         ]);
         setTenants(tenantsData);
         setProjects(projectsData);
         setPrizes(prizesData);
         setLeads(leadsData);
      } catch (error) {
         console.error('Failed to load data:', error);
      } finally {
         setLoading(false);
      }
   };

   const getStatusColor = (status: string) => {
      switch (status) {
         case 'Active': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
         case 'Trial': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
         case 'Suspended': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
         case 'Draft': return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400';
         default: return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400';
      }
   };

   const exportToCSV = (type: TabType) => {
      let headers: string[];
      let rows: any[][];
      let filename: string;

      switch (type) {
         case 'tenants':
            headers = ['Name', 'Owner', 'Email', 'Status', 'Projects', 'Total Spins', 'Signup Date'];
            rows = tenants.map(t => [t.name, t.ownerName, t.email, t.status, t._count.projects, t._count.spinHistory, new Date(t.createdAt).toLocaleDateString()]);
            filename = 'all-tenants.csv';
            break;
         case 'projects':
            headers = ['Project Name', 'Tenant', 'Status', 'Prizes', 'Spins', 'Created'];
            rows = projects.map(p => [p.name, p.tenant.name, p.status, p._count.prizes, p._count.spinHistory, new Date(p.createdAt).toLocaleDateString()]);
            filename = 'all-projects.csv';
            break;
         case 'prizes':
            headers = ['Prize Name', 'Tenant', 'Project', 'Type', 'Status', 'Quantity'];
            rows = prizes.map(p => [p.name, p.tenant.name, p.project?.name || 'All', p.type, p.status, p.isUnlimited ? 'Unlimited' : p.quantity]);
            filename = 'all-prizes.csv';
            break;
         case 'leads':
            headers = ['Name', 'Email', 'Phone', 'Prize Won', 'Tenant', 'Project', 'Date'];
            rows = leads.map(l => [l.userName || '', l.userEmail || '', l.userPhone || '', l.prizeWon, l.tenant.name, l.project?.name || '', new Date(l.timestamp).toLocaleString()]);
            filename = 'all-leads.csv';
            break;
      }

      const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
   };

   if (loading) return <div className="p-8 text-center">Loading...</div>;

   const tabs = [
      { id: 'tenants' as TabType, label: 'Tenants', icon: 'group', count: tenants.length },
      { id: 'projects' as TabType, label: 'All Projects', icon: 'folder', count: projects.length },
      { id: 'prizes' as TabType, label: 'All Prizes', icon: 'emoji_events', count: prizes.length },
      { id: 'leads' as TabType, label: 'All Leads', icon: 'contacts', count: leads.length }
   ];

   return (
      <div className="flex flex-col gap-6">
         {/* Tabs */}
         <div className="border-b border-slate-200 dark:border-slate-700">
            <div className="flex gap-4 overflow-x-auto">
               {tabs.map((tab) => (
                  <button
                     key={tab.id}
                     onClick={() => setActiveTab(tab.id)}
                     className={`flex items-center gap-2 py-3 px-1 border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.id
                           ? 'border-primary text-primary'
                           : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                        }`}
                  >
                     <span className="material-symbols-outlined text-lg">{tab.icon}</span>
                     {tab.label}
                     <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-full text-xs">
                        {tab.count}
                     </span>
                  </button>
               ))}
            </div>
         </div>

         {/* Header */}
         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <input
               type="text"
               placeholder="Search..."
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 text-slate-900 dark:text-white w-64"
            />
            <button
               onClick={() => exportToCSV(activeTab)}
               className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-green-700 transition-colors"
            >
               <span className="material-symbols-outlined !text-lg">download</span>
               Export CSV
            </button>
         </div>

         {/* Tenants Tab */}
         {activeTab === 'tenants' && (
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
                        {tenants.filter(t => t.name.toLowerCase().includes(searchTerm.toLowerCase()) || t.email.toLowerCase().includes(searchTerm.toLowerCase())).map((tenant) => (
                           <tr key={tenant.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                              <td className="px-6 py-4 whitespace-nowrap">
                                 <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-cover bg-center border border-slate-200"
                                       style={{ backgroundImage: `url("${tenant.logo || `https://placehold.co/100x100/2bbdee/ffffff?text=${tenant.name.charAt(0)}`}")` }} />
                                    <div>
                                       <p className="font-medium text-slate-900 dark:text-white">{tenant.name}</p>
                                       <p className="text-xs text-slate-500">{tenant.ownerName}</p>
                                    </div>
                                 </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">{tenant.email}</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                 <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(tenant.status)}`}>{tenant.status}</span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">{tenant._count.projects}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">{tenant._count.spinHistory}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{new Date(tenant.createdAt).toLocaleDateString()}</td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
         )}

         {/* Projects Tab */}
         {activeTab === 'projects' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden shadow-sm">
               <div className="overflow-x-auto">
                  <table className="w-full text-left">
                     <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                        <tr>
                           <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Project</th>
                           <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Tenant</th>
                           <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Status</th>
                           <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Prizes</th>
                           <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Spins</th>
                           <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Created</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                        {projects.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.tenant.name.toLowerCase().includes(searchTerm.toLowerCase())).map((project) => (
                           <tr key={project.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                              <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-900 dark:text-white">{project.name}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">{project.tenant.name}</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                 <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>{project.status}</span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">{project._count.prizes}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">{project._count.spinHistory}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{new Date(project.createdAt).toLocaleDateString()}</td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
         )}

         {/* Prizes Tab */}
         {activeTab === 'prizes' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden shadow-sm">
               <div className="overflow-x-auto">
                  <table className="w-full text-left">
                     <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                        <tr>
                           <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Prize</th>
                           <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Tenant</th>
                           <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Project</th>
                           <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Type</th>
                           <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Status</th>
                           <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Quantity</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                        {prizes.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.tenant.name.toLowerCase().includes(searchTerm.toLowerCase())).map((prize) => (
                           <tr key={prize.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                              <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-900 dark:text-white">{prize.name}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">{prize.tenant.name}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">{prize.project?.name || 'All'}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">{prize.type}</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                 <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(prize.status)}`}>{prize.status}</span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">
                                 {prize.isUnlimited ? <span className="text-green-600">Unlimited</span> : prize.quantity}
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
         )}

         {/* Leads Tab */}
         {activeTab === 'leads' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden shadow-sm">
               <div className="overflow-x-auto">
                  <table className="w-full text-left">
                     <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                        <tr>
                           <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Name</th>
                           <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Email</th>
                           <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Phone</th>
                           <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Prize Won</th>
                           <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Tenant</th>
                           <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Project</th>
                           <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Date</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                        {leads.filter(l =>
                           (l.userName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (l.userEmail || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                           l.tenant.name.toLowerCase().includes(searchTerm.toLowerCase())
                        ).map((lead) => (
                           <tr key={lead.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                              <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-900 dark:text-white">{lead.userName || '-'}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">{lead.userEmail || '-'}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">{lead.userPhone || '-'}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">{lead.prizeWon}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">{lead.tenant.name}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">{lead.project?.name || '-'}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{new Date(lead.timestamp).toLocaleString()}</td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
         )}
      </div>
   );
};

export default TenantsPage;