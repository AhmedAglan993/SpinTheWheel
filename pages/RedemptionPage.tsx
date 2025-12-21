import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

interface RedemptionData {
    prizeWon: string;
    tenant: {
        name: string;
        logo: string;
        primaryColor: string;
        backgroundColor: string;
        textColor: string;
    };
    projectName: string | null;
    isRedeemed: boolean;
}

const RedemptionPage: React.FC = () => {
    const { token } = useParams<{ token: string }>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<RedemptionData | null>(null);
    const [contactValue, setContactValue] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isRedeemed, setIsRedeemed] = useState(false);
    const [alreadyRedeemed, setAlreadyRedeemed] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${API_URL}/redeem/${token}`);
                setData(response.data);
                setLoading(false);
            } catch (err: any) {
                if (err.response?.data?.alreadyRedeemed) {
                    setAlreadyRedeemed(true);
                }
                setError(err.response?.data?.error || 'Failed to load prize info');
                setLoading(false);
            }
        };
        fetchData();
    }, [token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!contactValue.trim()) {
            alert('Please enter your email or phone number');
            return;
        }

        // Detect if email or phone
        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactValue);

        setIsSubmitting(true);
        try {
            await axios.post(`${API_URL}/redeem/${token}`, {
                email: isEmail ? contactValue : undefined,
                phone: !isEmail ? contactValue : undefined
            });
            setIsRedeemed(true);
        } catch (err: any) {
            if (err.response?.data?.alreadyRedeemed) {
                setAlreadyRedeemed(true);
            } else {
                alert(err.response?.data?.error || 'Failed to redeem prize');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const downloadPrizeImage = () => {
        if (!canvasRef.current || !data) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const width = 600;
        const height = 400;
        canvas.width = width;
        canvas.height = height;

        // Background gradient
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, data.tenant.primaryColor);
        gradient.addColorStop(1, data.tenant.backgroundColor || '#1e293b');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        // Decorative circles
        ctx.globalAlpha = 0.1;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(width * 0.1, height * 0.2, 80, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(width * 0.9, height * 0.8, 100, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;

        // Congratulations text
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 42px Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('🎉 CONGRATULATIONS! 🎉', width / 2, 80);

        // Prize name
        ctx.font = 'bold 48px Arial, sans-serif';
        ctx.fillText(data.prizeWon, width / 2, height / 2);

        // From tenant
        ctx.font = '24px Arial, sans-serif';
        ctx.fillText(`From ${data.tenant.name}`, width / 2, height / 2 + 50);

        // Show this to staff text
        ctx.font = '18px Arial, sans-serif';
        ctx.fillStyle = 'rgba(255,255,255,0.8)';
        ctx.fillText('Show this image to redeem your prize', width / 2, height - 60);

        // Date
        ctx.font = '14px Arial, sans-serif';
        ctx.fillText(new Date().toLocaleDateString(), width / 2, height - 30);

        // Download
        const dataUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `prize-${data.prizeWon.toLowerCase().replace(/\s+/g, '-')}.png`;
        link.href = dataUrl;
        link.click();
    };

    const primaryColor = data?.tenant?.primaryColor || '#2bbdee';
    const backgroundColor = data?.tenant?.backgroundColor || '#0f172a';
    const textColor = data?.tenant?.textColor || '#ffffff';

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor }}>
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
            </div>
        );
    }

    if (error || alreadyRedeemed) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor }}>
                <div className="text-center bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-md">
                    <div className="text-6xl mb-4">{alreadyRedeemed ? '✓' : '❌'}</div>
                    <h1 className="text-2xl font-bold text-white mb-2">
                        {alreadyRedeemed ? 'Already Redeemed' : 'Invalid Link'}
                    </h1>
                    <p className="text-white/70">
                        {alreadyRedeemed
                            ? 'This prize has already been claimed.'
                            : error || 'This redemption link is no longer valid.'}
                    </p>
                </div>
            </div>
        );
    }

    // Redeemed success state
    if (isRedeemed && data) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor }}>
                <div className="text-center bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-md w-full">
                    <div className="text-6xl mb-4">🎉</div>
                    <h1 className="text-3xl font-bold text-white mb-2">Prize Claimed!</h1>
                    <p className="text-xl text-white/90 mb-2">{data.prizeWon}</p>
                    <p className="text-white/70 mb-8">From {data.tenant.name}</p>

                    <button
                        onClick={downloadPrizeImage}
                        className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold text-white transition-all hover:scale-105"
                        style={{ backgroundColor: primaryColor }}
                    >
                        <span className="material-symbols-outlined">download</span>
                        Download Prize Image
                    </button>

                    <p className="text-white/50 text-sm mt-4">
                        Show this image to staff to receive your prize
                    </p>

                    <canvas ref={canvasRef} className="hidden" />
                </div>
            </div>
        );
    }

    // Enter contact form
    return (
        <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor }}>
            <div className="text-center bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-md w-full">
                {data?.tenant?.logo && (
                    <img
                        src={data.tenant.logo}
                        alt={data.tenant.name}
                        className="w-16 h-16 rounded-full mx-auto mb-4 object-cover border-2 border-white/20"
                    />
                )}

                <h1 className="text-2xl font-bold text-white mb-2">{data?.tenant?.name}</h1>

                <div className="my-6 p-4 bg-white/10 rounded-xl">
                    <p className="text-white/70 text-sm">You won:</p>
                    <p className="text-3xl font-bold text-white">{data?.prizeWon}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-white/70 text-sm mb-2 text-left">
                            Enter your email or phone to claim
                        </label>
                        <input
                            type="text"
                            value={contactValue}
                            onChange={(e) => setContactValue(e.target.value)}
                            placeholder="email@example.com or phone number"
                            className="w-full p-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-white/50"
                            autoFocus
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold text-white transition-all hover:scale-105 disabled:opacity-50"
                        style={{ backgroundColor: primaryColor }}
                    >
                        {isSubmitting ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                Claiming...
                            </>
                        ) : (
                            <>
                                <span className="material-symbols-outlined">redeem</span>
                                Claim My Prize
                            </>
                        )}
                    </button>
                </form>

                <p className="text-white/40 text-xs mt-6">
                    Your information will only be used to contact you about your prize.
                </p>
            </div>
        </div>
    );
};

export default RedemptionPage;
