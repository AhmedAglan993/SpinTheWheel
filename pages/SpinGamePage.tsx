import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SpinGamePage: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const navigate = useNavigate();

  const handleSpin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    
    // Simulate spin duration
    setTimeout(() => {
      setIsSpinning(false);
      setShowModal(true);
    }, 2000);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center p-4 bg-background-light dark:bg-background-dark overflow-hidden font-display text-text-light dark:text-text-dark">
      
      {/* Header */}
      <header className="absolute top-0 flex w-full max-w-5xl items-center justify-between p-6 lg:p-10 z-20">
        <div className="flex items-center gap-3 text-slate-900 dark:text-white">
          <div className="size-6 text-current">
            <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              <path d="M44 4H30.6666V17.3334H17.3334V30.6666H4V44H44V4Z" fill="currentColor"></path>
            </svg>
          </div>
          <h2 className="text-lg font-bold tracking-tight">Restaurant Logo</h2>
        </div>
        {/* Secret Admin Link */}
        <button onClick={() => navigate('/admin')} className="opacity-0 hover:opacity-20 transition-opacity p-2 text-xs">Admin</button>
      </header>

      {/* Main Content */}
      <main className="flex w-full max-w-5xl flex-1 flex-col items-center justify-center px-4 py-16 relative z-10">
        <div className="flex flex-col items-center gap-4 text-center md:gap-8">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white md:text-5xl">Spin to Win!</h1>
          
          {/* Wheel Container */}
          <div className="relative w-full max-w-lg">
            {/* Pointer */}
            <div className="absolute -left-1 -top-1 z-10 size-8 rotate-[225deg] transform text-primary md:size-10 filter drop-shadow-md">
              <svg viewBox="0 0 100 100" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <polygon points="50,0 100,100 0,100" />
              </svg>
            </div>
            
            {/* Wheel Image */}
            <div className="w-full aspect-square relative">
               <img 
                 src="https://lh3.googleusercontent.com/aida-public/AB6AXuCJmslNZhEnWNjlTQhINny8Dtoii8jryDOzYSomFOqZ0jNp8_hZmabWx4qDEl1IV8bqZWiYnT33x-UvRxr1LLOZx8LTfA1cugKKwhPYS1LW1KLwIiij2AHFYgt66Dp5FK_rbuIqu0aGfArdwGsf7UjtzdJbJjwR2eV0Le6PE4D--hIU4x628QekXRGJiIBK2V5yyDaMU3YcDE-F-9VhsIBVxsMH_oZplkEPNI_OHdMvfhdttbv1cyPZpPpEAg7wmLSAOCUnMKVl0LU"
                 alt="Spinning prize wheel"
                 className={`h-full w-full rounded-full object-cover shadow-2xl transition-transform duration-[2000ms] cubic-bezier(0.25, 0.1, 0.25, 1) ${isSpinning ? 'rotate-[720deg]' : 'rotate-0'}`}
               />
            </div>
          </div>

          <p className="max-w-md text-base text-slate-600 dark:text-slate-400">
            Click the button to spin the wheel and win a prize!
          </p>

          <div className="w-full max-w-xs pt-4">
            <button 
              onClick={handleSpin}
              disabled={isSpinning}
              className="flex h-14 w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl bg-primary px-5 text-lg font-bold text-white shadow-lg transition-all hover:scale-105 active:scale-95 disabled:opacity-70 disabled:scale-100 disabled:cursor-not-allowed"
            >
              <span className="truncate">{isSpinning ? 'SPINNING...' : 'SPIN THE WHEEL'}</span>
            </button>
          </div>
        </div>
      </main>

      {/* Prize Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-800 shadow-2xl transform transition-all scale-100 animate-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center p-8 text-center md:p-12">
              <div className="mb-6 flex size-20 items-center justify-center rounded-full bg-primary/20 text-primary animate-bounce">
                <span className="material-symbols-outlined !text-5xl">trophy</span>
              </div>
              
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Congratulations!</h3>
              <p className="mt-2 text-slate-600 dark:text-slate-400">You've won</p>
              
              <div className="mt-6 p-4 w-full bg-slate-50 dark:bg-slate-900 rounded-lg border border-primary/20">
                <p className="text-3xl font-black tracking-tight text-primary uppercase">A FREE DESSERT</p>
              </div>
              
              <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">
                Present this screen at the counter to redeem your prize. Valid today only.
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
      )}
    </div>
  );
};

export default SpinGamePage;