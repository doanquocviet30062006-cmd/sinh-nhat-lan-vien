import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { soundManager } from '../utils/audioSynthesizer';
import { Sparkles, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Stage7FireworksCelebrationProps {
  recipientName: string;
  subtitleMessage: string;
  onReplay?: () => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  color: string;
  size: number;
  decay: number;
  gravity: number;
  sparkle?: boolean;
}

interface Firework {
  x: number;
  y: number;
  targetY: number;
  vx: number;
  vy: number;
  color: string;
  type: 'heart' | 'ring' | 'willow' | 'chrysanthemum';
  exploded: boolean;
  particles: Particle[];
}

export const Stage7FireworksCelebration: React.FC<Stage7FireworksCelebrationProps> = ({
  recipientName,
  subtitleMessage,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // Trigger continuous celebratory confetti burst
    const confettiInterval = setInterval(() => {
      confetti({
        particleCount: 30,
        spread: 70,
        origin: { x: Math.random(), y: Math.random() * 0.4 },
        colors: ['#FFD27D', '#FF9BCF', '#9D7BFF', '#C8A2FF', '#FFC857'],
      });
    }, 2500);

    return () => clearInterval(confettiInterval);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const fireworks: Firework[] = [];
    const colors = ['#FFD27D', '#FFC857', '#FF9BCF', '#9D7BFF', '#C8A2FF', '#6EE7B7', '#F472B6'];
    const types: ('heart' | 'ring' | 'willow' | 'chrysanthemum')[] = [
      'heart',
      'ring',
      'willow',
      'chrysanthemum',
    ];

    const createFirework = (targetX?: number, targetY?: number) => {
      const startX = targetX !== undefined ? targetX : Math.random() * (width * 0.8) + width * 0.1;
      const endY = targetY !== undefined ? targetY : Math.random() * (height * 0.45) + height * 0.1;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const type = types[Math.floor(Math.random() * types.length)];

      fireworks.push({
        x: startX,
        y: height * 0.78,
        targetY: endY,
        vx: (Math.random() - 0.5) * 1.5,
        vy: -7 - Math.random() * 4,
        color,
        type,
        exploded: false,
        particles: [],
      });

      soundManager.playFireworkSound();
    };

    // Auto launch fireworks
    const autoInterval = setInterval(() => {
      if (fireworks.length < 8) {
        createFirework();
      }
    }, 1000);

    const render = () => {
      // Dark background with soft trail fade
      ctx.fillStyle = 'rgba(7, 11, 26, 0.18)';
      ctx.fillRect(0, 0, width, height);

      const waterY = height * 0.78;

      for (let i = fireworks.length - 1; i >= 0; i--) {
        const fw = fireworks[i];

        if (!fw.exploded) {
          fw.x += fw.vx;
          fw.y += fw.vy;

          ctx.beginPath();
          ctx.arc(fw.x, fw.y, 3, 0, Math.PI * 2);
          ctx.fillStyle = fw.color;
          ctx.shadowBlur = 12;
          ctx.shadowColor = fw.color;
          ctx.fill();

          if (fw.y <= fw.targetY || fw.vy >= 0) {
            fw.exploded = true;

            // Generate specialized particles based on firework type
            if (fw.type === 'heart') {
              const count = 50;
              for (let p = 0; p < count; p++) {
                const t = (p / count) * Math.PI * 2;
                // Heart shape parametric equation
                const hx = 16 * Math.pow(Math.sin(t), 3);
                const hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
                const speed = 0.25;

                fw.particles.push({
                  x: fw.x,
                  y: fw.y,
                  vx: hx * speed,
                  vy: hy * speed,
                  alpha: 1,
                  color: '#FF9BCF',
                  size: 2.2,
                  decay: 0.012,
                  gravity: 0.02,
                  sparkle: true,
                });
              }
            } else if (fw.type === 'ring') {
              const count = 45;
              for (let p = 0; p < count; p++) {
                const angle = (p / count) * Math.PI * 2;
                const speed = 3.5;
                fw.particles.push({
                  x: fw.x,
                  y: fw.y,
                  vx: Math.cos(angle) * speed,
                  vy: Math.sin(angle) * speed,
                  alpha: 1,
                  color: '#FFD27D',
                  size: 2.5,
                  decay: 0.015,
                  gravity: 0.03,
                });
              }
            } else if (fw.type === 'willow') {
              const count = 70;
              for (let p = 0; p < count; p++) {
                const angle = Math.random() * Math.PI * 2;
                const speed = 1 + Math.random() * 3.5;
                fw.particles.push({
                  x: fw.x,
                  y: fw.y,
                  vx: Math.cos(angle) * speed,
                  vy: Math.sin(angle) * speed,
                  alpha: 1,
                  color: '#FFC857',
                  size: 1.8,
                  decay: 0.008, // slow decay for cascading willow
                  gravity: 0.065, // higher gravity
                  sparkle: true,
                });
              }
            } else {
              // Chrysanthemum
              const count = 80;
              for (let p = 0; p < count; p++) {
                const angle = Math.random() * Math.PI * 2;
                const speed = 1.5 + Math.random() * 5.5;
                fw.particles.push({
                  x: fw.x,
                  y: fw.y,
                  vx: Math.cos(angle) * speed,
                  vy: Math.sin(angle) * speed,
                  alpha: 1,
                  color: fw.color,
                  size: 2,
                  decay: 0.016,
                  gravity: 0.04,
                });
              }
            }
          }
        } else {
          // Render explosion particles
          for (let p = fw.particles.length - 1; p >= 0; p--) {
            const pt = fw.particles[p];
            pt.x += pt.vx;
            pt.y += pt.vy;
            pt.vy += pt.gravity;
            pt.alpha -= pt.decay;

            if (pt.alpha <= 0) {
              fw.particles.splice(p, 1);
              continue;
            }

            ctx.save();
            ctx.globalAlpha = Math.max(0, pt.alpha);
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, pt.sparkle && Math.random() > 0.5 ? pt.size * 1.6 : pt.size, 0, Math.PI * 2);
            ctx.fillStyle = pt.color;
            ctx.shadowBlur = 14;
            ctx.shadowColor = pt.color;
            ctx.fill();

            // Dynamic Water Reflection
            if (pt.y < waterY) {
              const reflectY = waterY + (waterY - pt.y) * 0.35;
              const ripple = Math.sin(Date.now() * 0.006 + pt.x * 0.04) * 4;
              ctx.globalAlpha = Math.max(0, pt.alpha * 0.28);
              ctx.beginPath();
              ctx.arc(pt.x + ripple, reflectY, pt.size * 1.8, 0, Math.PI * 2);
              ctx.fillStyle = pt.color;
              ctx.fill();
            }

            ctx.restore();
          }

          if (fw.particles.length === 0) {
            fireworks.splice(i, 1);
          }
        }
      }

      // Skyline Silhouette Vector
      ctx.fillStyle = '#070B1A';
      ctx.beginPath();
      ctx.moveTo(0, height);
      ctx.lineTo(0, waterY);

      const buildings = [
        { x: 0, w: width * 0.08, h: 45 },
        { x: width * 0.08, w: width * 0.05, h: 75 },
        { x: width * 0.13, w: width * 0.07, h: 55 },
        { x: width * 0.22, w: width * 0.06, h: 95 },
        { x: width * 0.28, w: width * 0.09, h: 50 },
        { x: width * 0.40, w: width * 0.08, h: 120 },
        { x: width * 0.48, w: width * 0.06, h: 65 },
        { x: width * 0.58, w: width * 0.10, h: 85 },
        { x: width * 0.68, w: width * 0.07, h: 105 },
        { x: width * 0.77, w: width * 0.08, h: 60 },
        { x: width * 0.85, w: width * 0.15, h: 80 },
      ];

      buildings.forEach((b) => {
        ctx.fillRect(b.x, waterY - b.h, b.w, b.h);
      });

      // Water body gradient overlay
      const waterGradient = ctx.createLinearGradient(0, waterY, 0, height);
      waterGradient.addColorStop(0, 'rgba(12, 22, 51, 0.75)');
      waterGradient.addColorStop(1, 'rgba(7, 11, 26, 0.98)');
      ctx.fillStyle = waterGradient;
      ctx.fillRect(0, waterY, width, height - waterY);

      animId = requestAnimationFrame(render);
    };

    render();

    const handleCanvasClick = (e: MouseEvent) => {
      createFirework(e.clientX, e.clientY);
    };

    canvas.addEventListener('click', handleCanvasClick);

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('click', handleCanvasClick);
      clearInterval(autoInterval);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center text-center px-4 overflow-hidden z-10 select-none">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full cursor-pointer z-0"
        title="Chạm vào bầu trời để bắn pháo hoa trái tim, vành đai và hoa đăng rực rỡ!"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2 }}
        className="relative z-10 max-w-4xl mx-auto flex flex-col items-center pointer-events-none"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card border border-[#FFD27D]/40 text-[#FFD27D] text-xs font-semibold uppercase tracking-widest mb-4 shadow-[0_0_30px_rgba(255,210,125,0.5)]">
          <Sparkles className="w-3.5 h-3.5 text-[#FF9BCF] animate-spin" />
          <span>Grand Celebration Universe</span>
        </div>

        <h1 className="text-6xl sm:text-9xl font-script text-glow-gold mb-4 leading-tight tracking-wide drop-shadow-[0_0_35px_#FFD27D]">
          Happy Birthday!
        </h1>

        <h2 className="text-2xl sm:text-4xl font-serif-luxury text-glow-pink mb-6">
          Chúc Mừng Sinh Nhật {recipientName}!
        </h2>

        <p className="text-white/90 text-sm sm:text-base max-w-lg mx-auto leading-relaxed mb-8 font-sans-luxury bg-black/20 p-4 rounded-2xl border border-white/10 backdrop-blur-xs">
          {subtitleMessage}
        </p>

        <div className="flex items-center gap-2 px-6 py-2.5 rounded-full glass-card border border-[#FFD27D]/40 text-xs text-white/90 shadow-xl">
          <Heart className="w-4 h-4 text-[#FF9BCF] fill-[#FF9BCF] animate-bounce" />
          <span>Chạm vào bầu trời đêm để tự bắn pháo hoa Trái Tim & Vành Đai rực rỡ!</span>
        </div>
      </motion.div>
    </div>
  );
};
