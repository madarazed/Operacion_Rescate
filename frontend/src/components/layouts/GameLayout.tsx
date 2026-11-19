import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';
import type { GameLayoutProps } from '../../types';

export const GameLayout: React.FC<GameLayoutProps> = ({ children }) => {
  const score = useGameStore((state) => state.score);
  const globalTimer = useGameStore((state) => state.globalTimer);
  const isGameOver = useGameStore((state) => state.isGameOver);
  const currentLevel = useGameStore((state) => state.currentLevel);
  const isVictory = useGameStore((state) => state.isVictory);
  const isMuted = useGameStore((state) => state.isMuted);
  const isRelaxedMode = useGameStore((state) => state.isRelaxedMode);
  const isPracticeMode = useGameStore((state) => state.isPracticeMode);
  const lastTimeBonus = useGameStore((state) => state.lastTimeBonus);
  const deductTime = useGameStore((state) => state.actions.deductTime);
  const toggleSound = useGameStore((state) => state.actions.toggleSound);

  const showVictory = Boolean(isVictory || currentLevel >= 5);

  const [showBonus, setShowBonus] = useState(false);

  useEffect(() => {
    if (!lastTimeBonus) return;
    setShowBonus(true);
    const timer = setTimeout(() => {
      setShowBonus(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, [lastTimeBonus]);

  useEffect(() => {
    // No descontar tiempo en la pantalla de inicio, juego terminado, victoria, modo relajado o si se agotó el tiempo
    if (isGameOver || currentLevel === 0 || showVictory || isRelaxedMode || globalTimer <= 0) return;

    const interval = setInterval(() => {
      deductTime(1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isGameOver, currentLevel, showVictory, isRelaxedMode, globalTimer, deductTime]);

  const minutes = Math.floor(globalTimer / 60);
  const seconds = globalTimer % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const timerColor =
    globalTimer <= 15
      ? 'text-red-400 font-black animate-pulse'
      : globalTimer <= 30
      ? 'text-amber-400 font-bold'
      : 'text-slate-100 font-bold';

  return (
    <div className="w-screen h-[100dvh] flex flex-col relative overflow-hidden bg-slate-950 select-none">
      {/* Botón circular discreto de audio para pantallas sin HUD (Portada y Victoria) */}
      {(currentLevel === 0 || showVictory) && (
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
      {currentLevel > 0 && currentLevel <= 4 && !showVictory && (
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

            {/* Temporizador o Modo Práctica / Modo Relajado con Indicador de Bonificación */}
            <div className="relative flex items-center">
              {isRelaxedMode ? (
                <div
                  className="flex items-center space-x-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full shadow-sm"
                  title="Modo sin límite de tiempo"
                >
                  <span>🌿</span>
                  <span>Modo Relajado</span>
                </div>
              ) : isPracticeMode || globalTimer === 0 ? (
                <div
                  className="flex items-center space-x-1.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full shadow-sm animate-pulse"
                  title="Tiempo agotado. Continúa en Modo Práctica sin presión."
                >
                  <span>🌱</span>
                  <span>Modo Práctica</span>
                </div>
              ) : (
                <div className="flex items-center space-x-1">
                  <span className="text-slate-400 text-[11px] sm:text-xs">⏱️</span>
                  <span className={`text-xs sm:text-sm font-mono tracking-wider ${timerColor}`}>
                    {formattedTime}
                  </span>
                </div>
              )}

              {/* Indicador visual flotante de bonificación (+15s) */}
              <AnimatePresence>
                {showBonus && lastTimeBonus && (
                  <motion.div
                    key={lastTimeBonus.id}
                    initial={{ opacity: 0, y: 8, scale: 0.7 }}
                    animate={{ opacity: 1, y: -20, scale: 1.1 }}
                    exit={{ opacity: 0, y: -30, scale: 0.8 }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                    className="absolute -top-1 left-1/2 -translate-x-1/2 sm:left-full sm:translate-x-0 sm:ml-2 pointer-events-none z-50 flex items-center space-x-0.5 bg-emerald-500 text-slate-950 border border-emerald-300 text-[10px] sm:text-xs font-black px-2 py-0.5 rounded-full shadow-lg shadow-emerald-500/40 whitespace-nowrap"
                  >
                    <span>+{lastTimeBonus.amount}s</span>
                    <span>⏱️</span>
                  </motion.div>
                )}
              </AnimatePresence>
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
