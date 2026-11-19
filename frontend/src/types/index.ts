import type { ReactNode } from 'react';

export interface PlayerData {
  id: number | null;
  name: string;
}

export interface TimeBonusEvent {
  amount: number;
  id: number;
}

export interface GameState {
  currentLevel: number;
  score: number;
  globalTimer: number;
  isRelaxedMode: boolean;
  isPracticeMode: boolean;
  isVictory?: boolean;
  lastTimeBonus: TimeBonusEvent | null;
  playerData: PlayerData;
  isGameOver: boolean;
  gameOverReason: string;
  isMuted: boolean;
  actions: {
    nextLevel: () => void;
    finishMission: () => void;
    completeGame: () => void;
    setGameState: (state: string) => void;
    addScore: (points: number) => void;
    addTime: (seconds: number) => void;
    deductTime: (seconds: number) => void;
    setRelaxedMode: (enabled: boolean) => void;
    triggerGameOver: (reason: string) => void;
    resetGame: () => void;
    toggleSound: () => void;
    startGame: () => void;
  };
}

export interface GameLayoutProps {
  children: ReactNode;
}
