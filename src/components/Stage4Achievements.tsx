import React from 'react';
import { motion } from 'framer-motion';
import type { AchievementItem } from '../types';
import { soundManager } from '../utils/audioSynthesizer';
import { Award, ArrowRight } from 'lucide-react';

interface Stage4AchievementsProps {
  achievements: AchievementItem[];
  onNextStage: () => void;
}

export const Stage4Achievements: React.FC<Stage4AchievementsProps> = ({
  achievements,
  onNextStage,
}) => {
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center px-4 py-20 z-10">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/4 w-[400px] h-[400px] bg-gradient-to-br from-[#9D7BFF]/20 via-[#FFD27D]/10 to-transparent blur-3xl pointer-events-none" />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12 max-w-2xl"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card border border-[#FFD27D]/40 text-[#FFD27D] text-xs font-semibold uppercase tracking-widest mb-4">
          <Award className="w-3.5 h-3.5 text-[#FF9BCF]" />
          <span>Bảng Vàng Danh Dự</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-script text-glow-gold mb-3">
          Thành Tựu Tình Bạn
        </h2>
        <p className="text-white/70 text-xs sm:text-sm">
          Những chứng nhận đặc biệt tôn vinh sự tuyệt vời của bạn trong lòng mọi người.
        </p>
      </motion.div>

      {/* Achievement Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl w-full mb-12">
        {achievements.map((ach, idx) => (
          <motion.div
            key={ach.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.12, duration: 0.5 }}
            whileHover={{ scale: 1.03 }}
            className="glass-card glass-card-hover rounded-3xl p-6 border border-[#FFD27D]/30 shadow-xl flex items-start gap-4 relative overflow-hidden group"
          >
            {/* Shiny corner badge */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#FFD27D]/20 to-transparent rounded-bl-full pointer-events-none" />

            {/* Icon Circle */}
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FF9BCF]/30 to-[#9D7BFF]/30 border border-[#FFD27D]/40 flex items-center justify-center text-3xl shadow-lg shrink-0 group-hover:scale-110 transition-transform">
              {ach.icon}
            </div>

            {/* Info */}
            <div className="flex-1">
              <span className="text-[10px] uppercase tracking-wider text-[#FF9BCF] font-bold">
                {ach.category} • {ach.dateAwarded}
              </span>
              <h3 className="text-lg font-serif-luxury text-glow-gold mb-1 mt-0.5">
                {ach.title}
              </h3>
              <p className="text-white/80 text-xs sm:text-sm leading-relaxed">
                {ach.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Next Stage Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          soundManager.playChime();
          onNextStage();
        }}
        className="flex items-center gap-3 px-8 py-3.5 rounded-full glass-button text-white text-sm font-semibold cursor-pointer shadow-lg shadow-[#9D7BFF]/30"
      >
        <span>Mở Bức Thư Chúc Bày</span>
        <ArrowRight className="w-4 h-4 text-[#FFD27D]" />
      </motion.button>
    </div>
  );
};
