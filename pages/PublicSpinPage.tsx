import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { projectsAPI, spinAPI } from '../src/services/api';
import { Prize, Project } from '../types';

const PublicSpinPage: React.FC = () => {
    const { projectId } = useParams<{ projectId: string }>();
    const [project, setProject] = useState<Project | null>(null);
    const [prizes, setPrizes] = useState<Prize[]>([]);
    const [spinConfig, setSpinConfig] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [isSpinning, setIsSpinning] = useState(false);
    const [selectedPrize, setSelectedPrize] = useState<Prize | null>(null);
    const [rotation, setRotation] = useState(0);
    const [userInfo, setUserInfo] = useState({ name: '', email: '' });
    const [showForm, setShowForm] = useState(true);

    useEffect(() => {
        loadProjectData();
    }, [projectId]);

    const loadProjectData = async () => {
        try {
            setIsLoading(true);
            // Fetch project details and spin config
            const configData = await spinAPI.getConfig(projectId!);
            setPrizes(configData.prizes || []);
            setSpinConfig(configData.config);
            setProject(configData.project);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to load spin wheel. Please check the link.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSpin = () => {
        if (!userInfo.name || !userInfo.email) {
            alert('Please enter your name and email to spin!');
            return;
        }

        if (isSpinning || prizes.length === 0) return;

        setIsSpinning(true);
        setShowForm(false);

        // Select random prize
        const randomIndex = Math.floor(Math.random() * prizes.length);
        const prize = prizes[randomIndex];

        // Calculate rotation
        const prizeAngle = 360 / prizes.length;
        const targetRotation = 360 * 5 + (randomIndex * prizeAngle); // 5 full spins + target

        setRotation(targetRotation);
        setSelectedPrize(prize);

        // Record the spin
        setTimeout(async () => {
            try {
                await spinAPI.recordSpin({
                    tenantId: project?.tenantId || '',
                    projectId: projectId!,
                    userName: userInfo.name,
                    userEmail: userInfo.email,
                    prizeWon: prize.name
                });

                // Reload prizes to get updated quantities and remove exhausted prizes
                await loadProjectData();
            } catch (err) {
                console.error('Failed to record spin:', err);
            }
            setIsSpinning(false);
        }, spinConfig?.spinDuration || 5000);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
                <div className="text-center">
                    <div className="animate-spin size-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-slate-600 dark:text-slate-400">Loading spin wheel...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
                <div className="text-center max-w-md">
                    <span className="material-symbols-outlined text-6xl text-red-500 mb-4 block">error</span>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Oops!</h2>
                    <p className="text-slate-600 dark:text-slate-400 mb-6">{error}</p>
                    <Link to="/" className="inline-block px-6 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark transition-colors">
                        Go to Homepage
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
            <div className="max-w-6xl mx-auto py-8">
                {/* Header */}
                <div className="text-center mb-8">
                    {project && (
                        <>
                            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">{project.name}</h1>
                            <p className="text-slate-600 dark:text-slate-400">
                                {spinConfig?.customMessage || 'Spin the wheel to win amazing prizes!'}
                            </p>
                        </>
                    )}
                </div>

                <div className="grid lg:grid-cols-2 gap-8 items-start">
                    {/* Wheel Section */}
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8">
                        <div className="relative aspect-square max-w-md mx-auto">
                            {/* Wheel */}
                            <div
                                className="absolute inset-0 rounded-full border-8 border-slate-200 dark:border-slate-700 overflow-hidden transition-transform duration-[5000ms] ease-out"
                                style={{ transform: `rotate(${rotation}deg)` }}
                            >
                                {prizes.map((prize, index) => {
                                    const angle = (360 / prizes.length) * index;
                                    const color = spinConfig?.wheelColors?.[index % spinConfig.wheelColors.length] || '#2bbdee';
                                    return (
                                        <div
                                            key={prize.id}
                                            className="absolute inset-0 origin-center"
                                            style={{
                                                transform: `rotate(${angle}deg)`,
                                                clipPath: `polygon(50% 50%, 100% 0%, 100% ${100 / prizes.length}%)`
                                            }}
                                        >
                                            <div
                                                className="w-full h-full flex items-center justify-center"
                                                style={{ backgroundColor: color }}
                                            >
                                                <span className="text-white font-bold text-sm transform rotate-45">
                                                    {prize.name}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Center Button */}
                            <button
                                onClick={handleSpin}
                                disabled={isSpinning}
                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-20 bg-white dark:bg-slate-800 rounded-full shadow-xl border-4 border-primary flex items-center justify-center hover:scale-110 transition-transform disabled:opacity-50 disabled:cursor-not-allowed z-10"
                            >
                                <span className="material-symbols-outlined text-primary text-3xl">
                                    {isSpinning ? 'hourglass_empty' : 'play_arrow'}
                                </span>
                            </button>

                            {/* Pointer */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-20">
                                <div className="w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-t-[30px] border-t-red-500"></div>
                            </div>
                        </div>
                    </div>

                    {/* Info Section */}
                    <div className="space-y-6">
                        {showForm && !selectedPrize && (
                            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6">
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Enter Your Details</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                            Name
                                        </label>
                                        <input
                                            type="text"
                                            value={userInfo.name}
                                            onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                                            className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700"
                                            placeholder="Your name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            value={userInfo.email}
                                            onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                                            className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700"
                                            placeholder="your@email.com"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {selectedPrize && (
                            <div className="bg-gradient-to-br from-primary to-blue-600 rounded-2xl shadow-xl p-8 text-white text-center">
                                <span className="material-symbols-outlined text-6xl mb-4 block">celebration</span>
                                <h3 className="text-2xl font-bold mb-2">Congratulations!</h3>
                                <p className="text-xl mb-4">You won:</p>
                                <p className="text-3xl font-bold mb-2">{selectedPrize.name}</p>
                                <p className="text-sm opacity-90">{selectedPrize.description}</p>
                            </div>
                        )}

                        {/* Prizes List */}
                        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Available Prizes</h3>
                            <div className="space-y-3">
                                {prizes.map((prize) => (
                                    <div key={prize.id} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                                        <span className="material-symbols-outlined text-primary">emoji_events</span>
                                        <div>
                                            <p className="font-medium text-slate-900 dark:text-white">{prize.name}</p>
                                            <p className="text-sm text-slate-600 dark:text-slate-400">{prize.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PublicSpinPage;
