import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useData } from '../../contexts/DataContext';
import { statsAPI, projectsAPI, ownerAPI } from '../../src/services/api';

interface StatsData {
  totalSpins: number;
  uniqueUsers: number;
  prizesWon: Array<{ prizeWon: string; _count: { prizeWon: number } }>;
  chartData: Array<{ date: string; spins: number }>;
  totalProjects: number;
  activeProjects: number;
  totalTenants?: number;
}

interface Project {
  id: string;
  name: string;
  status: string;
}

const DashboardPage: React.FC = () => {
  const { currentTenant } = useData();
  const [stats, setStats] = useState<StatsData | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const [viewMode, setViewMode] = useState<'tenant' | 'global'>('tenant');
  const shareLink = `${window.location.origin}/#/play/${currentTenant?.id}`;

  useEffect(() => {
    checkOwnerStatus();
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedProject) {
      fetchProjectStats(selectedProject);
    } else if (viewMode === 'global' && isOwner) {
      fetchGlobalStats();
    } else {
      fetchData();
    }
  }, [selectedProject, viewMode]);

  const checkOwnerStatus = async () => {
    try {
      // Try to fetch owner stats - if it succeeds, user is owner
      await ownerAPI.getStats();
      setIsOwner(true);
    } catch {
      setIsOwner(false);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsData, projectsData] = await Promise.all([
        statsAPI.getOverview(),
        projectsAPI.getAll()
      ]);
      setStats(statsData);
      setProjects(projectsData);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchGlobalStats = async () => {
    try {
      setLoading(true);
      const globalStats = await ownerAPI.getStats();
      setStats({
        totalSpins: globalStats.totalSpins,
        uniqueUsers: globalStats.uniqueUsers,
        prizesWon: globalStats.prizesWon,
        chartData: globalStats.chartData,
        totalProjects: globalStats.totalProjects,
        activeProjects: globalStats.activeProjects,
        totalTenants: globalStats.totalTenants
      });
    } catch (error) {
      console.error('Failed to fetch global stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProjectStats = async (projectId: string) => {
    try {
      setLoading(true);
      const data = await statsAPI.getProjectStats(projectId);
      setStats({
        totalSpins: data.totalSpins,
        uniqueUsers: data.uniqueUsers,
        prizesWon: data.prizesWon,
        chartData: data.chartData,
        totalProjects: 1,
        activeProjects: data.project.status === 'Active' ? 1 : 0
      });
    } catch (error) {
      console.error('Failed to fetch project stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyLink = () => {
    const link = selectedProject
      ? `${window.location.origin}/#/spin/${selectedProject}`
      : shareLink;
    navigator.clipboard.writeText(link);
    alert('Link copied to clipboard!');
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  const handleViewModeChange = (mode: 'tenant' | 'global') => {
    setViewMode(mode);
    setSelectedProject('');
  };

  return (
    <div className="flex flex-col gap-6">
      {/* View Mode Toggle for Owners */}
      {isOwner && (
        <div className="flex items-center gap-4 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
          <span className="material-symbols-outlined text-amber-600">admin_panel_settings</span>
          <span className="text-amber-800 dark:text-amber-200 font-medium">Platform Owner View:</span>
          <div className="flex gap-2">
            <button
              onClick={() => handleViewModeChange('tenant')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${viewMode === 'tenant'
                  ? 'bg-amber-600 text-white'
                  : 'bg-amber-100 dark:bg-amber-800/40 text-amber-800 dark:text-amber-200 hover:bg-amber-200'
                }`}
            >
              My Stats
            </button>
            <button
              onClick={() => handleViewModeChange('global')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${viewMode === 'global'
                  ? 'bg-amber-600 text-white'
                  : 'bg-amber-100 dark:bg-amber-800/40 text-amber-800 dark:text-amber-200 hover:bg-amber-200'
                }`}
            >
              Global Stats (All Tenants)
            </button>
          </div>
        </div>
      )}

      {/* Project Filter - only show when viewing tenant stats */}
      {viewMode === 'tenant' && (
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-text-muted-light dark:text-text-muted-dark">
              View stats for:
            </label>
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="px-3 py-2 rounded-lg border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-text-light dark:text-text-dark"
            >
              <option value="">All Projects</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={fetchData}
            className="p-2 hover:bg-surface-elevated-light dark:hover:bg-surface-elevated-dark rounded-lg transition-colors"
            title="Refresh"
          >
            <span className="material-symbols-outlined text-text-muted-light dark:text-text-muted-dark">refresh</span>
          </button>
        </div>
      )}

      {/* Global Stats Header */}
      {viewMode === 'global' && (
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Global Platform Statistics</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Data from all tenants and projects</p>
          </div>
          <button
            onClick={fetchGlobalStats}
            className="p-2 hover:bg-surface-elevated-light dark:hover:bg-surface-elevated-dark rounded-lg transition-colors"
            title="Refresh"
          >
            <span className="material-symbols-outlined text-text-muted-light dark:text-text-muted-dark">refresh</span>
          </button>
        </div>
      )}

      {/* Link Generation Section - only show for tenant view */}
      {viewMode === 'tenant' && (
        <div className="bg-gradient-to-r from-surface-dark to-background-dark rounded-xl p-6 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-6 border border-border-dark">
          <div>
            <h3 className="text-xl font-bold mb-2">
              {selectedProject ? projects.find(p => p.id === selectedProject)?.name : 'Your Game is Live!'}
            </h3>
            <p className="text-text-muted-dark text-sm max-w-md">Share this link with your customers or display it on a tablet at your venue to start collecting leads.</p>
          </div>
          <div className="flex w-full md:w-auto items-center gap-2 bg-white/10 p-1.5 rounded-lg border border-white/20">
            <code className="px-3 py-2 text-sm font-mono text-blue-200 truncate max-w-[200px] md:max-w-xs">
              {selectedProject ? `${window.location.origin}/#/spin/${selectedProject}` : shareLink}
            </code>
            <button onClick={copyLink} className="p-2 bg-primary hover:bg-primary-dark text-white rounded-md transition-colors" title="Copy Link">
              <span className="material-symbols-outlined !text-lg">content_copy</span>
            </button>
            <a
              href={selectedProject ? `${window.location.origin}/#/spin/${selectedProject}` : shareLink}
              target="_blank"
              rel="noreferrer"
              className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-md transition-colors"
              title="Open"
            >
              <span className="material-symbols-outlined !text-lg">open_in_new</span>
            </a>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className={`grid grid-cols-1 ${viewMode === 'global' ? 'md:grid-cols-5' : 'md:grid-cols-4'} gap-6`}>
        {viewMode === 'global' && (
          <div className="flex flex-col gap-2 rounded-xl p-6 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 shadow-sm">
            <p className="text-amber-700 dark:text-amber-300 text-base font-medium">Total Tenants</p>
            <p className="text-amber-900 dark:text-amber-100 text-3xl font-bold">
              {loading ? '...' : formatNumber(stats?.totalTenants || 0)}
            </p>
          </div>
        )}
        <div className="flex flex-col gap-2 rounded-xl p-6 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark shadow-sm">
          <p className="text-text-muted-light dark:text-text-muted-dark text-base font-medium">Total Spins</p>
          <p className="text-slate-900 dark:text-white text-3xl font-bold">
            {loading ? '...' : formatNumber(stats?.totalSpins || 0)}
          </p>
        </div>
        <div className="flex flex-col gap-2 rounded-xl p-6 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark shadow-sm">
          <p className="text-text-muted-light dark:text-text-muted-dark text-base font-medium">Unique Users</p>
          <p className="text-slate-900 dark:text-white text-3xl font-bold">
            {loading ? '...' : formatNumber(stats?.uniqueUsers || 0)}
          </p>
        </div>
        <div className="flex flex-col gap-2 rounded-xl p-6 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark shadow-sm">
          <p className="text-text-muted-light dark:text-text-muted-dark text-base font-medium">Prizes Won</p>
          <p className="text-slate-900 dark:text-white text-3xl font-bold">
            {loading ? '...' : formatNumber(stats?.prizesWon?.length || 0)}
          </p>
        </div>
        <div className="flex flex-col gap-2 rounded-xl p-6 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark shadow-sm">
          <p className="text-text-muted-light dark:text-text-muted-dark text-base font-medium">Active Projects</p>
          <p className="text-slate-900 dark:text-white text-3xl font-bold">
            {loading ? '...' : `${stats?.activeProjects || 0} / ${stats?.totalProjects || 0}`}
          </p>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-6 shadow-sm">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-lg font-bold text-text-light dark:text-text-dark">
              {viewMode === 'global' ? 'Platform-wide Engagement' : 'Engagement Overview'}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-text-muted-light dark:text-text-muted-dark text-sm">
                {selectedProject ? 'All time' : 'Last 30 days'}
              </span>
            </div>
          </div>
        </div>
        <div className="h-[300px] w-full">
          {loading ? (
            <div className="h-full flex items-center justify-center text-text-muted-light dark:text-text-muted-dark">
              Loading chart...
            </div>
          ) : stats?.chartData && stats.chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.chartData}>
                <defs>
                  <linearGradient id="colorSpins" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1eb8e8" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#1eb8e8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  stroke="#64748b"
                  fontSize={12}
                />
                <YAxis hide />
                <Tooltip
                  contentStyle={{ backgroundColor: '#111920', border: '1px solid #1e3a4a', borderRadius: '8px', color: '#fff' }}
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                  formatter={(value: number) => [value, 'Spins']}
                />
                <Area
                  type="monotone"
                  dataKey="spins"
                  stroke="#1eb8e8"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorSpins)"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-text-muted-light dark:text-text-muted-dark">
              No spin data yet. Share your wheel link to start collecting data!
            </div>
          )}
        </div>
      </div>

      {/* Prize Breakdown */}
      {stats?.prizesWon && stats.prizesWon.length > 0 && (
        <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-text-light dark:text-text-dark mb-4">Prize Breakdown</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.prizesWon.map((prize, i) => (
              <div key={i} className="p-4 bg-surface-elevated-light dark:bg-surface-elevated-dark rounded-lg">
                <p className="text-sm text-text-muted-light dark:text-text-muted-dark">{prize.prizeWon}</p>
                <p className="text-2xl font-bold text-text-light dark:text-text-dark">{prize._count.prizeWon}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;