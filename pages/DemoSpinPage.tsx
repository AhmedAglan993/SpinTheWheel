import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const DEMO_PRIZES = [
    { id: '1', name: '10% Off', type: 'Discount', description: 'Get 10% off your next purchase' },
    { id: '2', name: 'Free Item', type: 'Food Item', description: 'Get a free item of your choice' },
    { id: '3', name: 'Try Again', type: 'Voucher', description: 'Better luck next time!' },
    { id: '4', name: '20% Off', type: 'Discount', description: 'Get 20% off your next purchase' },
    { id: '5', name: 'Free Shipping', type: 'Voucher', description: 'Free shipping on your next order' },
    { id: '6', name: '$5 Off', type: 'Discount', description: 'Get $5 off your next purchase' },
    { id: '7', name: 'Buy 1 Get 1', type: 'Voucher', description: 'Buy one, get one free!' },
    { id: '8', name: '15% Off', type: 'Discount', description: 'Get 15% off your next purchase' }
];

const WHEEL_COLORS = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
    '#FFEEAD', '#D4AC0D', '#FF9F43', '#5499C7'
];

const DemoSpinPage: React.FC = () => {
    const [showModal, setShowModal] = useState(false);
    const [isSpinning, setIsSpinning] = useState(false);
    const [rotation, setRotation] = useState(0);
    const [wonPrize, setWonPrize] = useState<typeof DEMO_PRIZES[0] | null>(null);

    const handleSpin = () => {
        if (isSpinning) return;
        setIsSpinning(true);
        setWonPrize(null);

        const randomIndex = Math.floor(Math.random() * DEMO_PRIZES.length);
        const selectedPrize = DEMO_PRIZES[randomIndex];

        const sliceAngle = 360 / DEMO_PRIZES.length;
        const centerOfSlice = (randomIndex * sliceAngle) + (sliceAngle / 2);
        let targetRotation = 270 - centerOfSlice;

        const currentRotationMod = rotation % 360;
        const spins = 5 * 360;
        let nextRotation = rotation + spins + (targetRotation - currentRotationMod);
        if (nextRotation <= rotation) nextRotation += 360;

        setRotation(nextRotation);

        setTimeout(() => {
            setIsSpinning(false);
            setWonPrize(selectedPrize);
            setShowModal(true);
        }, 4000);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const getSlicePath = (index: number, total: number, radius: number) => {
        const startAngle = (index * 360) / total;
        const endAngle = ((index + 1) * 360) / total;
        const startRad = (startAngle * Math.PI) / 180;
        const endRad = (endAngle * Math.PI) / 180;
        const x1 = 50 + radius * Math.cos(startRad);
        const y1 = 50 + radius * Math.sin(startRad);
        const x2 = 50 + radius * Math.cos(endRad);
        const y2 = 50 + radius * Math.sin(endRad);
        const largeArc = endAngle - startAngle > 180 ? 1 : 0;
        return `M 50 50 L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
    };

    const primaryColor = '#2bbdee';

    return (
        <div className="relative flex min-h-screen w-full flex-col items-center justify-center p-4 overflow-hidden font-display bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">

            {/* Header */}
            <header className="absolute top-0 flex w-full max-w-5xl items-center justify-between p-6 lg:p-10 z-20">
                <Link to="/" className="flex items-center gap-3 text-slate-900 dark:text-white hover:opacity-80 transition-opacity">
                    <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-white">
                        <span className="material-symbols-outlined">casino</span>
                    </div>
                    <h2 className="text-lg font-bold tracking-tight">Spinify Demo</h2>
                </Link>
            </header>

            {/* Main Content */}
            <main className="flex w-full max-w-5xl flex-1 flex-col items-center justify-center px-4 py-16 relative z-10">
                <div className="flex flex-col items-center gap-4 text-center md:gap-8">
                    <div className="mb-4">
                        <h1 className="text-4xl font-bold tracking-tight md:text-5xl text-slate-900 dark:text-white">
                            Try Our Spin Wheel!
                        </h1>
                        <p className="mt-3 text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
                            This is a demo of our spin wheel experience. Want a custom branded wheel for your business?
                        </p>
                    </div>

                    {/* Wheel Container */}
                    <div className="relative w-full max-w-[320px] md:max-w-[400px] aspect-square">
                        {/* Pointer */}
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-20 w-8 h-10 text-slate-800 dark:text-white drop-shadow-xl">
                            <svg viewBox="0 0 40 40" fill={primaryColor} className="w-full h-full filter drop-shadow-lg">
                                <path d="M20 40L0 0H40L20 40Z" />
                            </svg>
                        </div>

                        {/* The Wheel */}
                        <div
                            className="w-full h-full rounded-full shadow-2xl border-4 border-white dark:border-slate-700 relative overflow-hidden bg-white"
                            style={{
                                transform: `rotate(${rotation}deg)`,
                                transition: isSpinning ? 'transform 4s cubic-bezier(0.15, 0, 0.15, 1)' : 'none'
                            }}
                        >
                            <svg viewBox="0 0 100 100" className="w-full h-full">
                                {DEMO_PRIZES.map((prize, i) => {
                                    const slicePath = getSlicePath(i, DEMO_PRIZES.length, 50);
                                    const angle = 360 / DEMO_PRIZES.length;
                                    const rotationAngle = (i * angle) + (angle / 2);

                                    return (
                                        <g key={prize.id}>
                                            <path
                                                d={slicePath}
                                                fill={WHEEL_COLORS[i % WHEEL_COLORS.length]}
                                                stroke="white"
                                                strokeWidth="0.5"
                                            />
                                            <g transform={`translate(50,50) rotate(${rotationAngle}) translate(25, 0)`}>
                                                <text
                                                    fill="white"
                                                    fontSize="3.5"
                                                    fontWeight="bold"
                                                    textAnchor="middle"
                                                    dominantBaseline="middle"
                                                    className="uppercase drop-shadow-md"
                                                >
                                                    {prize.name.length > 12 ? prize.name.substring(0, 10) + '..' : prize.name}
                                                </text>
                                            </g>
                                        </g>
                                    );
                                })}

                                <circle cx="50" cy="50" r="10" fill="white" />
                                <circle cx="50" cy="50" r="8" fill={primaryColor} />
                                <text x="50" y="50" fontSize="3" fontWeight="bold" fill="white" textAnchor="middle" dominantBaseline="middle">SPIN</text>
                            </svg>
                        </div>
                    </div>

                    <p className="max-w-md text-base text-slate-600 dark:text-slate-400 mt-4">
                        Click the button below to try your luck!
                    </p>

                    <div className="w-full max-w-xs pt-4">
                        <button
                            onClick={handleSpin}
                            disabled={isSpinning}
                            className="flex h-14 w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl px-5 text-lg font-bold text-white shadow-lg transition-all hover:scale-105 active:scale-95 disabled:opacity-70 disabled:scale-100 disabled:cursor-not-allowed bg-primary hover:bg-primary-dark"
                        >
                            <span className="truncate">{isSpinning ? 'SPINNING...' : 'SPIN THE WHEEL'}</span>
                        </button>
                    </div>

                    {/* Contact CTA */}
                    <div className="mt-8 p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 max-w-md">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Love this experience?</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                            Get a custom branded spin wheel for your business with your logo, colors, and prizes!
                        </p>
                        <Link
                            to="/contact"
                            className="block w-full py-3 bg-primary text-white text-center font-bold rounded-lg hover:bg-primary-dark transition-colors"
                        >
                            Contact Us for Custom Wheel
                        </Link>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="absolute bottom-4 w-full flex justify-center items-center gap-6 text-xs text-slate-400 z-20 px-4">
                <p>© {new Date().getFullYear()} Seqed Games. All rights reserved.</p>
                <a href="https://seqedgames.com/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                    seqedgames.com
                </a>
            </footer>

            {/* Prize Modal */}
            {showModal && wonPrize && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-800 shadow-2xl transform transition-all scale-100 animate-in zoom-in-95 duration-200">
                        <div className="flex flex-col items-center p-8 text-center md:p-12">
                            <div
                                className="mb-6 flex size-20 items-center justify-center rounded-full text-white animate-bounce"
                                style={{ backgroundColor: `${primaryColor}30`, color: primaryColor }}
                            >
                                <span className="material-symbols-outlined !text-5xl">trophy</span>
                            </div>

                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Congratulations!</h3>
                            <p className="mt-2 text-slate-600 dark:text-slate-400">You've won</p>

                            <div className="mt-6 p-4 w-full bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                                <p className="text-3xl font-black tracking-tight uppercase" style={{ color: primaryColor }}>{wonPrize.name}</p>
                                {wonPrize.description && <p className="text-sm text-slate-500 mt-2">{wonPrize.description}</p>}
                            </div>

                            <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">
                                This is a demo. Contact us to create a real spin wheel for your business!
                            </p>

                            <div className="flex gap-3 mt-8 w-full">
                                <button
                                    onClick={closeModal}
                                    className="flex-1 h-12 cursor-pointer rounded-xl bg-slate-200 dark:bg-slate-700 px-5 text-base font-bold text-slate-800 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                                >
                                    Close
                                </button>
                                <Link
                                    to="/contact"
                                    className="flex-1 h-12 flex items-center justify-center rounded-xl bg-primary px-5 text-base font-bold text-white hover:bg-primary-dark transition-colors"
                                >
                                    Get Custom Wheel
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DemoSpinPage;
