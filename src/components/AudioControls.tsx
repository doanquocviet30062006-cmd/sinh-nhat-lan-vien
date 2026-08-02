import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Sparkles, Eye, X } from 'lucide-react';
import { soundManager } from '../utils/audioSynthesizer';
import { motion, AnimatePresence } from 'framer-motion';

interface WishRecord {
  wish: string;
  time: string;
}

interface AudioControlsProps {
  onSparkleClick?: () => void;
}

export const AudioControls: React.FC<AudioControlsProps> = ({ onSparkleClick }) => {
  const [isMuted, setIsMuted] = useState(soundManager.getMuted());
  const [showSecretModal, setShowSecretModal] = useState(false);
  const [, setClickTracker] = useState(0);
  const [savedWishes, setSavedWishes] = useState<WishRecord[]>([]);

  // Keyboard shortcut Ctrl + Shift + W to open secret wish log
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && (e.key === 'W' || e.key === 'w')) {
        e.preventDefault();
        openSecretModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const openSecretModal = () => {
    try {
      const stored = JSON.parse(localStorage.getItem('birthday_universe_wishes') || '[]');
      setSavedWishes(stored);
    } catch {
      setSavedWishes([]);
    }
    setShowSecretModal(true);
    soundManager.playChime();
  };

  const handleToggleSound = () => {
    // Secret triple click trigger
    setClickTracker((prev) => {
      const next = prev + 1;
      if (next >= 3) {
        openSecretModal();
        return 0;
      }
      return next;
    });

    const nextMuteState = soundManager.toggleMute();
    setIsMuted(nextMuteState);
    if (!nextMuteState) {
      soundManager.playChime();
    }
  };

  return (
    <>
      <div className="fixed top-5 right-5 z-50 flex items-center gap-3">
        {onSparkleClick && (
          <button
            onClick={() => {
              soundManager.playChime();
              onSparkleClick();
            }}
            className="p-3 rounded-full glass-button text-[#FFD27D] hover:scale-110 active:scale-95 transition-all duration-300 shadow-lg cursor-pointer"
            title="Tạo hiệu ứng lấp lánh"
          >
            <Sparkles className="w-5 h-5 animate-pulse" />
          </button>
        )}

        <button
          onClick={handleToggleSound}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full glass-button text-white text-sm font-medium hover:scale-105 active:scale-95 transition-all duration-300 shadow-xl cursor-pointer"
          title={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
        >
          {isMuted ? (
            <>
              <VolumeX className="w-4 h-4 text-gray-400" />
              <span className="text-gray-300 text-xs hidden sm:inline">Âm thanh: Tắt</span>
            </>
          ) : (
            <>
              <Volume2 className="w-4 h-4 text-[#FF9BCF] animate-bounce" />
              <span className="text-[#FFD27D] text-xs font-semibold hidden sm:inline">Âm thanh: Bật</span>
            </>
          )}
        </button>
      </div>

      {/* Secret Wish Viewer Modal */}
      <AnimatePresence>
        {showSecretModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-lg glass-card-premium rounded-3xl p-6 border border-[#FFD27D]/40 text-white shadow-2xl"
            >
              <button
                onClick={() => setShowSecretModal(false)}
                className="absolute top-4 right-4 p-2 rounded-full glass-button text-gray-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 text-[#FFD27D] mb-4">
                <Eye className="w-5 h-5" />
                <h3 className="text-xl font-serif-luxury font-bold">Nhật Ký Điều Ước Đã Nhập</h3>
              </div>

              {savedWishes.length === 0 ? (
                <p className="text-white/60 text-sm italic my-6 text-center">
                  Chưa có điều ước nào được nhập (hoặc người nhận chưa bấm "Gửi Điều Ước").
                </p>
              ) : (
                <div className="space-y-4 max-h-80 overflow-y-auto pr-2 my-4">
                  {savedWishes.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col gap-1"
                    >
                      <span className="text-[11px] text-[#FF9BCF] font-semibold">
                        ⏰ {item.time}
                      </span>
                      <p className="text-white text-base font-handwriting text-xl text-[#FFD27D]">
                        “{item.wish}”
                      </p>
                    </div>
                  ))}
                </div>
              )}

              <p className="text-[11px] text-white/40 text-center mt-4">
                💡 Phím tắt bí mật: <code className="text-[#FFD27D]">Ctrl + Shift + W</code>
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
