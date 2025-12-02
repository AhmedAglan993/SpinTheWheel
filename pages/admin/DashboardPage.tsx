import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { StatCardProps, RecentActivity } from '../../types';

// Mock Data
const stats: StatCardProps[] = [
  { title: 'Total Users', value: '1,420', change: '+5.4%', trend: 'up' },
  { title: 'Prizes Redeemed', value: '312', change: '+12.1%', trend: 'up' },
  { title: 'New Subscribers', value: '89', change: '-1.2%', trend: 'down' },
  { title: 'Active Users', value: '1.1k', change: '+2.8%', trend: 'up' },
];

const chartData = [
  { name: 'Day 1', value: 30 },
  { name: 'Day 5', value: 100 },
  { name: 'Day 10', value: 80 },
  { name: 'Day 15', value: 130 },
  { name: 'Day 20', value: 50 },
  { name: 'Day 25', value: 150 },
  { name: 'Day 30', value: 110 },
];

const activities: RecentActivity[] = [
  { id: '1', type: 'signup', title: 'New user signed up', time: 'Alex Morgan, 2 mins ago', icon: 'person_add', color: 'bg-blue-100 text-blue-500 dark:bg-blue-900/50 dark:text-blue-300' },
  { id: '2', type: 'redeem', title: 'Prize redeemed', time: 'Casey Jordan, 15 mins ago', icon: 'emoji_events', color: 'bg-amber-100 text-amber-500 dark:bg-amber-900/50 dark:text-amber-300' },
  { id: '3', type: 'upgrade', title: 'Subscription upgraded', time: 'Taylor Riley, 1 hour ago', icon: 'workspace_premium', color: 'bg-teal-100 text-teal-500 dark:bg-teal-900/50 dark:text-teal-300' },
  { id: '4', type: 'redeem', title: 'Prize redeemed', time: 'Jordan Pat, 3 hours ago', icon: 'emoji_events', color: 'bg-amber-100 text-amber-500 dark:bg-amber-900/50 dark:text-amber-300' },
];

const StatCard: React.FC<StatCardProps> = ({ title, value, change, trend }) => (
  <div className="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 shadow-sm">
    <p className="text-slate-600 dark:text-slate-400 text-base font-medium">{title}</p>
    <p className="text-slate-900 dark:text-white text-3xl font-bold">{value}</p>
    <div className={`text-sm font-medium flex items-center gap-1 ${trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
      <span className="material-symbols-outlined !text-base">{trend === 'up' ? 'arrow_upward' : 'arrow_downward'}</span>
      {change}
    </div>
  </div>
);

const DashboardPage: React.FC = () => {
  return (
    <div className="flex flex-col gap-6">
      {/* Filter Row */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
          Last 30 Days
          <span className="material-symbols-outlined !text-xl text-slate-500">expand_more</span>
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary-dark transition-colors">
          <span className="material-symbols-outlined !text-xl">download</span>
          Generate Report
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Section */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-start mb-6">
             <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">User Sign-ups vs. Prize Redemptions</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-slate-500 dark:text-slate-400 text-sm">Last 30 days</span>
                  <span className="text-green-600 dark:text-green-400 text-sm font-bold flex items-center">
                    <span className="material-symbols-outlined !text-base">arrow_upward</span>
                    +15.5%
                  </span>
                </div>
             </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2bbdee" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#2bbdee" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" hide />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                  cursor={{ stroke: '#94a3b8', strokeWidth: 1 }}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#2bbdee" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#colorValue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm flex flex-col">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Recent Activity</h3>
          <div className="flex flex-col gap-6 flex-1">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-center gap-4">
                <div className={`size-10 rounded-full flex items-center justify-center ${activity.color} shrink-0`}>
                  <span className="material-symbols-outlined">{activity.icon}</span>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{activity.title}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-6 w-full py-2.5 text-sm font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors">
            View All
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;