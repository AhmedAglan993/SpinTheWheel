import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-background-dark font-display text-slate-900 dark:text-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between p-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-white">
            <span className="material-symbols-outlined">api</span>
          </div>
          <span className="text-xl font-bold">Spinify</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-sm font-medium hover:text-primary transition-colors">Log In</Link>
          <Link to="/demo" className="px-5 py-2.5 bg-slate-900 dark:bg-white dark:text-slate-900 text-white text-sm font-bold rounded-full hover:opacity-90 transition-opacity">
            Try Demo
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 py-20 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wide mb-6">
          <span className="material-symbols-outlined !text-sm">star</span>
          Custom Spin Wheel Experiences
        </div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8">
          Engage customers with <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">Spin & Win</span> campaigns.
        </h1>
        <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 mb-10 max-w-2xl mx-auto">
          Create custom branded spin wheels for your events and campaigns. Collect emails, distribute prizes, and boost engagement. Contact us for a tailored solution.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/demo" className="w-full sm:w-auto px-8 py-4 bg-primary text-white text-lg font-bold rounded-xl shadow-xl shadow-primary/30 hover:bg-primary-dark transition-transform hover:-translate-y-1">
            Try Demo
          </Link>
          <Link to="/contact" className="w-full sm:w-auto px-8 py-4 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-lg font-bold rounded-xl hover:bg-slate-200 transition-colors flex items-center justify-center gap-2">
            <span className="material-symbols-outlined">contact_mail</span>
            Contact Us
          </Link>
        </div>
      </section>

      {/* Features Preview */}
      <section className="px-6 pb-24">
        <div className="max-w-6xl mx-auto bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-800 p-4 md:p-12 overflow-hidden relative">
          <img
            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2070"
            alt="Dashboard Preview"
            className="w-full rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-50 dark:from-slate-900 via-transparent to-transparent"></div>
        </div>
      </section>

      {/* Custom Solutions Section */}
      <section className="px-6 py-20 bg-slate-50 dark:bg-slate-900/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Custom Solutions for Your Business</h2>
          <p className="text-lg text-slate-500 dark:text-slate-400 mb-8">
            Every business is unique. We create custom spin wheel experiences tailored to your brand, event, and goals.
          </p>
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            <div className="p-6 bg-white dark:bg-slate-800 rounded-xl">
              <span className="material-symbols-outlined text-4xl text-primary mb-3 block">palette</span>
              <h3 className="font-bold mb-2">Custom Branding</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">Your logo, colors, and design</p>
            </div>
            <div className="p-6 bg-white dark:bg-slate-800 rounded-xl">
              <span className="material-symbols-outlined text-4xl text-primary mb-3 block">event</span>
              <h3 className="font-bold mb-2">Event-Specific</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">Perfect for trade shows & campaigns</p>
            </div>
            <div className="p-6 bg-white dark:bg-slate-800 rounded-xl">
              <span className="material-symbols-outlined text-4xl text-primary mb-3 block">support_agent</span>
              <h3 className="font-bold mb-2">Full Support</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">We handle setup and management</p>
            </div>
          </div>
          <Link to="/contact" className="inline-block px-8 py-4 bg-primary text-white text-lg font-bold rounded-xl hover:bg-primary-dark transition-colors">
            Get a Custom Quote
          </Link>
        </div>
      </section>

      <footer className="py-10 text-center text-slate-500 text-sm border-t border-slate-200 dark:border-slate-800">
        &copy; {new Date().getFullYear()} Spinify Inc. All rights reserved.
      </footer>
    </div>
  );
};

export default LandingPage;