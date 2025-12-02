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
          <Link to="/signup" className="px-5 py-2.5 bg-slate-900 dark:bg-white dark:text-slate-900 text-white text-sm font-bold rounded-full hover:opacity-90 transition-opacity">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 py-20 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wide mb-6">
          <span className="material-symbols-outlined !text-sm">star</span>
          New Feature: Analytics Dashboard
        </div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8">
          Engage customers with <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">Spin & Win</span> campaigns.
        </h1>
        <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 mb-10 max-w-2xl mx-auto">
          Create a branded spin wheel in minutes. Collect emails, distribute coupons, and boost sales. No coding required.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/signup" className="w-full sm:w-auto px-8 py-4 bg-primary text-white text-lg font-bold rounded-xl shadow-xl shadow-primary/30 hover:bg-primary-dark transition-transform hover:-translate-y-1">
            Start Free Trial
          </Link>
          <Link to="/play/demo" target="_blank" className="w-full sm:w-auto px-8 py-4 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-lg font-bold rounded-xl hover:bg-slate-200 transition-colors flex items-center justify-center gap-2">
            <span className="material-symbols-outlined">play_circle</span>
            Try Demo
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

      {/* Pricing */}
      <section className="px-6 py-20 bg-slate-50 dark:bg-slate-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Simple, transparent pricing</h2>
            <p className="text-slate-500">Choose the perfect plan for your business.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {['Starter', 'Growth', 'Enterprise'].map((plan, i) => (
              <div key={plan} className={`p-8 rounded-2xl bg-white dark:bg-slate-800 border ${i === 1 ? 'border-primary ring-4 ring-primary/10' : 'border-slate-200 dark:border-slate-700'} relative`}>
                {i === 1 && <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white px-3 py-1 rounded-full text-xs font-bold">MOST POPULAR</div>}
                <h3 className="text-xl font-bold mb-2">{plan}</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-bold">${i === 0 ? '29' : i === 1 ? '49' : '99'}</span>
                  <span className="text-slate-500">/mo</span>
                </div>
                <ul className="space-y-4 mb-8 text-sm text-slate-600 dark:text-slate-300">
                   <li className="flex gap-3"><span className="material-symbols-outlined text-green-500">check</span> Unlimited Campaigns</li>
                   <li className="flex gap-3"><span className="material-symbols-outlined text-green-500">check</span> {i === 0 ? '100' : i === 1 ? '1,000' : 'Unlimited'} Leads</li>
                   <li className="flex gap-3"><span className="material-symbols-outlined text-green-500">check</span> Custom Branding</li>
                </ul>
                <Link 
                  to={`/signup?plan=${plan.toLowerCase()}`}
                  className={`block w-full py-3 rounded-lg text-center font-bold transition-colors ${i === 1 ? 'bg-primary text-white hover:bg-primary-dark' : 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600'}`}
                >
                  Select Plan
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="py-10 text-center text-slate-500 text-sm border-t border-slate-200 dark:border-slate-800">
        &copy; {new Date().getFullYear()} Spinify Inc. All rights reserved.
      </footer>
    </div>
  );
};

export default LandingPage;