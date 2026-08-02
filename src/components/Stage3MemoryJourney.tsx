import React from 'react';
import { motion } from 'framer-motion';
import type { MemoryItem } from '../types';
import { soundManager } from '../utils/audioSynthesizer';
import { Calendar, MapPin, Sparkles, ArrowRight, Heart } from 'lucide-react';

interface Stage3MemoryJourneyProps {
  memories: MemoryItem[];
  onNextStage: () => void;
}

export const Stage3MemoryJourney: React.FC<Stage3MemoryJourneyProps> = ({
  memories,
  onNextStage,
}) => {
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center px-4 py-20 z-10">
      {/* Glow orb */}
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-gradient-to-tr from-[#FF9BCF]/15 via-[#9D7BFF]/15 to-transparent blur-3xl pointer-events-none" />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12 max-w-2xl"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card border border-[#FF9BCF]/30 text-[#FF9BCF] text-xs font-semibold uppercase tracking-widest mb-4">
          <Heart className="w-3.5 h-3.5 text-[#FFD27D] fill-[#FFD27D]" />
          <span>Hành Trình Kỷ Niệm</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-script text-glow-gold mb-3">
          Những Thước Phim Đẹp Nhất
        </h2>
        <p className="text-white/70 text-xs sm:text-sm">
          Mỗi khoảnh khắc trôi qua đều là một mảnh ghép vô giá đong đầy yêu thương.
        </p>
      </motion.div>

      {/* Memories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl w-full mb-12">
        {memories.map((mem, idx) => (
          <motion.div
            key={mem.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.15, duration: 0.6 }}
            whileHover={{ y: -8 }}
            className="glass-card glass-card-hover rounded-3xl overflow-hidden border border-white/15 shadow-2xl flex flex-col group"
          >
            {/* Image Frame */}
            <div className="relative h-56 sm:h-64 overflow-hidden">
              <img
                src={mem.imageUrl}
                alt={mem.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#070B1A] via-transparent to-transparent opacity-80" />

              {/* Tag Badge */}
              <div className="absolute top-4 left-4 px-3 py-1 rounded-full glass-card border border-white/20 text-xs font-semibold text-[#FFD27D] flex items-center gap-1.5 shadow-lg">
                <Sparkles className="w-3 h-3 text-[#FF9BCF]" />
                <span>{mem.tag}</span>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs text-white/60 mb-2">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#FF9BCF]" />
                    {mem.date}
                  </span>
                  {mem.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#FFD27D]" />
                      {mem.location}
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-serif-luxury text-glow-gold mb-2 group-hover:text-[#FF9BCF] transition-colors">
                  {mem.title}
                </h3>

                <p className="text-white/80 text-sm leading-relaxed mb-4">
                  {mem.description}
                </p>
              </div>
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
        <span>Bảng Vàng Thành Tựu</span>
        <ArrowRight className="w-4 h-4 text-[#FFD27D]" />
      </motion.button>
    </div>
  );
};
