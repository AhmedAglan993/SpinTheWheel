import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Prize, Tenant } from '../types';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const WHEEL_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
  '#FFEEAD', '#D4AC0D', '#FF9F43', '#5499C7'
];

const SpinGamePage: React.FC = () => {
  const { tenantId } = useParams<{ tenantId: string }>();

  const [activeTenant, setActiveTenant] = useState<Tenant | null>(null);
  const [activePrizes, setActivePrizes] = useState<Prize[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [wonPrize, setWonPrize] = useState<Prize | null>(null);

  useEffect(() => {
    const fetchGameData = async () => {
      if (!tenantId) {
        setError('No tenant ID provided');
        setLoading(false);
        return;
      }

      try {
        console.log('Fetching game data for tenant:', tenantId);
        const response = await axios.get(`${API_URL}/spin/config/${tenantId}`);
        console.log('Game data received:', response.data);

        const { tenant, prizes } = response.data;

        // Convert the minimal tenant data to our Tenant type with all theme colors
        const tenantData: Tenant = {
          id: tenantId,
          name: tenant.name,
          ownerName: '',
          email: '',
          status: 'Active',
          logo: tenant.logo || '',
          primaryColor: tenant.primaryColor || '#2bbdee',
          secondaryColor: tenant.secondaryColor || '#1e293b',
          backgroundColor: tenant.backgroundColor || '#f8fafc',
          textColor: tenant.textColor || '#0f172a'
        };

        setActiveTenant(tenantData);
        setActivePrizes(prizes || []);
        setLoading(false);
      } catch (err: any) {
        console.error('Error fetching game data:', err);
        setError(err.response?.data?.error || 'Failed to load game');
        setLoading(false);
      }
    };

    fetchGameData();
  }, [tenantId]);

  // Fallback if no prizes exist
  const displayPrizes = activePrizes.length > 0 ? activePrizes : [
    { id: '0', tenantId: '', name: 'Better Luck Next Time', type: 'Voucher', description: '', status: 'Active' }
  ] as Prize[];

  const handleSpin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setWonPrize(null);

    const randomIndex = Math.floor(Math.random() * displayPrizes.length);
    const selectedPrize = displayPrizes[randomIndex];

    const sliceAngle = 360 / displayPrizes.length;
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

  if (loading) return <div className="h-screen flex items-center justify-center"><div className="text-lg">Loading game...</div></div>;

  if (error || !activeTenant) return (
    <div className="h-screen flex flex-col items-center justify-center gap-4 text-center p-4">
      <h1 className="text-2xl font-bold">{error || 'Game Not Found'}</h1>
      <p>Please check the link or contact the business.</p>
      <Link to="/" className="text-primary hover:underline">Go Home</Link>
    </div>
  );

  const primaryColor = activeTenant.primaryColor || '#2bbdee';
  const secondaryColor = activeTenant.secondaryColor || '#1e293b';
  const backgroundColor = activeTenant.backgroundColor || '#f8fafc';
  const textColor = activeTenant.textColor || '#0f172a';

  // Generate wheel slice colors based on theme
  const generateWheelColors = (primary: string, secondary: string) => {
    // Helper to lighten/darken a hex color
    const adjustColor = (hex: string, percent: number) => {
      const num = parseInt(hex.replace('#', ''), 16);
      const r = Math.min(255, Math.max(0, (num >> 16) + percent));
      const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + percent));
      const b = Math.min(255, Math.max(0, (num & 0x0000FF) + percent));
      return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
    };

    return [
      primary,                      // Primary color
      adjustColor(primary, 40),     // Lighter version
      secondary,                    // Secondary color
      adjustColor(secondary, 40),   // Lighter version
      adjustColor(primary, -30),    // Darker version
      adjustColor(secondary, -30),  // Darker version
      adjustColor(primary, 70),     // Even lighter
      adjustColor(secondary, 70)    // Even lighter
    ];
  };

  const wheelColors = generateWheelColors(primaryColor, secondaryColor);

  return (
    <div
      className="relative flex min-h-screen w-full flex-col items-center justify-center p-4 overflow-hidden font-display"
      style={{ backgroundColor: backgroundColor, color: textColor }}
    >

      {/* Header */}
      <header className="absolute top-0 flex w-full max-w-5xl items-center justify-between p-6 lg:p-10 z-20">
        <div className="flex items-center gap-3" style={{ color: textColor }}>
          {activeTenant.logo && (
            <img src={activeTenant.logo} alt="Logo" className="size-8 rounded-full object-cover" />
          )}
          <h2 className="text-lg font-bold tracking-tight">{activeTenant.name}</h2>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex w-full max-w-5xl flex-1 flex-col items-center justify-center px-4 py-16 relative z-10">
        <div className="flex flex-col items-center gap-4 text-center md:gap-8">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl" style={{ color: textColor }}>Spin to Win!</h1>

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
                {displayPrizes.map((prize, i) => {
                  const slicePath = getSlicePath(i, displayPrizes.length, 50);
                  const angle = 360 / displayPrizes.length;
                  const rotationAngle = (i * angle) + (angle / 2);

                  return (
                    <g key={prize.id || i}>
                      <path
                        d={slicePath}
                        fill={wheelColors[i % wheelColors.length]}
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

          <p className="max-w-md text-base text-slate-600 dark:text-slate-400 mt-8">
            Click the button below to try your luck!
          </p>

          <div className="w-full max-w-xs pt-4">
            <button
              onClick={handleSpin}
              disabled={isSpinning || displayPrizes.length === 0}
              className="flex h-14 w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl px-5 text-lg font-bold text-white shadow-lg transition-all hover:scale-105 active:scale-95 disabled:opacity-70 disabled:scale-100 disabled:cursor-not-allowed"
              style={{ backgroundColor: primaryColor }}
            >
              <span className="truncate">{isSpinning ? 'SPINNING...' : 'SPIN THE WHEEL'}</span>
            </button>
          </div>
        </div>
      </main >

      {/* Footer */}
      < footer className="absolute bottom-4 w-full flex justify-center items-center gap-6 text-xs text-slate-400 z-20 px-4" >
        <p>© {new Date().getFullYear()} Seqed Games. All rights reserved.</p>
      </footer >

      {/* Prize Modal */}
      {
        showModal && wonPrize && (
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
                  Present this screen at the counter to redeem your prize.
                </p>

                <button
                  onClick={closeModal}
                  className="mt-8 flex h-12 w-full cursor-pointer items-center justify-center rounded-xl bg-slate-200 dark:bg-slate-700 px-5 text-base font-bold text-slate-800 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )
      }
    </div >
  );
};

export default SpinGamePage;