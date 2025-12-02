import React from 'react';
import { User } from '../../types';

const users: User[] = [
  { id: '1', name: 'Eleanor Pena', email: 'eleanor.p@example.com', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCtnCHce-ubLphotiHHzNBj0H7xPkfLTErc7Sn9LY5WFsDklBE5x3x4tyA9Eb5sUNzbA5t4B5BCf2ZJSUnPCiTQm9L2Qp5k2jyolET2irZFXEV4jK22cZe6bR1VLqGl3epR0Jbgm78wdygZjhA8G1QYNmBYFGEqdlfT-2K6AWJqNwgdbxhDDBBOowD2Q2-B4QgmISKRuvKAF_Yd8K2OMJSSGz9IUHEcDUtrZPee28fkqaZKijBxZPcIOvVWrE_VQGfyHqkkOEfK7Vo', plan: 'Premium', status: 'Active', dateJoined: '2023-05-12' },
  { id: '2', name: 'Cameron Williamson', email: 'c.williamson@example.com', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD0RcNBGxljpLY7NFWo8b4X5UxhXds-bDO_k97cg_WNdiB_G_3JqEjZqXfXL7klohlfWJeO4QFmr6PaQrOa9MR-WBMRCnr60vnxs-3DLi_E46JKb7gn240tAljKQ3NdjU38Xet-8XvOmLwi1FkVsdEvnGDWVcHevvZ-sH8H_ojuTHyYMt9_2Rl0A9ua3WrCIlQhTZrjsg36qdN7ffobRWSxYoskSNGRfRuA7LYh015wMnODPQKfZ2b7oww6yZXkCZj7iabTcFb65Is', plan: 'Basic', status: 'Active', dateJoined: '2023-04-28' },
  { id: '3', name: 'Brooklyn Simmons', email: 'b.simmons@example.com', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAM0fD3CTIBilrsoFW7LGsEj-JEzN2PoDFJh4HyWEJ_ysqIRqLw7QWliTCgI23zAWKZwZ3dj6g1zNCjPhyb1Sh7CVDaMQ-myC30tQjZDKew8QoL8NlzyCzpB23zScXtp2Yf0MZpIFa4u67rEmSDpLFZ1krjiPyAgndojpV5QKZyM9lZj3wyfcbClpm59OInoeq41bbnf2l23VB0fqGqEgwmUv2BxoirJ-XxP-po-RvRQqIhxQUIwVBj4Wjjql8IbRayJxfhTYuni0I', plan: 'Premium', status: 'Inactive', dateJoined: '2023-03-15' },
  { id: '4', name: 'Robert Fox', email: 'robert.fox@example.com', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAY9ObbMksC58LI2cwbqu6_g_QJhPaSjVj4_o1lgupqsphGRT9qKtgi-IG6vOi04aPj3O3HE7AtN8T0ZfMdMBAWPw4Lou-BSXQZlkhATQ9WV22ACBEG3che1XCKmJsbQsG4sRaEzyyMn9SAsK5WuuSi4LldnnhFqIThIOk2U7I1MUtfxSUeH_pNro8hxOExJY4yAqZOJhVHqMroL3i9yJl260UxjSuMXKZnUVh1M2BDvsjxVDCTRHiU0j5_UAEGsKbOIgch7wMIpxw', plan: 'Basic', status: 'Pending', dateJoined: '2023-02-01' },
];

const UsersPage: React.FC = () => {
  return (
    <div className="flex flex-col gap-6">
      {/* Action Header */}
      <div className="flex justify-between items-center">
         <div>{/* Title handled by layout, but if we wanted context specific actions */}</div>
         <button className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-bold shadow-lg shadow-primary/20 hover:bg-primary-dark transition-colors">
            <span className="material-symbols-outlined">add</span>
            Add New User
         </button>
      </div>

      {/* Table Container */}
      <div className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
               <span className="material-symbols-outlined text-slate-400">search</span>
             </div>
             <input 
                type="text" 
                placeholder="Search by name or email..." 
                className="pl-10 pr-4 py-2.5 w-full rounded-lg bg-slate-50 dark:bg-slate-900 border-none focus:ring-2 focus:ring-primary text-slate-900 dark:text-white placeholder:text-slate-400"
             />
          </div>
          <div className="flex gap-3">
             <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-900 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">
               Status: All
               <span className="material-symbols-outlined !text-xl text-slate-400">arrow_drop_down</span>
             </button>
             <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-900 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">
               Plan: All
               <span className="material-symbols-outlined !text-xl text-slate-400">arrow_drop_down</span>
             </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 text-xs uppercase font-semibold">
              <tr>
                <th className="p-4 w-12 text-center">
                  <input type="checkbox" className="rounded border-slate-300 text-primary focus:ring-primary bg-transparent" />
                </th>
                <th className="p-4">User</th>
                <th className="p-4">Email</th>
                <th className="p-4">Plan</th>
                <th className="p-4">Status</th>
                <th className="p-4">Date Joined</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-sm">
              {users.map(user => (
                <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="p-4 text-center">
                    <input type="checkbox" className="rounded border-slate-300 text-primary focus:ring-primary bg-transparent" />
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
                      <span className="font-medium text-slate-900 dark:text-white">{user.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-slate-500 dark:text-slate-400">{user.email}</td>
                  <td className="p-4">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${
                      user.plan === 'Premium' ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                    }`}>
                      {user.plan}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${
                      user.status === 'Active' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 
                      user.status === 'Inactive' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' : 
                      'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="p-4 text-slate-500 dark:text-slate-400">{user.dateJoined}</td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                       <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                         <span className="material-symbols-outlined">edit</span>
                       </button>
                       <button className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                         <span className="material-symbols-outlined">delete</span>
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 flex items-center justify-between border-t border-slate-200 dark:border-slate-800 text-sm text-slate-500 dark:text-slate-400">
           <p>Showing 1-4 of 32 results</p>
           <div className="flex items-center gap-2">
              <button className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <button className="w-9 h-9 flex items-center justify-center rounded-lg bg-primary/10 text-primary font-bold dark:bg-primary dark:text-white">1</button>
              <button className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">2</button>
              <button className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">3</button>
              <span>...</span>
              <button className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">8</button>
              <button className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default UsersPage;