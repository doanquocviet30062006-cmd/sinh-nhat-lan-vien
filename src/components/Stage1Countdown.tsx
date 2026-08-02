import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Moon, Star } from 'lucide-react';

interface Stage1CountdownProps {
  targetDate: Date;
  recipientName: string;
  onFinishCountdown: () => void;
}

const QUOTES = [
  "Mỗi khoảnh khắc là một món quà...",
  "Vũ trụ đang chuẩn bị điều kỳ diệu...",
  "Chờ đợi giây phút đặc biệt nhất...",
  "Hành tinh của bạn sắp tỏa sáng...",
  "Một chương mới đang mở ra..."
];

export default function Stage1Countdown({ targetDate, recipientName, onFinishCountdown }: Stage1CountdownProps) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Arbitrary total time for progress ring: 1 week (604800 seconds)
    const TOTAL_SECONDS = 604800;
    
    const calculateTimeLeft = () => {
      const difference = new Date(targetDate).getTime() - new Date().getTime();
      if (difference <= 0) {
        onFinishCountdown();
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }
      
      const secondsLeft = Math.floor(difference / 1000);
      const calculatedProgress = Math.max(0, Math.min(100, ((TOTAL_SECONDS - secondsLeft) / TOTAL_SECONDS) * 100));
      setProgress(calculatedProgress);

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate, onFinishCountdown]);

  useEffect(() => {
    const quoteTimer = setInterval(() => {
      setQuoteIndex(prev => (prev + 1) % QUOTES.length);
    }, 5000);
    return () => clearInterval(quoteTimer);
  }, []);

  const timeUnits = [
    { label: 'NGÀY', value: timeLeft.days },
    { label: 'GIỜ', value: timeLeft.hours },
    { label: 'PHÚT', value: timeLeft.minutes },
    { label: 'GIÂY', value: timeLeft.seconds }
  ];

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen text-center z-10 w-full overflow-hidden">
      {/* Decorative Orbits */}
      <motion.div 
        className="absolute w-[600px] h-[600px] rounded-full border border-dashed border-[#FFD27D]/20 opacity-30 pointer-events-none"
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
      />
      <motion.div 
        className="absolute w-[800px] h-[800px] rounded-full border border-dashed border-[#FF9BCF]/20 opacity-20 pointer-events-none"
        animate={{ rotate: -360 }}
        transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
      />

      {/* Floating Sparkles */}
      <motion.div
        className="absolute pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
      >
        <motion.div className="absolute -top-40 -left-40 text-[#FFD27D]" animate={{ y: [0, -20, 0], opacity: [0.5, 1, 0.5] }} transition={{ duration: 3, repeat: Infinity }}><Star size={24} /></motion.div>
        <motion.div className="absolute top-40 right-60 text-[#FF9BCF]" animate={{ y: [0, 20, 0], opacity: [0.5, 1, 0.5] }} transition={{ duration: 4, repeat: Infinity }}><Moon size={28} /></motion.div>
        <motion.div className="absolute -bottom-40 left-60 text-[#9D7BFF]" animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }} transition={{ duration: 2.5, repeat: Infinity }}><Sparkles size={32} /></motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center"
      >
        <h2 className="text-4xl md:text-5xl font-serif-luxury text-[#FFD27D] mb-4 text-glow-gold tracking-wider">
          Sắp đến ngày đặc biệt của
        </h2>
        <h1 className="text-6xl md:text-8xl font-script text-[#FF9BCF] mb-12 text-glow-pink">
          {recipientName}
        </h1>

        {/* Circular Progress Indicator behind countdown */}
        <div className="relative w-full max-w-4xl mx-auto flex justify-center items-center py-10">
          <svg className="absolute w-[400px] h-[400px] md:w-[600px] md:h-[600px] -z-10 opacity-20 transform -rotate-90 pointer-events-none">
            <circle cx="50%" cy="50%" r="48%" stroke="#0C1633" strokeWidth="4" fill="none" />
            <motion.circle 
              cx="50%" cy="50%" r="48%" 
              stroke="url(#gradient)" 
              strokeWidth="4" 
              fill="none"
              strokeDasharray="300%"
              strokeDashoffset={`${300 - (progress * 3)}%`}
              strokeLinecap="round"
              initial={{ strokeDashoffset: "300%" }}
              animate={{ strokeDashoffset: `${300 - (progress * 3)}%` }}
              transition={{ duration: 1, ease: "easeInOut" }}
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFD27D" />
                <stop offset="50%" stopColor="#FF9BCF" />
                <stop offset="100%" stopColor="#9D7BFF" />
              </linearGradient>
            </defs>
          </svg>

          <div className="flex items-center justify-center gap-2 md:gap-6">
            {timeUnits.map((unit, index) => (
              <React.Fragment key={unit.label}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.15 + 0.5, type: "spring" }}
                  className="relative group"
                >
                  <div className="absolute inset-0 bg-[#9D7BFF]/20 rounded-xl blur-xl group-hover:bg-[#FFD27D]/30 transition-all duration-500 rounded-full animate-glow-pulse" />
                  <div className="glass-card-premium w-20 h-24 md:w-32 md:h-36 flex flex-col items-center justify-center relative overflow-hidden backdrop-blur-md rounded-2xl border border-white/10 hover:border-[#FFD27D]/50 transition-colors">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent z-0" />
                    
                    <motion.span 
                      key={unit.value}
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      className="text-4xl md:text-6xl font-sans-luxury font-bold text-white z-10 text-glow-gold-strong"
                    >
                      {unit.value.toString().padStart(2, '0')}
                    </motion.span>
                    <span className="text-xs md:text-sm tracking-widest text-[#FFB8D2] mt-2 z-10 font-medium">
                      {unit.label}
                    </span>
                  </div>
                </motion.div>
                
                {index < timeUnits.length - 1 && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="text-3xl md:text-5xl text-[#FFD27D] font-bold animate-pulse text-glow-gold flex items-center justify-center pb-8"
                  >
                    :
                  </motion.div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="h-16 mt-8">
          <AnimatePresence mode="wait">
            <motion.p
              key={quoteIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.8 }}
              className="text-lg md:text-xl text-white/80 font-serif-luxury italic"
            >
              {QUOTES[quoteIndex]}
            </motion.p>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
