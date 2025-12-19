import React, { useState, useEffect } from 'react';
import { useData } from '../../contexts/DataContext';
import { Prize } from '../../types';
import { projectsAPI } from '../../src/services/api';

interface Project {
  id: string;
  name: string;
  status: string;
}

const PrizesPage: React.FC = () => {
  const { currentTenant, prizes, addPrize, updatePrize, deletePrize } = useData();
  const [showForm, setShowForm] = useState(false);
  const [editingPrize, setEditingPrize] = useState<Prize | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectFilter, setSelectedProjectFilter] = useState<string>('');

  // Load projects
  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await projectsAPI.getAll();
        setProjects(data);
      } catch (error) {
        console.error('Failed to load projects:', error);
      }
    };
    loadProjects();
  }, []);

  // Filter prizes by project
  const filteredPrizes = selectedProjectFilter
    ? prizes.filter((p: any) => p.projectId === selectedProjectFilter || !p.projectId)
    : prizes;

  // Form State
  const [newPrize, setNewPrize] = useState<Partial<Prize> & { projectId?: string }>({
    name: '',
    type: 'Voucher',
    description: '',
    status: 'Active',
    isUnlimited: true,
    quantity: 10,
    exhaustionBehavior: 'exclude',
    projectId: ''
  });

  const handleAddPrize = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTenant) return;

    try {
      await addPrize({
        name: newPrize.name || 'New Prize',
        type: newPrize.type as any,
        description: newPrize.description || '',
        status: 'Active',
        isUnlimited: newPrize.isUnlimited ?? true,
        quantity: newPrize.isUnlimited ? undefined : newPrize.quantity,
        exhaustionBehavior: newPrize.exhaustionBehavior || 'exclude',
        projectId: newPrize.projectId || undefined
      });
      setShowForm(false);
      setNewPrize({
        name: '',
        type: 'Voucher',
        description: '',
        status: 'Active',
        isUnlimited: true,
        quantity: 10,
        exhaustionBehavior: 'exclude',
        projectId: ''
      });
    } catch (error) {
      console.error('Failed to add prize:', error);
      alert('Failed to add prize. Please try again.');
    }
  };

  const handleUpdatePrize = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPrize || !currentTenant) return;

    try {
      await updatePrize(editingPrize.id, {
        name: editingPrize.name,
        type: editingPrize.type,
        description: editingPrize.description,
        status: editingPrize.status,
        isUnlimited: editingPrize.isUnlimited,
        quantity: editingPrize.isUnlimited ? undefined : editingPrize.quantity,
        exhaustionBehavior: editingPrize.exhaustionBehavior
      });
      setEditingPrize(null);
    } catch (error) {
      console.error('Failed to update prize:', error);
      alert('Failed to update prize. Please try again.');
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-slate-500 dark:text-slate-400">Filter by Project:</label>
          <select
            value={selectedProjectFilter}
            onChange={(e) => setSelectedProjectFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700"
          >
            <option value="">All Projects</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>{project.name}</option>
            ))}
          </select>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-bold shadow-lg shadow-primary/20 hover:bg-primary-dark transition-colors"
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
                value={newPrize.name} onChange={e => setNewPrize({ ...newPrize, name: e.target.value })}
              />
            </div>
            <div className="flex-1 w-full">
              <label className="text-xs font-bold uppercase text-slate-500 mb-1 block">Type</label>
              <select
                className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700"
                value={newPrize.type} onChange={e => setNewPrize({ ...newPrize, type: e.target.value as any })}
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
                value={newPrize.description} onChange={e => setNewPrize({ ...newPrize, description: e.target.value })}
              />
            </div>

            {/* Quantity Management */}
            <div className="flex-1 w-full">
              <label className="text-xs font-bold uppercase text-slate-500 mb-1 block">Availability</label>
              <select
                className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700"
                value={newPrize.isUnlimited ? 'unlimited' : 'numbered'}
                onChange={e => setNewPrize({ ...newPrize, isUnlimited: e.target.value === 'unlimited' })}
              >
                <option value="unlimited">Unlimited</option>
                <option value="numbered">Numbered</option>
              </select>
            </div>

            {!newPrize.isUnlimited && (
              <>
                <div className="flex-1 w-full">
                  <label className="text-xs font-bold uppercase text-slate-500 mb-1 block">Quantity</label>
                  <input
                    type="number" min="0" required
                    className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700"
                    value={newPrize.quantity || 0}
                    onChange={e => setNewPrize({ ...newPrize, quantity: parseInt(e.target.value) })}
                  />
                </div>
                <div className="flex-1 w-full">
                  <label className="text-xs font-bold uppercase text-slate-500 mb-1 block">When Exhausted</label>
                  <select
                    className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700"
                    value={newPrize.exhaustionBehavior}
                    onChange={e => setNewPrize({ ...newPrize, exhaustionBehavior: e.target.value as any })}
                  >
                    <option value="exclude">Exclude from wheel</option>
                    <option value="show_unavailable">Show as unavailable</option>
                    <option value="mark_inactive">Mark as inactive</option>
                  </select>
                </div>
              </>
            )}

            {/* Project Assignment */}
            <div className="flex-1 w-full">
              <label className="text-xs font-bold uppercase text-slate-500 mb-1 block">Project (Optional)</label>
              <select
                className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700"
                value={newPrize.projectId || ''}
                onChange={e => setNewPrize({ ...newPrize, projectId: e.target.value })}
              >
                <option value="">All Projects</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>{project.name}</option>
                ))}
              </select>
            </div>

            <button type="submit" className="px-6 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700">Save</button>
          </form>
        </div>
      )}

      {/* Edit Prize Modal */}
      {editingPrize && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Edit Prize</h2>
              <button
                onClick={() => setEditingPrize(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleUpdatePrize} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Prize Name */}
                <div>
                  <label className="text-xs font-bold uppercase text-slate-500 mb-1 block">Prize Name</label>
                  <input
                    type="text" required
                    className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-800"
                    value={editingPrize.name}
                    onChange={e => setEditingPrize({ ...editingPrize, name: e.target.value })}
                  />
                </div>

                {/* Type */}
                <div>
                  <label className="text-xs font-bold uppercase text-slate-500 mb-1 block">Type</label>
                  <select
                    className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-800"
                    value={editingPrize.type}
                    onChange={e => setEditingPrize({ ...editingPrize, type: e.target.value as any })}
                  >
                    <option>Food Item</option>
                    <option>Discount</option>
                    <option>Voucher</option>
                    <option>Merchandise</option>
                  </select>
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="text-xs font-bold uppercase text-slate-500 mb-1 block">Description</label>
                  <input
                    type="text"
                    className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-800"
                    value={editingPrize.description}
                    onChange={e => setEditingPrize({ ...editingPrize, description: e.target.value })}
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="text-xs font-bold uppercase text-slate-500 mb-1 block">Status</label>
                  <select
                    className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-800"
                    value={editingPrize.status}
                    onChange={e => setEditingPrize({ ...editingPrize, status: e.target.value as any })}
                  >
                    <option>Active</option>
                    <option>Inactive</option>
                  </select>
                </div>

                {/* Availability */}
                <div>
                  <label className="text-xs font-bold uppercase text-slate-500 mb-1 block">Availability</label>
                  <select
                    className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-800"
                    value={editingPrize.isUnlimited ? 'unlimited' : 'numbered'}
                    onChange={e => setEditingPrize({ ...editingPrize, isUnlimited: e.target.value === 'unlimited' })}
                  >
                    <option value="unlimited">Unlimited</option>
                    <option value="numbered">Numbered</option>
                  </select>
                </div>

                {/* Quantity (conditional) */}
                {!editingPrize.isUnlimited && (
                  <>
                    <div>
                      <label className="text-xs font-bold uppercase text-slate-500 mb-1 block">Quantity</label>
                      <input
                        type="number" min="0" required
                        className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-800"
                        value={editingPrize.quantity || 0}
                        onChange={e => setEditingPrize({ ...editingPrize, quantity: parseInt(e.target.value) })}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase text-slate-500 mb-1 block">When Exhausted</label>
                      <select
                        className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-800"
                        value={editingPrize.exhaustionBehavior}
                        onChange={e => setEditingPrize({ ...editingPrize, exhaustionBehavior: e.target.value as any })}
                      >
                        <option value="exclude">Exclude from wheel</option>
                        <option value="show_unavailable">Show as unavailable</option>
                        <option value="mark_inactive">Mark as inactive</option>
                      </select>
                    </div>
                  </>
                )}
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setEditingPrize(null)}
                  className="px-6 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-bold rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
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
                <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Quantity</th>
                <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Status</th>
                <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {filteredPrizes.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-slate-500">No prizes found{selectedProjectFilter ? ' for this project' : ''}.</td></tr>
              ) : filteredPrizes.map((prize) => (
                <tr key={prize.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-white">{prize.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">{prize.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">{prize.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                    {prize.isUnlimited ? (
                      <span className="text-green-600 dark:text-green-400 font-medium">Unlimited</span>
                    ) : (
                      <span className="font-medium">
                        {prize.quantity ?? 0} / {prize.initialQuantity ?? 0}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${prize.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300'
                      }`}>
                      {prize.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-4">
                      <button
                        onClick={() => setEditingPrize(prize)}
                        className="text-blue-500 hover:text-blue-600 transition-colors"
                        title="Edit prize"
                      >
                        <span className="material-symbols-outlined">edit</span>
                      </button>
                      <button
                        onClick={() => deletePrize(prize.id)}
                        className="text-red-500 hover:text-red-600 transition-colors"
                        title="Delete prize"
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