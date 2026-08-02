import React, { createContext, useContext, useState } from 'react';
import type { Chapter } from '../types';

interface ChapterContextType {
  currentChapter: Chapter;
  setChapter: (chapter: Chapter) => void;
  nextChapter: () => void;
  prevChapter: () => void;
  chapterIndex: number;
  totalChapters: number;
  isAudioMuted: boolean;
  toggleAudio: () => void;
}

export const CHAPTER_SEQUENCE: { id: Chapter; title: string; number: number }[] = [
  { id: 'universe', title: 'Vũ Trụ Vô Tận', number: 1 },
  { id: 'constellation', title: 'Chòm Sao Tên Em', number: 2 },
  { id: 'rewind', title: 'Ngược Dòng Thời Gian', number: 3 },
  { id: 'gift', title: 'Hộp Quà Kỳ Diệu', number: 4 },
  { id: 'letter', title: 'Bức Thư Tình Cảm', number: 5 },
  { id: 'cake', title: 'Bánh Sinh Nhật & Thổi Nến', number: 6 },
  { id: 'fireworks', title: 'Lễ Hội Pháo Hoa', number: 7 },
  { id: 'lantern', title: 'Đèn Lồng Ước Nguyện', number: 8 },
  { id: 'finale', title: 'Đồi Sao & Thành Phố', number: 9 },
];

const ChapterContext = createContext<ChapterContextType | undefined>(undefined);

export const ChapterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentChapter, setCurrentChapter] = useState<Chapter>('universe');
  const [isAudioMuted, setIsAudioMuted] = useState(false);

  const chapterIndex = CHAPTER_SEQUENCE.findIndex((c) => c.id === currentChapter);

  const setChapter = (chapter: Chapter) => {
    setCurrentChapter(chapter);
  };

  const nextChapter = () => {
    if (chapterIndex < CHAPTER_SEQUENCE.length - 1) {
      setCurrentChapter(CHAPTER_SEQUENCE[chapterIndex + 1].id);
    }
  };

  const prevChapter = () => {
    if (chapterIndex > 0) {
      setCurrentChapter(CHAPTER_SEQUENCE[chapterIndex - 1].id);
    }
  };

  const toggleAudio = () => {
    setIsAudioMuted((prev) => !prev);
  };

  return (
    <ChapterContext.Provider
      value={{
        currentChapter,
        setChapter,
        nextChapter,
        prevChapter,
        chapterIndex: chapterIndex >= 0 ? chapterIndex : 0,
        totalChapters: CHAPTER_SEQUENCE.length,
        isAudioMuted,
        toggleAudio,
      }}
    >
      {children}
    </ChapterContext.Provider>
  );
};

export const useChapter = () => {
  const context = useContext(ChapterContext);
  if (!context) {
    throw new Error('useChapter must be used within a ChapterProvider');
  }
  return context;
};
