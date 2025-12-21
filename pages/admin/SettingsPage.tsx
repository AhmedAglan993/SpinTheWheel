import React, { useState, useEffect } from 'react';
import { useData } from '../../contexts/DataContext';
import { useLanguage } from '../../contexts/LanguageContext';

// Complete theme presets with all colors
const THEME_PRESETS = [
  { name: 'Ocean Breeze', primaryColor: '#2bbdee', secondaryColor: '#0891b2', backgroundColor: '#f0f9ff', textColor: '#0c4a6e' },
  { name: 'Sunset Vibes', primaryColor: '#f97316', secondaryColor: '#ea580c', backgroundColor: '#fff7ed', textColor: '#7c2d12' },
  { name: 'Forest Green', primaryColor: '#10b981', secondaryColor: '#059669', backgroundColor: '#f0fdf4', textColor: '#14532d' },
  { name: 'Royal Purple', primaryColor: '#8b5cf6', secondaryColor: '#7c3aed', backgroundColor: '#faf5ff', textColor: '#4c1d95' },
  { name: 'Rose Garden', primaryColor: '#ec4899', secondaryColor: '#db2777', backgroundColor: '#fdf2f8', textColor: '#831843' },
  { name: 'Crimson Passion', primaryColor: '#ef4444', secondaryColor: '#dc2626', backgroundColor: '#fef2f2', textColor: '#7f1d1d' },
  { name: 'Midnight Blue', primaryColor: '#3b82f6', secondaryColor: '#2563eb', backgroundColor: '#eff6ff', textColor: '#1e3a8a' },
  { name: 'Golden Hour', primaryColor: '#f59e0b', secondaryColor: '#d97706', backgroundColor: '#fffbeb', textColor: '#78350f' },
  { name: 'Teal Dream', primaryColor: '#14b8a6', secondaryColor: '#0d9488', backgroundColor: '#f0fdfa', textColor: '#134e4a' },
  { name: 'Electric Lime', primaryColor: '#84cc16', secondaryColor: '#65a30d', backgroundColor: '#f7fee7', textColor: '#365314' },
  { name: 'Dark Elegance', primaryColor: '#8b5cf6', secondaryColor: '#6366f1', backgroundColor: '#1e293b', textColor: '#f1f5f9' },
  { name: 'Coral Reef', primaryColor: '#f97316', secondaryColor: '#fb923c', backgroundColor: '#fffbeb', textColor: '#7c2d12' },
];

const SettingsPage: React.FC = () => {
  const { currentTenant, updateTenantSettings } = useData();
  const { t, language, setLanguage, isRTL } = useLanguage();

  const [name, setName] = useState(currentTenant?.name || '');
  const [logo, setLogo] = useState(currentTenant?.logo || '');
  const [primaryColor, setPrimaryColor] = useState(currentTenant?.primaryColor || '#2bbdee');
  const [secondaryColor, setSecondaryColor] = useState(currentTenant?.secondaryColor || '#1e293b');
  const [backgroundColor, setBackgroundColor] = useState(currentTenant?.backgroundColor || '#f8fafc');
  const [textColor, setTextColor] = useState(currentTenant?.textColor || '#0f172a');
  const [isSaving, setIsSaving] = useState(false);

  // Dashboard theme state
  const [dashboardTheme, setDashboardTheme] = useState<'light' | 'dark' | 'system'>(() => {
    return (localStorage.getItem('dashboardTheme') as 'light' | 'dark' | 'system') || 'system';
  });

  const isOwner = (currentTenant as any)?.isOwner === true;

  // Apply dashboard theme
  useEffect(() => {
    const applyTheme = () => {
      const root = document.documentElement;
      if (dashboardTheme === 'dark') {
        root.classList.add('dark');
      } else if (dashboardTheme === 'light') {
        root.classList.remove('dark');
      } else {
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
      }
    };
    applyTheme();
    localStorage.setItem('dashboardTheme', dashboardTheme);
  }, [dashboardTheme]);

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
      await updateTenantSettings({ name, logo, primaryColor, secondaryColor, backgroundColor, textColor });
      alert(language === 'ar' ? 'تم حفظ السمة!' : 'Theme saved!');
    } catch (error) {
      console.error('Failed to save settings:', error);
      alert(language === 'ar' ? 'فشل حفظ الإعدادات' : 'Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={`flex flex-col gap-6 max-w-5xl ${isRTL ? 'font-arabic' : ''}`}>
      {/* Language Section */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
        <h3 className="text-lg font-bold mb-4 text-slate-900 dark:text-white flex items-center gap-2">
          <span className="material-symbols-outlined">translate</span>
          {t('settings.language')}
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
          {t('settings.languageDesc')}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => setLanguage('en')}
            className={`p-4 rounded-xl border-2 transition-all flex items-center gap-4 ${language === 'en' ? 'border-primary bg-primary/5' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
              }`}
          >
            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-2xl">
              🇺🇸
            </div>
            <div className={`text-${isRTL ? 'right' : 'left'}`}>
              <span className="font-medium text-slate-900 dark:text-white block">English</span>
              {language === 'en' && <span className="text-xs text-primary font-medium">{t('settings.active')}</span>}
            </div>
          </button>

          <button
            onClick={() => setLanguage('ar')}
            className={`p-4 rounded-xl border-2 transition-all flex items-center gap-4 ${language === 'ar' ? 'border-primary bg-primary/5' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
              }`}
          >
            <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-2xl">
              🇸🇦
            </div>
            <div className={`text-${isRTL ? 'right' : 'left'}`}>
              <span className="font-medium text-slate-900 dark:text-white block">العربية</span>
              {language === 'ar' && <span className="text-xs text-primary font-medium">{t('settings.active')}</span>}
            </div>
          </button>
        </div>
      </div>

      {/* Dashboard Theme Section */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
        <h3 className="text-lg font-bold mb-4 text-slate-900 dark:text-white flex items-center gap-2">
          <span className="material-symbols-outlined">dark_mode</span>
          {t('settings.dashboardTheme')}
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
          {t('settings.themeDesc')}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            onClick={() => setDashboardTheme('light')}
            className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-3 ${dashboardTheme === 'light' ? 'border-primary bg-primary/5' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
              }`}
          >
            <div className="w-12 h-12 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center">
              <span className="material-symbols-outlined text-amber-500">light_mode</span>
            </div>
            <span className="font-medium text-slate-900 dark:text-white">{t('settings.light')}</span>
            {dashboardTheme === 'light' && <span className="text-xs text-primary font-medium">{t('settings.active')}</span>}
          </button>

          <button
            onClick={() => setDashboardTheme('dark')}
            className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-3 ${dashboardTheme === 'dark' ? 'border-primary bg-primary/5' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
              }`}
          >
            <div className="w-12 h-12 rounded-full bg-slate-800 border-2 border-slate-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-indigo-400">dark_mode</span>
            </div>
            <span className="font-medium text-slate-900 dark:text-white">{t('settings.dark')}</span>
            {dashboardTheme === 'dark' && <span className="text-xs text-primary font-medium">{t('settings.active')}</span>}
          </button>

          <button
            onClick={() => setDashboardTheme('system')}
            className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-3 ${dashboardTheme === 'system' ? 'border-primary bg-primary/5' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
              }`}
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-white to-slate-800 border-2 border-slate-300 flex items-center justify-center">
              <span className="material-symbols-outlined text-slate-600">desktop_windows</span>
            </div>
            <span className="font-medium text-slate-900 dark:text-white">{t('settings.system')}</span>
            {dashboardTheme === 'system' && <span className="text-xs text-primary font-medium">{t('settings.active')}</span>}
          </button>
        </div>
      </div>

      {/* Owner-only: Account Settings */}
      {isOwner && (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
          <h3 className="text-lg font-bold mb-4 text-slate-900 dark:text-white flex items-center gap-2">
            <span className="material-symbols-outlined">admin_panel_settings</span>
            {t('settings.accountType')}
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
              <div>
                <p className="font-medium text-amber-800 dark:text-amber-200">{t('settings.accountType')}</p>
                <p className="text-sm text-amber-600 dark:text-amber-400">{t('settings.platformOwner')}</p>
              </div>
              <span className="material-symbols-outlined text-amber-600 text-3xl">verified</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
              <div>
                <p className="font-medium text-slate-900 dark:text-white">{t('settings.email')}</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">{currentTenant.email}</p>
              </div>
              <span className="material-symbols-outlined text-slate-400">email</span>
            </div>
          </div>
        </div>
      )}

      {/* Tenant-only: Spin wheel customization */}
      {!isOwner && (
        <>
          {/* Theme Presets */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-4 text-slate-900 dark:text-white flex items-center gap-2">
              <span className="material-symbols-outlined">palette</span>
              {t('settings.spinWheelTheme')}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">{t('settings.themePresetsDesc')}</p>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {THEME_PRESETS.map((theme) => (
                <button
                  key={theme.name}
                  onClick={() => handleSelectTheme(theme)}
                  className="group relative p-4 rounded-xl border-2 transition-all hover:scale-105 hover:shadow-lg"
                  style={{
                    borderColor: primaryColor === theme.primaryColor && secondaryColor === theme.secondaryColor ? theme.primaryColor : '#e2e8f0',
                    backgroundColor: theme.backgroundColor
                  }}
                >
                  <div className="flex gap-2 mb-3">
                    <div className="w-6 h-6 rounded-full shadow-md" style={{ backgroundColor: theme.primaryColor }} />
                    <div className="w-6 h-6 rounded-full shadow-md" style={{ backgroundColor: theme.secondaryColor }} />
                  </div>
                  <p className="font-bold text-xs" style={{ color: theme.textColor }}>{theme.name}</p>
                  {primaryColor === theme.primaryColor && secondaryColor === theme.secondaryColor && (
                    <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1">
                      <span className="material-symbols-outlined !text-xs">check</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Business Info */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-6 text-slate-900 dark:text-white flex items-center gap-2">
              <span className="material-symbols-outlined">business</span>
              {t('settings.businessInfo')}
            </h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-900 dark:text-white">{t('settings.logoUrl')}</label>
                <div className="flex items-center gap-4">
                  <div className="size-16 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 flex items-center justify-center overflow-hidden">
                    {logo ? <img src={logo} alt="Logo" className="w-full h-full object-cover" /> : <span className="material-symbols-outlined text-slate-400">image</span>}
                  </div>
                  <input type="text" value={logo} onChange={(e) => setLogo(e.target.value)}
                    className="flex-1 p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent text-slate-900 dark:text-white" placeholder="https://..." />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-900 dark:text-white">{t('settings.displayName')}</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent text-slate-900 dark:text-white" />
              </div>
            </div>
          </div>

          {/* Custom Colors */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-4 text-slate-900 dark:text-white flex items-center gap-2">
              <span className="material-symbols-outlined">colorize</span>
              {t('settings.customColors')}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">{t('settings.customColorsDesc')}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: t('settings.primaryColor'), desc: t('settings.primaryColorDesc'), value: primaryColor, setter: setPrimaryColor },
                { label: t('settings.secondaryColor'), desc: t('settings.secondaryColorDesc'), value: secondaryColor, setter: setSecondaryColor },
                { label: t('settings.backgroundColor'), desc: t('settings.backgroundColorDesc'), value: backgroundColor, setter: setBackgroundColor },
                { label: t('settings.textColor'), desc: t('settings.textColorDesc'), value: textColor, setter: setTextColor },
              ].map((item, i) => (
                <div key={i}>
                  <label className="block text-sm font-semibold mb-2 text-slate-900 dark:text-white">{item.label}</label>
                  <p className="text-xs text-slate-500 mb-3">{item.desc}</p>
                  <div className="flex items-center gap-3">
                    <input type="color" value={item.value} onChange={(e) => item.setter(e.target.value)}
                      className="h-10 w-14 rounded-lg cursor-pointer border-2 border-white shadow-md" />
                    <input type="text" value={item.value} onChange={(e) => item.setter(e.target.value)}
                      className="flex-1 p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent font-mono text-sm text-slate-900 dark:text-white" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Live Preview */}
          <div className="rounded-xl border-2 p-8 shadow-lg transition-all" style={{ backgroundColor, borderColor: primaryColor, color: textColor }}>
            <h3 className="text-xl font-bold mb-4" style={{ color: textColor }}>🎪 {t('settings.livePreview')}</h3>
            <p className="text-sm mb-6 opacity-80">{t('settings.previewDesc')}</p>
            <div className="flex flex-wrap items-center gap-4">
              <button style={{ backgroundColor: primaryColor }} className="px-8 py-4 rounded-xl text-white font-bold shadow-xl transform hover:scale-105 transition-all">
                {t('settings.spinButton')}
              </button>
              <div className="px-6 py-3 rounded-lg font-semibold border-2" style={{ borderColor: secondaryColor, color: secondaryColor, backgroundColor: `${secondaryColor}10` }}>
                {t('settings.prizeWon')}
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex items-center justify-between p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div>
              <p className="text-sm font-medium text-slate-900 dark:text-white">{t('settings.readyToApply')}</p>
              <p className="text-xs text-slate-500 mt-1">💡 {t('settings.changesVisible')}</p>
            </div>
            <button onClick={handleSave} disabled={isSaving}
              className="px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-50 flex items-center gap-2 shadow-lg">
              {isSaving ? (
                <><span className="material-symbols-outlined animate-spin">refresh</span>{t('settings.savingTheme')}</>
              ) : (
                <><span className="material-symbols-outlined">palette</span>{t('settings.saveTheme')}</>
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default SettingsPage;