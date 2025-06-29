import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';

interface NameInputProps {
  onNameSubmit: (name: string) => void;
}

/**
 * NameInput Component
 * Handles user name input with validation before allowing wheel spin
 */
export const NameInput: React.FC<NameInputProps> = ({ onNameSubmit }) => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('Please enter your name to continue');
      return;
    }
    
    if (name.trim().length < 2) {
      setError('Name must be at least 2 characters long');
      return;
    }

    setError('');
    onNameSubmit(name.trim());
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
        <div className="text-center mb-8">
          <div className="w-32 h-32 mx-auto mb-4 shadow-2xl rounded-2xl overflow-hidden border-2 border-orange-400/50 hover:scale-105 transition-transform duration-300">
            <img
              src="/efootball-logo.jpg"
              alt="eFootball 2025 Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            eFootball™ 2025 Generator
          </h1>
          <p className="text-orange-100 text-lg">
            Enter your name to spin and win exclusive coins & prizes!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-white font-medium mb-2">
              Your Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError('');
              }}
              placeholder="Enter your full name"
              className={`w-full px-4 py-3 rounded-xl bg-white/20 border ${
                error ? 'border-red-400' : 'border-white/30'
              } placeholder-white/60 text-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-200`}
            />
            {error && (
              <p className="text-red-300 text-sm mt-2 flex items-center">
                <span className="w-1 h-1 bg-red-300 rounded-full mr-2"></span>
                {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-orange-500 to-blue-600 hover:from-orange-600 hover:to-blue-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center space-x-2 group"
          >
            <span>Start Playing</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-orange-100 text-sm">
            ⚽ Exclusive eFootball rewards for every player!
          </p>
        </div>
      </div>
    </div>
  );
};