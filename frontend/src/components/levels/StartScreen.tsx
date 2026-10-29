import React from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';
import coverBg from '../../assets/backgrounds/cover-rescate.png';

export const StartScreen: React.FC = () => {
  const startGame = useGameStore((state) => state.actions.startGame);

  const handleStart = () => {
    try {
      navigator?.vibrate?.(60);
    } catch {
      // Ignore vibration error on unsupported platforms
    }
    startGame();
  };

  return (
    <div
      className="bg-cover bg-[center_bottom_35%] md:bg-center h-[100dvh] w-full relative overflow-hidden flex flex-col justify-between p-4 sm:p-6 select-none bg-no-repeat"
      style={{ backgroundImage: `url(${coverBg})` }}
    >
      {/* Overlay oscuro difuminado para que la interfaz resalte y el fondo respire de manera natural */}
      <div className="absolute inset-0 bg-slate-950/25 bg-gradient-to-b from-slate-950/40 via-transparent to-slate-950/70 pointer-events-none" />

      {/* 1. Cabecera y Título de Impacto (Totalmente en Español y Adaptable) */}
      <header className="relative z-20 text-center max-w-4xl mx-auto space-y-1 sm:space-y-1.5 pt-2 sm:pt-4">
        {/* Badge dorado centrado */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-500/20 via-amber-400/20 to-amber-500/20 border border-amber-400/50 px-3.5 py-1 rounded-full shadow-lg backdrop-blur-md"
        >
          <span className="text-xs sm:text-sm font-extrabold text-amber-300 tracking-wider uppercase">
            🐾 JUEGO FAMILIAR & EDUCATIVO
          </span>
        </motion.div>

        {/* Título principal con tipografía enérgica */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold uppercase tracking-wider filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.8)] text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 via-amber-300 to-orange-400 leading-tight">
            MISIÓN RESCATE
          </h1>

          {/* Subtítulo en turquesa / verde suave */}
          <p className="text-xs sm:text-sm lg:text-base font-bold text-teal-300 tracking-widest uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            CÓDIGO PASR • PRIMEROS AUXILIOS VETERINARIOS
          </p>

          {/* Eslogan educativo */}
          <p className="text-sm sm:text-lg text-slate-200 font-semibold mt-1 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
            APRENDE A SALVAR VIDAS ANIMALES EN LA CALLE
          </p>
        </motion.div>
      </header>

      {/* 2. Botón de Acción Central-Izquierdo (Interactivo y Animado) */}
      <div className="relative z-20 flex-1 flex items-center justify-center lg:justify-start">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <button
            type="button"
            onClick={handleStart}
            className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-extrabold text-lg sm:text-2xl px-8 py-4 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.4)] border-b-4 border-teal-800 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3 w-fit mx-auto lg:mx-0 lg:ml-12 my-4 lg:my-6 cursor-pointer"
          >
            <span>¡COMENZAR MISIÓN!</span>
            <span>🐾</span>
            <span>▶</span>
          </button>
        </motion.div>
      </div>

      {/* 3. Bloques del Protocolo PASR (Base de la Pantalla) */}
      <footer className="relative z-20 w-full max-w-4xl mx-auto pb-1 sm:pb-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="grid grid-cols-3 gap-2 sm:gap-4 w-full"
        >
          {/* Tarjeta 1: P: PROTEGER */}
          <div className="bg-slate-900/85 backdrop-blur-md border border-white/10 p-2 sm:p-3 rounded-2xl flex flex-col items-center text-center shadow-lg transition-transform hover:scale-102">
            <div className="text-xl sm:text-2xl mb-1">🛡️⚠️</div>
            <div className="text-xs sm:text-sm font-black text-amber-300 tracking-tight leading-tight">
              P: PROTEGER
            </div>
            <p className="text-[10px] sm:text-xs text-slate-300 mt-0.5 leading-snug">
              Guantes y cinta de precaución
            </p>
          </div>

          {/* Tarjeta 2: A: ALERTAR */}
          <div className="bg-slate-900/85 backdrop-blur-md border border-white/10 p-2 sm:p-3 rounded-2xl flex flex-col items-center text-center shadow-lg transition-transform hover:scale-102">
            <div className="text-xl sm:text-2xl mb-1">📞📱</div>
            <div className="text-xs sm:text-sm font-black text-cyan-300 tracking-tight leading-tight">
              A: ALERTAR
            </div>
            <p className="text-[10px] sm:text-xs text-slate-300 mt-0.5 leading-snug">
              Teléfono de emergencias
            </p>
          </div>

          {/* Tarjeta 3: S Y R: SOCORRER Y REMITIR */}
          <div className="bg-slate-900/85 backdrop-blur-md border border-white/10 p-2 sm:p-3 rounded-2xl flex flex-col items-center text-center shadow-lg transition-transform hover:scale-102">
            <div className="text-xl sm:text-2xl mb-1">🚑🏥</div>
            <div className="text-xs sm:text-sm font-black text-emerald-300 tracking-tight leading-tight truncate">
              S Y R: SOCORRER Y REMITIR
            </div>
            <p className="text-[10px] sm:text-xs text-slate-300 mt-0.5 leading-snug">
              Ambulancia y triage veterinario
            </p>
          </div>
        </motion.div>
      </footer>
    </div>
  );
};
