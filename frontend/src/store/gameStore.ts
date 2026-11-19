import { create } from 'zustand';
import type { GameState } from '../types';
import { setSoundMuted } from '../utils/soundEffects';

export const useGameStore = create<GameState>((set) => ({
  currentLevel: 0,
  score: 0,
  globalTimer: 120,
  isRelaxedMode: false,
  isPracticeMode: false,
  isVictory: false,
  lastTimeBonus: null,
  playerData: { id: null, name: '' },
  isGameOver: false,
  gameOverReason: '',
  isMuted: false,
  actions: {
    startGame: () =>
      set((state) => ({
        currentLevel: 1,
        isVictory: false,
        score: 0,
        globalTimer: 120,
        isPracticeMode: false,
        isGameOver: false,
        gameOverReason: '',
        lastTimeBonus: null,
        isRelaxedMode: state.isRelaxedMode,
      })),
    nextLevel: () =>
      set((state) => {
        const next = state.currentLevel + 1;
        return {
          currentLevel: next,
          isVictory: next >= 5,
        };
      }),
    finishMission: () =>
      set(() => ({
        currentLevel: 5,
        isVictory: true,
        isGameOver: false,
        gameOverReason: '',
      })),
    completeGame: () =>
      set(() => ({
        currentLevel: 5,
        isVictory: true,
        isGameOver: false,
        gameOverReason: '',
      })),
    setGameState: (gameState: string) =>
      set(() => {
        if (gameState === 'victory') {
          return {
            currentLevel: 5,
            isVictory: true,
            isGameOver: false,
            gameOverReason: '',
          };
        }
        return {};
      }),
    addScore: (points: number) =>
      set((state) => ({
        score: state.score + points,
      })),
    addTime: (seconds: number) =>
      set((state) => {
        if (state.isGameOver) return {};
        return {
          globalTimer: state.globalTimer + seconds,
          isPracticeMode: false,
          lastTimeBonus: { amount: seconds, id: Date.now() },
        };
      }),
    deductTime: (seconds: number) =>
      set((state) => {
        if (state.isGameOver || state.isRelaxedMode || state.globalTimer <= 0) return {};
        const newTimer = Math.max(0, state.globalTimer - seconds);
        if (newTimer === 0) {
          return {
            globalTimer: 0,
            isPracticeMode: true,
          };
        }
        return { globalTimer: newTimer };
      }),
    setRelaxedMode: (enabled: boolean) =>
      set(() => ({
        isRelaxedMode: enabled,
      })),
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
      set((state) => ({
        currentLevel: 0,
        isVictory: false,
        score: 0,
        globalTimer: 120,
        isPracticeMode: false,
        isGameOver: false,
        gameOverReason: '',
        lastTimeBonus: null,
        playerData: { id: null, name: '' },
        isRelaxedMode: state.isRelaxedMode,
      })),
  },
}));
