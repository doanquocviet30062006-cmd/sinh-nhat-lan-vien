import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { soundManager } from '../utils/audioSynthesizer';
import type { WishRecord } from '../types';
import { Flame, ArrowRight, Send } from 'lucide-react';

interface Chapter9WishLanternProps {
  onNext: () => void;
}

export const Chapter9WishLantern: React.FC<Chapter9WishLanternProps> = ({ onNext }) => {
  const [wishInput, setWishInput] = useState('');
  const [launchedWishes, setLaunchedWishes] = useState<WishRecord[]>([]);
  const [isLaunching, setIsLaunching] = useState(false);

  useEffect(() => {
    soundManager.playChapterSound('lantern');
    try {
      const stored = JSON.parse(localStorage.getItem('birthday_universe_wishes') || '[]');
      setLaunchedWishes(stored);
    } catch {
      setLaunchedWishes([]);
    }
  }, []);

  const handleLaunchLantern = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wishInput.trim() || isLaunching) return;

    setIsLaunching(true);
    soundManager.playChime();

    const newRecord: WishRecord = {
      wish: wishInput.trim(),
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    };

    const updated = [newRecord, ...launchedWishes];
    setLaunchedWishes(updated);
    try {
      localStorage.setItem('birthday_universe_wishes', JSON.stringify(updated));
    } catch {
      // storage error handled
    }

    setTimeout(() => {
      setWishInput('');
      setIsLaunching(false);
    }, 2500);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-between py-12 px-4 overflow-hidden z-10 select-none">
      {/* Floating lanterns in background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {launchedWishes.slice(0, 10).map((w, idx) => (
          <motion.div
            key={idx}
            initial={{ y: '105vh', opacity: 0 }}
            animate={{
              y: '-20vh',
              opacity: [0, 0.9, 0.9, 0],
              x: [(idx % 2 === 0 ? 1 : -1) * 30, (idx % 2 === 0 ? -1 : 1) * 30],
            }}
            transition={{
              duration: 18 + idx * 3,
              repeat: Infinity,
              delay: idx * 2,
              ease: 'linear',
            }}
            className="absolute rounded-lg bg-gradient-to-t from-[#FFC857] via-[#FFD27D] to-[#FF9BCF] p-3 shadow-[0_0_20px_#FFD27D] border border-yellow-200/50 flex flex-col items-center justify-center max-w-[160px]"
            style={{ left: `${15 + ((idx * 18) % 70)}%` }}
          >
            <div className="w-2 h-3 rounded-full bg-white blur-[1px] animate-pulse mb-1" />
            <span className="text-[11px] font-handwriting text-[#070B1A] font-bold line-clamp-2 text-center">
              "{w.wish}"
            </span>
          </motion.div>
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
          <span>Chương IX: Đèn Lồng Ước Nguyện Bay Vào Vũ Trụ</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-script text-glow-gold">
          Gửi Điều Ước Lên Những Vì Sao
        </h2>
      </motion.div>

      {/* Main Interactive Form & Lantern Launching */}
      <div className="relative z-10 w-full max-w-xl glass-card-premium rounded-3xl p-6 sm:p-8 border border-[#FFD27D]/40 text-center shadow-2xl flex flex-col items-center gap-6 my-4">
        <p className="text-white/85 text-sm sm:text-base leading-relaxed">
          Hãy viết một lời ước hoặc thông điệp chân thành nhất. Chiếc đèn lồng lung linh sẽ mang ước nguyện của bạn bay vút lên bầu trời đêm và hóa thành vì sao vĩnh cửu.
        </p>

        <form onSubmit={handleLaunchLantern} className="w-full flex flex-col items-center gap-4">
          <div className="relative w-full">
            <textarea
              value={wishInput}
              onChange={(e) => setWishInput(e.target.value)}
              placeholder="Nhập điều ước của bạn tại đây..."
              rows={3}
              maxLength={150}
              className="w-full bg-white/10 border border-[#FFD27D]/40 rounded-2xl p-4 text-white placeholder-white/40 focus:outline-none focus:border-[#FFD27D] font-handwriting text-xl sm:text-2xl resize-none shadow-inner"
            />
            <span className="absolute bottom-3 right-4 text-xs text-white/40">
              {wishInput.length}/150
            </span>
          </div>

          <button
            type="submit"
            disabled={!wishInput.trim() || isLaunching}
            className="w-full py-4 rounded-full glass-button text-white font-semibold text-lg flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_25px_rgba(255,210,125,0.3)] cursor-pointer"
          >
            <Send className="w-5 h-5 text-[#FFD27D]" />
            <span>{isLaunching ? 'Đang thả đèn lồng...' : 'Thả Đèn Lồng Ước Nguyện'}</span>
          </button>
        </form>
      </div>

      {/* Next Chapter Button */}
      <div className="relative z-10 mb-2">
        <button
          onClick={() => {
            soundManager.playWhoosh();
            onNext();
          }}
          className="flex items-center gap-3 px-8 py-3.5 rounded-full glass-button text-white text-sm font-semibold cursor-pointer shadow-lg shadow-[#9D7BFF]/30 hover:scale-105 active:scale-95 transition-all"
        >
          <span>Đến Chương Cuối: Quả Cầu Tuyết Kỳ Diệu</span>
          <ArrowRight className="w-4 h-4 text-[#FFD27D]" />
        </button>
      </div>
    </div>
  );
};
