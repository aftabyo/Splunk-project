'use client';
import { useState, useEffect } from 'react';

export default function SplashScreen({ onComplete }) {
  const [loadingText, setLoadingText] = useState('Initializing Core Systems...');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Sequence of loading messages
    const messages = [
      'Establish connection: HEC Port 8088...',
      'Authenticating Identity: AFTABYO...',
      'Loading Observability Modules...',
      'Indexing Resume Telemetry...',
      'READY.'
    ];

    let i = 0;
    // Timing designed to match the text reveal animation (~1.2s start delay)
    setTimeout(() => {
        const interval = setInterval(() => {
        if (i < messages.length) {
            setLoadingText(messages[i]);
            // Calculate progress steps based on message count
            setProgress(((i + 1) / messages.length) * 100);
            i++;
        } else {
            clearInterval(interval);
            // Short delay on "READY" before dismissing
            setTimeout(() => onComplete(), 800); 
        }
        }, 600); // Speed of progress updates

        return () => clearInterval(interval);
    }, 1000); // Wait 1s for initial logo animation before starting progressbar

  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[200] bg-[#1c1e21] flex flex-col items-center justify-center font-mono">
      <div className="text-center">
        {/* --- ANIMATED LOGO CONTAINER --- */}
        <h1 className="text-6xl font-black lowercase mb-6 flex items-center justify-center tracking-tighter relative overflow-hidden p-2">
          {/* The Name (Slides in) */}
          <span className="text-white text-anim z-10">aftabyo</span>
          {/* The Arrow (Turns and snaps) */}
          <span className="text-[#65a637] arrow-anim ml-1 z-20">{'>'}</span>
        </h1>

        {/* PROGRESS BAR */}
        <div className="w-64 h-1 bg-gray-800 rounded-full overflow-hidden mb-4 mx-auto border border-gray-700">
          <div 
            className="h-full bg-[#65a637] transition-all duration-500 ease-out shadow-[0_0_15px_#65a637] relative" 
            style={{ width: `${progress}%` }}
          >
             {/* Little glowing tip on the progress bar */}
             <div className="absolute right-0 top-1/2 -translate-y-1/2 h-2 w-2 bg-white rounded-full shadow-[0_0_10px_white]"></div>
          </div>
        </div>
        
        {/* LOADING TEXT */}
        <p className="text-[#65a637] text-[10px] uppercase tracking-[0.3em] font-bold animate-pulse">
          {loadingText}
        </p>
      </div>
      
      {/* FOOTER */}
      <div className="absolute bottom-10 text-gray-600 text-[8px] uppercase tracking-widest font-bold opacity-50">
        v2025.1.0 | System_Ready | © Aftab Ahmed
      </div>

      {/* --- CUSTOM CSS ANIMATIONS --- */}
      <style jsx>{`
        /* Animation for the '>' arrow turning and snapping into place */
        @keyframes arrowSpinSnap {
            0% { 
                transform: rotate(-180deg) scale(0.5) translateX(-50px); 
                opacity: 0; 
            }
            60% {
                transform: rotate(10deg) scale(1.1) translateX(0);
                opacity: 1;
            }
            100% { 
                transform: rotate(0deg) scale(1) translateX(0); 
                opacity: 1; 
            }
        }

        /* Animation for the text sliding out from behind the arrow */
        @keyframes textSlideReveal {
            0% { 
                transform: translateX(-100%);
                opacity: 0;
            }
            50% {
                transform: translateX(-20%);
                opacity: 0.5;
            }
            100% { 
                transform: translateX(0);
                opacity: 1;
            }
        }

        .arrow-anim {
            display: inline-block;
            /* Use a bouncy bezier curve for a satisfying "snap" effect */
            animation: arrowSpinSnap 1s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        .text-anim {
            display: inline-block;
            opacity: 0; /* Start hidden */
            /* Start animating after the arrow is mostly in place (0.4s delay) */
            animation: textSlideReveal 0.8s ease-out 0.4s forwards;
        }
      `}</style>
    </div>
  );
}