import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const LandingPage: React.FC = () => {
  const { t, language, setLanguage, isRTL } = useLanguage();

  return (
    <div className={`min-h-screen bg-white dark:bg-background-dark text-slate-900 dark:text-white ${isRTL ? 'font-arabic' : 'font-display'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Navbar */}
      <nav className="flex items-center justify-between p-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <img src="/seqed-games-logo.png" alt="Seqed Games" className="size-10" />
          <div className="flex flex-col leading-tight">
            <span className="text-xl font-bold leading-none">Spinify</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 leading-none mt-1">by Seqed Games</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {/* Language Toggle */}
          <button
            onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
            className="px-3 py-1.5 text-sm font-medium bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            {language === 'en' ? '🇸🇦 العربية' : '🇺🇸 English'}
          </button>
          <Link to="/login" className="text-sm font-medium hover:text-primary transition-colors">{t('auth.login')}</Link>
          <Link to="/demo" className="px-5 py-2.5 bg-slate-900 dark:bg-white dark:text-slate-900 text-white text-sm font-bold rounded-full hover:opacity-90 transition-opacity">
            {language === 'ar' ? 'جرب الآن' : 'Try Demo'}
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 py-20 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-primary/10 to-accent-gold/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wide mb-6">
          <span className="material-symbols-outlined !text-sm text-accent-gold">star</span>
          {language === 'ar' ? 'تجارب عجلة الحظ المخصصة' : 'Custom Spin Wheel Experiences'}
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-8 leading-snug">
          {language === 'ar' ? (
            <>حوّل كل زائر إلى <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent-gold to-primary-light">عميل محتمل</span></>
          ) : (
            <>Engage customers with <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent-gold to-primary-light">Spin & Win</span> campaigns.</>
          )}
        </h1>
        <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 mb-10 max-w-2xl mx-auto">
          {language === 'ar'
            ? 'أنشئ عجلات حظ مخصصة بعلامتك التجارية. اجمع بيانات العملاء، وزّع الجوائز، وزد التفاعل. تواصل معنا للحصول على حل مخصص.'
            : 'Create custom branded spin wheels for your events and campaigns. Collect emails, distribute prizes, and boost engagement. Contact us for a tailored solution.'
          }
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/demo" className="w-full sm:w-auto px-8 py-4 bg-primary text-white text-lg font-bold rounded-xl shadow-xl shadow-primary/30 hover:bg-primary-dark transition-transform hover:-translate-y-1">
            {language === 'ar' ? 'جرب العرض' : 'Try Demo'}
          </Link>
          <Link to="/contact" className="w-full sm:w-auto px-8 py-4 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-lg font-bold rounded-xl hover:bg-slate-200 transition-colors flex items-center justify-center gap-2">
            <span className="material-symbols-outlined">contact_mail</span>
            {language === 'ar' ? 'تواصل معنا' : 'Contact Us'}
          </Link>
        </div>
      </section>

      {/* Features Preview */}
      <section className="px-6 pb-24">
        <div className="max-w-6xl mx-auto bg-surface-elevated-light dark:bg-surface-elevated-dark rounded-3xl border border-border-light dark:border-border-dark p-4 md:p-12 overflow-hidden relative">
          <img
            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2070"
            alt="Dashboard Preview"
            className="w-full rounded-xl shadow-2xl border border-border-light dark:border-border-dark opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface-elevated-light dark:from-surface-elevated-dark via-transparent to-transparent"></div>
        </div>
      </section>

      {/* Custom Solutions Section */}
      <section className="px-6 py-20 bg-surface-elevated-light dark:bg-surface-elevated-dark">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            {language === 'ar' ? 'حلول مخصصة لعملك' : 'Custom Solutions for Your Business'}
          </h2>
          <p className="text-lg text-text-muted-light dark:text-text-muted-dark mb-8">
            {language === 'ar'
              ? 'كل عمل فريد. نحن ننشئ تجارب عجلة حظ مخصصة لعلامتك التجارية وحدثك وأهدافك.'
              : 'Every business is unique. We create custom spin wheel experiences tailored to your brand, event, and goals.'
            }
          </p>
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            <div className="p-6 bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark">
              <span className="material-symbols-outlined text-4xl text-primary mb-3 block">palette</span>
              <h3 className="font-bold mb-2">{language === 'ar' ? 'علامة تجارية مخصصة' : 'Custom Branding'}</h3>
              <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
                {language === 'ar' ? 'شعارك، ألوانك، وتصميمك' : 'Your logo, colors, and design'}
              </p>
            </div>
            <div className="p-6 bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark">
              <span className="material-symbols-outlined text-4xl text-primary mb-3 block">event</span>
              <h3 className="font-bold mb-2">{language === 'ar' ? 'خاص بالفعاليات' : 'Event-Specific'}</h3>
              <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
                {language === 'ar' ? 'مثالي للمعارض والحملات' : 'Perfect for trade shows & campaigns'}
              </p>
            </div>
            <div className="p-6 bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark">
              <span className="material-symbols-outlined text-4xl text-primary mb-3 block">support_agent</span>
              <h3 className="font-bold mb-2">{language === 'ar' ? 'دعم كامل' : 'Full Support'}</h3>
              <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
                {language === 'ar' ? 'نحن نتولى الإعداد والإدارة' : 'We handle setup and management'}
              </p>
            </div>
          </div>
          <Link to="/contact" className="inline-block px-8 py-4 bg-primary text-white text-lg font-bold rounded-xl hover:bg-primary-dark transition-colors">
            {language === 'ar' ? 'احصل على عرض سعر' : 'Get a Custom Quote'}
          </Link>
        </div>
      </section>

      {/* About Seqed Games Section */}
      <section className="px-6 py-20 bg-surface-light dark:bg-surface-dark">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <img src="/seqed-games-logo.png" alt="Seqed Games" className="size-20" />
          </div>
          <h2 className="text-3xl font-bold mb-4">
            {language === 'ar' ? 'من Seqed Games' : 'Powered by Seqed Games'}
          </h2>
          <p className="text-lg text-text-muted-light dark:text-text-muted-dark mb-8 max-w-2xl mx-auto">
            {language === 'ar'
              ? 'Spinify هو منتج من Seqed Games، شركة تطوير ألعاب متخصصة في الألعاب العلامات التجارية، الألعاب الجادة، تجارب VR/AR، وحلول التلعيب. مقرنا في مصر، نخدم العملاء عالمياً.'
              : 'SpinTheWheel is a product of Seqed Games, a professional game development company specializing in branded games, serious games, VR/AR experiences, and gamification solutions. Based in Egypt, serving clients globally.'
            }
          </p>
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            <div className="p-6 bg-surface-elevated-light dark:bg-surface-elevated-dark rounded-xl border border-border-light dark:border-border-dark">
              <span className="material-symbols-outlined text-4xl text-primary mb-3 block">sports_esports</span>
              <h3 className="font-bold mb-2">{language === 'ar' ? 'تطوير الألعاب' : 'Game Development'}</h3>
              <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
                {language === 'ar' ? 'تطوير ألعاب كامل من الفكرة إلى الإطلاق' : 'Full-cycle game development from concept to launch'}
              </p>
            </div>
            <div className="p-6 bg-surface-elevated-light dark:bg-surface-elevated-dark rounded-xl border border-border-light dark:border-border-dark">
              <span className="material-symbols-outlined text-4xl text-primary mb-3 block">psychology</span>
              <h3 className="font-bold mb-2">{language === 'ar' ? 'الألعاب الجادة' : 'Serious Games'}</h3>
              <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
                {language === 'ar' ? 'ألعاب التدريب والتعليم والمحاكاة' : 'Training, educational, and simulation games'}
              </p>
            </div>
            <div className="p-6 bg-surface-elevated-light dark:bg-surface-elevated-dark rounded-xl border border-border-light dark:border-border-dark">
              <span className="material-symbols-outlined text-4xl text-primary mb-3 block">view_in_ar</span>
              <h3 className="font-bold mb-2">{language === 'ar' ? 'تطوير VR/AR' : 'VR/AR Development'}</h3>
              <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
                {language === 'ar' ? 'تجارب الواقع الافتراضي والمعزز' : 'Immersive virtual and augmented reality experiences'}
              </p>
            </div>
          </div>
          <a
            href="https://seqedgames.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-lg font-bold rounded-xl hover:opacity-90 transition-opacity"
          >
            {language === 'ar' ? 'زيارة Seqed Games' : 'Visit Seqed Games'}
            <span className="material-symbols-outlined">arrow_outward</span>
          </a>
        </div>
      </section>

      <footer className="py-10 text-center text-text-muted-light dark:text-text-muted-dark text-sm border-t border-border-light dark:border-border-dark">
        <p>&copy; {new Date().getFullYear()} Seqed Games. {language === 'ar' ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}</p>
        <p className="mt-2 text-xs">
          <a href="https://seqedgames.com/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
            seqedgames.com
          </a>
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;