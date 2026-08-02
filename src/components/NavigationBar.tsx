import React, { useRef, useState, useEffect } from 'react';
import type { Chapter } from '../types';
import { soundManager } from '../utils/audioSynthesizer';
import { CHAPTER_SEQUENCE } from '../contexts/ChapterContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface NavigationBarProps {
  currentChapter: Chapter;
  onSelectChapter: (chapter: Chapter) => void;
}

export const NavigationBar: React.FC<NavigationBarProps> = ({ currentChapter, onSelectChapter }) => {
  const navRef = useRef<HTMLDivElement>(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  // Check scroll position to show/hide scroll arrows
  const checkScroll = () => {
    if (!navRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = navRef.current;
    setShowLeftArrow(scrollLeft > 5);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 5);
  };

  useEffect(() => {
    checkScroll();
    const navEl = navRef.current;
    if (navEl) {
      navEl.addEventListener('scroll', checkScroll);
      window.addEventListener('resize', checkScroll);
    }
    return () => {
      if (navEl) navEl.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, []);

  // Auto-scroll active item into view when chapter changes
  useEffect(() => {
    if (!navRef.current) return;
    const activeBtn = navRef.current.querySelector<HTMLElement>('[data-active="true"]');
    if (activeBtn) {
      activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [currentChapter]);

  // Mouse Drag to Scroll handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!navRef.current) return;
    setIsMouseDown(true);
    setStartX(e.pageX - navRef.current.offsetLeft);
    setScrollLeft(navRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsMouseDown(false);
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDown || !navRef.current) return;
    e.preventDefault();
    const x = e.pageX - navRef.current.offsetLeft;
    const walk = (x - startX) * 1.8; // Scroll speed multiplier
    navRef.current.scrollLeft = scrollLeft - walk;
  };

  const scrollContainer = (direction: 'left' | 'right') => {
    if (!navRef.current) return;
    const scrollAmount = 180;
    navRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
    soundManager.playChime();
  };

  return (
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 max-w-[96vw] sm:max-w-2xl flex items-center gap-1.5 select-none">
      {/* Scroll Left Arrow Button */}
      {showLeftArrow && (
        <button
          onClick={() => scrollContainer('left')}
          className="p-2 rounded-full glass-card border border-white/20 text-[#FFD27D] hover:scale-110 active:scale-95 transition-all shadow-xl cursor-pointer shrink-0"
          aria-label="Cuộn sang trái"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      )}

      {/* Drag-scrollable Container */}
      <div
        ref={navRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        className={`flex items-center gap-1.5 p-2 rounded-full glass-card border border-white/20 shadow-2xl backdrop-blur-xl bg-[#070B1A]/90 overflow-x-auto scroll-smooth touch-pan-x ${
          isMouseDown ? 'cursor-grabbing' : 'cursor-grab'
        }`}
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {CHAPTER_SEQUENCE.map((item) => {
          const isActive = currentChapter === item.id;
          return (
            <button
              key={item.id}
              data-active={isActive}
              onClick={() => {
                if (!isMouseDown) {
                  soundManager.playChime();
                  onSelectChapter(item.id);
                }
              }}
              title={`Chương ${item.number}: ${item.title}`}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 whitespace-nowrap cursor-pointer shrink-0 ${
                isActive
                  ? 'bg-gradient-to-r from-[#FF9BCF] to-[#9D7BFF] text-white shadow-lg shadow-[#9D7BFF]/40 scale-105 font-bold border border-[#FFD27D]/40'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <span className={`text-[11px] font-semibold px-1.5 py-0.5 rounded-full ${isActive ? 'bg-[#FFD27D] text-[#070B1A]' : 'bg-white/10 text-white/80'}`}>
                {item.number}
              </span>
              <span className="text-xs">{item.title}</span>
            </button>
          );
        })}
      </div>

      {/* Scroll Right Arrow Button */}
      {showRightArrow && (
        <button
          onClick={() => scrollContainer('right')}
          className="p-2 rounded-full glass-card border border-white/20 text-[#FFD27D] hover:scale-110 active:scale-95 transition-all shadow-xl cursor-pointer shrink-0"
          aria-label="Cuộn sang phải"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      )}
    </nav>
  );
};
