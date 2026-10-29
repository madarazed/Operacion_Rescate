import React from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';

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
      className="w-full h-[100dvh] relative overflow-hidden bg-slate-950 bg-cover bg-center flex flex-col justify-end select-none"
      style={{ backgroundImage: "url('/images/cover-rescate.png')" }}
    >
      {/* Overlay suave exclusivamente en la base para dar contraste a los controles sin tapar la ilustración */}
      <div className="absolute inset-x-0 bottom-0 h-64 sm:h-80 bg-gradient-to-t from-slate-950 via-slate-950/75 to-transparent pointer-events-none z-10" />

      {/* Zona Inferior: Botón Principal y Tarjetas Base del Protocolo PASR */}
      <footer className="relative z-20 w-full max-w-xl mx-auto px-4 pb-4 sm:pb-6 space-y-3 sm:space-y-4">
        {/* Botón Principal: INICIAR MISIÓN con huellita 🐾 y flecha ▶ */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          <button
            type="button"
            onClick={handleStart}
            className="w-full group min-h-[56px] sm:min-h-[64px] py-3.5 sm:py-4 px-6 rounded-2xl bg-gradient-to-b from-teal-300 via-emerald-500 to-teal-700 hover:from-teal-200 hover:via-emerald-400 hover:to-teal-600 text-white font-black text-lg sm:text-2xl tracking-wide uppercase shadow-2xl shadow-emerald-500/40 hover:shadow-emerald-500/60 border-t-2 border-teal-200 border-b-4 border-emerald-900 transition-all duration-200 transform hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-between"
          >
            <span className="text-2xl sm:text-3xl filter drop-shadow group-hover:rotate-12 transition-transform">
              🐾
            </span>
            <span
              className="tracking-wider drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
              style={{ textShadow: '0 2px 4px rgba(0,0,0,0.7)' }}
            >
              INICIAR MISIÓN
            </span>
            <span className="text-xl sm:text-2xl filter drop-shadow group-hover:translate-x-1 transition-transform">
              ▶
            </span>
          </button>
        </motion.div>

        {/* Tarjetas de los 3 pasos en la base (estilo cards de cómic) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="grid grid-cols-3 gap-2 sm:gap-3"
        >
          {/* Tarjeta 1: P: PROTEGER */}
          <div className="bg-gradient-to-b from-amber-500/20 to-slate-900/95 border-2 border-amber-400/90 rounded-2xl p-2 sm:p-2.5 text-center shadow-lg shadow-amber-500/10 backdrop-blur-md flex flex-col justify-between transform hover:-translate-y-0.5 transition-transform">
            <div className="text-xl sm:text-2xl mb-0.5">🧤 ⚠️</div>
            <div>
              <div className="text-[11px] sm:text-xs font-black text-amber-300 tracking-tight leading-tight">
                P: PROTEGER
              </div>
              <p className="text-[9px] sm:text-[10px] text-slate-200 leading-tight mt-0.5 font-medium">
                Guantes y cinta de precaución
              </p>
            </div>
          </div>

          {/* Tarjeta 2: A: ALERTAR */}
          <div className="bg-gradient-to-b from-blue-500/20 to-slate-900/95 border-2 border-cyan-400/90 rounded-2xl p-2 sm:p-2.5 text-center shadow-lg shadow-cyan-500/10 backdrop-blur-md flex flex-col justify-between transform hover:-translate-y-0.5 transition-transform">
            <div className="text-xl sm:text-2xl mb-0.5">📱 🚨</div>
            <div>
              <div className="text-[11px] sm:text-xs font-black text-cyan-300 tracking-tight leading-tight">
                A: ALERTAR
              </div>
              <p className="text-[9px] sm:text-[10px] text-slate-200 leading-tight mt-0.5 font-medium">
                Teléfono de emergencias
              </p>
            </div>
          </div>

          {/* Tarjeta 3: S Y R: SOCORRER Y REMITIR */}
          <div className="bg-gradient-to-b from-emerald-500/20 to-slate-900/95 border-2 border-emerald-400/90 rounded-2xl p-2 sm:p-2.5 text-center shadow-lg shadow-emerald-500/10 backdrop-blur-md flex flex-col justify-between transform hover:-translate-y-0.5 transition-transform">
            <div className="text-xl sm:text-2xl mb-0.5">🚑 🏥</div>
            <div>
              <div className="text-[11px] sm:text-xs font-black text-emerald-300 tracking-tight leading-tight">
                S Y R: SOCORRER Y REMITIR
              </div>
              <p className="text-[9px] sm:text-[10px] text-slate-200 leading-tight mt-0.5 font-medium">
                Ambulancia y triage veterinario
              </p>
            </div>
          </div>
        </motion.div>
      </footer>
    </div>
  );
};
