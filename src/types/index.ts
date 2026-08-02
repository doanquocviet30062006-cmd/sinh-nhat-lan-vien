export type Chapter = 
  | 'universe'
  | 'constellation'
  | 'rewind'
  | 'gift'
  | 'letter'
  | 'cake'
  | 'fireworks'
  | 'lantern'
  | 'finale';

// Keep Stage type for backwards compatibility
export type Stage = Chapter | 'loading' | 'countdown' | 'achievements' | 'memories';

export interface MemoryItem {
  id: string;
  date: string;
  title: string;
  location?: string;
  description: string;
  imageUrl: string;
  tag: string;
  color?: string;
}

export interface AchievementItem {
  id: string;
  title: string;
  category: string;
  description: string;
  icon: string;
  dateAwarded: string;
}

export interface ConstellationNode {
  id: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  title: string;
  quote: string;
  starSize: number;
}

export interface BirthdayData {
  recipientName: string;
  nickname: string;
  birthdayDate: string; // ISO date string e.g. "2026-08-03T00:00:00"
  subtitleMessage: string;
  constellations: ConstellationNode[];
  memories: MemoryItem[];
  achievements: AchievementItem[];
  letter: {
    salutation: string;
    paragraphs: string[];
    closing: string;
    signature: string;
  };
  secretGift: {
    wishTitle: string;
    wishMessage: string;
    giftBoxTitle: string;
    giftBoxSurprise: string;
  };
}

export interface WishRecord {
  wish: string;
  time: string;
}
