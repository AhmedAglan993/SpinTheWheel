import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { contactAPI } from '../src/services/api';

const ContactFormPage: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: '',
        requestType: 'New Experience'
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            await contactAPI.create(formData);
            setSubmitted(true);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to submit request. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark p-4">
                <div className="w-full max-w-md bg-surface-light dark:bg-surface-dark rounded-2xl shadow-xl p-8 text-center border border-border-light dark:border-border-dark">
                    <div className="size-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-3xl">check_circle</span>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Request Received!</h2>
                    <p className="text-slate-600 dark:text-slate-400 mb-6">
                        Thank you for your interest. We'll review your request and get back to you within 24 hours.
                    </p>
                    <Link to="/" className="inline-block px-6 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark transition-colors">
                        Back to Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark p-4">
            {/* Header */}
            <nav className="flex items-center justify-between p-6 max-w-7xl mx-auto">
                <Link to="/" className="flex items-center gap-3">
                    <img src="/seqed-games-logo.png" alt="Seqed Games" className="size-10" />
                    <div className="flex flex-col leading-tight">
                        <span className="text-xl font-bold text-text-light dark:text-text-dark leading-none">SpinTheWheel</span>
                        <span className="text-xs text-text-muted-light dark:text-text-muted-dark leading-none mt-1">by Seqed Games</span>
                    </div>
                </Link>
                <Link to="/login" className="text-sm font-medium text-text-muted-light dark:text-text-muted-dark hover:text-primary transition-colors">
                    Admin Login
                </Link>
            </nav>

            {/* Form */}
            <div className="max-w-2xl mx-auto mt-8">
                <div className="bg-surface-light dark:bg-surface-dark rounded-2xl shadow-xl p-8 border border-border-light dark:border-border-dark">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Request Custom Spin Wheel</h1>
                        <p className="text-slate-600 dark:text-slate-400">
                            Tell us about your event or campaign, and we'll create a custom spin wheel experience for you.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Name *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full p-3 rounded-lg border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-elevated-dark text-text-light dark:text-text-dark"
                                    placeholder="Your name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Email *
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full p-3 rounded-lg border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-elevated-dark text-text-light dark:text-text-dark"
                                    placeholder="your@email.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Phone (Optional)
                            </label>
                            <input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                                placeholder="+1 (555) 123-4567"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Request Type *
                            </label>
                            <select
                                required
                                value={formData.requestType}
                                onChange={(e) => setFormData({ ...formData, requestType: e.target.value })}
                                className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                            >
                                <option value="New Experience">New Spin Wheel Experience</option>
                                <option value="Customization">Custom Design/Features</option>
                                <option value="Support">Technical Support</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Tell us about your project *
                            </label>
                            <textarea
                                required
                                rows={6}
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white resize-none"
                                placeholder="Describe your event, target audience, goals, and any specific requirements..."
                            />
                        </div>

                        {error && (
                            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                                <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-4 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit Request'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ContactFormPage;
