import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { soundManager } from '../utils/audioSynthesizer';
import { ArrowRight, Sparkles } from 'lucide-react';

interface Chapter1UniverseProps {
  onNext: () => void;
}

export const Chapter1Universe: React.FC<Chapter1UniverseProps> = ({ onNext }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showShootingStar, setShowShootingStar] = useState(false);
  const [showText1, setShowText1] = useState(false);
  const [showText2, setShowText2] = useState(false);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    soundManager.playChapterSound('universe');

    // Sequence timing
    const timer1 = setTimeout(() => setShowShootingStar(true), 2500);
    const timer2 = setTimeout(() => setShowText1(true), 4000);
    const timer3 = setTimeout(() => setShowText2(true), 6500);
    const timer4 = setTimeout(() => setShowButton(true), 9000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Deep cosmic stars
    const starCount = 450;
    const stars = Array.from({ length: starCount }, () => ({
      x: (Math.random() - 0.5) * width * 1.5 + width / 2,
      y: (Math.random() - 0.5) * height * 1.5 + height / 2,
      z: Math.random() * 1000 + 1,
      size: Math.random() * 2 + 0.5,
      color: Math.random() > 0.7 ? '#FFD27D' : (Math.random() > 0.4 ? '#FF9BCF' : '#FFFFFF'),
    }));

    let cameraZ = 0;
    let angle = 0;

    const render = () => {
      ctx.fillStyle = 'rgba(7, 11, 26, 0.25)';
      ctx.fillRect(0, 0, width, height);

      cameraZ += 0.4;
      angle += 0.0005;

      const cx = width / 2;
      const cy = height / 2;

      stars.forEach((star) => {
        let sz = star.z - (cameraZ % 1000);
        if (sz <= 0) sz += 1000;

        const k = 400 / sz;
        const px = (star.x - cx) * k + cx + Math.cos(angle) * 15;
        const py = (star.y - cy) * k + cy + Math.sin(angle) * 15;

        if (px >= 0 && px <= width && py >= 0 && py <= height) {
          const alpha = Math.min(1, (1000 - sz) / 600);
          ctx.beginPath();
          ctx.arc(px, py, Math.max(0.5, star.size * k * 0.8), 0, Math.PI * 2);
          ctx.fillStyle = star.color;
          ctx.globalAlpha = alpha;
          ctx.fill();

          if (star.size > 1.5) {
            ctx.shadowBlur = 10;
            ctx.shadowColor = star.color;
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        }
      });
      ctx.globalAlpha = 1;

      animId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center text-center px-4 overflow-hidden select-none z-10">
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />

      {/* Volumetric ambient light glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-radial from-[#9D7BFF]/10 via-[#FF9BCF]/5 to-transparent blur-3xl pointer-events-none" />

      {/* Shooting Star effect */}
      <AnimatePresence>
        {showShootingStar && (
          <motion.div
            initial={{ opacity: 0, x: -100, y: -50 }}
            animate={{ opacity: [0, 1, 0], x: 400, y: 300 }}
            transition={{ duration: 1.8, ease: "easeOut" }}
            className="absolute top-1/4 left-1/4 w-32 h-[2px] bg-gradient-to-r from-transparent via-[#FFD27D] to-white rounded-full shadow-[0_0_15px_#FFD27D] pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* Chapter 1 Cinematic Text Reveal */}
      <div className="relative z-10 max-w-3xl flex flex-col items-center gap-6">
        <AnimatePresence>
          {showText1 && (
            <motion.p
              initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 1.5 }}
              className="text-2xl sm:text-4xl md:text-5xl font-serif-luxury text-white/90 leading-relaxed font-light tracking-wide"
            >
              Trong hàng tỷ ngôi sao giữa vũ trụ bao la...
            </motion.p>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showText2 && (
            <motion.h1
              initial={{ opacity: 0, scale: 0.9, filter: 'blur(15px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              transition={{ duration: 2, ease: "easeOut" }}
              className="text-4xl sm:text-6xl md:text-7xl font-script text-glow-gold-strong text-[#FFD27D] tracking-wider mt-4"
            >
              Có một vì sao tỏa sáng rạng rỡ nhất ✨
            </motion.h1>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showButton && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="mt-12"
            >
              <button
                onClick={() => {
                  soundManager.playWhoosh();
                  onNext();
                }}
                className="group relative px-8 py-4 rounded-full glass-card-premium border border-[#FFD27D]/40 text-white font-medium text-lg flex items-center gap-3 hover:scale-105 active:scale-95 transition-all duration-300 shadow-[0_0_30px_rgba(255,210,125,0.3)] cursor-pointer"
              >
                <Sparkles className="w-5 h-5 text-[#FFD27D] group-hover:rotate-45 transition-transform" />
                <span>Khám phá vì sao ấy</span>
                <ArrowRight className="w-5 h-5 text-[#FF9BCF] group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
