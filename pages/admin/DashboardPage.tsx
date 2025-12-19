import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { StatCardProps, RecentActivity } from '../../types';
import { useData } from '../../contexts/DataContext';

// Mock Data
const stats: StatCardProps[] = [
  { title: 'Total Spins', value: '1,420', change: '+5.4%', trend: 'up' },
  { title: 'Prizes Redeemed', value: '312', change: '+12.1%', trend: 'up' },
  { title: 'Unique Players', value: '1.1k', change: '+2.8%', trend: 'up' },
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

const StatCard: React.FC<StatCardProps> = ({ title, value, change, trend }) => (
  <div className="flex flex-col gap-2 rounded-xl p-6 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark shadow-sm">
    <p className="text-text-muted-light dark:text-text-muted-dark text-base font-medium">{title}</p>
    <p className="text-slate-900 dark:text-white text-3xl font-bold">{value}</p>
    <div className={`text-sm font-medium flex items-center gap-1 ${trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
      <span className="material-symbols-outlined !text-base">{trend === 'up' ? 'arrow_upward' : 'arrow_downward'}</span>
      {change}
    </div>
  </div>
);

const DashboardPage: React.FC = () => {
  const { currentTenant } = useData();
  const shareLink = `${window.location.origin}/#/play/${currentTenant?.id}`;

  const copyLink = () => {
    navigator.clipboard.writeText(shareLink);
    alert('Link copied to clipboard!');
  };

  return (
    <div className="flex flex-col gap-6">

      {/* Link Generation Section */}
      <div className="bg-gradient-to-r from-surface-dark to-background-dark rounded-xl p-6 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-6 border border-border-dark">
        <div>
          <h3 className="text-xl font-bold mb-2">Your Game is Live!</h3>
          <p className="text-text-muted-dark text-sm max-w-md">Share this link with your customers or display it on a tablet at your venue to start collecting leads.</p>
        </div>
        <div className="flex w-full md:w-auto items-center gap-2 bg-white/10 p-1.5 rounded-lg border border-white/20">
          <code className="px-3 py-2 text-sm font-mono text-blue-200 truncate max-w-[200px] md:max-w-xs">{shareLink}</code>
          <button onClick={copyLink} className="p-2 bg-primary hover:bg-primary-dark text-white rounded-md transition-colors" title="Copy Link">
            <span className="material-symbols-outlined !text-lg">content_copy</span>
          </button>
          <a href={shareLink} target="_blank" rel="noreferrer" className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-md transition-colors" title="Open">
            <span className="material-symbols-outlined !text-lg">open_in_new</span>
          </a>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6">
        {/* Chart Section */}
        <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-lg font-bold text-text-light dark:text-text-dark">Engagement Overview</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-text-muted-light dark:text-text-muted-dark text-sm">Last 30 days</span>
              </div>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1eb8e8" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#1eb8e8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" hide />
                <YAxis hide />
                <Tooltip
                  contentStyle={{ backgroundColor: '#111920', border: '1px solid #1e3a4a', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                  cursor={{ stroke: '#94a3b8', strokeWidth: 1 }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#1eb8e8"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorValue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;