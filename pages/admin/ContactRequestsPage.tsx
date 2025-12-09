import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

interface ContactRequest {
    id: string;
    name: string;
    email: string;
    phone?: string;
    message: string;
    requestType: string;
    status: string;
    estimatedCost?: number;
    estimatedTimeframe?: string;
    adminNotes?: string;
    createdAt: string;
}

const ContactRequestsPage: React.FC = () => {
    const [requests, setRequests] = useState<ContactRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedRequest, setSelectedRequest] = useState<ContactRequest | null>(null);
    const [filter, setFilter] = useState<string>('All');

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const token = localStorage.getItem('auth_token');
            const response = await axios.get(`${API_URL}/contact`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setRequests(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch contact requests:', error);
            setLoading(false);
        }
    };

    const updateRequest = async (id: string, updates: Partial<ContactRequest>) => {
        try {
            const token = localStorage.getItem('auth_token');
            await axios.patch(`${API_URL}/contact/${id}`, updates, {
                headers: { Authorization: `Bearer ${token}` }
            });
            await fetchRequests();
            setSelectedRequest(null);
        } catch (error) {
            console.error('Failed to update request:', error);
        }
    };

    const filteredRequests = filter === 'All'
        ? requests
        : requests.filter(r => r.status === filter);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
            case 'In Review': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
            case 'Quoted': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
            case 'Accepted': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
            case 'Rejected': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
        }
    };

    if (loading) {
        return <div className="flex items-center justify-center h-64">Loading...</div>;
    }

    return (
        <div className="flex flex-col gap-6">
            {/* Header with Filters */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Contact Requests</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Manage customer inquiries and custom experience requests
                    </p>
                </div>
                <div className="flex gap-2">
                    {['All', 'Pending', 'In Review', 'Quoted', 'Accepted', 'Rejected'].map(status => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filter === status
                                    ? 'bg-primary text-white'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Requests List */}
            <div className="grid gap-4">
                {filteredRequests.length === 0 ? (
                    <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                        <span className="material-symbols-outlined text-4xl text-slate-400 mb-2">inbox</span>
                        <p className="text-slate-500 dark:text-slate-400">No contact requests found</p>
                    </div>
                ) : (
                    filteredRequests.map(request => (
                        <div
                            key={request.id}
                            className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 hover:border-primary/50 transition-colors cursor-pointer"
                            onClick={() => setSelectedRequest(request)}
                        >
                            <div className="flex justify-between items-start gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">{request.name}</h3>
                                        <span className={`text-xs font-bold px-2 py-1 rounded ${getStatusColor(request.status)}`}>
                                            {request.status}
                                        </span>
                                    </div>
                                    <div className="flex flex-col gap-1 text-sm text-slate-600 dark:text-slate-400 mb-3">
                                        <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined !text-sm">email</span>
                                            {request.email}
                                        </div>
                                        {request.phone && (
                                            <div className="flex items-center gap-2">
                                                <span className="material-symbols-outlined !text-sm">phone</span>
                                                {request.phone}
                                            </div>
                                        )}
                                        <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined !text-sm">category</span>
                                            {request.requestType}
                                        </div>
                                    </div>
                                    <p className="text-sm text-slate-700 dark:text-slate-300 line-clamp-2">{request.message}</p>
                                </div>
                                <div className="text-right text-xs text-slate-500">
                                    {new Date(request.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                            {request.estimatedCost && (
                                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 flex gap-4 text-sm">
                                    <div>
                                        <span className="text-slate-500 dark:text-slate-400">Estimated Cost:</span>
                                        <span className="ml-2 font-bold text-slate-900 dark:text-white">${request.estimatedCost}</span>
                                    </div>
                                    {request.estimatedTimeframe && (
                                        <div>
                                            <span className="text-slate-500 dark:text-slate-400">Timeframe:</span>
                                            <span className="ml-2 font-bold text-slate-900 dark:text-white">{request.estimatedTimeframe}</span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* Request Detail Modal */}
            {selectedRequest && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setSelectedRequest(null)}>
                    <div className="w-full max-w-2xl rounded-2xl bg-white dark:bg-slate-800 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{selectedRequest.name}</h3>
                                    <p className="text-sm text-slate-500 mt-1">{selectedRequest.email}</p>
                                </div>
                                <button
                                    onClick={() => setSelectedRequest(null)}
                                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                                >
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Message</label>
                                <p className="mt-1 text-slate-900 dark:text-white">{selectedRequest.message}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Status</label>
                                    <select
                                        value={selectedRequest.status}
                                        onChange={(e) => updateRequest(selectedRequest.id, { status: e.target.value })}
                                        className="mt-1 w-full p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700"
                                    >
                                        <option>Pending</option>
                                        <option>In Review</option>
                                        <option>Quoted</option>
                                        <option>Accepted</option>
                                        <option>Rejected</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Request Type</label>
                                    <p className="mt-1 text-slate-900 dark:text-white">{selectedRequest.requestType}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Estimated Cost ($)</label>
                                    <input
                                        type="number"
                                        value={selectedRequest.estimatedCost || ''}
                                        onChange={(e) => setSelectedRequest({ ...selectedRequest, estimatedCost: parseFloat(e.target.value) })}
                                        className="mt-1 w-full p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700"
                                        placeholder="Enter cost"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Estimated Timeframe</label>
                                    <input
                                        type="text"
                                        value={selectedRequest.estimatedTimeframe || ''}
                                        onChange={(e) => setSelectedRequest({ ...selectedRequest, estimatedTimeframe: e.target.value })}
                                        className="mt-1 w-full p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700"
                                        placeholder="e.g., 2 weeks"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Admin Notes</label>
                                <textarea
                                    value={selectedRequest.adminNotes || ''}
                                    onChange={(e) => setSelectedRequest({ ...selectedRequest, adminNotes: e.target.value })}
                                    className="mt-1 w-full p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 h-24"
                                    placeholder="Add internal notes..."
                                />
                            </div>
                        </div>

                        <div className="p-6 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3">
                            <button
                                onClick={() => setSelectedRequest(null)}
                                className="px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white font-medium hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => updateRequest(selectedRequest.id, {
                                    estimatedCost: selectedRequest.estimatedCost,
                                    estimatedTimeframe: selectedRequest.estimatedTimeframe,
                                    adminNotes: selectedRequest.adminNotes
                                })}
                                className="px-4 py-2 rounded-lg bg-primary text-white font-medium hover:bg-primary-dark transition-colors"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ContactRequestsPage;
