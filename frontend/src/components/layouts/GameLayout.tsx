import React, { useEffect } from 'react';
import { useGameStore } from '../../store/gameStore';
import type { GameLayoutProps } from '../../types';

export const GameLayout: React.FC<GameLayoutProps> = ({ children }) => {
  const score = useGameStore((state) => state.score);
  const globalTimer = useGameStore((state) => state.globalTimer);
  const isGameOver = useGameStore((state) => state.isGameOver);
  const currentLevel = useGameStore((state) => state.currentLevel);
  const isMuted = useGameStore((state) => state.isMuted);
  const deductTime = useGameStore((state) => state.actions.deductTime);
  const toggleSound = useGameStore((state) => state.actions.toggleSound);

  useEffect(() => {
    // No descontar tiempo en la pantalla de inicio o cuando el juego ha finalizado
    if (isGameOver || currentLevel === 0) return;

    const interval = setInterval(() => {
      deductTime(1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isGameOver, currentLevel, deductTime]);

  const timerColor =
    globalTimer <= 10
      ? 'text-red-400 font-black animate-pulse'
      : globalTimer <= 20
      ? 'text-amber-400 font-bold'
      : 'text-slate-100 font-bold';

  return (
    <div className="w-screen h-[100dvh] flex flex-col relative overflow-hidden bg-slate-950 select-none">
      {/* Botón circular discreto de audio para pantallas sin HUD (Portada y Victoria) */}
      {(currentLevel === 0 || currentLevel > 4) && (
        <button
          type="button"
          onClick={toggleSound}
          className="absolute top-4 right-4 z-50 w-11 h-11 rounded-full bg-slate-900/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-lg shadow-lg active:scale-90 transition-all cursor-pointer text-white"
          title={isMuted ? 'Activar sonido' : 'Silenciar sonido'}
          aria-label={isMuted ? 'Activar sonido' : 'Silenciar sonido'}
        >
          {isMuted ? '🔇' : '🔊'}
        </button>
      )}

      {/* Barra superior / HUD Flotante tipo Cápsula Semitransparente (SOLO en niveles jugables 1 a 4) */}
      {currentLevel > 0 && currentLevel <= 4 && (
        <header className="absolute top-2.5 sm:top-3 left-3 right-3 sm:left-1/2 sm:-translate-x-1/2 sm:w-auto z-50 bg-slate-900/80 backdrop-blur-md border border-white/10 rounded-full px-4 py-2 flex items-center justify-between sm:space-x-6 text-white shadow-xl max-w-xl mx-auto">
          {/* Identificador de Marca / Nivel */}
          <div className="flex items-center space-x-2">
            <span className="text-lg">🚑</span>
            <span className="font-extrabold tracking-tight text-xs sm:text-sm text-white hidden xs:inline">
              Operación Rescate
            </span>
            <span className="text-[11px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2 py-0.5 rounded-full">
              Nivel {currentLevel}
            </span>
          </div>

          {/* HUD Métricas */}
          <div className="flex items-center space-x-3 sm:space-x-5">
            <div className="flex items-center space-x-1">
              <span className="text-slate-400 text-[11px] sm:text-xs">Pts:</span>
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs sm:text-sm font-bold px-2 py-0.2 rounded-full">
                {score}
              </span>
            </div>

            <div className="flex items-center space-x-1">
              <span className="text-slate-400 text-[11px] sm:text-xs">⏱️</span>
              <span className={`text-xs sm:text-sm font-mono tracking-wider ${timerColor}`}>
                {globalTimer}s
              </span>
            </div>
          </div>

          {/* Botón Toggle de Sonido en HUD */}
          <button
            type="button"
            onClick={toggleSound}
            className="p-1.5 sm:px-2.5 sm:py-1 rounded-full bg-slate-800/80 hover:bg-slate-700 active:scale-90 text-white text-xs sm:text-sm transition flex items-center space-x-1 border border-slate-700/60 shadow-inner cursor-pointer"
            title={isMuted ? 'Activar sonido' : 'Silenciar sonido'}
          >
            <span>{isMuted ? '🔇' : '🔊'}</span>
            <span className="text-[10px] hidden sm:inline font-semibold">
              {isMuted ? 'Silencio' : 'Audio'}
            </span>
          </button>
        </header>
      )}

      {/* Contenedor del Nivel (100% de la ventana) */}
      <main className="w-full h-full relative overflow-hidden flex items-center justify-center">
        {children}
      </main>
    </div>
  );
};
