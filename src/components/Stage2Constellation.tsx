import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ConstellationNode } from '../types';
import { soundManager } from '../utils/audioSynthesizer';
import { Sparkles, Star, ArrowRight } from 'lucide-react';

interface Stage2ConstellationProps {
  constellations: ConstellationNode[];
  onNextStage: () => void;
}

export const Stage2Constellation: React.FC<Stage2ConstellationProps> = ({
  constellations,
  onNextStage,
}) => {
  const [selectedNode, setSelectedNode] = useState<ConstellationNode | null>(
    constellations[0] || null
  );

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center px-4 py-16 z-10 overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-gradient-to-br from-[#9D7BFF]/15 via-[#FFB8D2]/10 to-transparent blur-3xl pointer-events-none" />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8 max-w-2xl z-10"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card border border-[#C8A2FF]/30 text-[#C8A2FF] text-xs font-semibold uppercase tracking-widest mb-4">
          <Star className="w-3.5 h-3.5 text-[#FFD27D]" />
          <span>Vũ Trụ Kỷ Niệm</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-script text-glow-gold mb-3">
          Chòm Sao Tình Bạn
        </h2>
        <p className="text-white/70 text-xs sm:text-sm">
          Chạm vào từng vì sao lấp lánh để đọc những thông điệp kỳ diệu gắn kết đôi ta.
        </p>
      </motion.div>

      {/* Constellation Interactive Map Container */}
      <div className="relative w-full max-w-4xl h-[350px] sm:h-[450px] glass-card rounded-3xl border border-white/10 p-6 mb-8 overflow-hidden">
        {/* SVG Constellation Connection Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {constellations.map((node, i) => {
            const nextNode = constellations[(i + 1) % constellations.length];
            return (
              <line
                key={`line-${node.id}`}
                x1={`${node.x}%`}
                y1={`${node.y}%`}
                x2={`${nextNode.x}%`}
                y2={`${nextNode.y}%`}
                stroke="rgba(255, 210, 125, 0.3)"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                className="animate-pulse"
              />
            );
          })}
        </svg>

        {/* Constellation Star Nodes */}
        {constellations.map((node) => {
          const isSelected = selectedNode?.id === node.id;
          return (
            <motion.button
              key={node.id}
              onClick={() => {
                soundManager.playChime();
                setSelectedNode(node);
              }}
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
              whileHover={{ scale: 1.4 }}
              className="absolute -translate-x-1/2 -translate-y-1/2 p-2 rounded-full cursor-pointer focus:outline-none z-20 group"
            >
              <div
                className={`relative flex items-center justify-center rounded-full transition-all duration-300 ${
                  isSelected
                    ? 'w-7 h-7 bg-[#FFD27D] shadow-[0_0_25px_#FFD27D]'
                    : 'w-5 h-5 bg-[#FF9BCF] group-hover:bg-[#FFD27D] shadow-[0_0_15px_#FF9BCF]'
                }`}
              >
                <Star
                  className={`w-3.5 h-3.5 ${
                    isSelected ? 'text-[#070B1A] fill-[#070B1A]' : 'text-white fill-white'
                  }`}
                />
              </div>

              {/* Node Title Label */}
              <span className="absolute top-7 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] sm:text-xs font-medium text-white/80 group-hover:text-[#FFD27D] transition-colors">
                {node.title}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Selected Star Details Card */}
      <div className="w-full max-w-lg min-h-[120px] mb-8">
        <AnimatePresence mode="wait">
          {selectedNode && (
            <motion.div
              key={selectedNode.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="glass-card rounded-2xl p-6 border border-[#FF9BCF]/30 text-center shadow-xl"
            >
              <h3 className="text-xl font-serif-luxury text-glow-pink mb-2 flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4 text-[#FFD27D]" />
                <span>{selectedNode.title}</span>
              </h3>
              <p className="text-white/90 text-sm sm:text-base font-handwriting text-lg sm:text-xl leading-relaxed text-[#FFD27D]">
                “{selectedNode.quote}”
              </p>
            </motion.div>
          )}
        </AnimatePresence>
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
