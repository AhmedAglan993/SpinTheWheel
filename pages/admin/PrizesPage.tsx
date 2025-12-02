import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { Prize } from '../../types';

const PrizesPage: React.FC = () => {
  const { currentTenant, getTenantPrizes, addPrize, deletePrize } = useData();
  const prizes = currentTenant ? getTenantPrizes(currentTenant.id) : [];
  const [showForm, setShowForm] = useState(false);
  
  // Form State
  const [newPrize, setNewPrize] = useState<Partial<Prize>>({
    name: '',
    type: 'Voucher',
    description: '',
    status: 'Active'
  });

  const handleAddPrize = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTenant) return;

    addPrize({
      id: Math.random().toString(36).substr(2, 9),
      tenantId: currentTenant.id,
      name: newPrize.name || 'New Prize',
      type: newPrize.type as any,
      description: newPrize.description || '',
      status: 'Active'
    });
    setShowForm(false);
    setNewPrize({ name: '', type: 'Voucher', description: '', status: 'Active' });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header Actions */}
      <div className="flex justify-between items-center">
         <p className="hidden md:block text-slate-500 dark:text-slate-400">Manage the prizes your customers can win.</p>
         <button 
           onClick={() => setShowForm(!showForm)}
           className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-bold shadow-lg shadow-primary/20 hover:bg-primary-dark transition-colors ml-auto"
         >
            <span className="material-symbols-outlined">{showForm ? 'close' : 'add'}</span>
            {showForm ? 'Cancel' : 'Add New Prize'}
         </button>
      </div>

      {/* Quick Add Form */}
      {showForm && (
        <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 animate-in fade-in slide-in-from-top-4">
           <form onSubmit={handleAddPrize} className="flex flex-col md:flex-row gap-4 items-end">
             <div className="flex-1 w-full">
               <label className="text-xs font-bold uppercase text-slate-500 mb-1 block">Prize Name</label>
               <input 
                 type="text" required placeholder="e.g. Free Coffee"
                 className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700"
                 value={newPrize.name} onChange={e => setNewPrize({...newPrize, name: e.target.value})}
               />
             </div>
             <div className="flex-1 w-full">
               <label className="text-xs font-bold uppercase text-slate-500 mb-1 block">Type</label>
               <select 
                  className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700"
                  value={newPrize.type} onChange={e => setNewPrize({...newPrize, type: e.target.value as any})}
               >
                 <option>Food Item</option>
                 <option>Discount</option>
                 <option>Voucher</option>
                 <option>Merchandise</option>
               </select>
             </div>
             <div className="flex-1 w-full">
               <label className="text-xs font-bold uppercase text-slate-500 mb-1 block">Description</label>
               <input 
                 type="text" placeholder="Details shown to winner"
                 className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700"
                 value={newPrize.description} onChange={e => setNewPrize({...newPrize, description: e.target.value})}
               />
             </div>
             <button type="submit" className="px-6 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700">Save</button>
           </form>
        </div>
      )}

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
                {prizes.length === 0 ? (
                  <tr><td colSpan={5} className="p-8 text-center text-slate-500">No prizes added yet.</td></tr>
                ) : prizes.map((prize) => (
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
                        <button 
                          onClick={() => deletePrize(prize.id)}
                          className="text-red-500 hover:text-red-600 transition-colors"
                        >
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
    </div>
  );
};

export default PrizesPage;