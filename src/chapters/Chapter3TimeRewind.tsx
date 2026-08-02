import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { soundManager } from '../utils/audioSynthesizer';
import birthdayData from '../data/birthdayData.json';
import { ArrowRight, Clock, Sparkles } from 'lucide-react';

interface Chapter3TimeRewindProps {
  onNext: () => void;
}

export const Chapter3TimeRewind: React.FC<Chapter3TimeRewindProps> = ({ onNext }) => {
  const [phase, setPhase] = useState<'rewinding' | 'frozen' | 'exploded'>('rewinding');
  const [rotation, setRotation] = useState(0);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    soundManager.playChapterSound('rewind');

    // Fast rewind rotation animation
    const interval = setInterval(() => {
      setRotation((prev) => prev - 18);
    }, 25);

    const freezeTimer = setTimeout(() => {
      clearInterval(interval);
      setPhase('frozen');
      soundManager.playChime();
    }, 3600);

    const explodeTimer = setTimeout(() => {
      setPhase('exploded');
      soundManager.playFireworkSound();
    }, 5600);

    return () => {
      clearInterval(interval);
      clearTimeout(freezeTimer);
      clearTimeout(explodeTimer);
    };
  }, []);

  useEffect(() => {
    const target = new Date(birthdayData.birthdayDate).getTime();
    const updateCountdown = () => {
      const diff = target - Date.now();
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / 1000 / 60) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        });
      }
    };
    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center text-center px-4 overflow-hidden z-10 select-none">
      {/* Time Rewind Swirling Particles */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {[...Array(40)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-[#FFD27D] to-[#FF9BCF]"
            style={{
              width: Math.random() * 5 + 2 + 'px',
              height: Math.random() * 5 + 2 + 'px',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: phase === 'rewinding' ? [2, 0.1] : [1, 1.6, 1],
              opacity: [0.2, 0.95, 0.2],
              rotate: [0, -360],
            }}
            transition={{
              duration: Math.random() * 2.5 + 1,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {phase === 'rewinding' && (
          <motion.div
            key="rewinding"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2, filter: 'blur(10px)' }}
            className="flex flex-col items-center gap-6"
          >
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full glass-card border border-[#FF9BCF]/40 text-[#FF9BCF] text-xs font-semibold uppercase tracking-widest shadow-xl">
              <Clock className="w-4 h-4 text-[#FFD27D]" />
              <span>Chương III: Ngược Dòng Thời Gian</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-script text-glow-gold text-[#FFD27D]">
              Mọi khoảnh khắc đang quay ngược về quá khứ...
            </h2>

            {/* Ultra-Luxury 3D Metallic Clock */}
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-full border-[6px] border-[#FFD27D] bg-gradient-to-b from-[#101C45] via-[#070B1A] to-[#0C1633] flex items-center justify-center shadow-[0_0_80px_rgba(255,210,125,0.5),inset_0_0_30px_rgba(255,155,207,0.3)] my-4">
              {/* Glass Bevel Glare */}
              <div className="absolute top-2 left-6 right-6 h-24 rounded-t-full bg-gradient-to-b from-white/20 to-transparent pointer-events-none skew-x-6" />

              {/* Roman Numerals */}
              <span className="absolute top-3 font-serif-luxury font-bold text-lg text-[#FFD27D] text-glow-gold">XII</span>
              <span className="absolute right-4 font-serif-luxury font-bold text-lg text-[#FFD27D] text-glow-gold">III</span>
              <span className="absolute bottom-3 font-serif-luxury font-bold text-lg text-[#FFD27D] text-glow-gold">VI</span>
              <span className="absolute left-4 font-serif-luxury font-bold text-lg text-[#FFD27D] text-glow-gold">IX</span>

              {/* Mechanical Ring Motif */}
              <div className="absolute inset-6 rounded-full border border-dashed border-[#FF9BCF]/30 animate-spin-slow" />

              {/* Center Gold Pivot */}
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#FFC857] to-white z-20 shadow-[0_0_15px_#FFD27D]" />

              {/* Hour Hand */}
              <div
                className="absolute w-2 h-20 bg-gradient-to-t from-[#FF9BCF] to-white rounded-full origin-bottom top-14 z-10 shadow-[0_0_10px_#FF9BCF]"
                style={{ transform: `rotate(${rotation}deg)` }}
              />
              {/* Minute Hand */}
              <div
                className="absolute w-1.5 h-28 bg-gradient-to-t from-[#FFD27D] to-white rounded-full origin-bottom top-6 z-10 shadow-[0_0_12px_#FFD27D]"
                style={{ transform: `rotate(${rotation * 4}deg)` }}
              />
            </div>
          </motion.div>
        )}

        {phase === 'frozen' && (
          <motion.div
            key="frozen"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, filter: 'blur(20px)' }}
            className="flex flex-col items-center gap-4"
          >
            <h1 className="text-6xl sm:text-8xl font-mono font-bold text-[#FFD27D] text-glow-gold-strong tracking-widest animate-pulse">
              00 : 00 : 00
            </h1>
            <p className="text-xl sm:text-2xl text-[#FF9BCF] font-serif-luxury tracking-widest uppercase">
              Thời Gian Đóng Băng Tại Giây Phút Kỳ Diệu Nhất...
            </p>
          </motion.div>
        )}

        {phase === 'exploded' && (
          <motion.div
            key="exploded"
            initial={{ opacity: 0, scale: 0.5, filter: 'blur(20px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 1, type: 'spring', bounce: 0.4 }}
            className="flex flex-col items-center gap-6 max-w-2xl"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Sparkles className="w-16 h-16 text-[#FFD27D] drop-shadow-[0_0_20px_#FFD27D]" />
            </motion.div>

            <h1 className="text-5xl sm:text-7xl font-script text-glow-gold text-[#FFD27D]">
              Chúc Mừng Sinh Nhật {birthdayData.recipientName}!
            </h1>

            <p className="text-lg sm:text-xl text-white/80 font-serif-luxury italic leading-relaxed">
              "{birthdayData.subtitleMessage}"
            </p>

            {/* Countdown Badge */}
            <div className="flex gap-4 my-4">
              {[
                { label: 'NGÀY', val: timeLeft.days },
                { label: 'GIỜ', val: timeLeft.hours },
                { label: 'PHÚT', val: timeLeft.minutes },
                { label: 'GIÂY', val: timeLeft.seconds },
              ].map((unit, i) => (
                <div key={i} className="glass-card px-4 py-3 rounded-2xl border border-white/20 min-w-16">
                  <div className="text-2xl font-bold font-mono text-[#FF9BCF]">{unit.val}</div>
                  <div className="text-[10px] tracking-wider text-white/60">{unit.label}</div>
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                soundManager.playWhoosh();
                onNext();
              }}
              className="mt-4 flex items-center gap-3 px-8 py-3.5 rounded-full glass-button text-white text-sm font-semibold cursor-pointer shadow-lg shadow-[#9D7BFF]/30 hover:scale-105 active:scale-95 transition-all"
            >
              <span>Tiếp theo: Hộp Quà Kỳ Diệu</span>
              <ArrowRight className="w-4 h-4 text-[#FFD27D]" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
