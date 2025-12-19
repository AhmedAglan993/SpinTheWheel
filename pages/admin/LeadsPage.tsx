import React, { useState, useEffect } from 'react';
import { statsAPI, projectsAPI } from '../../src/services/api';

interface Lead {
    userName: string | null;
    userEmail: string | null;
    userPhone: string | null;
    prizeWon: string;
    timestamp: string;
}

interface Project {
    id: string;
    name: string;
}

const LeadsPage: React.FC = () => {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [selectedProject, setSelectedProject] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [totalLeads, setTotalLeads] = useState(0);

    useEffect(() => {
        loadProjects();
    }, []);

    useEffect(() => {
        if (selectedProject) {
            loadProjectLeads(selectedProject);
        } else {
            setLeads([]);
            setTotalLeads(0);
        }
    }, [selectedProject]);

    const loadProjects = async () => {
        try {
            const data = await projectsAPI.getAll();
            setProjects(data);
            if (data.length > 0) {
                setSelectedProject(data[0].id);
            }
        } catch (error) {
            console.error('Failed to load projects:', error);
        }
    };

    const loadProjectLeads = async (projectId: string) => {
        try {
            setLoading(true);
            const data = await statsAPI.getProjectStats(projectId);
            setLeads(data.leads || []);
            setTotalLeads(data.uniqueUsers || 0);
        } catch (error) {
            console.error('Failed to load leads:', error);
            setLeads([]);
        } finally {
            setLoading(false);
        }
    };

    const exportToCSV = () => {
        const headers = ['Name', 'Email', 'Phone', 'Prize Won', 'Date'];
        const rows = leads.map(lead => [
            lead.userName || '',
            lead.userEmail || '',
            lead.userPhone || '',
            lead.prizeWon,
            new Date(lead.timestamp).toLocaleString()
        ]);

        const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `leads-${selectedProject}.csv`;
        a.click();
    };

    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Collected Leads</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        View and export leads from your spin wheel campaigns
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <select
                        value={selectedProject}
                        onChange={(e) => setSelectedProject(e.target.value)}
                        className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 text-slate-900 dark:text-white"
                    >
                        <option value="">Select Project</option>
                        {projects.map((project) => (
                            <option key={project.id} value={project.id}>{project.name}</option>
                        ))}
                    </select>
                    {leads.length > 0 && (
                        <button
                            onClick={exportToCSV}
                            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-green-700 transition-colors"
                        >
                            <span className="material-symbols-outlined !text-lg">download</span>
                            Export CSV
                        </button>
                    )}
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-surface-light dark:bg-surface-dark p-4 rounded-xl border border-border-light dark:border-border-dark">
                    <p className="text-sm text-slate-500 dark:text-slate-400">Total Leads</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{totalLeads}</p>
                </div>
                <div className="bg-surface-light dark:bg-surface-dark p-4 rounded-xl border border-border-light dark:border-border-dark">
                    <p className="text-sm text-slate-500 dark:text-slate-400">With Email</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                        {leads.filter(l => l.userEmail).length}
                    </p>
                </div>
                <div className="bg-surface-light dark:bg-surface-dark p-4 rounded-xl border border-border-light dark:border-border-dark">
                    <p className="text-sm text-slate-500 dark:text-slate-400">With Phone</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                        {leads.filter(l => l.userPhone).length}
                    </p>
                </div>
                <div className="bg-surface-light dark:bg-surface-dark p-4 rounded-xl border border-border-light dark:border-border-dark">
                    <p className="text-sm text-slate-500 dark:text-slate-400">Latest Entry</p>
                    <p className="text-lg font-bold text-slate-900 dark:text-white">
                        {leads.length > 0 ? new Date(leads[0].timestamp).toLocaleDateString() : '-'}
                    </p>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                            <tr>
                                <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Name</th>
                                <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Email</th>
                                <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Phone</th>
                                <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Prize Won</th>
                                <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                            {loading ? (
                                <tr><td colSpan={5} className="p-8 text-center text-slate-500">Loading...</td></tr>
                            ) : !selectedProject ? (
                                <tr><td colSpan={5} className="p-8 text-center text-slate-500">Select a project to view leads</td></tr>
                            ) : leads.length === 0 ? (
                                <tr><td colSpan={5} className="p-8 text-center text-slate-500">No leads collected yet</td></tr>
                            ) : leads.map((lead, i) => (
                                <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-white">
                                        {lead.userName || '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">
                                        {lead.userEmail || '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">
                                        {lead.userPhone || '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300">
                                            {lead.prizeWon}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                                        {new Date(lead.timestamp).toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default LeadsPage;
