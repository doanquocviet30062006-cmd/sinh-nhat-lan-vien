import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { soundManager } from '../utils/audioSynthesizer';
import birthdayData from '../data/birthdayData.json';
import { RotateCcw, Music, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Chapter10FinaleProps {
  onRestart: () => void;
}

export const Chapter10Finale: React.FC<Chapter10FinaleProps> = ({ onRestart }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    soundManager.playChapterSound('finale');

    // Trigger celebratory confetti burst
    confetti({
      particleCount: 80,
      spread: 90,
      origin: { y: 0.35 },
      colors: ['#FFD27D', '#FF9BCF', '#9D7BFF', '#FFFFFF'],
    });

    const timer = setTimeout(() => setShowContent(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Distant city buildings in the valley below
    const buildingCount = 36;
    const buildings = Array.from({ length: buildingCount }, (_, i) => {
      const w = Math.random() * 45 + 25;
      const h = Math.random() * 120 + 60;
      const x = (i / buildingCount) * width;
      const windowRows = Math.floor(h / 12);
      const windowCols = Math.floor(w / 10);
      const windows = [];
      for (let r = 0; r < windowRows; r++) {
        for (let c = 0; c < windowCols; c++) {
          windows.push({
            rx: c * 8 + 3,
            ry: r * 10 + 4,
            isOn: Math.random() > 0.3,
            color: Math.random() > 0.4 ? '#FFD27D' : (Math.random() > 0.5 ? '#FF9BCF' : '#FFFFFF'),
          });
        }
      }
      return { x, w, h, windows };
    });

    // Moving car headlights in valley roads
    const carCount = 18;
    const cars = Array.from({ length: carCount }, () => ({
      x: Math.random() * width,
      y: height * 0.72 + (Math.random() - 0.5) * 40,
      speed: Math.random() * 1.5 + 0.5,
      color: Math.random() > 0.3 ? '#FFD27D' : '#FF4D4D',
    }));

    // Starfield particles in sky
    const stars = Array.from({ length: 220 }, () => ({
      x: Math.random() * width,
      y: Math.random() * (height * 0.5),
      size: Math.random() * 2 + 0.5,
      alpha: Math.random(),
      speed: Math.random() * 0.02 + 0.005,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Deep Cosmic Doraemon Night Sky
      const skyGrad = ctx.createLinearGradient(0, 0, 0, height * 0.65);
      skyGrad.addColorStop(0, '#040714');
      skyGrad.addColorStop(0.5, '#0C1633');
      skyGrad.addColorStop(1, '#18224B');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height);

      // Twinkling Stars in high sky
      stars.forEach((s) => {
        s.alpha += s.speed;
        const currentAlpha = (Math.sin(s.alpha) + 1) / 2;
        ctx.fillStyle = `rgba(255, 255, 255, ${currentAlpha * 0.95})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // City Horizon in Valley (positioned lower so hill dominates foreground)
      const valleyY = height * 0.75;

      // Distant City Atmosphere Glow
      const glowGrad = ctx.createLinearGradient(0, valleyY - 140, 0, valleyY);
      glowGrad.addColorStop(0, 'rgba(255, 210, 125, 0)');
      glowGrad.addColorStop(0.6, 'rgba(255, 155, 207, 0.2)');
      glowGrad.addColorStop(1, 'rgba(255, 210, 125, 0.35)');
      ctx.fillStyle = glowGrad;
      ctx.fillRect(0, valleyY - 140, width, 140);

      // Buildings in Valley
      buildings.forEach((b) => {
        ctx.fillStyle = '#080D21';
        ctx.fillRect(b.x, valleyY - b.h, b.w, b.h);

        b.windows.forEach((win) => {
          if (win.isOn) {
            ctx.fillStyle = win.color;
            ctx.globalAlpha = Math.random() > 0.95 ? 0.3 : 0.85;
            ctx.fillRect(b.x + win.rx, valleyY - b.h + win.ry, 3.5, 5);
          }
        });
        ctx.globalAlpha = 1;
      });

      // Valley Road Car Lights
      cars.forEach((car) => {
        car.x += car.speed;
        if (car.x > width + 20) car.x = -20;
        ctx.fillStyle = car.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = car.color;
        ctx.fillRect(car.x, car.y, 4, 2);
        ctx.shadowBlur = 0;
      });

      // HIGH HILLTOP FOREGROUND (Looking down from high hill vantage point)
      // Curve starts high on the left (0.42 * height) and sweeps down right
      ctx.fillStyle = '#050817';
      ctx.beginPath();
      ctx.moveTo(-50, height * 0.42);
      ctx.quadraticCurveTo(width * 0.35, height * 0.48, width * 0.7, height * 0.68);
      ctx.quadraticCurveTo(width * 0.85, height * 0.75, width + 50, height * 0.72);
      ctx.lineTo(width + 50, height + 50);
      ctx.lineTo(-50, height + 50);
      ctx.fill();

      // Second Hill Layer for Depth
      ctx.fillStyle = '#030510';
      ctx.beginPath();
      ctx.moveTo(-50, height * 0.52);
      ctx.quadraticCurveTo(width * 0.25, height * 0.56, width * 0.5, height * 0.78);
      ctx.lineTo(width + 50, height + 50);
      ctx.lineTo(-50, height + 50);
      ctx.fill();

      // Glowing Hilltop Rim Light
      ctx.strokeStyle = 'rgba(255, 210, 125, 0.4)';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(-50, height * 0.42);
      ctx.quadraticCurveTo(width * 0.35, height * 0.48, width * 0.7, height * 0.68);
      ctx.stroke();

      // Hilltop Tree Silhouette on high left ridge
      const treeX = width * 0.16;
      const treeY = height * 0.44;
      ctx.fillStyle = '#02030A';
      ctx.fillRect(treeX - 5, treeY, 10, 50);
      ctx.beginPath();
      ctx.arc(treeX, treeY - 20, 32, 0, Math.PI * 2);
      ctx.arc(treeX - 18, treeY - 10, 22, 0, Math.PI * 2);
      ctx.arc(treeX + 18, treeY - 10, 22, 0, Math.PI * 2);
      ctx.fill();

      // Cozy Bench on Hilltop Edge
      const benchX = width * 0.24;
      const benchY = height * 0.46;
      ctx.strokeStyle = '#02030A';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(benchX - 15, benchY);
      ctx.lineTo(benchX + 15, benchY); // bench seat
      ctx.moveTo(benchX - 15, benchY - 10);
      ctx.lineTo(benchX + 15, benchY - 10); // bench back
      ctx.moveTo(benchX - 12, benchY - 10);
      ctx.lineTo(benchX - 12, benchY + 8); // leg 1
      ctx.moveTo(benchX + 12, benchY - 10);
      ctx.lineTo(benchX + 12, benchY + 8); // leg 2
      ctx.stroke();

      animId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-between py-10 px-4 overflow-hidden z-10 select-none">
      {/* High Vantage Point Hilltop Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />

      {/* Floating Sparkles in High Sky */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 flex gap-4 pointer-events-none">
        <Sparkles className="w-8 h-8 text-[#FFD27D] animate-pulse" />
        <Sparkles className="w-10 h-10 text-[#FF9BCF] animate-bounce" />
        <Sparkles className="w-8 h-8 text-[#C8A2FF] animate-pulse" />
      </div>

      {/* Big Glowing Sky Text: "Happy Birthday Lan Viên" */}
      <div className="relative z-10 max-w-3xl flex flex-col items-center text-center mt-6 gap-3">
        <AnimatePresence>
          {showContent && (
            <motion.div
              initial={{ opacity: 0, y: 30, filter: 'blur(15px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 1.8, ease: 'easeOut' }}
              className="flex flex-col items-center gap-3"
            >
              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full glass-card border border-[#FFD27D]/50 text-[#FFD27D] text-xs font-semibold uppercase tracking-widest shadow-xl">
                <Sparkles className="w-4 h-4 text-[#FF9BCF]" />
                <span>Góc Nhìn Từ Đồi Cao Nhìn Xuống Thành Phố</span>
              </div>

              {/* Big Glowing Sky Text */}
              <h1 className="text-5xl sm:text-7xl md:text-8xl font-script text-glow-gold-strong text-[#FFD27D] tracking-wider my-2 drop-shadow-[0_0_40px_rgba(255,210,125,0.9)]">
                Happy Birthday {birthdayData.recipientName}
              </h1>

              <p className="text-xl sm:text-2xl text-white/90 font-serif-luxury italic leading-relaxed max-w-xl">
                "Cảm ơn vì đã xuất hiện trong cuộc đời mình ✨"
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Action Controls at Bottom */}
      <div className="relative z-10 flex flex-col sm:flex-row items-center gap-4 mb-16">
        <button
          onClick={() => {
            soundManager.playAThousandYears();
          }}
          className="flex items-center gap-3 px-8 py-3.5 rounded-full glass-card-premium border border-[#FFD27D]/50 text-[#FFD27D] font-semibold text-sm hover:scale-105 active:scale-95 transition-all shadow-[0_0_25px_rgba(255,210,125,0.4)] cursor-pointer"
        >
          <Music className="w-4 h-4 text-[#FF9BCF] animate-bounce" />
          <span>Bật Nhạc A Thousand Years (Piano) 🎹</span>
        </button>

        <button
          onClick={() => {
            soundManager.playWhoosh();
            onRestart();
          }}
          className="flex items-center gap-3 px-8 py-3.5 rounded-full glass-button text-white font-semibold text-sm hover:scale-105 active:scale-95 transition-all shadow-lg cursor-pointer"
        >
          <RotateCcw className="w-4 h-4 text-[#FFD27D]" />
          <span>Xem Lại Hành Trình Từ Đầu</span>
        </button>
      </div>
    </div>
  );
};
