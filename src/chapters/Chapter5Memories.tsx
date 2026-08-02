import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { soundManager } from '../utils/audioSynthesizer';
import birthdayData from '../data/birthdayData.json';
import { Calendar, MapPin, Sparkles, ArrowRight, Heart, ChevronLeft, ChevronRight } from 'lucide-react';

interface Chapter5MemoriesProps {
  onNext: () => void;
}

export const Chapter5Memories: React.FC<Chapter5MemoriesProps> = ({ onNext }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    soundManager.playChapterSound('memories');
  }, []);

  const memories = birthdayData.memories;
  const currentMemory = memories[activeIndex];

  const handleNextMem = () => {
    soundManager.playChime();
    setActiveIndex((prev) => (prev + 1) % memories.length);
  };

  const handlePrevMem = () => {
    soundManager.playChime();
    setActiveIndex((prev) => (prev - 1 + memories.length) % memories.length);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-between py-12 px-4 overflow-hidden z-10 select-none">
      {/* Glow orb */}
      <div className="absolute top-1/3 right-10 w-[450px] h-[450px] bg-radial from-[#FF9BCF]/15 via-[#9D7BFF]/10 to-transparent blur-3xl pointer-events-none" />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-xl z-10 mt-2"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card border border-[#FF9BCF]/30 text-[#FF9BCF] text-xs font-semibold uppercase tracking-widest mb-3">
          <Heart className="w-3.5 h-3.5 text-[#FFD27D] fill-[#FFD27D]" />
          <span>Chương V: Quần Đảo Kỷ Niệm Kỳ Diệu</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-script text-glow-gold">
          Những Thước Phim Đẹp Nhất
        </h2>
      </motion.div>

      {/* Floating 3D Island Card Showcase */}
      <div className="relative w-full max-w-3xl flex items-center justify-center my-6 z-10">
        <button
          onClick={handlePrevMem}
          className="absolute left-0 sm:-left-6 z-30 p-3 rounded-full glass-button text-white hover:scale-110 active:scale-95 transition-transform"
          aria-label="Kỷ niệm trước"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentMemory.id}
            initial={{ opacity: 0, scale: 0.9, rotateY: 20 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            exit={{ opacity: 0, scale: 0.9, rotateY: -20 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-xl glass-card-premium rounded-3xl overflow-hidden border border-white/20 shadow-2xl flex flex-col"
          >
            {/* Image Frame with Overlay Tag */}
            <div className="relative h-64 sm:h-72 overflow-hidden">
              <img
                src={currentMemory.imageUrl}
                alt={currentMemory.title}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#070B1A] via-transparent to-transparent opacity-85" />

              <div className="absolute top-4 left-4 px-3 py-1 rounded-full glass-card border border-white/20 text-xs font-semibold text-[#FFD27D] flex items-center gap-1.5 shadow-lg">
                <Sparkles className="w-3.5 h-3.5 text-[#FF9BCF]" />
                <span>{currentMemory.tag}</span>
              </div>
            </div>

            {/* Memory Info */}
            <div className="p-6 sm:p-8 flex flex-col gap-3">
              <div className="flex items-center justify-between text-xs text-white/60">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-[#FF9BCF]" />
                  {currentMemory.date}
                </span>
                {currentMemory.location && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-[#FFD27D]" />
                    {currentMemory.location}
                  </span>
                )}
              </div>

              <h3 className="text-2xl font-serif-luxury text-glow-gold text-[#FFD27D]">
                {currentMemory.title}
              </h3>

              <p className="text-white/85 text-sm sm:text-base leading-relaxed font-light">
                {currentMemory.description}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>

        <button
          onClick={handleNextMem}
          className="absolute right-0 sm:-right-6 z-30 p-3 rounded-full glass-button text-white hover:scale-110 active:scale-95 transition-transform"
          aria-label="Kỷ niệm tiếp"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Pagination dots & Next Chapter */}
      <div className="relative z-10 flex flex-col items-center gap-6 mb-2">
        <div className="flex gap-2">
          {memories.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                soundManager.playChime();
                setActiveIndex(idx);
              }}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                activeIndex === idx ? 'w-8 bg-[#FFD27D]' : 'w-2.5 bg-white/30'
              }`}
            />
          ))}
        </div>

        <button
          onClick={() => {
            soundManager.playWhoosh();
            onNext();
          }}
          className="flex items-center gap-3 px-8 py-3.5 rounded-full glass-button text-white text-sm font-semibold cursor-pointer shadow-lg shadow-[#9D7BFF]/30 hover:scale-105 active:scale-95 transition-all"
        >
          <span>Tiếp theo: Bức Thư Tình Cảm</span>
          <ArrowRight className="w-4 h-4 text-[#FFD27D]" />
        </button>
      </div>
    </div>
  );
};
