import React from 'react';
import { useData } from '../../contexts/DataContext';

const SubscriptionPage: React.FC = () => {
  const { invoices } = useData();

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto">
      
      {/* Current Plan Section */}
      <section className="flex flex-col md:flex-row gap-6 bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-8 shadow-xl relative overflow-hidden">
         {/* Decorative Background */}
         <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-primary/20 rounded-full blur-3xl"></div>
         
         <div className="flex-1 relative z-10">
            <div className="flex items-center gap-3 mb-4">
               <span className="bg-white/10 p-2 rounded-lg backdrop-blur-sm">
                  <span className="material-symbols-outlined text-primary">diamond</span>
               </span>
               <h2 className="text-lg font-medium text-slate-300">Current Subscription</h2>
            </div>
            <h1 className="text-4xl font-bold mb-2">Growth Plan</h1>
            <p className="text-slate-400 mb-6 max-w-sm">Perfect for growing restaurants with up to 5,000 monthly spins.</p>
            <div className="flex gap-3">
               <button className="bg-white text-slate-900 px-5 py-2.5 rounded-lg font-bold hover:bg-slate-100 transition-colors">
                  Manage Plan
               </button>
               <button className="bg-transparent border border-white/20 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-white/10 transition-colors">
                  Cancel Subscription
               </button>
            </div>
         </div>
         
         <div className="flex flex-col justify-center min-w-[200px] border-t md:border-t-0 md:border-l border-white/10 pt-6 md:pt-0 md:pl-6 relative z-10">
            <p className="text-sm text-slate-400 mb-1">Next Payment</p>
            <p className="text-3xl font-bold">$49.00</p>
            <p className="text-sm text-slate-400 mb-4">on Oct 24, 2023</p>
            <div className="flex items-center gap-2 text-xs font-medium bg-green-500/20 text-green-400 px-3 py-1.5 rounded-full w-fit">
               <span className="material-symbols-outlined !text-sm">check_circle</span>
               Active
            </div>
         </div>
      </section>

      {/* Upgrade Options */}
      <section>
         <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Available Plans</h3>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Starter */}
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 hover:border-primary/50 transition-colors">
               <h4 className="font-bold text-lg text-slate-900 dark:text-white">Starter</h4>
               <p className="text-3xl font-bold mt-2">$29<span className="text-sm font-normal text-slate-500">/mo</span></p>
               <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">For small cafes</p>
               <ul className="mt-6 space-y-3 text-sm text-slate-600 dark:text-slate-300">
                  <li className="flex items-center gap-2"><span className="material-symbols-outlined text-green-500 !text-lg">check</span> 1,000 Spins/mo</li>
                  <li className="flex items-center gap-2"><span className="material-symbols-outlined text-green-500 !text-lg">check</span> Basic Analytics</li>
                  <li className="flex items-center gap-2"><span className="material-symbols-outlined text-green-500 !text-lg">check</span> 5 Prizes Max</li>
               </ul>
               <button className="w-full mt-6 py-2 border border-slate-300 dark:border-slate-600 rounded-lg font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">Downgrade</button>
            </div>

            {/* Growth */}
            <div className="bg-white dark:bg-slate-800 border-2 border-primary rounded-xl p-6 relative shadow-lg shadow-primary/10">
               <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">CURRENT</div>
               <h4 className="font-bold text-lg text-slate-900 dark:text-white">Growth</h4>
               <p className="text-3xl font-bold mt-2 text-primary">$49<span className="text-sm font-normal text-slate-500 dark:text-slate-400">/mo</span></p>
               <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Most popular choice</p>
               <ul className="mt-6 space-y-3 text-sm text-slate-600 dark:text-slate-300">
                  <li className="flex items-center gap-2"><span className="material-symbols-outlined text-green-500 !text-lg">check</span> 5,000 Spins/mo</li>
                  <li className="flex items-center gap-2"><span className="material-symbols-outlined text-green-500 !text-lg">check</span> Advanced Analytics</li>
                  <li className="flex items-center gap-2"><span className="material-symbols-outlined text-green-500 !text-lg">check</span> Unlimited Prizes</li>
               </ul>
               <button disabled className="w-full mt-6 py-2 bg-primary/10 text-primary rounded-lg font-bold cursor-default">Current Plan</button>
            </div>

            {/* Enterprise */}
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 hover:border-primary/50 transition-colors">
               <h4 className="font-bold text-lg text-slate-900 dark:text-white">Enterprise</h4>
               <p className="text-3xl font-bold mt-2">$99<span className="text-sm font-normal text-slate-500">/mo</span></p>
               <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">For franchises</p>
               <ul className="mt-6 space-y-3 text-sm text-slate-600 dark:text-slate-300">
                  <li className="flex items-center gap-2"><span className="material-symbols-outlined text-green-500 !text-lg">check</span> Unlimited Spins</li>
                  <li className="flex items-center gap-2"><span className="material-symbols-outlined text-green-500 !text-lg">check</span> Custom Branding</li>
                  <li className="flex items-center gap-2"><span className="material-symbols-outlined text-green-500 !text-lg">check</span> Dedicated Support</li>
               </ul>
               <button className="w-full mt-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20">Upgrade</button>
            </div>
         </div>
      </section>

      {/* Payment Method & History Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         {/* Payment Method */}
         <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Payment Method</h3>
            <div className="flex items-center gap-4 p-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900/50">
               <div className="bg-white dark:bg-slate-800 p-2 rounded border border-slate-200 dark:border-slate-700">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/200px-Mastercard-logo.svg.png" alt="Mastercard" className="h-6" />
               </div>
               <div className="flex-1">
                  <p className="text-sm font-bold text-slate-900 dark:text-white">Mastercard ending in 4242</p>
                  <p className="text-xs text-slate-500">Expiry 12/24</p>
               </div>
               <button className="text-sm text-primary font-medium hover:underline">Edit</button>
            </div>
            <button className="mt-4 flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">
               <span className="material-symbols-outlined !text-lg">add</span>
               Add new payment method
            </button>
         </div>

         {/* Invoice History */}
         <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <div className="flex justify-between items-center mb-4">
               <h3 className="text-lg font-bold text-slate-900 dark:text-white">Billing History</h3>
               <button className="text-sm text-primary hover:underline">Download All</button>
            </div>
            <div className="space-y-3">
               {invoices.map((inv) => (
                  <div key={inv.id} className="flex items-center justify-between p-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg transition-colors cursor-pointer group">
                     <div className="flex items-center gap-3">
                        <div className="bg-slate-100 dark:bg-slate-700 p-2 rounded-lg text-slate-500 dark:text-slate-400 group-hover:bg-white dark:group-hover:bg-slate-600 group-hover:text-primary transition-colors">
                           <span className="material-symbols-outlined !text-xl">description</span>
                        </div>
                        <div>
                           <p className="text-sm font-bold text-slate-900 dark:text-white">{inv.date}</p>
                           <p className="text-xs text-slate-500">{inv.plan}</p>
                        </div>
                     </div>
                     <div className="text-right">
                        <p className="text-sm font-bold text-slate-900 dark:text-white">{inv.amount}</p>
                        <span className="text-[10px] uppercase font-bold text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400 px-1.5 py-0.5 rounded">{inv.status}</span>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;