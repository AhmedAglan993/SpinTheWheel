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
  const [projectId, setProjectId] = useState<string | null>(null);
  const [realTenantId, setRealTenantId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [showLeadModal, setShowLeadModal] = useState(false); // Will show based on settings
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [wonPrize, setWonPrize] = useState<Prize | null>(null);

  // Lead capture state - single field for email or phone
  const [contactValue, setContactValue] = useState('');
  const [hasProvidedInfo, setHasProvidedInfo] = useState(false);
  const [alreadySpun, setAlreadySpun] = useState(false);

  // Spin settings from project
  const [spinSettings, setSpinSettings] = useState({
    requireContact: true,
    enableSpinLimit: true,
    spinsPerUserPerDay: 1
  });

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
          id: tenant.id || tenantId,
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
        // Store projectId and real tenantId if returned (for project-specific spins)
        if (response.data.projectId) {
          setProjectId(response.data.projectId);
        }
        if (response.data.tenantId) {
          setRealTenantId(response.data.tenantId);
        }
        // Store spin settings
        if (response.data.spinSettings) {
          setSpinSettings(response.data.spinSettings);
        }
        // Always show lead modal on load (user can skip if not required)
        setShowLeadModal(true);
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
    { id: '0', tenantId: '', name: 'Better Luck Next Time', type: 'Voucher', description: '', status: 'Active', isAvailable: true }
  ] as Prize[];

  // Only allow winning available prizes
  const availablePrizes = displayPrizes.filter((p: any) => p.isAvailable !== false);

  // Auto-detect if contact is email or phone
  const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  const userEmail = isEmail(contactValue) ? contactValue : '';
  const userPhone = !isEmail(contactValue) && contactValue ? contactValue : '';

  // Handle lead form submission
  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (spinSettings.requireContact && !contactValue.trim()) {
      alert('Please provide your email or phone number.');
      return;
    }
    setHasProvidedInfo(true);
    setShowLeadModal(false);
  };

  // Handle skip (when contact not required)
  const handleSkip = () => {
    setContactValue('');
    setHasProvidedInfo(true);
    setShowLeadModal(false);
  };

  const handleSpin = async () => {
    if (isSpinning) return;

    // Make sure user has provided info
    if (!hasProvidedInfo) {
      setShowLeadModal(true);
      return;
    }

    // Make sure there are available prizes
    if (availablePrizes.length === 0) {
      alert('No prizes available at this time.');
      return;
    }

    setIsSpinning(true);
    setWonPrize(null);

    // Select from AVAILABLE prizes only
    const randomIndex = Math.floor(Math.random() * availablePrizes.length);
    const selectedPrize = availablePrizes[randomIndex];

    // Find the index in displayPrizes for wheel animation
    const displayIndex = displayPrizes.findIndex(p => p.id === selectedPrize.id);
    const animationIndex = displayIndex >= 0 ? displayIndex : randomIndex;

    const sliceAngle = 360 / displayPrizes.length;
    const centerOfSlice = (animationIndex * sliceAngle) + (sliceAngle / 2);
    let targetRotation = 270 - centerOfSlice;

    const currentRotationMod = rotation % 360;
    const spins = 5 * 360;
    let nextRotation = rotation + spins + (targetRotation - currentRotationMod);
    if (nextRotation <= rotation) nextRotation += 360;

    setRotation(nextRotation);

    setTimeout(async () => {
      // Record the spin to backend with user info
      try {
        await axios.post(`${API_URL}/spin/record`, {
          tenantId: realTenantId || activeTenant?.id || tenantId,
          projectId: projectId,
          userName: '',
          userEmail: userEmail,
          userPhone: userPhone,
          prizeWon: selectedPrize.name
        });

        // Refresh prizes to get updated quantities
        const response = await axios.get(`${API_URL}/spin/config/${tenantId}`);
        setActivePrizes(response.data.prizes || []);
      } catch (err: any) {
        console.error('Failed to record spin:', err);
        // Check if user already spun today
        if (err.response?.status === 429) {
          setAlreadySpun(true);
          setIsSpinning(false);
          return;
        }
      }

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
                        {/* Prize count badge */}
                        <text
                          fill="rgba(255,255,255,0.7)"
                          fontSize="2"
                          textAnchor="middle"
                          dominantBaseline="middle"
                          y="4"
                        >
                          {(prize as any).isUnlimited ? '∞' : `${(prize as any).quantity || 0} left`}
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
            <div id="prize-modal-content" className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-800 shadow-2xl transform transition-all scale-100 animate-in zoom-in-95 duration-200">
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

                <div className="flex gap-3 mt-8 w-full">
                  <button
                    onClick={() => {
                      // Create a simple canvas-based screenshot
                      const canvas = document.createElement('canvas');
                      canvas.width = 400;
                      canvas.height = 300;
                      const ctx = canvas.getContext('2d');
                      if (ctx) {
                        // Background
                        ctx.fillStyle = '#1e293b';
                        ctx.fillRect(0, 0, 400, 300);

                        // Border
                        ctx.strokeStyle = primaryColor;
                        ctx.lineWidth = 4;
                        ctx.strokeRect(10, 10, 380, 280);

                        // Text
                        ctx.fillStyle = '#ffffff';
                        ctx.font = 'bold 24px sans-serif';
                        ctx.textAlign = 'center';
                        ctx.fillText('🎉 Congratulations!', 200, 60);

                        ctx.font = '18px sans-serif';
                        ctx.fillText('You won:', 200, 100);

                        ctx.fillStyle = primaryColor;
                        ctx.font = 'bold 32px sans-serif';
                        ctx.fillText(wonPrize.name.toUpperCase(), 200, 150);

                        ctx.fillStyle = '#94a3b8';
                        ctx.font = '14px sans-serif';
                        ctx.fillText(wonPrize.description || '', 200, 190);

                        ctx.fillText('Show this at the counter', 200, 240);
                        ctx.font = 'bold 12px sans-serif';
                        ctx.fillText(`${activeTenant?.name || 'SpinTheWheel'}`, 200, 275);

                        // Download
                        const link = document.createElement('a');
                        link.download = `prize-${wonPrize.name.replace(/\s+/g, '-').toLowerCase()}.png`;
                        link.href = canvas.toDataURL('image/png');
                        link.click();
                      }
                    }}
                    className="flex-1 flex h-12 cursor-pointer items-center justify-center rounded-xl px-5 text-base font-bold text-white transition-colors hover:opacity-90"
                    style={{ backgroundColor: primaryColor }}
                  >
                    <span className="material-symbols-outlined mr-2 !text-lg">download</span>
                    Save
                  </button>
                  <button
                    onClick={closeModal}
                    className="flex-1 flex h-12 cursor-pointer items-center justify-center rounded-xl bg-slate-200 dark:bg-slate-700 px-5 text-base font-bold text-slate-800 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      }

      {/* Lead Capture Modal */}
      {
        showLeadModal && !hasProvidedInfo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-800 shadow-2xl">
              <form onSubmit={handleLeadSubmit} className="flex flex-col p-8 md:p-10">
                <div className="text-center mb-6">
                  <div
                    className="mb-4 flex size-16 items-center justify-center rounded-full mx-auto"
                    style={{ backgroundColor: `${primaryColor}20`, color: primaryColor }}
                  >
                    <span className="material-symbols-outlined !text-4xl">celebration</span>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Ready to Win?</h3>
                  <p className="mt-2 text-slate-600 dark:text-slate-400">
                    Enter your details to spin the wheel!
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Email or Phone Number
                    </label>
                    <input
                      type="text"
                      value={contactValue}
                      onChange={(e) => setContactValue(e.target.value)}
                      placeholder="your@email.com or +1 555 123 4567"
                      className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                      autoFocus
                    />
                  </div>
                </div>

                <p className="mt-4 text-xs text-slate-400 text-center">
                  We'll only use this to send you your prize details.
                </p>

                <button
                  type="submit"
                  className="mt-6 flex h-12 w-full cursor-pointer items-center justify-center rounded-xl px-5 text-base font-bold text-white transition-colors hover:opacity-90"
                  style={{ backgroundColor: primaryColor }}
                >
                  <span className="material-symbols-outlined mr-2">casino</span>
                  {spinSettings.requireContact ? "Let's Spin!" : 'Continue'}
                </button>

                {/* Skip button - only show when contact not required */}
                {!spinSettings.requireContact && (
                  <button
                    type="button"
                    onClick={handleSkip}
                    className="mt-3 flex h-10 w-full cursor-pointer items-center justify-center rounded-xl px-5 text-sm font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
                  >
                    Skip for now
                  </button>
                )}
              </form>
            </div>
          </div>
        )
      }

      {/* Already Spun Modal */}
      {
        alreadySpun && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-800 shadow-2xl">
              <div className="flex flex-col items-center p-8 text-center">
                <div className="mb-6 flex size-20 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/30">
                  <span className="material-symbols-outlined !text-5xl text-yellow-600 dark:text-yellow-400">schedule</span>
                </div>

                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Come Back Tomorrow!</h3>
                <p className="mt-2 text-slate-600 dark:text-slate-400">
                  You've already spun the wheel today.
                </p>

                <div className="mt-6 p-4 w-full bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Each person can spin once per day. Try again in:
                  </p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
                    🕐 24 hours
                  </p>
                </div>

                <button
                  onClick={() => setAlreadySpun(false)}
                  className="mt-8 flex h-12 w-full cursor-pointer items-center justify-center rounded-xl bg-slate-200 dark:bg-slate-700 px-5 text-base font-bold text-slate-800 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                >
                  Got it!
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