import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { soundManager } from '../utils/audioSynthesizer';
import birthdayData from '../data/birthdayData.json';
import confetti from 'canvas-confetti';
import { Gift as GiftIcon, Heart, Star, Sparkles, ArrowRight } from 'lucide-react';

interface Chapter4GiftProps {
  onNext: () => void;
}

export const Chapter4Gift: React.FC<Chapter4GiftProps> = ({ onNext }) => {
  const [opened, setOpened] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    soundManager.playChapterSound('gift');
  }, []);

  const handleTriggerOpen = () => {
    if (opened) return;
    setOpened(true);
    soundManager.playFireworkSound();

    // Trigger golden particle explosion
    confetti({
      particleCount: 100,
      spread: 100,
      origin: { y: 0.5 },
      colors: ['#FFD27D', '#FF9BCF', '#9D7BFF', '#FFFFFF'],
    });
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center text-center px-4 overflow-hidden z-10 select-none">
      {/* Glow aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-radial from-[#FFD27D]/20 via-[#FF9BCF]/10 to-transparent blur-3xl pointer-events-none" />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-xl mb-8 z-10"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card border border-[#FFD27D]/40 text-[#FFD27D] text-xs font-semibold uppercase tracking-widest mb-3">
          <GiftIcon className="w-3.5 h-3.5 text-[#FF9BCF]" />
          <span>Chương IV: Hộp Quà Kỳ Diệu Vũ Trụ</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-script text-glow-gold">
          {birthdayData.secretGift.giftBoxTitle}
        </h2>
      </motion.div>

      {/* Interactive Gift Box */}
      <AnimatePresence mode="wait">
        {!opened ? (
          <motion.div
            key="unopened"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.4, filter: 'blur(10px)' }}
            className="relative flex flex-col items-center my-8 cursor-pointer group"
            onMouseEnter={() => {
              setIsHovered(true);
              soundManager.playChime();
            }}
            onMouseLeave={() => setIsHovered(false)}
            onClick={handleTriggerOpen}
          >
            {/* Box Ambient Glow */}
            <div
              className={`absolute inset-0 rounded-full blur-3xl transition-all duration-500 ${
                isHovered ? 'bg-[#FFD27D]/40 scale-125' : 'bg-[#FF9BCF]/20 scale-100'
              }`}
            />

            {/* Floating Gift Box Illustration */}
            <motion.div
              animate={{
                y: isHovered ? [-5, 5, -5] : [-10, 10, -10],
                rotate: isHovered ? [-3, 3, -3] : [0, 0, 0],
              }}
              transition={{ duration: isHovered ? 0.4 : 3, repeat: Infinity, ease: 'easeInOut' }}
              className="relative w-56 h-56 glass-card-premium rounded-3xl border-2 border-[#FFD27D]/60 p-6 flex flex-col items-center justify-center shadow-2xl overflow-hidden"
            >
              {/* Ribbon Vertical */}
              <div className="absolute top-0 bottom-0 w-10 bg-gradient-to-b from-[#FFD27D] to-[#FF9BCF] shadow-lg" />
              {/* Ribbon Horizontal */}
              <div className="absolute left-0 right-0 h-10 bg-gradient-to-r from-[#FFD27D] to-[#FF9BCF] shadow-lg" />
              
              {/* Glowing Bow */}
              <div className="absolute -top-4 z-20 flex items-center justify-center">
                <Sparkles className="w-12 h-12 text-[#FFD27D] animate-spin-slow drop-shadow-[0_0_15px_#FFD27D]" />
              </div>

              <GiftIcon className="w-20 h-20 text-white z-10 drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]" />
            </motion.div>

            <motion.p
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="mt-6 text-[#FFD27D] font-serif-luxury text-lg tracking-wider"
            >
              Rê chuột vào gần hoặc chạm vào để mở hộp quà ✨
            </motion.p>
          </motion.div>
        ) : (
          <motion.div
            key="opened"
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, type: 'spring' }}
            className="relative z-10 w-full max-w-2xl glass-card-premium rounded-3xl p-8 sm:p-12 border border-[#FFD27D]/40 text-center shadow-2xl flex flex-col items-center gap-6"
          >
            <div className="flex gap-4">
              <Star className="w-8 h-8 text-[#FFD27D] animate-bounce" />
              <Heart className="w-8 h-8 text-[#FF9BCF] animate-bounce delay-100 fill-[#FF9BCF]" />
              <Sparkles className="w-8 h-8 text-[#C8A2FF] animate-bounce delay-200" />
            </div>

            <h3 className="text-2xl sm:text-4xl font-serif-luxury text-[#FFD27D] text-glow-gold">
              {birthdayData.secretGift.giftBoxSurprise}
            </h3>

            <p className="text-white/90 font-handwriting text-2xl sm:text-3xl text-[#FF9BCF] leading-relaxed max-w-lg">
              "{birthdayData.secretGift.wishMessage}"
            </p>

            <button
              onClick={() => {
                soundManager.playWhoosh();
                onNext();
              }}
              className="mt-4 flex items-center gap-3 px-8 py-3.5 rounded-full glass-button text-white text-sm font-semibold cursor-pointer shadow-lg shadow-[#9D7BFF]/30 hover:scale-105 active:scale-95 transition-all"
            >
              <span>Tiếp theo: Bức Thư Tình Cảm</span>
              <ArrowRight className="w-4 h-4 text-[#FFD27D]" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
