import React from 'react';
import { Prize } from '../../types';

const prizes: Prize[] = [
  { id: '1', name: 'Free Appetizer', type: 'Food Item', description: 'Any appetizer up to $10 value', status: 'Active' },
  { id: '2', name: '15% Off Total Bill', type: 'Discount', description: 'Valid on orders over $50', status: 'Active' },
  { id: '3', name: 'Free T-Shirt', type: 'Merchandise', description: 'Limited edition restaurant shirt', status: 'Inactive' },
  { id: '4', name: '$5 Gift Card', type: 'Voucher', description: 'For your next visit', status: 'Active' },
  { id: '5', name: 'Free Dessert', type: 'Food Item', description: 'Choice of any dessert from the menu', status: 'Inactive' },
];

const PrizesPage: React.FC = () => {
  return (
    <div className="flex flex-col gap-6">
      {/* Header Actions */}
      <div className="flex justify-between items-center">
         <p className="hidden md:block text-slate-500 dark:text-slate-400">Add, edit, and view all available prizes for the spin-the-wheel game.</p>
         <button className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-bold shadow-lg shadow-primary/20 hover:bg-primary-dark transition-colors ml-auto">
            <span className="material-symbols-outlined">add</span>
            Add New Prize
         </button>
      </div>

       {/* Search Bar (Full width style) */}
       <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <span className="material-symbols-outlined text-slate-400">search</span>
          </div>
          <input 
            type="text" 
            placeholder="Search by prize name or type..." 
            className="pl-12 pr-4 h-12 w-full rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary focus:border-transparent text-slate-900 dark:text-white placeholder:text-slate-400 shadow-sm"
          />
       </div>

       {/* Table */}
       <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden shadow-sm">
         <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Prize Name</th>
                  <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Prize Type</th>
                  <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Value/Description</th>
                  <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Status</th>
                  <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {prizes.map((prize) => (
                  <tr key={prize.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-white">{prize.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">{prize.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">{prize.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                       <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                         prize.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300'
                       }`}>
                         {prize.status}
                       </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-4">
                        <button className="text-primary hover:text-primary-dark transition-colors">
                          <span className="material-symbols-outlined">edit</span>
                        </button>
                        <button className="text-red-500 hover:text-red-600 transition-colors">
                          <span className="material-symbols-outlined">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
         </div>
       </div>

       {/* Pagination */}
       <div className="flex justify-center items-center gap-2 mt-2">
          <button className="w-10 h-10 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800">
             <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-primary text-white font-bold text-sm shadow-md">1</button>
          <button className="w-10 h-10 flex items-center justify-center rounded-full text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 text-sm">2</button>
          <button className="w-10 h-10 flex items-center justify-center rounded-full text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 text-sm">3</button>
          <span className="w-10 h-10 flex items-center justify-center text-slate-400">...</span>
          <button className="w-10 h-10 flex items-center justify-center rounded-full text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 text-sm">8</button>
          <button className="w-10 h-10 flex items-center justify-center rounded-full text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 text-sm">9</button>
          <button className="w-10 h-10 flex items-center justify-center rounded-full text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 text-sm">10</button>
          <button className="w-10 h-10 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800">
             <span className="material-symbols-outlined">chevron_right</span>
          </button>
       </div>
    </div>
  );
};

export default PrizesPage;