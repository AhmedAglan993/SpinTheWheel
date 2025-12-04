import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';

// Complete theme presets with all colors
const THEME_PRESETS = [
  {
    name: 'Ocean Breeze',
    primaryColor: '#2bbdee',
    secondaryColor: '#0891b2',
    backgroundColor: '#f0f9ff',
    textColor: '#0c4a6e'
  },
  {
    name: 'Sunset Vibes',
    primaryColor: '#f97316',
    secondaryColor: '#ea580c',
    backgroundColor: '#fff7ed',
    textColor: '#7c2d12'
  },
  {
    name: 'Forest Green',
    primaryColor: '#10b981',
    secondaryColor: '#059669',
    backgroundColor: '#f0fdf4',
    textColor: '#14532d'
  },
  {
    name: 'Royal Purple',
    primaryColor: '#8b5cf6',
    secondaryColor: '#7c3aed',
    backgroundColor: '#faf5ff',
    textColor: '#4c1d95'
  },
  {
    name: 'Rose Garden',
    primaryColor: '#ec4899',
    secondaryColor: '#db2777',
    backgroundColor: '#fdf2f8',
    textColor: '#831843'
  },
  {
    name: 'Crimson Passion',
    primaryColor: '#ef4444',
    secondaryColor: '#dc2626',
    backgroundColor: '#fef2f2',
    textColor: '#7f1d1d'
  },
  {
    name: 'Midnight Blue',
    primaryColor: '#3b82f6',
    secondaryColor: '#2563eb',
    backgroundColor: '#eff6ff',
    textColor: '#1e3a8a'
  },
  {
    name: 'Golden Hour',
    primaryColor: '#f59e0b',
    secondaryColor: '#d97706',
    backgroundColor: '#fffbeb',
    textColor: '#78350f'
  },
  {
    name: 'Teal Dream',
    primaryColor: '#14b8a6',
    secondaryColor: '#0d9488',
    backgroundColor: '#f0fdfa',
    textColor: '#134e4a'
  },
  {
    name: 'Electric Lime',
    primaryColor: '#84cc16',
    secondaryColor: '#65a30d',
    backgroundColor: '#f7fee7',
    textColor: '#365314'
  },
  {
    name: 'Dark Elegance',
    primaryColor: '#8b5cf6',
    secondaryColor: '#6366f1',
    backgroundColor: '#1e293b',
    textColor: '#f1f5f9'
  },
  {
    name: 'Coral Reef',
    primaryColor: '#f97316',
    secondaryColor: '#fb923c',
    backgroundColor: '#fffbeb',
    textColor: '#7c2d12'
  },
];

const SettingsPage: React.FC = () => {
  const { currentTenant, updateTenantSettings } = useData();
  const [name, setName] = useState(currentTenant?.name || '');
  const [logo, setLogo] = useState(currentTenant?.logo || '');
  const [primaryColor, setPrimaryColor] = useState(currentTenant?.primaryColor || '#2bbdee');
  const [secondaryColor, setSecondaryColor] = useState(currentTenant?.secondaryColor || '#1e293b');
  const [backgroundColor, setBackgroundColor] = useState(currentTenant?.backgroundColor || '#f8fafc');
  const [textColor, setTextColor] = useState(currentTenant?.textColor || '#0f172a');
  const [isSaving, setIsSaving] = useState(false);

  if (!currentTenant) return null;

  const handleSelectTheme = (theme: typeof THEME_PRESETS[0]) => {
    setPrimaryColor(theme.primaryColor);
    setSecondaryColor(theme.secondaryColor);
    setBackgroundColor(theme.backgroundColor);
    setTextColor(theme.textColor);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateTenantSettings({
        name,
        logo,
        primaryColor,
        secondaryColor,
        backgroundColor,
        textColor
      });
      alert('Theme saved! Your custom colors will appear on the spin game.');
    } catch (error) {
      console.error('Failed to save settings:', error);
      alert('Failed to save settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl">
      {/* Theme Presets Section */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        <h3 className="text-lg font-bold mb-4">🎨 Theme Presets</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
          Choose a complete theme or customize individual colors below
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {THEME_PRESETS.map((theme) => (
            <button
              key={theme.name}
              onClick={() => handleSelectTheme(theme)}
              className="group relative p-4 rounded-xl border-2 transition-all hover:scale-105 hover:shadow-lg"
              style={{
                borderColor: primaryColor === theme.primaryColor &&
                  secondaryColor === theme.secondaryColor ?
                  theme.primaryColor : '#e2e8f0',
                backgroundColor: theme.backgroundColor
              }}
            >
              {/* Color Swatches */}
              <div className="flex gap-2 mb-3">
                <div
                  className="w-8 h-8 rounded-full shadow-md ring-2 ring-white"
                  style={{ backgroundColor: theme.primaryColor }}
                />
                <div
                  className="w-8 h-8 rounded-full shadow-md ring-2 ring-white"
                  style={{ backgroundColor: theme.secondaryColor }}
                />
                <div
                  className="w-8 h-8 rounded-full shadow-md ring-2 ring-white"
                  style={{ backgroundColor: theme.backgroundColor }}
                />
              </div>

              <p className="font-bold text-sm" style={{ color: theme.textColor }}>
                {theme.name}
              </p>

              {/* Selected Indicator */}
              {primaryColor === theme.primaryColor &&
                secondaryColor === theme.secondaryColor && (
                  <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1">
                    <span className="material-symbols-outlined !text-base">check</span>
                  </div>
                )}
            </button>
          ))}
        </div>
      </div>

      {/* Business Info */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        <h3 className="text-lg font-bold mb-6">🏢 Business Information</h3>

        <div className="space-y-6">
          {/* Logo */}
          <div>
            <label className="block text-sm font-medium mb-2">Company Logo URL</label>
            <div className="flex items-center gap-4">
              <div className="size-16 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden">
                {logo ? (
                  <img src={logo} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  <span className="material-symbols-outlined text-slate-400">image</span>
                )}
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
              placeholder="Your Business Name"
            />
          </div>
        </div>
      </div>

      {/* Custom Colors Section */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        <h3 className="text-lg font-bold mb-4">🎨 Custom Color Palette</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
          Fine-tune individual colors or select a preset above
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Primary Color */}
          <div>
            <label className="block text-sm font-semibold mb-3">Primary Color</label>
            <p className="text-xs text-slate-500 mb-3">Main buttons, accents, wheel pointer</p>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="h-12 w-16 rounded-lg cursor-pointer border-2 border-white shadow-md"
              />
              <input
                type="text"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="flex-1 p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent font-mono text-sm"
              />
            </div>
          </div>

          {/* Secondary Color */}
          <div>
            <label className="block text-sm font-semibold mb-3">Secondary Color</label>
            <p className="text-xs text-slate-500 mb-3">Secondary accents, highlights</p>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={secondaryColor}
                onChange={(e) => setSecondaryColor(e.target.value)}
                className="h-12 w-16 rounded-lg cursor-pointer border-2 border-white shadow-md"
              />
              <input
                type="text"
                value={secondaryColor}
                onChange={(e) => setSecondaryColor(e.target.value)}
                className="flex-1 p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent font-mono text-sm"
              />
            </div>
          </div>

          {/* Background Color */}
          <div>
            <label className="block text-sm font-semibold mb-3">Background Color</label>
            <p className="text-xs text-slate-500 mb-3">Page background</p>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)}
                className="h-12 w-16 rounded-lg cursor-pointer border-2 border-white shadow-md"
              />
              <input
                type="text"
                value={backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)}
                className="flex-1 p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent font-mono text-sm"
              />
            </div>
          </div>

          {/* Text Color */}
          <div>
            <label className="block text-sm font-semibold mb-3">Text Color</label>
            <p className="text-xs text-slate-500 mb-3">Main text and headings</p>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                className="h-12 w-16 rounded-lg cursor-pointer border-2 border-white shadow-md"
              />
              <input
                type="text"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                className="flex-1 p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent font-mono text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Live Preview */}
      <div
        className="rounded-xl border-2 p-8 shadow-lg transition-all"
        style={{
          backgroundColor: backgroundColor,
          borderColor: primaryColor,
          color: textColor
        }}
      >
        <h3 className="text-xl font-bold mb-4" style={{ color: textColor }}>
          🎪 Live Preview
        </h3>
        <p className="text-sm mb-6 opacity-80">How your spin game will look:</p>

        <div className="flex flex-wrap items-center gap-4">
          <button
            style={{ backgroundColor: primaryColor }}
            className="px-8 py-4 rounded-xl text-white font-bold shadow-xl transform hover:scale-105 transition-all"
          >
            SPIN THE WHEEL
          </button>

          <div
            className="px-6 py-3 rounded-lg font-semibold border-2"
            style={{
              borderColor: secondaryColor,
              color: secondaryColor,
              backgroundColor: `${secondaryColor}10`
            }}
          >
            Prize Won!
          </div>

          <div className="flex gap-2">
            <div
              className="w-12 h-12 rounded-full shadow-md"
              style={{ backgroundColor: primaryColor }}
            />
            <div
              className="w-12 h-12 rounded-full shadow-md"
              style={{ backgroundColor: secondaryColor }}
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex items-center justify-between p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <p className="text-sm font-medium">Ready to apply your theme?</p>
          <p className="text-xs text-slate-500 mt-1">
            💡 Changes will be visible immediately on your spin game
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg"
        >
          {isSaving ? (
            <>
              <span className="material-symbols-outlined animate-spin">refresh</span>
              Saving Theme...
            </>
          ) : (
            <>
              <span className="material-symbols-outlined">palette</span>
              Save Theme
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;