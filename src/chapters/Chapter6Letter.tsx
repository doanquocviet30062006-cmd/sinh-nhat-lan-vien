import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { soundManager } from '../utils/audioSynthesizer';
import birthdayData from '../data/birthdayData.json';
import { Heart, ArrowRight, Award, Mail } from 'lucide-react';

interface Chapter6LetterProps {
  onNext: () => void;
}

export const Chapter6Letter: React.FC<Chapter6LetterProps> = ({ onNext }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSealBroken, setIsSealBroken] = useState(false);
  const [activeTab, setActiveTab] = useState<'letter' | 'achievements'>('letter');

  useEffect(() => {
    soundManager.playChapterSound('letter');
  }, []);

  const handleBreakSeal = () => {
    if (isSealBroken) return;
    setIsSealBroken(true);
    soundManager.playPageFlip();
    setTimeout(() => {
      setIsOpen(true);
      soundManager.playChime();
    }, 800);
  };

  const letter = birthdayData.letter;
  const achievements = birthdayData.achievements;

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-between py-12 px-4 overflow-hidden z-10 select-none">
      {/* Floating Petals */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-[#FF9BCF]/40"
            style={{
              width: Math.random() * 12 + 6 + 'px',
              height: Math.random() * 12 + 6 + 'px',
              left: `${Math.random() * 100}%`,
              top: `-20px`,
              borderRadius: '50% 0 50% 50%',
            }}
            animate={{
              y: ['0vh', '105vh'],
              x: [0, (Math.random() - 0.5) * 80, 0],
              rotate: [0, 360],
            }}
            transition={{
              duration: Math.random() * 12 + 10,
              repeat: Infinity,
              delay: Math.random() * 10,
              ease: 'linear',
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
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card border border-[#FF9BCF]/30 text-[#FF9BCF] text-xs font-semibold uppercase tracking-widest mb-3">
          <Mail className="w-3.5 h-3.5 text-[#FFD27D]" />
          <span>Chương VI: Bức Thư & Bảng Vàng Danh Dự</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-script text-glow-gold">
          Thông Điệp Từ Trái Tim
        </h2>
      </motion.div>

      {/* Envelope & Letter Container */}
      <div className="relative w-full max-w-3xl flex items-center justify-center my-6 z-10">
        <AnimatePresence mode="wait">
          {!isOpen ? (
            <motion.div
              key="envelope"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.1, opacity: 0 }}
              className="relative cursor-pointer group w-full max-w-lg h-72 glass-card-premium rounded-3xl border-2 border-[#FFD27D]/40 shadow-2xl flex flex-col items-center justify-center p-6"
              onClick={handleBreakSeal}
            >
              {/* Wax Seal */}
              <motion.div
                animate={{ scale: isSealBroken ? [1, 1.4, 0] : [1, 1.08, 1] }}
                transition={{ duration: isSealBroken ? 0.6 : 2, repeat: isSealBroken ? 0 : Infinity }}
                className="w-20 h-20 rounded-full bg-gradient-to-br from-red-700 to-red-900 border-2 border-[#FFD27D] shadow-2xl flex items-center justify-center z-20"
              >
                <Heart className="w-10 h-10 text-[#FFD27D] fill-[#FFD27D]" />
              </motion.div>

              <p className="mt-6 text-[#FFD27D] font-serif-luxury text-lg tracking-wider animate-pulse">
                Chạm vào con dấu sáp để mở lá thư ✨
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="letter-content"
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="w-full max-w-2xl glass-card-premium rounded-3xl p-6 sm:p-10 border border-[#FFD27D]/40 shadow-2xl flex flex-col gap-6"
            >
              {/* Tab Switcher */}
              <div className="flex justify-center gap-2 p-1.5 rounded-full glass-card border border-white/10 self-center">
                <button
                  onClick={() => setActiveTab('letter')}
                  className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-semibold transition-all ${
                    activeTab === 'letter'
                      ? 'bg-gradient-to-r from-[#FF9BCF] to-[#9D7BFF] text-white shadow-md'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Bức Thư Chúc Mừng</span>
                </button>
                <button
                  onClick={() => setActiveTab('achievements')}
                  className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-semibold transition-all ${
                    activeTab === 'achievements'
                      ? 'bg-gradient-to-r from-[#FF9BCF] to-[#9D7BFF] text-white shadow-md'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>Bảng Vàng Thành Tựu</span>
                </button>
              </div>

              {/* Letter View */}
              {activeTab === 'letter' && (
                <div className="flex flex-col gap-4 text-left font-serif-luxury leading-relaxed">
                  <h3 className="text-2xl sm:text-3xl font-script text-[#FF9BCF] text-glow-pink">
                    {letter.salutation}
                  </h3>

                  {letter.paragraphs.map((para, idx) => (
                    <p key={idx} className="text-white/90 text-sm sm:text-base font-light">
                      {para}
                    </p>
                  ))}

                  <div className="mt-4 pt-4 border-t border-white/10 flex flex-col items-end">
                    <span className="text-sm text-[#FFD27D] italic">{letter.closing}</span>
                    <span className="text-2xl font-handwriting text-[#9D7BFF] text-glow-purple mt-1">
                      {letter.signature}
                    </span>
                  </div>
                </div>
              )}

              {/* Achievements View */}
              {activeTab === 'achievements' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                  {achievements.map((ach) => (
                    <div
                      key={ach.id}
                      className="glass-card rounded-2xl p-4 border border-[#FFD27D]/30 flex items-start gap-3"
                    >
                      <span className="text-2xl p-2 rounded-xl bg-white/10">{ach.icon}</span>
                      <div>
                        <span className="text-[10px] text-[#FF9BCF] uppercase font-bold tracking-wider">
                          {ach.category}
                        </span>
                        <h4 className="text-sm font-bold text-[#FFD27D]">{ach.title}</h4>
                        <p className="text-xs text-white/75 mt-1 leading-snug">{ach.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Next Button */}
      <div className="relative z-10 mb-2">
        <button
          onClick={() => {
            soundManager.playWhoosh();
            onNext();
          }}
          className="flex items-center gap-3 px-8 py-3.5 rounded-full glass-button text-white text-sm font-semibold cursor-pointer shadow-lg shadow-[#9D7BFF]/30 hover:scale-105 active:scale-95 transition-all"
        >
          <span>Tiếp theo: Bánh Sinh Nhật & Thổi Nến</span>
          <ArrowRight className="w-4 h-4 text-[#FFD27D]" />
        </button>
      </div>
    </div>
  );
};
