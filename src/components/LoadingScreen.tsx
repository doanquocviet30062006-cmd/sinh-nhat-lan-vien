import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { soundManager } from '../utils/audioSynthesizer';

interface LoadingScreenProps {
  recipientName: string;
  onEnter: () => void;
}

const TIPS = [
  "Bật âm thanh để trải nghiệm tốt nhất 🎵",
  "Chuẩn bị một không gian yên tĩnh ✨",
  "Mở toàn màn hình để đắm chìm vào không gian 🌌",
  "Mỗi chi tiết đều mang một thông điệp riêng 💌"
];

export default function LoadingScreen({ recipientName, onEnter }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    const duration = 3000;
    const intervalTime = 30;
    const steps = duration / intervalTime;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      setProgress(Math.min(100, (currentStep / steps) * 100));
      if (currentStep >= steps) {
        clearInterval(timer);
        setLoadingComplete(true);
      }
    }, intervalTime);

    const tipTimer = setInterval(() => {
      setTipIndex(prev => (prev + 1) % TIPS.length);
    }, 2500);

    return () => {
      clearInterval(timer);
      clearInterval(tipTimer);
    };
  }, []);

  const titleText = "The Birthday Universe";
  const titleLetters = titleText.split("");

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#070B1A] overflow-hidden">
      
      {/* Constellation Background Effect (simplified via animated stars) */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 3 + 1 + 'px',
              height: Math.random() * 3 + 1 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
            }}
            animate={{
              opacity: [0.1, 0.8, 0.1],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Pulsing Cosmic Orb */}
      <motion.div 
        className="absolute w-64 h-64 md:w-96 md:h-96 rounded-full blur-[100px] opacity-40 z-0 pointer-events-none mix-blend-screen"
        animate={{
          background: [
            "radial-gradient(circle, #9D7BFF 0%, transparent 70%)",
            "radial-gradient(circle, #FF9BCF 0%, transparent 70%)",
            "radial-gradient(circle, #FFD27D 0%, transparent 70%)",
            "radial-gradient(circle, #9D7BFF 0%, transparent 70%)"
          ],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
      />

      <div className="relative z-10 flex flex-col items-center w-full max-w-2xl px-6">
        
        {/* Title Reveal */}
        <div className="mb-2 flex overflow-hidden">
          {titleLetters.map((letter, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ delay: i * 0.08, duration: 0.8 }}
              className="text-3xl md:text-5xl font-serif-luxury text-white text-glow-purple tracking-widest uppercase"
            >
              {letter === " " ? "\u00A0" : letter}
            </motion.span>
          ))}
        </div>

        {/* Recipient Subtitle */}
        <motion.p
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="text-xl md:text-2xl font-script text-glow-gold mb-12"
        >
          Dành riêng cho {recipientName} ✨
        </motion.p>

        {/* Progress Bar Container */}
        {!loadingComplete ? (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="w-full max-w-md flex flex-col items-center"
          >
            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden relative backdrop-blur-sm">
              <motion.div 
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#9D7BFF] via-[#FF9BCF] to-[#FFD27D] shadow-[0_0_10px_rgba(255,210,125,0.8)]"
                style={{ width: `${progress}%` }}
              />
            </div>
            
            <div className="mt-6 h-6">
              <AnimatePresence mode="wait">
                <motion.p
                  key={tipIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-sm md:text-base text-white/60 font-sans-luxury tracking-wide"
                >
                  {TIPS[tipIndex]}
                </motion.p>
              </AnimatePresence>
            </div>
            <div className="mt-2 text-[#FFD27D] font-mono text-sm">
              {Math.floor(progress)}%
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="mt-8"
          >
            <button 
              onClick={() => {
                soundManager.startContinuousMusic();
                onEnter();
              }}
              className="relative group px-10 py-4 rounded-full overflow-hidden flex items-center gap-3 bg-white/5 backdrop-blur-md border border-white/20 transition-all hover:border-[#FFD27D]/50"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#9D7BFF]/20 via-[#FF9BCF]/20 to-[#FFD27D]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Animated border effect */}
              <div className="absolute inset-0 p-[1px] rounded-full overflow-hidden mask-border pointer-events-none">
                <div className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent_0_340deg,white_360deg)] animate-spin-slow opacity-0 group-hover:opacity-100 mix-blend-overlay" style={{ animationDuration: '3s' }} />
              </div>

              <Sparkles className="w-6 h-6 text-[#FFD27D] group-hover:animate-spin" />
              <span className="text-xl font-sans-luxury text-white font-medium tracking-wider relative z-10">Mở Cánh Cổng Vũ Trụ</span>
              <Sparkles className="w-6 h-6 text-[#FF9BCF] group-hover:animate-spin" />
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
