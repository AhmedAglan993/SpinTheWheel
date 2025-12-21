import React, { useState, useEffect, useRef } from 'react';
import { projectsAPI } from '../../src/services/api';

interface Project {
    id: string;
    name: string;
    status: string;
    startDate?: string;
    endDate?: string;
    spinLimit?: number;
    currentSpins: number;
    price?: number;
    isPaid: boolean;
    // Spin settings
    requireContact?: boolean;
    enableSpinLimit?: boolean;
    spinsPerUserPerDay?: number;
}

const ProjectsPage: React.FC = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showQRModal, setShowQRModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const qrCanvasRef = useRef<HTMLCanvasElement>(null);
    const [newProject, setNewProject] = useState({
        name: '',
        startDate: '',
        endDate: '',
        spinLimit: '',
        price: ''
    });

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const data = await projectsAPI.getAll();
            setProjects(data);
        } catch (error) {
            console.error('Failed to fetch projects:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await projectsAPI.create({
                name: newProject.name,
                startDate: newProject.startDate || undefined,
                endDate: newProject.endDate || undefined,
                spinLimit: newProject.spinLimit ? parseInt(newProject.spinLimit) : undefined,
                price: newProject.price ? parseFloat(newProject.price) : undefined
            });
            setShowCreateModal(false);
            setNewProject({ name: '', startDate: '', endDate: '', spinLimit: '', price: '' });
            fetchProjects();
        } catch (error) {
            console.error('Failed to create project:', error);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Active': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
            case 'Draft': return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400';
            case 'Completed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
            default: return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
        }
    };

    // Generate QR code on canvas using QR API
    const generateQRCode = async (text: string, canvas: HTMLCanvasElement) => {
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const size = 256;
        canvas.width = size;
        canvas.height = size;

        // Use Google Charts QR API to generate real QR code
        const qrApiUrl = `https://chart.googleapis.com/chart?cht=qr&chs=${size}x${size}&chl=${encodeURIComponent(text)}&choe=UTF-8`;

        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = qrApiUrl;

        img.onload = () => {
            ctx.drawImage(img, 0, 0, size, size);
        };

        img.onerror = () => {
            // Fallback to a simpler text-based display
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, size, size);
            ctx.fillStyle = '#000000';
            ctx.font = 'bold 14px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('QR Code Error', size / 2, size / 2);
            ctx.font = '10px sans-serif';
            ctx.fillText('Copy link instead', size / 2, size / 2 + 20);
        };
    };

    const openQRModal = (project: Project) => {
        setSelectedProject(project);
        setShowQRModal(true);
        setTimeout(() => {
            if (qrCanvasRef.current) {
                const link = `${window.location.origin}/#/spin/${project.id}`;
                generateQRCode(link, qrCanvasRef.current);
            }
        }, 100);
    };

    const downloadQR = () => {
        if (qrCanvasRef.current && selectedProject) {
            const link = document.createElement('a');
            link.download = `qr-${selectedProject.name.replace(/\s+/g, '-').toLowerCase()}.png`;
            link.href = qrCanvasRef.current.toDataURL('image/png');
            link.click();
        }
    };

    const openPreview = (project: Project) => {
        window.open(`${window.location.origin}/#/spin/${project.id}`, '_blank');
    };

    const handleStatusChange = async (project: Project, newStatus: string) => {
        try {
            await projectsAPI.update(project.id, { status: newStatus });
            fetchProjects();
        } catch (error) {
            console.error('Failed to update status:', error);
        }
    };

    const openEditModal = (project: Project) => {
        setEditingProject({ ...project });
        setShowEditModal(true);
    };

    const handleEditProject = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingProject) return;
        try {
            await projectsAPI.update(editingProject.id, {
                name: editingProject.name,
                spinLimit: editingProject.spinLimit,
                startDate: editingProject.startDate,
                endDate: editingProject.endDate,
                price: editingProject.price,
                requireContact: editingProject.requireContact,
                enableSpinLimit: editingProject.enableSpinLimit,
                spinsPerUserPerDay: editingProject.spinsPerUserPerDay
            });
            setShowEditModal(false);
            setEditingProject(null);
            fetchProjects();
        } catch (error) {
            console.error('Failed to update project:', error);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading projects...</div>;

    return (
        <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Projects</h1>
                    <p className="text-slate-500 dark:text-slate-400">Manage your client events and campaigns</p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg flex items-center gap-2 transition-colors"
                >
                    <span className="material-symbols-outlined">add</span>
                    New Project
                </button>
            </div>

            <div className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700">
                            <th className="p-4 font-semibold text-slate-600 dark:text-slate-300">Name</th>
                            <th className="p-4 font-semibold text-slate-600 dark:text-slate-300">Status</th>
                            <th className="p-4 font-semibold text-slate-600 dark:text-slate-300">Dates</th>
                            <th className="p-4 font-semibold text-slate-600 dark:text-slate-300">Spins</th>
                            <th className="p-4 font-semibold text-slate-600 dark:text-slate-300">Price</th>
                            <th className="p-4 font-semibold text-slate-600 dark:text-slate-300">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {projects.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="p-8 text-center text-slate-500 dark:text-slate-400">
                                    No projects found. Create your first one!
                                </td>
                            </tr>
                        ) : (
                            projects.map((project) => (
                                <tr key={project.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                    <td className="p-4">
                                        <div className="font-medium text-slate-900 dark:text-white">{project.name}</div>
                                        <div className="text-xs text-slate-500 font-mono">{project.id}</div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                                            {project.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-sm text-slate-600 dark:text-slate-400">
                                        {project.startDate ? new Date(project.startDate).toLocaleDateString() : 'TBD'}
                                        {project.endDate ? ` - ${new Date(project.endDate).toLocaleDateString()}` : ''}
                                    </td>
                                    <td className="p-4 text-sm text-slate-600 dark:text-slate-400">
                                        {project.currentSpins} / {project.spinLimit || '∞'}
                                    </td>
                                    <td className="p-4 text-sm text-slate-600 dark:text-slate-400">
                                        {project.price ? `$${project.price}` : '-'}
                                        {project.isPaid && <span className="ml-2 text-green-500 text-xs">Paid</span>}
                                    </td>
                                    <td className="p-4">
                                        <div className="flex gap-1">
                                            <button
                                                onClick={() => {
                                                    const link = `${window.location.origin}/#/spin/${project.id}`;
                                                    navigator.clipboard.writeText(link);
                                                    alert('Link copied to clipboard!');
                                                }}
                                                className="p-1.5 text-slate-500 hover:text-green-500 hover:bg-green-500/10 rounded-md transition-colors"
                                                title="Copy Spin Link"
                                            >
                                                <span className="material-symbols-outlined !text-lg">link</span>
                                            </button>
                                            <button
                                                onClick={() => openQRModal(project)}
                                                className="p-1.5 text-slate-500 hover:text-purple-500 hover:bg-purple-500/10 rounded-md transition-colors"
                                                title="QR Code"
                                            >
                                                <span className="material-symbols-outlined !text-lg">qr_code</span>
                                            </button>
                                            <button
                                                onClick={() => openPreview(project)}
                                                className="p-1.5 text-slate-500 hover:text-blue-500 hover:bg-blue-500/10 rounded-md transition-colors"
                                                title="Preview"
                                            >
                                                <span className="material-symbols-outlined !text-lg">visibility</span>
                                            </button>
                                            <select
                                                value={project.status}
                                                onChange={(e) => handleStatusChange(project, e.target.value)}
                                                className="px-2 py-1 text-xs rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                                            >
                                                <option value="Draft">Draft</option>
                                                <option value="Active">Active</option>
                                                <option value="Completed">Completed</option>
                                            </select>
                                            <button
                                                onClick={() => openEditModal(project)}
                                                className="p-1.5 text-slate-500 hover:text-amber-500 hover:bg-amber-500/10 rounded-md transition-colors"
                                                title="Edit Project"
                                            >
                                                <span className="material-symbols-outlined !text-lg">edit</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Create Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-xl w-full max-w-md p-6 shadow-xl">
                        <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">Create New Project</h2>
                        <form onSubmit={handleCreate} className="flex flex-col gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Project Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                                    placeholder="e.g. Summer Trade Show"
                                    value={newProject.name}
                                    onChange={e => setNewProject({ ...newProject, name: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Start Date</label>
                                    <input
                                        type="date"
                                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                                        value={newProject.startDate}
                                        onChange={e => setNewProject({ ...newProject, startDate: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">End Date</label>
                                    <input
                                        type="date"
                                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                                        value={newProject.endDate}
                                        onChange={e => setNewProject({ ...newProject, endDate: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Spin Limit</label>
                                    <input
                                        type="number"
                                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                                        placeholder="Optional"
                                        value={newProject.spinLimit}
                                        onChange={e => setNewProject({ ...newProject, spinLimit: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Price ($)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                                        placeholder="Optional"
                                        value={newProject.price}
                                        onChange={e => setNewProject({ ...newProject, price: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 mt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateModal(false)}
                                    className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors"
                                >
                                    Create Project
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* QR Code Modal */}
            {showQRModal && selectedProject && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-xl w-full max-w-sm p-6 shadow-xl text-center">
                        <h2 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">QR Code</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{selectedProject.name}</p>

                        <div className="bg-white p-4 rounded-lg mb-4 inline-block">
                            <canvas ref={qrCanvasRef} className="mx-auto" />
                        </div>

                        <p className="text-xs text-slate-400 mb-4 break-all">
                            {`${window.location.origin}/#/spin/${selectedProject.id}`}
                        </p>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowQRModal(false)}
                                className="flex-1 px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                            >
                                Close
                            </button>
                            <button
                                onClick={downloadQR}
                                className="flex-1 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                            >
                                <span className="material-symbols-outlined !text-lg">download</span>
                                Download
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Project Modal */}
            {showEditModal && editingProject && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-xl w-full max-w-md shadow-xl">
                        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Edit Project</h2>
                        </div>
                        <form onSubmit={handleEditProject} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Project Name</label>
                                <input
                                    type="text"
                                    className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-800"
                                    value={editingProject.name}
                                    onChange={(e) => setEditingProject({ ...editingProject, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Start Date</label>
                                    <input
                                        type="date"
                                        className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-800"
                                        value={editingProject.startDate?.split('T')[0] || ''}
                                        onChange={(e) => setEditingProject({ ...editingProject, startDate: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">End Date</label>
                                    <input
                                        type="date"
                                        className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-800"
                                        value={editingProject.endDate?.split('T')[0] || ''}
                                        onChange={(e) => setEditingProject({ ...editingProject, endDate: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Spin Limit (per user/day)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-800"
                                        value={editingProject.spinLimit || ''}
                                        onChange={(e) => setEditingProject({ ...editingProject, spinLimit: parseInt(e.target.value) || undefined })}
                                        placeholder="Unlimited"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Price ($)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-800"
                                        value={editingProject.price || ''}
                                        onChange={(e) => setEditingProject({ ...editingProject, price: parseFloat(e.target.value) || undefined })}
                                    />
                                </div>
                            </div>

                            {/* Spin Settings */}
                            <div className="border-t border-slate-200 dark:border-slate-700 pt-4 mt-4">
                                <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Spin Settings</h3>
                                <div className="space-y-3">
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={editingProject.requireContact ?? true}
                                            onChange={(e) => setEditingProject({ ...editingProject, requireContact: e.target.checked })}
                                            className="w-4 h-4 rounded border-slate-300 dark:border-slate-600"
                                        />
                                        <span className="text-sm text-slate-700 dark:text-slate-300">
                                            Require email/phone before spin
                                        </span>
                                    </label>
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={editingProject.enableSpinLimit ?? true}
                                            onChange={(e) => {
                                                const enableLimit = e.target.checked;
                                                setEditingProject({
                                                    ...editingProject,
                                                    enableSpinLimit: enableLimit,
                                                    // Auto-enable require contact when spin limit is on
                                                    ...(enableLimit && { requireContact: true })
                                                });
                                            }}
                                            className="w-4 h-4 rounded border-slate-300 dark:border-slate-600"
                                        />
                                        <span className="text-sm text-slate-700 dark:text-slate-300">
                                            Limit spins per user per day
                                        </span>
                                    </label>
                                    {(editingProject.enableSpinLimit ?? true) && !(editingProject.requireContact ?? true) && (
                                        <p className="text-xs text-amber-600 dark:text-amber-400 ml-7">
                                            ⚠️ Contact info is required to track spin limits
                                        </p>
                                    )}
                                    {(editingProject.enableSpinLimit ?? true) && (
                                        <div className="ml-7">
                                            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                                                Spins per user per day
                                            </label>
                                            <input
                                                type="number"
                                                min="1"
                                                max="10"
                                                className="w-24 p-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-800"
                                                value={editingProject.spinsPerUserPerDay ?? 1}
                                                onChange={(e) => setEditingProject({ ...editingProject, spinsPerUserPerDay: parseInt(e.target.value) || 1 })}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => { setShowEditModal(false); setEditingProject(null); }}
                                    className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectsPage;
