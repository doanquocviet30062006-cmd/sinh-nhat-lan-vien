import React from 'react';
import { motion } from 'framer-motion';

const FloatingLanterns: React.FC = () => {
  const lanterns = Array.from({ length: 8 });
  const petals = Array.from({ length: 25 });
  const orbs = Array.from({ length: 6 });
  const auroras = Array.from({ length: 3 });

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Aurora Borealis */}
      <div className="absolute inset-x-0 top-0 h-96 opacity-40">
        {auroras.map((_, i) => (
          <motion.div
            key={`aurora-${i}`}
            className="absolute inset-0"
            style={{
              background: `linear-gradient(180deg, ${
                i === 0 ? 'rgba(157, 123, 255, 0.4)' : i === 1 ? 'rgba(255, 155, 207, 0.3)' : 'rgba(255, 210, 125, 0.2)'
              } 0%, transparent 100%)`,
              filter: 'blur(40px)',
              transformOrigin: 'top center',
            }}
            animate={{
              scaleY: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
              skewX: [-10, 10, -10],
            }}
            transition={{
              duration: 10 + i * 5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Light Orbs (Bokeh) */}
      {orbs.map((_, i) => (
        <motion.div
          key={`orb-${i}`}
          className="absolute rounded-full mix-blend-screen"
          style={{
            width: Math.random() * 200 + 100,
            height: Math.random() * 200 + 100,
            background: `radial-gradient(circle, ${i % 2 === 0 ? 'rgba(255, 200, 87, 0.15)' : 'rgba(255, 155, 207, 0.15)'} 0%, transparent 70%)`,
            left: `${Math.random() * 100}vw`,
            top: `${Math.random() * 100}vh`,
          }}
          animate={{
            x: [0, Math.random() * 100 - 50, 0],
            y: [0, Math.random() * 100 - 50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 15 + Math.random() * 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}

      {/* Floating Lanterns */}
      {lanterns.map((_, i) => {
        const size = Math.random() * 30 + 40;
        const delay = Math.random() * 10;
        const duration = Math.random() * 15 + 20;
        const startX = Math.random() * 100;
        
        return (
          <motion.div
            key={`lantern-${i}`}
            className="absolute bottom-0 shadow-lg"
            style={{
              left: `${startX}vw`,
              width: size,
              height: size * 1.4,
              borderRadius: '8px 8px 4px 4px',
              background: 'linear-gradient(to bottom, #FFC857, #FFD27D, rgba(255, 155, 207, 0.8))',
              boxShadow: '0 0 20px 5px rgba(255, 210, 125, 0.6), inset 0 -10px 20px rgba(255, 155, 207, 0.8)',
            }}
            initial={{ y: '100vh', opacity: 0 }}
            animate={{
              y: '-20vh',
              opacity: [0, 1, 1, 0],
              x: [0, Math.random() * 100 - 50, Math.random() * 100 - 50],
              rotate: [-5, 5, -5],
            }}
            transition={{
              y: { duration, repeat: Infinity, ease: "linear", delay },
              opacity: { duration, repeat: Infinity, times: [0, 0.1, 0.8, 1], delay },
              x: { duration, repeat: Infinity, ease: "easeInOut", delay },
              rotate: { duration: 3, repeat: Infinity, ease: "easeInOut", delay }
            }}
          >
            {/* Lantern inner flame */}
            <motion.div 
              className="absolute bottom-2 left-1/2 -translate-x-1/2 w-4 h-6 rounded-full"
              style={{
                background: '#FFF',
                boxShadow: '0 0 10px 2px #FFD27D',
                filter: 'blur(2px)'
              }}
              animate={{ opacity: [0.7, 1, 0.7], scale: [0.9, 1.1, 0.9] }}
              transition={{ duration: 0.5 + Math.random() * 0.5, repeat: Infinity }}
            />
          </motion.div>
        );
      })}

      {/* Floating Rose Petals */}
      {petals.map((_, i) => {
        const size = Math.random() * 10 + 5;
        const color = Math.random() > 0.5 ? '#FF9BCF' : '#FFD27D';
        
        return (
          <motion.div
            key={`petal-${i}`}
            className="absolute top-0"
            style={{
              width: size,
              height: size,
              background: color,
              borderRadius: '50% 0 50% 50%',
              opacity: 0.6,
              left: `${Math.random() * 100}vw`,
            }}
            initial={{ y: '-10vh' }}
            animate={{
              y: '110vh',
              x: [0, Math.random() * 100 - 50, 0],
              rotate: [0, 360, 720],
              rotateX: [0, 180, 360],
              rotateY: [0, 180, 360],
            }}
            transition={{
              duration: 10 + Math.random() * 15,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 20
            }}
          />
        );
      })}
    </div>
  );
};

export default FloatingLanterns;
