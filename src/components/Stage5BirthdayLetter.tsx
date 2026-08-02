import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, Heart, Sparkles, Star } from 'lucide-react';
import { soundManager } from '../utils/audioSynthesizer';

interface Stage5BirthdayLetterProps {
  letter: {
    salutation: string;
    paragraphs: string[];
    closing: string;
    signature: string;
  };
  onNextStage: () => void;
}

export default function Stage5BirthdayLetter({ letter, onNextStage }: Stage5BirthdayLetterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSealBroken, setIsSealBroken] = useState(false);
  const [displayedText, setDisplayedText] = useState<{salutation: string, paras: string[], closing: string, signature: string}>({
    salutation: '', paras: letter.paragraphs.map(() => ''), closing: '', signature: ''
  });
  const [typingPhase, setTypingPhase] = useState<'idle' | 'salutation' | 'paras' | 'closing' | 'signature' | 'done'>('idle');
  const [currentParaIndex, setCurrentParaIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTypingPhase('salutation');
      soundManager.startAmbient();
    }
  }, [isOpen]);

  useEffect(() => {
    if (typingPhase === 'salutation') {
      let i = 0;
      const interval = setInterval(() => {
        setDisplayedText(prev => ({ ...prev, salutation: letter.salutation.substring(0, i + 1) }));
        i++;
        if (i >= letter.salutation.length) {
          clearInterval(interval);
          setTimeout(() => setTypingPhase('paras'), 500);
        }
      }, 50);
      return () => clearInterval(interval);
    } 
    else if (typingPhase === 'paras') {
      let i = 0;
      const currentFullText = letter.paragraphs[currentParaIndex];
      const interval = setInterval(() => {
        setDisplayedText(prev => {
          const newParas = [...prev.paras];
          newParas[currentParaIndex] = currentFullText.substring(0, i + 1);
          return { ...prev, paras: newParas };
        });
        i++;
        if (i >= currentFullText.length) {
          clearInterval(interval);
          if (currentParaIndex < letter.paragraphs.length - 1) {
            setTimeout(() => setCurrentParaIndex(p => p + 1), 600);
          } else {
            setTimeout(() => setTypingPhase('closing'), 800);
          }
        }
      }, 40); // typing speed
      return () => clearInterval(interval);
    }
    else if (typingPhase === 'closing') {
      let i = 0;
      const interval = setInterval(() => {
        setDisplayedText(prev => ({ ...prev, closing: letter.closing.substring(0, i + 1) }));
        i++;
        if (i >= letter.closing.length) {
          clearInterval(interval);
          setTimeout(() => setTypingPhase('signature'), 1000);
        }
      }, 50);
      return () => clearInterval(interval);
    }
    else if (typingPhase === 'signature') {
      setDisplayedText(prev => ({ ...prev, signature: letter.signature }));
      setTimeout(() => setTypingPhase('done'), 1500);
    }
  }, [typingPhase, currentParaIndex, letter]);

  const handleOpenEnvelope = () => {
    setIsSealBroken(true);
    setTimeout(() => {
      setIsOpen(true);
    }, 800);
  };

  // Generate random petals
  const petals = Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 5,
    duration: 10 + Math.random() * 10,
    size: 10 + Math.random() * 15,
  }));

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen w-full p-4 overflow-hidden" ref={containerRef}>
      
      {/* Falling Petals */}
      {isOpen && petals.map(petal => (
        <motion.div
          key={petal.id}
          className="absolute top-[-50px] pointer-events-none"
          initial={{ x: `${petal.x}vw`, y: -50, rotate: 0, opacity: 0 }}
          animate={{ 
            y: '100vh', 
            rotate: 360, 
            opacity: [0, 1, 1, 0],
            x: `${petal.x + (Math.random() * 20 - 10)}vw` 
          }}
          transition={{ duration: petal.duration, delay: petal.delay, repeat: Infinity, ease: 'linear' }}
        >
          <svg width={petal.size} height={petal.size} viewBox="0 0 24 24" fill="#FFB8D2" className="opacity-60 drop-shadow-md">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </motion.div>
      ))}

      <AnimatePresence mode="wait">
        {!isOpen ? (
          <motion.div
            key="envelope"
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 1.1, opacity: 0, y: -50 }}
            transition={{ duration: 0.8, type: "spring" }}
            className="relative cursor-pointer group w-full max-w-2xl h-[400px] flex items-center justify-center"
            onClick={handleOpenEnvelope}
          >
            {/* Sparkles around envelope */}
            <motion.div className="absolute inset-0 pointer-events-none" animate={{ rotate: 360 }} transition={{ duration: 50, repeat: Infinity, ease: "linear" }}>
              <Sparkles className="absolute top-10 left-10 text-[#FFD27D] w-6 h-6 animate-pulse" />
              <Sparkles className="absolute bottom-20 right-10 text-[#FF9BCF] w-8 h-8 animate-pulse" />
              <Star className="absolute top-1/2 left-4 text-[#9D7BFF] w-5 h-5 animate-pulse" />
            </motion.div>

            {/* Envelope Body */}
            <div className="relative w-full max-w-xl h-64 bg-[#e8e2d2] rounded-md shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-visible perspective-[1000px]">
              
              {/* Paper Texture Overlay */}
              <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIiAvPgo8cGF0aCBkPSJNMCAwTDggOFpNOCAwTDAgOFoiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgLz4KPC9zdmc+')] mix-blend-multiply" />

              {/* Envelope Flap */}
              <motion.div
                className="absolute top-0 left-0 right-0 h-1/2 bg-[#dcd4c0] origin-top z-20 shadow-md flex justify-center"
                style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }}
                animate={{ rotateX: isSealBroken ? 180 : 0 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              />

              {/* Bottom fold */}
              <div 
                className="absolute bottom-0 left-0 right-0 h-2/3 bg-[#f4ebd8] z-10"
                style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 0, 50% 30%, 0 0)' }}
              />

              {/* Left & Right folds */}
              <div className="absolute inset-0 z-0">
                <div className="absolute top-0 left-0 bottom-0 w-1/2 bg-[#e0d8c4]" style={{ clipPath: 'polygon(0 0, 100% 50%, 0 100%)' }} />
                <div className="absolute top-0 right-0 bottom-0 w-1/2 bg-[#e0d8c4]" style={{ clipPath: 'polygon(100% 0, 0 50%, 100% 100%)' }} />
              </div>

              {/* Wax Seal */}
              <AnimatePresence>
                {!isSealBroken && (
                  <motion.div
                    exit={{ scale: 1.5, opacity: 0, filter: 'blur(10px)' }}
                    transition={{ duration: 0.5 }}
                    className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 flex items-center justify-center w-16 h-16 bg-red-800 rounded-full shadow-lg border-2 border-red-900 group-hover:scale-110 transition-transform"
                  >
                    <div className="absolute inset-1 rounded-full border border-red-700/50" />
                    <Heart className="text-[#FFD27D] w-6 h-6 fill-[#FFD27D]" />
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="absolute -bottom-16 w-full text-center">
                <span className="text-[#FFD27D] font-serif-luxury text-glow-gold text-xl animate-pulse">Chạm vào phong thư để mở</span>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="letter"
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, type: "spring" }}
            className="relative z-10 w-full max-w-3xl glass-card-premium p-8 md:p-12 text-[#FFD27D]"
          >
            {/* Ambient Music Note Indicator */}
            <motion.div 
              className="absolute top-6 right-6 text-[#9D7BFF] opacity-50"
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Music className="w-6 h-6" />
            </motion.div>

            <div className="font-serif-luxury text-lg md:text-xl leading-relaxed space-y-6 min-h-[40vh]">
              <h3 className="text-3xl md:text-4xl font-script text-[#FF9BCF] text-glow-pink mb-8">
                {displayedText.salutation}
                {typingPhase === 'salutation' && <span className="animate-pulse">|</span>}
              </h3>

              {displayedText.paras.map((para, idx) => (
                <p key={idx} className="text-white/90">
                  {para}
                  {typingPhase === 'paras' && currentParaIndex === idx && <span className="animate-pulse text-[#FF9BCF]">|</span>}
                </p>
              ))}

              <div className="pt-8">
                <p className="text-right text-[#FFD27D]">
                  {displayedText.closing}
                  {typingPhase === 'closing' && <span className="animate-pulse">|</span>}
                </p>
                {typingPhase === 'signature' || typingPhase === 'done' ? (
                  <motion.h4 
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-right text-4xl md:text-5xl font-handwriting text-[#9D7BFF] mt-4 text-glow-purple"
                  >
                    {/* Simulated hand-drawn signature effect */}
                    <motion.span
                      initial={{ opacity: 0, clipPath: "inset(0 100% 0 0)" }}
                      animate={{ opacity: 1, clipPath: "inset(0 0% 0 0)" }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                    >
                      {displayedText.signature}
                    </motion.span>
                  </motion.h4>
                ) : null}
              </div>
            </div>

            <AnimatePresence>
              {typingPhase === 'done' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1, duration: 0.8 }}
                  className="mt-12 flex justify-center"
                >
                  <button onClick={onNextStage} className="glass-button text-lg px-8 py-3 rounded-full flex items-center gap-3 group">
                    <span>Mở Quà Bí Mật</span>
                    <Heart className="w-5 h-5 text-[#FF9BCF] group-hover:fill-[#FF9BCF] transition-all" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
