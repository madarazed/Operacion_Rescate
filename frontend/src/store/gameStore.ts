import { create } from 'zustand';
import type { GameState } from '../types';
import { setSoundMuted } from '../utils/soundEffects';

export const useGameStore = create<GameState>((set) => ({
  currentLevel: 0,
  score: 0,
  globalTimer: 60,
  playerData: { id: null, name: '' },
  isGameOver: false,
  gameOverReason: '',
  isMuted: false,
  actions: {
    startGame: () =>
      set(() => ({
        currentLevel: 1,
        score: 0,
        globalTimer: 60,
        isGameOver: false,
        gameOverReason: '',
      })),
    nextLevel: () =>
      set((state) => ({
        currentLevel: state.currentLevel + 1,
      })),
    addScore: (points: number) =>
      set((state) => ({
        score: state.score + points,
      })),
    deductTime: (seconds: number) =>
      set((state) => {
        if (state.isGameOver) return {};
        const newTimer = Math.max(0, state.globalTimer - seconds);
        if (newTimer === 0) {
          return {
            globalTimer: 0,
            isGameOver: true,
            gameOverReason: '¡Se te ha agotado el tiempo!',
          };
        }
        return { globalTimer: newTimer };
      }),
    triggerGameOver: (reason: string) =>
      set(() => ({
        isGameOver: true,
        gameOverReason: reason,
      })),
    toggleSound: () =>
      set((state) => {
        const nextMuted = !state.isMuted;
        setSoundMuted(nextMuted);
        return { isMuted: nextMuted };
      }),
    resetGame: () =>
      set(() => ({
        currentLevel: 0,
        score: 0,
        globalTimer: 60,
        isGameOver: false,
        gameOverReason: '',
        playerData: { id: null, name: '' },
      })),
  },
}));
