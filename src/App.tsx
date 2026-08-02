import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Chapter } from './types';
import birthdayData from './data/birthdayData.json';
import BackgroundCanvas from './components/BackgroundCanvas';
import FloatingLanterns from './components/FloatingLanterns';
import CursorSparkles from './components/CursorSparkles';
import { AudioControls } from './components/AudioControls';
import { NavigationBar } from './components/NavigationBar';
import LoadingScreen from './components/LoadingScreen';

// Chapter components
import { Chapter1Universe } from './chapters/Chapter1Universe';
import { Chapter2Constellation } from './chapters/Chapter2Constellation';
import { Chapter3TimeRewind } from './chapters/Chapter3TimeRewind';
import { Chapter4Gift } from './chapters/Chapter4Gift';
import { Chapter6Letter } from './chapters/Chapter6Letter';
import { Chapter7Cake } from './chapters/Chapter7Cake';
import { Chapter8Fireworks } from './chapters/Chapter8Fireworks';
import { Chapter9WishLantern } from './chapters/Chapter9WishLantern';
import { Chapter10Finale } from './chapters/Chapter10Finale';

import confetti from 'canvas-confetti';

export function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [chapter, setChapter] = useState<Chapter>('universe');

  const handleTriggerSparkles = () => {
    confetti({
      particleCount: 50,
      spread: 80,
      origin: { y: 0.2 },
      colors: ['#FFD27D', '#FF9BCF', '#9D7BFF'],
    });
  };

  const handleNextChapter = () => {
    const chapters: Chapter[] = [
      'universe',
      'constellation',
      'rewind',
      'gift',
      'letter',
      'cake',
      'fireworks',
      'lantern',
      'finale',
    ];
    const currentIndex = chapters.indexOf(chapter);
    if (currentIndex < chapters.length - 1) {
      setChapter(chapters[currentIndex + 1]);
    }
  };

  return (
    <main className="relative min-h-screen bg-[#070B1A] text-white overflow-hidden selection:bg-[#FF9BCF] selection:text-[#070B1A]">
      {/* Background Starfield Canvas & Ambient Lanterns */}
      <BackgroundCanvas />
      <FloatingLanterns />
      <CursorSparkles />

      {/* Global Sound & Secret Wish Controls */}
      {!isLoading && <AudioControls onSparkleClick={handleTriggerSparkles} />}

      {/* Floating Bottom Chapter Navigation Bar */}
      {!isLoading && (
        <NavigationBar currentChapter={chapter} onSelectChapter={setChapter} />
      )}

      {/* Initial Loading Screen */}
      {isLoading ? (
        <LoadingScreen
          recipientName={birthdayData.recipientName}
          onEnter={() => setIsLoading(false)}
        />
      ) : (
        /* Cinematic Chapter Viewport */
        <AnimatePresence mode="wait">
          {chapter === 'universe' && (
            <motion.div
              key="universe"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, filter: 'blur(10px)' }}
              transition={{ duration: 0.8 }}
            >
              <Chapter1Universe onNext={handleNextChapter} />
            </motion.div>
          )}

          {chapter === 'constellation' && (
            <motion.div
              key="constellation"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.8 }}
            >
              <Chapter2Constellation onNext={handleNextChapter} />
            </motion.div>
          )}

          {chapter === 'rewind' && (
            <motion.div
              key="rewind"
              initial={{ opacity: 0, filter: 'blur(15px)' }}
              animate={{ opacity: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, filter: 'blur(15px)' }}
              transition={{ duration: 0.8 }}
            >
              <Chapter3TimeRewind onNext={handleNextChapter} />
            </motion.div>
          )}

          {chapter === 'gift' && (
            <motion.div
              key="gift"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 0.8 }}
            >
              <Chapter4Gift onNext={handleNextChapter} />
            </motion.div>
          )}

          {chapter === 'letter' && (
            <motion.div
              key="letter"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.8 }}
            >
              <Chapter6Letter onNext={handleNextChapter} />
            </motion.div>
          )}

          {chapter === 'cake' && (
            <motion.div
              key="cake"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.8 }}
            >
              <Chapter7Cake onNext={handleNextChapter} />
            </motion.div>
          )}

          {chapter === 'fireworks' && (
            <motion.div
              key="fireworks"
              initial={{ opacity: 0, filter: 'blur(15px)' }}
              animate={{ opacity: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, filter: 'blur(15px)' }}
              transition={{ duration: 1 }}
            >
              <Chapter8Fireworks onNext={handleNextChapter} />
            </motion.div>
          )}

          {chapter === 'lantern' && (
            <motion.div
              key="lantern"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.8 }}
            >
              <Chapter9WishLantern onNext={handleNextChapter} />
            </motion.div>
          )}

          {chapter === 'finale' && (
            <motion.div
              key="finale"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
            >
              <Chapter10Finale onRestart={() => setChapter('universe')} />
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </main>
  );
}

export default App;
