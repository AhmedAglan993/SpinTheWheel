import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';

const SettingsPage: React.FC = () => {
  const { currentTenant, updateTenantSettings } = useData();
  const [name, setName] = useState(currentTenant?.name || '');
  const [logo, setLogo] = useState(currentTenant?.logo || '');
  const [color, setColor] = useState(currentTenant?.primaryColor || '#2bbdee');

  if (!currentTenant) return null;

  const handleSave = () => {
    updateTenantSettings(currentTenant.id, {
      name,
      logo,
      primaryColor: color
    });
    alert('Settings saved!');
  };

  return (
    <div className="flex flex-col gap-8 max-w-2xl">
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        <h3 className="text-lg font-bold mb-6">Game Branding</h3>
        
        <div className="space-y-6">
          {/* Logo Upload Mock */}
          <div>
            <label className="block text-sm font-medium mb-2">Company Logo URL</label>
            <div className="flex items-center gap-4">
              <div className="size-16 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden">
                {logo ? <img src={logo} alt="Logo" className="w-full h-full object-cover" /> : <span className="material-symbols-outlined text-slate-400">image</span>}
              </div>
              <input 
                type="text" 
                value={logo}
                onChange={(e) => setLogo(e.target.value)}
                className="flex-1 p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent"
                placeholder="https://..."
              />
            </div>
          </div>

          {/* Business Name */}
          <div>
            <label className="block text-sm font-medium mb-2">Display Name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent"
            />
          </div>

          {/* Brand Color */}
          <div>
            <label className="block text-sm font-medium mb-2">Primary Color</label>
            <div className="flex items-center gap-4">
              <input 
                type="color" 
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="h-10 w-20 rounded cursor-pointer"
              />
              <span className="text-sm text-slate-500">{color}</span>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
          <button 
            onClick={handleSave}
            className="px-6 py-2.5 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;