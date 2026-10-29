import React, { useEffect } from 'react';
import { useGameStore } from '../../store/gameStore';
import type { GameLayoutProps } from '../../types';

export const GameLayout: React.FC<GameLayoutProps> = ({ children }) => {
  const score = useGameStore((state) => state.score);
  const globalTimer = useGameStore((state) => state.globalTimer);
  const isGameOver = useGameStore((state) => state.isGameOver);
  const currentLevel = useGameStore((state) => state.currentLevel);
  const deductTime = useGameStore((state) => state.actions.deductTime);

  useEffect(() => {
    if (isGameOver) return;

    const interval = setInterval(() => {
      deductTime(1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isGameOver, deductTime]);

  const timerColor = globalTimer <= 10 ? 'text-red-400 font-bold animate-pulse' : 'text-slate-100';

  return (
    <div className="w-screen h-screen flex flex-col relative overflow-hidden bg-slate-950">
      {/* Barra superior / HUD Flotante Integrada */}
      <header className="absolute top-0 left-0 right-0 z-50 h-14 bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50 px-6 flex items-center justify-between text-white shadow-lg">
        <div className="flex items-center space-x-2">
          <span className="text-xl">🚑</span>
          <span className="font-bold tracking-tight text-white hidden sm:inline">
            Operación Rescate
          </span>
        </div>

        <div className="flex items-center space-x-4 sm:space-x-6">
          <div className="text-xs sm:text-sm font-medium text-slate-300">
            Nivel: <span className="text-white font-bold">{currentLevel}</span>
          </div>

          <div className="flex items-center space-x-1.5">
            <span className="text-slate-300 text-xs sm:text-sm font-medium">Puntaje:</span>
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs sm:text-sm font-bold px-2.5 py-0.5 rounded-full">
              {score}
            </span>
          </div>

          <div className="flex items-center space-x-1.5">
            <span className="text-slate-300 text-xs sm:text-sm font-medium">Tiempo:</span>
            <span className={`text-xs sm:text-sm font-bold font-mono tracking-wider ${timerColor}`}>
              {globalTimer}s
            </span>
          </div>
        </div>
      </header>

      {/* Contenedor del Nivel (100% de la ventana) */}
      <main className="w-full h-full relative overflow-hidden flex items-center justify-center">
        {children}
      </main>
    </div>
  );
};
