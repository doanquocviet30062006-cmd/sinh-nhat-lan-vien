import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { soundManager } from '../utils/audioSynthesizer';
import { Wind, Flame, ArrowRight, Sparkles } from 'lucide-react';

interface Chapter7CakeProps {
  onNext: () => void;
}

export const Chapter7Cake: React.FC<Chapter7CakeProps> = ({ onNext }) => {
  const [blown, setBlown] = useState(false);

  useEffect(() => {
    soundManager.playChapterSound('cake');

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !blown) {
        e.preventDefault();
        handleExtinguish();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [blown]);

  const handleExtinguish = () => {
    if (blown) return;
    setBlown(true);
    soundManager.playChime();
    setTimeout(() => {
      soundManager.playFireworkSound();
    }, 1200);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-between py-10 px-4 overflow-hidden z-10 select-none">
      {/* Volumetric Warm Lighting Spotlight behind Cake */}
      <div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-1000 blur-3xl pointer-events-none ${
          blown
            ? 'w-[400px] h-[400px] bg-radial from-blue-900/10 to-transparent'
            : 'w-[600px] h-[600px] bg-radial from-[#FFD27D]/35 via-[#FF9BCF]/20 to-transparent'
        }`}
      />

      {/* Floating Gold Motes */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {[...Array(25)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-[#FFD27D]"
            style={{
              width: Math.random() * 4 + 2 + 'px',
              height: Math.random() * 4 + 2 + 'px',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -40, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-xl z-10 mt-2"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card border border-[#FFD27D]/40 text-[#FFD27D] text-xs font-semibold uppercase tracking-widest mb-3">
          <Flame className="w-3.5 h-3.5 text-[#FF9BCF]" />
          <span>Chương VI: Bánh Sinh Nhật & Thổi Nến</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-script text-glow-gold">
          {blown ? 'Điều Ước Đã Được Gửi Đêm Nay' : 'Hãy Thắp Nến Và Ước Một Điều'}
        </h2>
      </motion.div>

      {/* Ultra-Luxury 3D/4D Rendered Birthday Cake */}
      <motion.div
        animate={{ scale: blown ? 1 : [0.98, 1.02, 0.98] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="relative w-full max-w-lg h-80 flex flex-col items-center justify-end z-10 my-4"
      >
        {/* Cake Base Gold Plate */}
        <div className="absolute bottom-0 w-80 sm:w-96 h-6 rounded-full bg-gradient-to-r from-[#FFC857] via-[#FFD27D] to-[#FFC857] border-2 border-white/60 shadow-[0_15px_35px_rgba(0,0,0,0.8)] z-0" />

        {/* Candles Container */}
        <div className="absolute top-2 flex gap-6 z-30 justify-center">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="relative w-4 h-16 rounded-t-md bg-gradient-to-t from-pink-300 via-white to-yellow-100 border border-white/50 shadow-md">
              {/* Candle Stripe Detail */}
              <div className="absolute inset-0 rounded-t-md opacity-30 bg-[repeating-linear-gradient(45deg,transparent,transparent_4px,#FF9BCF_4px,#FF9BCF_8px)]" />

              {/* Realistic Volumetric Flame */}
              <AnimatePresence>
                {!blown && (
                  <motion.div
                    exit={{ scale: 0, opacity: 0, y: -15 }}
                    className="absolute -top-8 left-1/2 -translate-x-1/2 w-6 h-9 bg-gradient-to-t from-orange-600 via-amber-400 to-white rounded-full blur-[0.8px] animate-pulse origin-bottom shadow-[0_0_25px_#FFD27D]"
                    style={{ animationDuration: `${0.35 + (i % 3) * 0.15}s` }}
                  >
                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-2.5 h-4 bg-white rounded-full opacity-95 blur-[0.5px]" />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Rising Soft Smoke when blown out */}
              <AnimatePresence>
                {blown && (
                  <motion.div
                    initial={{ opacity: 0, y: 0 }}
                    animate={{ opacity: [0, 0.7, 0], y: -70, x: (i % 2 === 0 ? 1 : -1) * 20 }}
                    transition={{ duration: 3, ease: 'easeOut' }}
                    className="absolute -top-4 left-1/2 -translate-x-1/2 w-4 h-4 bg-gray-200 rounded-full blur-[4px]"
                  />
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* Top Cake Tier (Vanilla Cream & Icing Drips) */}
        <div className="w-44 h-16 bg-gradient-to-b from-[#FFF5FA] via-[#FFB8D2] to-[#FF9BCF] rounded-t-3xl z-20 border-t-4 border-white/80 shadow-lg relative overflow-hidden flex justify-center">
          {/* Cream Icing Drips */}
          <div className="absolute top-0 w-full h-6 bg-white rounded-b-xl opacity-90 border-b-2 border-pink-200 shadow-sm" />
          {/* Pearl Sprinkles */}
          <div className="absolute bottom-2 flex gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FFD27D] shadow-sm" />
            <span className="w-2.5 h-2.5 rounded-full bg-white shadow-sm" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#C8A2FF] shadow-sm" />
          </div>
        </div>

        {/* Middle Cake Tier (Lavender Velvet) */}
        <div className="w-60 h-20 bg-gradient-to-b from-[#E9D8FF] via-[#C8A2FF] to-[#9D7BFF] rounded-t-3xl z-10 border-t-4 border-white/80 shadow-xl relative overflow-hidden flex justify-center">
          {/* Cream Icing Wave */}
          <div className="absolute top-0 w-full h-7 bg-white/90 rounded-b-2xl border-b-2 border-purple-200 shadow-sm" />
          {/* Gold Pearl Decor */}
          <div className="absolute bottom-3 flex gap-4">
            <Sparkles className="w-4 h-4 text-[#FFD27D]" />
            <Sparkles className="w-4 h-4 text-white" />
            <Sparkles className="w-4 h-4 text-[#FFD27D]" />
          </div>
        </div>

        {/* Bottom Cake Tier (Gold Luxury Layer) */}
        <div className="w-80 sm:w-88 h-24 bg-gradient-to-b from-[#FFE8B3] via-[#FFD27D] to-[#FFC857] rounded-t-3xl rounded-b-xl z-10 border-t-4 border-white/90 shadow-[0_20px_40px_rgba(0,0,0,0.7)] relative overflow-hidden">
          {/* Cream Icing Border */}
          <div className="absolute top-0 w-full h-8 bg-white/95 rounded-b-2xl border-b-2 border-yellow-200 shadow-sm" />
          {/* Diamond Ribbon Pattern */}
          <div
            className="absolute inset-0 opacity-35"
            style={{ background: 'repeating-linear-gradient(45deg, transparent, transparent 15px, rgba(255,255,255,0.8) 15px, rgba(255,255,255,0.8) 30px)' }}
          />
        </div>
      </motion.div>

      {/* Action Controls */}
      <div className="relative z-10 flex flex-col items-center gap-4 mb-4">
        {!blown ? (
          <div className="flex flex-col items-center gap-3">
            <button
              onClick={handleExtinguish}
              className="px-8 py-4 rounded-full glass-card-premium border border-[#FFD27D]/60 text-white font-semibold text-lg flex items-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-[0_0_35px_rgba(255,210,125,0.5)] cursor-pointer"
            >
              <Wind className="w-6 h-6 text-[#FFD27D] animate-bounce" />
              <span>Chạm để Thổi Nến</span>
            </button>

            <span className="text-xs text-white/60 font-mono">
              💡 Mẹo Desktop: Nhấn giữ phím <code className="text-[#FFD27D]">Space</code>
            </span>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-4"
          >
            <p className="text-xl font-handwriting text-[#FFD27D] text-glow-gold">
              Nến đã tắt! Hãy chuẩn bị chào đón màn bắn pháo hoa rực rỡ ✨
            </p>

            <button
              onClick={() => {
                soundManager.playWhoosh();
                onNext();
              }}
              className="flex items-center gap-3 px-8 py-3.5 rounded-full glass-button text-white text-sm font-semibold cursor-pointer shadow-lg shadow-[#9D7BFF]/30 hover:scale-105 active:scale-95 transition-all"
            >
              <span>Tiếp theo: Lễ Hội Pháo Hoa</span>
              <ArrowRight className="w-4 h-4 text-[#FFD27D]" />
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};
