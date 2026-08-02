import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Sparkle {
  id: string;
  x: number;
  y: number;
  color: string;
  shape: string;
  angle: number;
  velocity: number;
}

const CursorSparkles: React.FC = () => {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const colors = ['#FFD27D', '#FF9BCF', '#9D7BFF', '#C8A2FF'];
  const shapes = ['✦', '✧', '★', '✨', '♡'];

  useEffect(() => {
    let lastTime = 0;
    const addSparkle = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastTime < 50) return; // Throttle
      lastTime = now;

      setSparkles(prev => {
        const newSparkles = [...prev, {
          id: `${now}-${Math.random()}`,
          x: e.clientX,
          y: e.clientY,
          color: colors[Math.floor(Math.random() * colors.length)],
          shape: shapes[Math.floor(Math.random() * shapes.length)],
          angle: Math.random() * Math.PI * 2,
          velocity: Math.random() * 30 + 10
        }];
        if (newSparkles.length > 40) {
          return newSparkles.slice(newSparkles.length - 40);
        }
        return newSparkles;
      });
    };

    const handleClick = (e: MouseEvent) => {
      const burstCount = Math.floor(Math.random() * 5) + 8; // 8-12
      const burst = Array.from({ length: burstCount }).map(() => ({
        id: `burst-${Date.now()}-${Math.random()}`,
        x: e.clientX,
        y: e.clientY,
        color: colors[Math.floor(Math.random() * colors.length)],
        shape: shapes[Math.floor(Math.random() * shapes.length)],
        angle: Math.random() * Math.PI * 2,
        velocity: Math.random() * 60 + 40
      }));

      setSparkles(prev => {
        const combined = [...prev, ...burst];
        if (combined.length > 40) return combined.slice(combined.length - 40);
        return combined;
      });
    };

    window.addEventListener('mousemove', addSparkle);
    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('mousemove', addSparkle);
      window.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      <AnimatePresence>
        {sparkles.map((sparkle) => (
          <motion.div
            key={sparkle.id}
            initial={{ 
              opacity: 1, 
              scale: Math.random() * 0.5 + 0.5,
              x: sparkle.x,
              y: sparkle.y 
            }}
            animate={{
              opacity: 0,
              scale: 0,
              x: sparkle.x + Math.cos(sparkle.angle) * sparkle.velocity,
              y: sparkle.y + Math.sin(sparkle.angle) * sparkle.velocity,
              rotate: Math.random() * 360 - 180
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 + Math.random() * 0.4, ease: "easeOut" }}
            onAnimationComplete={() => {
              setSparkles(prev => prev.filter(s => s.id !== sparkle.id));
            }}
            className="absolute text-lg select-none"
            style={{
              color: sparkle.color,
              textShadow: `0 0 8px ${sparkle.color}`,
              left: -10,
              top: -10
            }}
          >
            {sparkle.shape}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default CursorSparkles;
