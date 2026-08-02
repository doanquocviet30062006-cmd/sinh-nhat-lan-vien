import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { soundManager } from '../utils/audioSynthesizer';
import birthdayData from '../data/birthdayData.json';
import { Sparkles, ArrowRight, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Chapter8FireworksProps {
  onNext: () => void;
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
  type: 'heart' | 'star' | 'willow' | 'chrysanthemum';
  exploded: boolean;
  particles: Particle[];
}

export const Chapter8Fireworks: React.FC<Chapter8FireworksProps> = ({ onNext }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    soundManager.playChapterSound('fireworks');

    const confettiInterval = setInterval(() => {
      confetti({
        particleCount: 25,
        spread: 80,
        origin: { x: Math.random(), y: Math.random() * 0.4 },
        colors: ['#FFD27D', '#FF9BCF', '#9D7BFF', '#C8A2FF'],
      });
    }, 2800);

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

    const fireworks: Firework[] = [];
    const colors = ['#FFD27D', '#FFC857', '#FF9BCF', '#9D7BFF', '#C8A2FF', '#6EE7B7', '#F472B6'];
    const types: ('heart' | 'star' | 'willow' | 'chrysanthemum')[] = [
      'heart',
      'star',
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
        y: height * 0.8,
        targetY: endY,
        vx: (Math.random() - 0.5) * 1.5,
        vy: -8 - Math.random() * 4,
        color,
        type,
        exploded: false,
        particles: [],
      });

      soundManager.playFireworkSound();
    };

    // Auto-launch fireworks continuously
    const autoLaunch = setInterval(() => {
      if (fireworks.length < 7) {
        createFirework();
      }
    }, 1200);

    const render = () => {
      ctx.fillStyle = 'rgba(7, 11, 26, 0.2)';
      ctx.fillRect(0, 0, width, height);

      const waterY = height * 0.8;

      for (let i = fireworks.length - 1; i >= 0; i--) {
        const fw = fireworks[i];

        if (!fw.exploded) {
          fw.x += fw.vx;
          fw.y += fw.vy;

          ctx.beginPath();
          ctx.arc(fw.x, fw.y, 3.5, 0, Math.PI * 2);
          ctx.fillStyle = fw.color;
          ctx.shadowBlur = 12;
          ctx.shadowColor = fw.color;
          ctx.fill();

          if (fw.y <= fw.targetY || fw.vy >= 0) {
            fw.exploded = true;

            if (fw.type === 'heart') {
              const count = 55;
              for (let p = 0; p < count; p++) {
                const t = (p / count) * Math.PI * 2;
                const hx = 16 * Math.pow(Math.sin(t), 3);
                const hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
                const speed = 0.26;
                fw.particles.push({
                  x: fw.x,
                  y: fw.y,
                  vx: hx * speed,
                  vy: hy * speed,
                  alpha: 1,
                  color: '#FF9BCF',
                  size: 2.5,
                  decay: 0.012,
                  gravity: 0.02,
                  sparkle: true,
                });
              }
            } else if (fw.type === 'star') {
              const count = 50;
              for (let p = 0; p < count; p++) {
                const angle = (p / count) * Math.PI * 2;
                const speed = (p % 2 === 0 ? 4.5 : 2.2);
                fw.particles.push({
                  x: fw.x,
                  y: fw.y,
                  vx: Math.cos(angle) * speed,
                  vy: Math.sin(angle) * speed,
                  alpha: 1,
                  color: '#FFD27D',
                  size: 2.8,
                  decay: 0.015,
                  gravity: 0.03,
                });
              }
            } else if (fw.type === 'willow') {
              const count = 75;
              for (let p = 0; p < count; p++) {
                const angle = Math.random() * Math.PI * 2;
                const speed = 1 + Math.random() * 3.8;
                fw.particles.push({
                  x: fw.x,
                  y: fw.y,
                  vx: Math.cos(angle) * speed,
                  vy: Math.sin(angle) * speed,
                  alpha: 1,
                  color: '#FFC857',
                  size: 2,
                  decay: 0.008,
                  gravity: 0.065,
                  sparkle: true,
                });
              }
            } else {
              const count = 85;
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
                  size: 2.2,
                  decay: 0.016,
                  gravity: 0.04,
                });
              }
            }
          }
        } else {
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
            ctx.arc(pt.x, pt.y, pt.sparkle && Math.random() > 0.5 ? pt.size * 1.5 : pt.size, 0, Math.PI * 2);
            ctx.fillStyle = pt.color;
            ctx.shadowBlur = 14;
            ctx.shadowColor = pt.color;
            ctx.fill();

            // Water reflection
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

      // Skyline & Water
      ctx.fillStyle = '#070B1A';
      ctx.fillRect(0, waterY, width, height - waterY);

      animId = requestAnimationFrame(render);
    };

    render();

    const handleCanvasClick = (e: MouseEvent) => {
      createFirework(e.clientX, e.clientY);
    };

    canvas.addEventListener('click', handleCanvasClick);

    return () => {
      canvas.removeEventListener('click', handleCanvasClick);
      clearInterval(autoLaunch);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-between py-12 px-4 overflow-hidden z-10 select-none">
      <canvas ref={canvasRef} className="absolute inset-0 z-0 cursor-crosshair" />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-xl z-10 mt-2 pointer-events-none"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card border border-[#FFD27D]/40 text-[#FFD27D] text-xs font-semibold uppercase tracking-widest mb-3">
          <Sparkles className="w-3.5 h-3.5 text-[#FF9BCF]" />
          <span>Chương VIII: Lễ Hội Pháo Hoa Rực Rỡ</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-script text-glow-gold">
          Chúc Mừng Sinh Nhật {birthdayData.recipientName}!
        </h2>
        <p className="text-xs sm:text-sm text-white/70 mt-2">
          Chạm/bấm vào bất kỳ đâu trên màn hình để bắn pháo hoa theo ý thích! 🎆
        </p>
      </motion.div>

      {/* Floating Heart Icon */}
      <motion.div
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 1.8, repeat: Infinity }}
        className="z-10 pointer-events-none"
      >
        <Heart className="w-16 h-16 text-[#FF9BCF] fill-[#FF9BCF] drop-shadow-[0_0_25px_#FF9BCF]" />
      </motion.div>

      {/* Next Button */}
      <div className="relative z-10 mb-2">
        <button
          onClick={() => {
            soundManager.playWhoosh();
            onNext();
          }}
          className="flex items-center gap-3 px-8 py-3.5 rounded-full glass-button text-white text-sm font-semibold cursor-pointer shadow-lg shadow-[#9D7BFF]/30 hover:scale-105 active:scale-95 transition-all"
        >
          <span>Tiếp theo: Đèn Lồng Ước Nguyện</span>
          <ArrowRight className="w-4 h-4 text-[#FFD27D]" />
        </button>
      </div>
    </div>
  );
};
