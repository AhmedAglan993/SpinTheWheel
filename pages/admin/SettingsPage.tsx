import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';

// Curated brand color palettes
const COLOR_PALETTES = [
  { name: 'Ocean Blue', color: '#2bbdee' },
  { name: 'Vibrant Purple', color: '#8B5CF6' },
  { name: 'Emerald Green', color: '#10B981' },
  { name: 'Sunset Orange', color: '#F97316' },
  { name: 'Rose Pink', color: '#EC4899' },
  { name: 'Royal Blue', color: '#3B82F6' },
  { name: 'Crimson Red', color: '#EF4444' },
  { name: 'Amber Yellow', color: '#F59E0B' },
  { name: 'Teal', color: '#14B8A6' },
  { name: 'Indigo', color: '#6366F1' },
  { name: 'Lime Green', color: '#84CC16' },
  { name: 'Fuchsia', color: '#D946EF' },
];

const SettingsPage: React.FC = () => {
  const { currentTenant, updateTenantSettings } = useData();
  const [name, setName] = useState(currentTenant?.name || '');
  const [logo, setLogo] = useState(currentTenant?.logo || '');
  const [color, setColor] = useState(currentTenant?.primaryColor || '#2bbdee');
  const [isSaving, setIsSaving] = useState(false);

  if (!currentTenant) return null;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateTenantSettings({
        name,
        logo,
        primaryColor: color
      });
      alert('Settings saved! Your branding will appear on the spin game.');
    } catch (error) {
      console.error('Failed to save settings:', error);
      alert('Failed to save settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 max-w-3xl">
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
            <p className="text-xs text-slate-500 mt-2">Paste an image URL or use an image hosting service like Imgur</p>
          </div>

          {/* Business Name */}
          <div>
            <label className="block text-sm font-medium mb-2">Display Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent"
              placeholder="Your Business Name"
            />
          </div>

          {/* Brand Color with Palette */}
          <div>
            <label className="block text-sm font-medium mb-3">Primary Brand Color</label>

            {/* Color Palette Grid */}
            <div className="mb-4">
              <p className="text-xs text-slate-500 mb-3">Choose a preset color or pick your own below:</p>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                {COLOR_PALETTES.map((palette) => (
                  <button
                    key={palette.color}
                    onClick={() => setColor(palette.color)}
                    className={`group relative flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all hover:scale-105 ${color === palette.color
                        ? 'border-slate-900 dark:border-white shadow-lg'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                      }`}
                    title={palette.name}
                  >
                    <div
                      className="w-10 h-10 rounded-full shadow-md ring-2 ring-white dark:ring-slate-800"
                      style={{ backgroundColor: palette.color }}
                    />
                    <span className="text-xs font-medium text-center leading-tight">{palette.name}</span>
                    {color === palette.color && (
                      <div className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full p-0.5">
                        <span className="material-symbols-outlined !text-sm">check</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Color Picker */}
            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
              <p className="text-xs font-semibold uppercase text-slate-500 mb-3">Custom Color</p>
              <div className="flex items-center gap-4">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="h-12 w-24 rounded-lg cursor-pointer border-2 border-white shadow-md"
                />
                <div className="flex-1">
                  <input
                    type="text"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 font-mono text-sm"
                    placeholder="#2bbdee"
                  />
                  <p className="text-xs text-slate-500 mt-1">Enter hex code (e.g., #FF5733)</p>
                </div>
              </div>
            </div>

            {/* Preview */}
            <div className="mt-4 p-4 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
              <p className="text-xs font-semibold uppercase text-slate-500 mb-3">Preview</p>
              <div className="flex items-center gap-4">
                <button
                  style={{ backgroundColor: color }}
                  className="px-6 py-3 rounded-lg text-white font-bold shadow-lg transform hover:scale-105 transition-transform"
                >
                  Spin the Wheel
                </button>
                <div className="flex-1">
                  <div className="h-2 rounded-full" style={{ backgroundColor: color, opacity: 0.3 }}></div>
                  <p className="text-xs text-slate-500 mt-2">This color will appear on buttons, the wheel pointer, and prize highlights</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-2.5 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSaving ? (
              <>
                <span className="material-symbols-outlined animate-spin">refresh</span>
                Saving...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined">save</span>
                Save Changes
              </>
            )}
          </button>
          <p className="text-xs text-slate-500 mt-3">
            💡 Tip: After saving, copy your game link from the Dashboard and open it to see your new branding!
          </p>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;