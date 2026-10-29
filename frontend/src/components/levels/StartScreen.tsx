import React from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';
import heroDog from '../../assets/characters/level3-examine-dog.png';

export const StartScreen: React.FC = () => {
  const startGame = useGameStore((state) => state.actions.startGame);

  const handleStart = () => {
    try {
      navigator?.vibrate?.(50);
    } catch {
      // Ignore vibration error
    }
    startGame();
  };

  return (
    <div className="w-full h-[100dvh] relative overflow-hidden bg-slate-950 flex flex-col justify-between items-center px-4 py-8 select-none">
      {/* Luces y ambientación cinematográfica */}
      <div className="absolute inset-0 bg-radial-gradient from-blue-900/20 via-slate-950 to-slate-950 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header / Badges Superiores */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 text-center space-y-2 mt-4 sm:mt-6"
      >
        <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-500/20 via-amber-400/20 to-amber-500/20 border border-amber-400/40 px-3.5 py-1 rounded-full shadow-lg backdrop-blur-md">
          <span className="text-base">🐾</span>
          <span className="text-xs sm:text-sm font-extrabold text-amber-300 tracking-wider uppercase">
            Juego Familiar & Educativo
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-100 to-slate-400 tracking-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)]">
          MISIÓN RESCATE
        </h1>
        <p className="text-emerald-400 font-bold text-sm sm:text-base tracking-widest uppercase">
          Código PASR • Primeros Auxilios Veterinarios
        </p>
      </motion.div>

      {/* Hero Visual: Mascota en Recuperación */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="relative z-10 my-auto flex flex-col items-center"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-emerald-400/20 rounded-full blur-2xl animate-pulse pointer-events-none" />
          <img
            src={heroDog}
            alt="Paciente canino rescatado"
            className="w-40 h-40 sm:w-52 sm:h-52 object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.8)] animate-pulse"
          />
        </div>
      </motion.div>

      {/* Guía Rápida de 3 Pasos */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="relative z-10 w-full max-w-xl space-y-4 mb-2"
      >
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          <div className="bg-slate-900/80 border border-slate-700/60 rounded-xl p-2.5 text-center shadow-lg backdrop-blur-sm">
            <span className="text-xl sm:text-2xl block mb-1">🛡️</span>
            <div className="text-[11px] sm:text-xs font-bold text-white">1. Protege</div>
            <p className="text-[9px] sm:text-[10px] text-slate-300 hidden xs:block mt-0.5">
              Asegura el entorno vial
            </p>
          </div>

          <div className="bg-slate-900/80 border border-slate-700/60 rounded-xl p-2.5 text-center shadow-lg backdrop-blur-sm">
            <span className="text-xl sm:text-2xl block mb-1">📋</span>
            <div className="text-[11px] sm:text-xs font-bold text-white">2. Triage</div>
            <p className="text-[9px] sm:text-[10px] text-slate-300 hidden xs:block mt-0.5">
              Código START (Rojo/Amarillo/Verde)
            </p>
          </div>

          <div className="bg-slate-900/80 border border-slate-700/60 rounded-xl p-2.5 text-center shadow-lg backdrop-blur-sm">
            <span className="text-xl sm:text-2xl block mb-1">🎓</span>
            <div className="text-[11px] sm:text-xs font-bold text-white">3. Certifícate</div>
            <p className="text-[9px] sm:text-[10px] text-slate-300 hidden xs:block mt-0.5">
              Hemostasia y diploma oficial
            </p>
          </div>
        </div>

        {/* Botón Principal: ¡Comenzar Rescate! */}
        <button
          type="button"
          onClick={handleStart}
          className="w-full py-4 sm:py-5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-500 active:scale-95 text-white font-black text-base sm:text-xl tracking-wide shadow-xl shadow-emerald-500/30 hover:shadow-emerald-500/50 border-2 border-emerald-300/80 transition-all cursor-pointer flex items-center justify-center space-x-2"
        >
          <span>🚨</span>
          <span>¡Comenzar Rescate!</span>
          <svg className="w-6 h-6 ml-1 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
      </motion.div>
    </div>
  );
};
