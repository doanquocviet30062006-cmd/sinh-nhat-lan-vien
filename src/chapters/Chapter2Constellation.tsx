import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { soundManager } from '../utils/audioSynthesizer';
import type { ConstellationNode } from '../types';
import birthdayData from '../data/birthdayData.json';
import { Star, Sparkles, ArrowRight } from 'lucide-react';

interface Chapter2ConstellationProps {
  onNext: () => void;
}

export const Chapter2Constellation: React.FC<Chapter2ConstellationProps> = ({ onNext }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedStar, setSelectedStar] = useState<ConstellationNode | null>(
    birthdayData.constellations[0] || null
  );

  useEffect(() => {
    soundManager.playChapterSound('constellation');
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Create offscreen text mask to get particle target coordinates for "LAN VIÊN"
    const textCanvas = document.createElement('canvas');
    const textCtx = textCanvas.getContext('2d');
    textCanvas.width = 800;
    textCanvas.height = 200;
    if (textCtx) {
      textCtx.fillStyle = '#ffffff';
      textCtx.font = 'bold 90px "Playfair Display", serif';
      textCtx.textAlign = 'center';
      textCtx.textBaseline = 'middle';
      textCtx.fillText('LAN VIÊN', 400, 100);
    }

    const targets: { x: number; y: number }[] = [];
    if (textCtx) {
      const imgData = textCtx.getImageData(0, 0, 800, 200);
      const step = 6;
      for (let y = 0; y < 200; y += step) {
        for (let x = 0; x < 800; x += step) {
          const alpha = imgData.data[(y * 800 + x) * 4 + 3];
          if (alpha > 128) {
            targets.push({
              x: (x - 400) * 0.9,
              y: (y - 100) * 0.9,
            });
          }
        }
      }
    }

    // Particles moving to target positions
    const particles = targets.map((t) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      tx: t.x,
      ty: t.y,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      size: Math.random() * 2 + 1,
      color: Math.random() > 0.6 ? '#FFD27D' : (Math.random() > 0.3 ? '#FF9BCF' : '#C8A2FF'),
    }));

    let progress = 0;

    const render = () => {
      ctx.fillStyle = 'rgba(7, 11, 26, 0.22)';
      ctx.fillRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2 - 40;

      if (progress < 1) progress += 0.008;

      particles.forEach((p) => {
        const targetX = cx + p.tx;
        const targetY = cy + p.ty;

        p.x += (targetX - p.x) * 0.04 * Math.min(1, progress * 1.5);
        p.y += (targetY - p.y) * 0.04 * Math.min(1, progress * 1.5);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = 0.85;
        ctx.fill();
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
    <div className="relative min-h-screen w-full flex flex-col items-center justify-between py-12 px-4 overflow-hidden z-10 select-none">
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-xl z-10 mt-4"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card border border-[#C8A2FF]/30 text-[#C8A2FF] text-xs font-semibold uppercase tracking-widest mb-3">
          <Star className="w-3.5 h-3.5 text-[#FFD27D]" />
          <span>Chương II: Chòm Sao Mang Tên Em</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-script text-glow-gold">
          Chòm Sao {birthdayData.recipientName}
        </h2>
      </motion.div>

      {/* Constellation Nodes Interactive Ring around canvas center */}
      <div className="relative w-full max-w-4xl h-[280px] sm:h-[350px] z-10 flex items-center justify-center">
        {birthdayData.constellations.map((node) => {
          const isSelected = selectedStar?.id === node.id;
          return (
            <motion.button
              key={node.id}
              onClick={() => {
                soundManager.playChime();
                setSelectedStar(node);
              }}
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
              whileHover={{ scale: 1.3 }}
              className="absolute -translate-x-1/2 -translate-y-1/2 p-2 rounded-full cursor-pointer focus:outline-none z-20 group"
            >
              <div
                className={`relative flex items-center justify-center rounded-full transition-all duration-300 ${
                  isSelected
                    ? 'w-8 h-8 bg-[#FFD27D] shadow-[0_0_25px_#FFD27D]'
                    : 'w-6 h-6 bg-[#FF9BCF] group-hover:bg-[#FFD27D] shadow-[0_0_15px_#FF9BCF]'
                }`}
              >
                <Star
                  className={`w-4 h-4 ${
                    isSelected ? 'text-[#070B1A] fill-[#070B1A]' : 'text-white fill-white'
                  }`}
                />
              </div>

              <span className="absolute top-9 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-medium text-white/90 group-hover:text-[#FFD27D] transition-colors bg-[#070B1A]/80 px-2 py-0.5 rounded-full border border-white/10">
                {node.title}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Selected Star Details & Next Button */}
      <div className="relative z-10 w-full max-w-xl flex flex-col items-center gap-6 mb-4">
        <AnimatePresence mode="wait">
          {selectedStar && (
            <motion.div
              key={selectedStar.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="glass-card-premium rounded-2xl p-6 border border-[#FFD27D]/30 text-center w-full shadow-2xl"
            >
              <h3 className="text-xl font-serif-luxury text-glow-pink mb-2 flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4 text-[#FFD27D]" />
                <span>{selectedStar.title}</span>
              </h3>
              <p className="text-white/90 font-handwriting text-xl sm:text-2xl text-[#FFD27D] leading-relaxed">
                "{selectedStar.quote}"
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => {
            soundManager.playWhoosh();
            onNext();
          }}
          className="flex items-center gap-3 px-8 py-3.5 rounded-full glass-button text-white text-sm font-semibold cursor-pointer shadow-lg shadow-[#9D7BFF]/30 hover:scale-105 active:scale-95 transition-all"
        >
          <span>Tiếp theo: Ngược Dòng Thời Gian</span>
          <ArrowRight className="w-4 h-4 text-[#FFD27D]" />
        </button>
      </div>
    </div>
  );
};
