import React, { useState, useRef, useEffect, useCallback } from 'react';
import { RotateCw, ArrowLeft } from 'lucide-react';
import { WheelItem, SpinResult } from '../types/wheel';

interface SpinWheelProps {
  userName: string;
  onSpinComplete: (result: SpinResult) => void;
  onGoBack: () => void;
}

// Premium eFootball 2025 Rewards with enhanced visual appeal
const WHEEL_ITEMS: WheelItem[] = [
  { 
    id: '1', 
    label: '500K', 
    color: '#FFD700', 
    textColor: '#1A1A1A',
    icon: '👑',
    rarity: 'legendary'
  },
  { 
    id: '2', 
    label: '250K', 
    color: '#FF6B35', 
    textColor: '#FFFFFF',
    icon: '🏆',
    rarity: 'epic'
  },
  { 
    id: '3', 
    label: '100K', 
    color: '#4ECDC4', 
    textColor: '#FFFFFF',
    icon: '⭐',
    rarity: 'rare'
  },
  { 
    id: '4', 
    label: '750K', 
    color: '#9B59B6', 
    textColor: '#FFFFFF',
    icon: '💎',
    rarity: 'legendary'
  },
  { 
    id: '5', 
    label: '300K', 
    color: '#3498DB', 
    textColor: '#FFFFFF',
    icon: '⚡',
    rarity: 'epic'
  },
  { 
    id: '6', 
    label: '150K', 
    color: '#E74C3C', 
    textColor: '#FFFFFF',
    icon: '🎁',
    rarity: 'rare'
  },
  { 
    id: '7', 
    label: '1M', 
    color: '#2ECC71', 
    textColor: '#FFFFFF',
    icon: '💠',
    rarity: 'mythic'
  },
  { 
    id: '8', 
    label: '400K', 
    color: '#F39C12', 
    textColor: '#FFFFFF',
    icon: '🪙',
    rarity: 'epic'
  },
];

const GUARANTEED_WINS = WHEEL_ITEMS;

// Particle system for visual effects
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

export const SpinWheel: React.FC<SpinWheelProps> = ({ userName, onSpinComplete, onGoBack }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const particlesRef = useRef<Particle[]>([]);
  const lastTimeRef = useRef<number>(0);

  // Get rarity colors for effects
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'mythic': return '#FF00FF';
      case 'legendary': return '#FFD700';
      case 'epic': return '#9B59B6';
      case 'rare': return '#3498DB';
      default: return '#FFFFFF';
    }
  };

  // Create particles for visual effects
  const createParticles = useCallback((centerX: number, centerY: number, count: number = 20) => {
    const particles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count;
      const speed = 2 + Math.random() * 3;
      particles.push({
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        maxLife: 60 + Math.random() * 40,
        color: `hsl(${Math.random() * 60 + 30}, 100%, 60%)`,
        size: 2 + Math.random() * 3
      });
    }
    return particles;
  }, []);

  // Update particles
  const updateParticles = useCallback((particles: Particle[]) => {
    return particles.filter(particle => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vy += 0.1; // gravity
      particle.life--;
      particle.vx *= 0.99; // friction
      particle.vy *= 0.99;
      return particle.life > 0;
    });
  }, []);

  // Draw the wheel on canvas
  const drawWheel = useCallback((ctx: CanvasRenderingContext2D, currentRotation: number, time: number) => {
    const canvas = ctx.canvas;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(canvas.width, canvas.height) / 2 - 20;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background glow
    const glowGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius + 50);
    glowGradient.addColorStop(0, 'rgba(255, 215, 0, 0.3)');
    glowGradient.addColorStop(0.5, 'rgba(255, 107, 53, 0.2)');
    glowGradient.addColorStop(1, 'rgba(59, 130, 246, 0.1)');
    
    ctx.fillStyle = glowGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw outer ring with animation
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate((time * 0.001) % (Math.PI * 2));
    
    const outerGradient = ctx.createLinearGradient(-radius, -radius, radius, radius);
    outerGradient.addColorStop(0, '#FFD700');
    outerGradient.addColorStop(0.25, '#FF6B35');
    outerGradient.addColorStop(0.5, '#9B59B6');
    outerGradient.addColorStop(0.75, '#3498DB');
    outerGradient.addColorStop(1, '#FFD700');
    
    ctx.strokeStyle = outerGradient;
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(0, 0, radius + 10, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    // Draw wheel segments
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate((currentRotation * Math.PI) / 180);

    const segmentAngle = (Math.PI * 2) / WHEEL_ITEMS.length;

    WHEEL_ITEMS.forEach((item, index) => {
      const startAngle = index * segmentAngle;
      const endAngle = (index + 1) * segmentAngle;
      const midAngle = startAngle + segmentAngle / 2;

      // Create gradient for each segment
      const segmentGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, radius);
      segmentGradient.addColorStop(0, item.color);
      segmentGradient.addColorStop(0.7, item.color);
      segmentGradient.addColorStop(1, `${item.color}CC`);

      // Draw segment
      ctx.fillStyle = segmentGradient;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fill();

      // Draw segment border with rarity glow
      const rarityColor = getRarityColor(item.rarity || 'rare');
      ctx.strokeStyle = rarityColor;
      ctx.lineWidth = 3;
      ctx.shadowColor = rarityColor;
      ctx.shadowBlur = 10;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Draw inner highlight
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius * 0.9, startAngle, endAngle);
      ctx.stroke();

      // Draw reward card
      const cardX = Math.cos(midAngle) * (radius * 0.7);
      const cardY = Math.sin(midAngle) * (radius * 0.7);

      ctx.save();
      ctx.translate(cardX, cardY);
      ctx.rotate(midAngle + Math.PI / 2);

      // Card background
      const cardGradient = ctx.createLinearGradient(-30, -25, 30, 25);
      cardGradient.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
      cardGradient.addColorStop(1, 'rgba(248, 249, 250, 0.9)');
      
      ctx.fillStyle = cardGradient;
      ctx.strokeStyle = rarityColor;
      ctx.lineWidth = 2;
      ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
      ctx.shadowBlur = 5;
      ctx.shadowOffsetY = 2;
      
      ctx.beginPath();
      ctx.roundRect(-30, -25, 60, 50, 8);
      ctx.fill();
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Icon
      ctx.font = '20px Arial';
      ctx.textAlign = 'center';
      ctx.fillStyle = item.color;
      ctx.fillText(item.icon || '🪙', 0, -5);

      // Amount
      ctx.font = 'bold 12px Arial';
      ctx.fillStyle = '#1F2937';
      ctx.fillText(item.label, 0, 10);

      // "COINS" label
      ctx.font = 'bold 8px Arial';
      ctx.fillStyle = '#6B7280';
      ctx.fillText('COINS', 0, 20);

      ctx.restore();
    });

    ctx.restore();

    // Draw center hub
    const centerGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 40);
    centerGradient.addColorStop(0, '#FFD700');
    centerGradient.addColorStop(0.3, '#F97316');
    centerGradient.addColorStop(0.7, '#3B82F6');
    centerGradient.addColorStop(1, '#1E40AF');

    ctx.fillStyle = centerGradient;
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 4;
    ctx.shadowColor = 'rgba(255, 215, 0, 0.5)';
    ctx.shadowBlur = 15;
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, 35, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Inner center circle
    const innerGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 22);
    innerGradient.addColorStop(0, '#FFFFFF');
    innerGradient.addColorStop(1, '#F8F9FA');
    
    ctx.fillStyle = innerGradient;
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 22, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Center logo
    ctx.font = '24px Arial';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#F97316';
    ctx.fillText('⚽', centerX, centerY + 8);

    // Draw particles
    particlesRef.current.forEach(particle => {
      ctx.save();
      ctx.globalAlpha = particle.life / particle.maxLife;
      ctx.fillStyle = particle.color;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // Draw pointer
    ctx.save();
    ctx.translate(centerX, centerY - radius - 15);
    
    // Pointer shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.beginPath();
    ctx.moveTo(-12, 22);
    ctx.lineTo(12, 22);
    ctx.lineTo(0, 2);
    ctx.closePath();
    ctx.fill();

    // Main pointer
    const pointerGradient = ctx.createLinearGradient(0, 0, 0, 20);
    pointerGradient.addColorStop(0, '#FFD700');
    pointerGradient.addColorStop(1, '#FF6B35');
    
    ctx.fillStyle = pointerGradient;
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.shadowColor = '#FFD700';
    ctx.shadowBlur = 10;
    
    ctx.beginPath();
    ctx.moveTo(-10, 20);
    ctx.lineTo(10, 20);
    ctx.lineTo(0, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Pointer highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.beginPath();
    ctx.moveTo(-6, 16);
    ctx.lineTo(6, 16);
    ctx.lineTo(0, 4);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }, [getRarityColor]);

  // Animation loop
  const animate = useCallback((time: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Update particles
    particlesRef.current = updateParticles(particlesRef.current);

    // Add new particles occasionally
    if (Math.random() < 0.1) {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = Math.min(canvas.width, canvas.height) / 2 - 20;
      const angle = Math.random() * Math.PI * 2;
      const distance = radius * 0.8 + Math.random() * radius * 0.2;
      const x = centerX + Math.cos(angle) * distance;
      const y = centerY + Math.sin(angle) * distance;
      
      particlesRef.current.push(...createParticles(x, y, 3));
    }

    drawWheel(ctx, rotation, time);
    animationRef.current = requestAnimationFrame(animate);
  }, [rotation, drawWheel, updateParticles, createParticles]);

  // Setup canvas and start animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas size
    const size = Math.min(window.innerWidth - 40, 500);
    canvas.width = size;
    canvas.height = size;

    // Start animation
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate]);

  const handleSpin = () => {
    if (isSpinning) return;

    setIsSpinning(true);

    // Create burst of particles
    const canvas = canvasRef.current;
    if (canvas) {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      particlesRef.current.push(...createParticles(centerX, centerY, 50));
    }

    // Fixed result - user always wins something good!
    const winningItem = GUARANTEED_WINS[Math.floor(Math.random() * GUARANTEED_WINS.length)];
    const winningIndex = WHEEL_ITEMS.findIndex(item => item.id === winningItem.id);

    const segmentAngle = 360 / WHEEL_ITEMS.length;
    const targetAngle = winningIndex * segmentAngle + (segmentAngle / 2);

    // Add multiple full rotations for dramatic effect
    const spins = 8 + Math.random() * 4; // 8-12 full rotations
    const finalRotation = spins * 360 + (360 - targetAngle);

    // Animate rotation
    const startRotation = rotation;
    const startTime = Date.now();
    const duration = 4000; // 4 seconds

    const animateRotation = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth deceleration
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentRotation = startRotation + (finalRotation - startRotation) * easeOut;
      
      setRotation(currentRotation);

      if (progress < 1) {
        requestAnimationFrame(animateRotation);
      } else {
        setIsSpinning(false);
        const result: SpinResult = {
          item: winningItem,
          rotation: finalRotation
        };
        onSpinComplete(result);
      }
    };

    requestAnimationFrame(animateRotation);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
        {/* Back Button */}
        <div className="flex justify-start mb-4">
          <button
            onClick={onGoBack}
            className="flex items-center space-x-2 text-white/70 hover:text-white transition-colors duration-200 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
            <span className="text-sm font-medium">Back</span>
          </button>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 mx-auto mb-4 shadow-2xl rounded-2xl overflow-hidden border-2 border-orange-400/50 hover:scale-105 transition-transform duration-300">
            <img
              src="/efootball-logo.jpg"
              alt="eFootball 2025 Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">
            Ready to play, {userName}?
          </h2>
          <p className="text-orange-100 text-lg">
            Spin the premium wheel for exclusive rewards!
          </p>
        </div>

        {/* Canvas Wheel */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <canvas
              ref={canvasRef}
              className="drop-shadow-2xl rounded-full"
              style={{ maxWidth: '100%', height: 'auto' }}
            />
          </div>
        </div>

        {/* Enhanced Spin Button */}
        <div className="text-center">
          <button
            onClick={handleSpin}
            disabled={isSpinning}
            className={`relative overflow-hidden bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 hover:from-orange-600 hover:via-red-600 hover:to-pink-600 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-6 px-12 rounded-2xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 shadow-2xl hover:shadow-orange-500/25 flex items-center space-x-4 mx-auto border-2 border-white/20 ${
              isSpinning ? 'cursor-not-allowed animate-pulse' : 'cursor-pointer'
            }`}
          >
            {/* Enhanced glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-orange-400/30 via-red-400/30 to-pink-400/30 rounded-2xl blur-xl"></div>

            {/* Animated background particles */}
            <div className="absolute inset-0 overflow-hidden rounded-2xl">
              <div className="absolute top-2 left-4 w-1 h-1 bg-white rounded-full animate-ping"></div>
              <div className="absolute top-6 right-8 w-1 h-1 bg-yellow-300 rounded-full animate-ping delay-200"></div>
              <div className="absolute bottom-4 left-12 w-1 h-1 bg-white rounded-full animate-ping delay-400"></div>
              <div className="absolute bottom-6 right-4 w-1 h-1 bg-yellow-300 rounded-full animate-ping delay-600"></div>
            </div>

            <RotateCw className={`relative z-10 w-8 h-8 ${isSpinning ? 'animate-spin' : ''}`} />
            <span className="relative z-10 text-2xl font-black tracking-wide">
              {isSpinning ? 'SPINNING...' : 'SPIN NOW!'}
            </span>

            {/* Button sparkle effects */}
            <div className="absolute top-1 right-6 text-yellow-200 animate-ping text-xl">✨</div>
            <div className="absolute bottom-1 left-6 text-yellow-200 animate-ping delay-300 text-xl">✨</div>
          </button>

          {/* Reward preview */}
          <div className="mt-8 grid grid-cols-4 gap-3 max-w-lg mx-auto">
            {WHEEL_ITEMS.slice(0, 4).map((item) => (
              <div key={item.id} className="bg-white/10 rounded-xl p-3 text-center border border-white/20 hover:bg-white/20 transition-all duration-200 hover:scale-105">
                <div className="text-2xl mb-2">{item.icon}</div>
                <div className="text-white text-sm font-bold">{item.label}</div>
                <div className="text-white/60 text-xs">COINS</div>
              </div>
            ))}
          </div>
        </div>

        {isSpinning && (
          <div className="text-center mt-8">
            <div className="bg-gradient-to-r from-yellow-400/20 via-orange-500/20 to-red-500/20 rounded-2xl p-6 border border-yellow-400/30">
              <p className="text-yellow-100 animate-pulse text-2xl font-bold mb-4">
                🎯 SPINNING FOR MEGA REWARDS!
              </p>
              <div className="flex justify-center space-x-4 mb-4">
                <div className="w-4 h-4 bg-yellow-400 rounded-full animate-bounce"></div>
                <div className="w-4 h-4 bg-orange-400 rounded-full animate-bounce delay-100"></div>
                <div className="w-4 h-4 bg-red-400 rounded-full animate-bounce delay-200"></div>
                <div className="w-4 h-4 bg-pink-400 rounded-full animate-bounce delay-300"></div>
              </div>
              <div className="text-orange-100 text-lg font-semibold">
                💰 Calculating your massive win...
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};