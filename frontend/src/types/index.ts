import type { ReactNode } from 'react';

export interface PlayerData {
  id: number | null;
  name: string;
}

export interface GameState {
  currentLevel: number;
  score: number;
  globalTimer: number;
  playerData: PlayerData;
  isGameOver: boolean;
  gameOverReason: string;
  actions: {
    nextLevel: () => void;
    addScore: (points: number) => void;
    deductTime: (seconds: number) => void;
    triggerGameOver: (reason: string) => void;
    resetGame: () => void;
  };
}

export interface GameLayoutProps {
  children: ReactNode;
}
