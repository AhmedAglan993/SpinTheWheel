import React, { useState, useEffect, useRef } from 'react';
import { prizeImportAPI } from '../src/services/api';

interface ImportPrizesModalProps {
    isOpen: boolean;
    onClose: () => void;
    projectId?: string | null;
    onImportComplete: () => void;
}

interface PrizeTemplate {
    id: string;
    name: string;
    description?: string;
    prizes: any[];
    createdAt: string;
}

interface HistorySnapshot {
    id: string;
    action: string;
    description?: string;
    prizes: any[];
    createdAt: string;
}

type TabType = 'csv' | 'templates' | 'history';

const ImportPrizesModal: React.FC<ImportPrizesModalProps> = ({
    isOpen,
    onClose,
    projectId,
    onImportComplete
}) => {
    const [activeTab, setActiveTab] = useState<TabType>('csv');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // CSV Import State
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [parsedPrizes, setParsedPrizes] = useState<any[]>([]);
    const [fileName, setFileName] = useState<string>('');

    // Templates State
    const [templates, setTemplates] = useState<PrizeTemplate[]>([]);
    const [newTemplateName, setNewTemplateName] = useState('');
    const [showCreateTemplate, setShowCreateTemplate] = useState(false);

    // History State
    const [history, setHistory] = useState<HistorySnapshot[]>([]);

    // Load data when modal opens
    useEffect(() => {
        if (isOpen) {
            loadTemplates();
            loadHistory();
            setError(null);
            setSuccess(null);
        }
    }, [isOpen, projectId]);

    const loadTemplates = async () => {
        try {
            const data = await prizeImportAPI.getTemplates();
            setTemplates(data);
        } catch (err) {
            console.error('Failed to load templates:', err);
        }
    };

    const loadHistory = async () => {
        try {
            const data = await prizeImportAPI.getHistory(projectId || undefined);
            setHistory(data);
        } catch (err) {
            console.error('Failed to load history:', err);
        }
    };

    // CSV Parsing
    const parseCSV = (text: string): any[] => {
        const lines = text.trim().split('\n');
        if (lines.length < 2) return [];

        const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
        const prizes: any[] = [];

        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',').map(v => v.trim());
            const prize: any = {
                name: '',
                type: 'Voucher',
                description: '',
                status: 'Active',
                isUnlimited: true,
                quantity: null
            };

            headers.forEach((header, idx) => {
                const value = values[idx] || '';
                if (header === 'name' || header === 'prize name' || header === 'prizename') {
                    prize.name = value;
                } else if (header === 'type' || header === 'prize type') {
                    prize.type = value || 'Voucher';
                } else if (header === 'description' || header === 'desc') {
                    prize.description = value;
                } else if (header === 'quantity' || header === 'qty') {
                    const qty = parseInt(value);
                    if (!isNaN(qty) && qty > 0) {
                        prize.isUnlimited = false;
                        prize.quantity = qty;
                    }
                } else if (header === 'status') {
                    prize.status = value === 'Inactive' ? 'Inactive' : 'Active';
                }
            });

            if (prize.name) {
                prizes.push(prize);
            }
        }

        return prizes;
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setFileName(file.name);
        setError(null);
        setSuccess(null);

        const reader = new FileReader();
        reader.onload = (event) => {
            const text = event.target?.result as string;
            try {
                const prizes = parseCSV(text);
                if (prizes.length === 0) {
                    setError('No valid prizes found in the file. Make sure the CSV has a header row with "name" column.');
                    setParsedPrizes([]);
                } else {
                    setParsedPrizes(prizes);
                }
            } catch (err) {
                setError('Failed to parse CSV file');
                setParsedPrizes([]);
            }
        };
        reader.readAsText(file);
    };

    const handleImportCSV = async () => {
        if (parsedPrizes.length === 0) return;

        setLoading(true);
        setError(null);
        try {
            const result = await prizeImportAPI.importPrizes(parsedPrizes, projectId || undefined);
            setSuccess(result.message);
            setParsedPrizes([]);
            setFileName('');
            onImportComplete();
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to import prizes');
        } finally {
            setLoading(false);
        }
    };

    // Template Functions
    const handleCreateTemplate = async () => {
        if (!newTemplateName.trim()) return;

        setLoading(true);
        setError(null);
        try {
            await prizeImportAPI.createTemplate(newTemplateName, undefined, projectId || undefined);
            setSuccess('Template created successfully');
            setNewTemplateName('');
            setShowCreateTemplate(false);
            loadTemplates();
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to create template');
        } finally {
            setLoading(false);
        }
    };

    const handleApplyTemplate = async (templateId: string, templateName: string) => {
        if (!confirm(`Apply template "${templateName}"? This will add prizes from the template.`)) return;

        setLoading(true);
        setError(null);
        try {
            const result = await prizeImportAPI.applyTemplate(templateId, projectId || undefined);
            setSuccess(result.message);
            onImportComplete();
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to apply template');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteTemplate = async (templateId: string) => {
        if (!confirm('Delete this template?')) return;

        setLoading(true);
        try {
            await prizeImportAPI.deleteTemplate(templateId);
            loadTemplates();
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to delete template');
        } finally {
            setLoading(false);
        }
    };

    // History Functions
    const handleRestoreSnapshot = async (snapshotId: string) => {
        if (!confirm('Restore prizes from this snapshot? This will replace current prizes for this project.')) return;

        setLoading(true);
        setError(null);
        try {
            const result = await prizeImportAPI.restoreFromHistory(snapshotId, projectId || undefined);
            setSuccess(result.message);
            onImportComplete();
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to restore from history');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl max-w-4xl w-full max-h-[85vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="border-b border-slate-200 dark:border-slate-700 px-6 py-4 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Import Prizes</h2>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Tabs */}
                <div className="border-b border-slate-200 dark:border-slate-700 px-6">
                    <div className="flex gap-4">
                        {[
                            { id: 'csv', label: 'CSV/Excel Import', icon: 'upload_file' },
                            { id: 'templates', label: 'Templates', icon: 'content_copy' },
                            { id: 'history', label: 'History', icon: 'history' }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as TabType)}
                                className={`flex items-center gap-2 py-3 border-b-2 transition-colors ${activeTab === tab.id
                                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                    : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                    }`}
                            >
                                <span className="material-symbols-outlined text-lg">{tab.icon}</span>
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Messages */}
                {(error || success) && (
                    <div className={`mx-6 mt-4 p-3 rounded-lg ${error ? 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300' : 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                        }`}>
                        {error || success}
                    </div>
                )}

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {/* CSV Import Tab */}
                    {activeTab === 'csv' && (
                        <div className="space-y-6">
                            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                                <h3 className="font-medium mb-2">CSV Format</h3>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                                    Upload a CSV file with the following columns:
                                </p>
                                <code className="text-xs bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded">
                                    name, type, description, quantity, status
                                </code>
                                <p className="text-xs text-slate-500 mt-2">
                                    Only "name" is required. Leave quantity empty for unlimited prizes.
                                </p>
                            </div>

                            <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-8 text-center">
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".csv,.txt"
                                    onChange={handleFileUpload}
                                    className="hidden"
                                />
                                <span className="material-symbols-outlined text-4xl text-slate-400 mb-2 block">upload_file</span>
                                {fileName ? (
                                    <p className="text-slate-600 dark:text-slate-400 mb-4">{fileName}</p>
                                ) : (
                                    <p className="text-slate-600 dark:text-slate-400 mb-4">Click to upload or drag and drop</p>
                                )}
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Choose File
                                </button>
                            </div>

                            {/* Preview */}
                            {parsedPrizes.length > 0 && (
                                <div>
                                    <h3 className="font-medium mb-3">Preview ({parsedPrizes.length} prizes)</h3>
                                    <div className="max-h-60 overflow-y-auto border border-slate-200 dark:border-slate-700 rounded-lg">
                                        <table className="w-full text-sm">
                                            <thead className="bg-slate-50 dark:bg-slate-800 sticky top-0">
                                                <tr>
                                                    <th className="px-4 py-2 text-left">Name</th>
                                                    <th className="px-4 py-2 text-left">Type</th>
                                                    <th className="px-4 py-2 text-left">Description</th>
                                                    <th className="px-4 py-2 text-left">Quantity</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                                {parsedPrizes.map((prize, i) => (
                                                    <tr key={i}>
                                                        <td className="px-4 py-2">{prize.name}</td>
                                                        <td className="px-4 py-2">{prize.type}</td>
                                                        <td className="px-4 py-2">{prize.description}</td>
                                                        <td className="px-4 py-2">{prize.isUnlimited ? 'Unlimited' : prize.quantity}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <button
                                        onClick={handleImportCSV}
                                        disabled={loading}
                                        className="mt-4 w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                                    >
                                        {loading ? 'Importing...' : `Import ${parsedPrizes.length} Prizes`}
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Templates Tab */}
                    {activeTab === 'templates' && (
                        <div className="space-y-6">
                            {/* Save Template */}
                            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                                {showCreateTemplate ? (
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            placeholder="Template name"
                                            value={newTemplateName}
                                            onChange={(e) => setNewTemplateName(e.target.value)}
                                            className="flex-1 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700"
                                        />
                                        <button
                                            onClick={handleCreateTemplate}
                                            disabled={loading || !newTemplateName.trim()}
                                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                                        >
                                            Save
                                        </button>
                                        <button
                                            onClick={() => setShowCreateTemplate(false)}
                                            className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => setShowCreateTemplate(true)}
                                        className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                                    >
                                        <span className="material-symbols-outlined">add</span>
                                        Save Current Prizes as Template
                                    </button>
                                )}
                            </div>

                            {/* Template List */}
                            {templates.length === 0 ? (
                                <p className="text-center text-slate-500 py-8">No templates saved yet</p>
                            ) : (
                                <div className="space-y-3">
                                    {templates.map((template) => (
                                        <div
                                            key={template.id}
                                            className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 flex items-center justify-between"
                                        >
                                            <div>
                                                <h3 className="font-medium">{template.name}</h3>
                                                <p className="text-sm text-slate-500">
                                                    {(template.prizes as any[]).length} prizes • Created {formatDate(template.createdAt)}
                                                </p>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleApplyTemplate(template.id, template.name)}
                                                    disabled={loading}
                                                    className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50"
                                                >
                                                    Apply
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteTemplate(template.id)}
                                                    disabled={loading}
                                                    className="px-3 py-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                                                >
                                                    <span className="material-symbols-outlined text-sm">delete</span>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* History Tab */}
                    {activeTab === 'history' && (
                        <div className="space-y-3">
                            {history.length === 0 ? (
                                <p className="text-center text-slate-500 py-8">No history available</p>
                            ) : (
                                history.map((snapshot) => (
                                    <div
                                        key={snapshot.id}
                                        className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 flex items-center justify-between"
                                    >
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className={`px-2 py-0.5 rounded text-xs font-medium ${snapshot.action === 'imported' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                                                    snapshot.action === 'created' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                                                        'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                                                    }`}>
                                                    {snapshot.action}
                                                </span>
                                                <span className="text-sm text-slate-500">
                                                    {formatDate(snapshot.createdAt)}
                                                </span>
                                            </div>
                                            <p className="text-sm mt-1">
                                                {(snapshot.prizes as any[]).length} prizes
                                                {snapshot.description && ` • ${snapshot.description}`}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => handleRestoreSnapshot(snapshot.id)}
                                            disabled={loading}
                                            className="px-3 py-1.5 bg-amber-600 text-white text-sm rounded hover:bg-amber-700 disabled:opacity-50"
                                        >
                                            Restore
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ImportPrizesModal;
