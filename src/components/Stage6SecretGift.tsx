import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Heart, Crown, Music, Wind } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundManager } from '../utils/audioSynthesizer';

interface Stage6SecretGiftProps {
  secretGift: {
    wishTitle: string;
    wishMessage: string;
    giftBoxTitle: string;
    giftBoxSurprise: string;
  };
  onNextStage: () => void;
}

export default function Stage6SecretGift({ secretGift, onNextStage }: Stage6SecretGiftProps) {
  const [phase, setPhase] = useState<'cake' | 'make-wish' | 'wish-sent' | 'gift' | 'opened'>('cake');
  const [candlesBlown, setCandlesBlown] = useState(false);
  const [wishText, setWishText] = useState('');

  const handleBlowCandles = () => {
    setCandlesBlown(true);
    soundManager.playChime();
    setTimeout(() => {
      setPhase('make-wish');
    }, 2500);
  };

  const handleMakeWish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wishText.trim()) return;

    // Save wish locally
    try {
      const existing = JSON.parse(localStorage.getItem('birthday_universe_wishes') || '[]');
      existing.push({
        wish: wishText.trim(),
        time: new Date().toLocaleString('vi-VN')
      });
      localStorage.setItem('birthday_universe_wishes', JSON.stringify(existing));
    } catch {
      // ignore storage error
    }

    setPhase('wish-sent');
    setTimeout(() => {
      setPhase('gift');
    }, 3000);
  };

  const handleOpenGift = () => {
    setPhase('opened');
    soundManager.playFireworkSound();
    
    // Confetti explosion sequence
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#FFD27D', '#FF9BCF', '#9D7BFF']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#FFD27D', '#FF9BCF', '#9D7BFF']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  const renderCake = () => (
    <motion.div 
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 1.1, opacity: 0, filter: 'blur(10px)' }}
      transition={{ duration: 1 }}
      className="flex flex-col items-center justify-center relative w-full max-w-md mx-auto py-20"
    >
      <h2 className="text-4xl font-script text-[#FF9BCF] text-glow-pink mb-12 text-center">
        Hãy thổi nến nhé!
      </h2>

      <div className="relative w-64 h-64 flex flex-col items-center justify-end">
        {/* Candles */}
        <div className="absolute top-10 flex gap-4 z-20 w-48 justify-center">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="relative w-3 h-12 bg-gradient-to-t from-orange-200 to-white rounded-t-sm shadow-sm">
              {/* Flame */}
              <AnimatePresence>
                {!candlesBlown && (
                  <motion.div
                    exit={{ scale: 0, opacity: 0, y: -10 }}
                    className="absolute -top-6 left-1/2 -translate-x-1/2 w-4 h-6 bg-gradient-to-t from-yellow-500 via-orange-400 to-transparent rounded-full blur-[1px] animate-pulse origin-bottom"
                    style={{ animationDuration: `${0.5 + Math.random() * 0.5}s` }}
                  >
                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-2 h-3 bg-white rounded-full opacity-80" />
                  </motion.div>
                )}
              </AnimatePresence>
              {/* Smoke */}
              <AnimatePresence>
                {candlesBlown && (
                  <motion.div
                    initial={{ opacity: 0, y: 0 }}
                    animate={{ opacity: [0, 0.5, 0], y: -50, x: (Math.random() - 0.5) * 20 }}
                    transition={{ duration: 2, ease: "easeOut" }}
                    className="absolute -top-2 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-400 rounded-full blur-[2px]"
                  />
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* Cake Tiers */}
        <div className="w-32 h-12 bg-gradient-to-b from-[#FFB8D2] to-[#FF9BCF] rounded-t-xl z-10 border-t-4 border-white/50 shadow-inner relative overflow-hidden">
          <div className="absolute w-full h-4 bg-white/30 top-0 rounded-b-lg opacity-50 border-b-2 border-dashed border-white" />
        </div>
        <div className="w-48 h-16 bg-gradient-to-b from-[#C8A2FF] to-[#9D7BFF] rounded-t-xl z-10 border-t-4 border-white/50 shadow-inner relative overflow-hidden">
          <div className="absolute w-full h-5 bg-white/30 top-0 rounded-b-xl opacity-50" style={{ backgroundImage: 'radial-gradient(circle, white 2px, transparent 2px)', backgroundSize: '10px 10px' }} />
        </div>
        <div className="w-64 h-20 bg-gradient-to-b from-[#FFD27D] to-[#FFC857] rounded-t-xl rounded-b-md z-10 border-t-4 border-white/50 shadow-[0_10px_20px_rgba(0,0,0,0.5)] relative overflow-hidden">
          <div className="absolute inset-0 opacity-20" style={{ background: 'repeating-linear-gradient(45deg, transparent, transparent 10px, white 10px, white 20px)' }} />
        </div>
      </div>

      {!candlesBlown && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleBlowCandles}
          className="mt-12 glass-button px-8 py-3 flex items-center gap-2 rounded-full text-lg"
        >
          <Wind className="w-5 h-5 text-white" />
          <span>Thổi nến</span>
        </motion.button>
      )}
    </motion.div>
  );

  const renderMakeWish = () => (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="w-full max-w-xl mx-auto flex flex-col items-center glass-card-premium p-10"
    >
      <h3 className="text-3xl font-serif-luxury text-[#FFD27D] text-glow-gold mb-6">{secretGift.wishTitle}</h3>
      <p className="text-white/80 text-center mb-8">{secretGift.wishMessage}</p>
      
      <form onSubmit={handleMakeWish} className="w-full flex flex-col items-center">
        <textarea
          value={wishText}
          onChange={(e) => setWishText(e.target.value)}
          placeholder="Nhập điều ước của bạn..."
          className="w-full h-32 bg-white/5 border border-[#FFD27D]/30 rounded-xl p-4 text-white placeholder-white/30 focus:outline-none focus:border-[#FFD27D] transition-colors resize-none mb-6 font-handwriting text-2xl"
        />
        <button type="submit" disabled={!wishText.trim()} className="glass-button px-8 py-3 rounded-full text-lg disabled:opacity-50 disabled:cursor-not-allowed">
          Gửi Điều Ước ✨
        </button>
      </form>
    </motion.div>
  );

  const renderWishSent = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center h-[50vh]"
    >
      <motion.div
        initial={{ y: 50, opacity: 1, scale: 1 }}
        animate={{ y: -200, opacity: 0, scale: 0.5, filter: 'blur(10px)' }}
        transition={{ duration: 2.5, ease: "easeIn" }}
        className="text-2xl font-handwriting text-[#FFD27D] text-glow-gold mb-8"
      >
        "{wishText}"
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-xl text-[#FF9BCF] font-serif-luxury mt-8"
      >
        Điều ước của bạn đã được gửi đến vũ trụ! ✨
      </motion.p>
    </motion.div>
  );

  const renderGiftBox = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center relative z-10 w-full"
    >
      <h2 className="text-4xl font-script text-[#9D7BFF] text-glow-purple mb-12">{secretGift.giftBoxTitle}</h2>
      
      <div className="relative w-64 h-64 cursor-pointer group" onClick={handleOpenGift}>
        {/* Glow behind box */}
        <div className="absolute inset-0 bg-[#FFD27D]/20 blur-3xl rounded-full group-hover:bg-[#FFD27D]/40 transition-colors animate-pulse" />
        
        {/* Box Lid */}
        <motion.div 
          className="absolute top-8 left-1/2 -translate-x-1/2 w-48 h-12 bg-gradient-to-r from-red-600 to-red-500 rounded-sm z-20 shadow-lg border-2 border-red-700 flex justify-center"
          animate={{ y: [0, -5, 0], rotate: [0, 2, -2, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {/* Ribbon vertical on lid */}
          <div className="w-8 h-full bg-[#FFD27D] shadow-sm" />
          {/* Bow */}
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex">
            <div className="w-12 h-12 border-4 border-[#FFD27D] rounded-full translate-x-3 rotate-45" />
            <div className="w-12 h-12 border-4 border-[#FFD27D] rounded-full -translate-x-3 -rotate-45" />
          </div>
        </motion.div>

        {/* Box Body */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-44 h-36 bg-gradient-to-b from-red-700 to-red-800 rounded-b-md z-10 shadow-2xl border border-red-900 flex justify-center overflow-hidden">
          {/* Ribbon vertical */}
          <div className="w-8 h-full bg-[#FFD27D] shadow-sm" />
          {/* Ribbon horizontal */}
          <div className="absolute top-1/2 -translate-y-1/2 w-full h-8 bg-[#FFD27D] shadow-sm" />
        </div>
      </div>
      
      <p className="mt-8 text-white/70 animate-bounce">Chạm vào hộp quà để mở!</p>
    </motion.div>
  );

  const renderOpenedGift = () => {
    const items = [
      { id: 1, icon: Star, color: 'text-[#FFD27D]', label: 'Ngôi Sao May Mắn' },
      { id: 2, icon: Heart, color: 'text-[#FF9BCF]', label: 'Tình Yêu Thương' },
      { id: 3, icon: Crown, color: 'text-[#9D7BFF]', label: 'Sự Tự Tin' }
    ];

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center w-full max-w-4xl"
      >
        <h2 className="text-5xl font-serif-luxury text-[#FFD27D] text-glow-gold mb-16">{secretGift.giftBoxSurprise}</h2>
        
        <div className="flex flex-wrap justify-center gap-8 md:gap-16 mb-16">
          {items.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 100, scale: 0.5 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: index * 0.5, type: 'spring', bounce: 0.5 }}
                className="flex flex-col items-center gap-4"
              >
                <div className="w-24 h-24 md:w-32 md:h-32 glass-card-premium rounded-full flex items-center justify-center animate-float" style={{ animationDelay: `${index * 0.2}s` }}>
                  <Icon className={`w-12 h-12 md:w-16 md:h-16 ${item.color} drop-shadow-[0_0_15px_currentColor]`} />
                </div>
                <span className={`font-medium text-lg ${item.color}`}>{item.label}</span>
              </motion.div>
            );
          })}
        </div>

        <div className="flex flex-col sm:flex-row gap-6 mt-8">
          <button 
            onClick={() => {
              soundManager.playChime();
            }} 
            className="glass-button px-6 py-3 rounded-full flex items-center gap-2 group"
          >
            <Music className="w-5 h-5 text-[#FF9BCF] group-hover:scale-110 transition-transform" />
            <span>🎵 Bấm nghe nhạc chúc mừng</span>
          </button>
          
          <button 
            onClick={onNextStage} 
            className="glass-button px-8 py-3 rounded-full text-white hover:bg-white/10"
          >
            Tiếp Tục Cuộc Hành Trình
          </button>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4">
      <AnimatePresence mode="wait">
        {phase === 'cake' && <motion.div key="cake" className="w-full">{renderCake()}</motion.div>}
        {phase === 'make-wish' && <motion.div key="make-wish" className="w-full">{renderMakeWish()}</motion.div>}
        {phase === 'wish-sent' && <motion.div key="wish-sent" className="w-full">{renderWishSent()}</motion.div>}
        {phase === 'gift' && <motion.div key="gift" className="w-full">{renderGiftBox()}</motion.div>}
        {phase === 'opened' && <motion.div key="opened" className="w-full">{renderOpenedGift()}</motion.div>}
      </AnimatePresence>
    </div>
  );
}
