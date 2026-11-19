import React from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';

interface FloatingSymbol {
  icon: string;
  top: string;
  left: string;
  size: string;
  opacity: string;
  duration: number;
  delay: number;
}

const FLOATING_SYMBOLS: FloatingSymbol[] = [
  { icon: '🐾', top: '10%', left: '7%', size: 'text-2xl sm:text-3xl', opacity: 'opacity-15', duration: 6, delay: 0 },
  { icon: '✚', top: '22%', left: '88%', size: 'text-2xl sm:text-4xl', opacity: 'opacity-20 text-teal-300', duration: 7, delay: 1 },
  { icon: '🛡️', top: '75%', left: '6%', size: 'text-2xl sm:text-3xl', opacity: 'opacity-15', duration: 8, delay: 0.5 },
  { icon: '💓', top: '60%', left: '92%', size: 'text-2xl sm:text-3xl', opacity: 'opacity-15', duration: 6.5, delay: 1.5 },
  { icon: '🐾', top: '45%', left: '48%', size: 'text-xl sm:text-2xl', opacity: 'opacity-10', duration: 7.5, delay: 2 },
  { icon: '✚', top: '82%', left: '38%', size: 'text-xl sm:text-2xl', opacity: 'opacity-15 text-emerald-300', duration: 7, delay: 2.2 },
  { icon: '💓', top: '32%', left: '14%', size: 'text-xl sm:text-2xl', opacity: 'opacity-15', duration: 6, delay: 1.2 },
  { icon: '🛡️', top: '16%', left: '42%', size: 'text-xl sm:text-2xl', opacity: 'opacity-10', duration: 8, delay: 1.8 },
  { icon: '🐾', top: '84%', left: '80%', size: 'text-2xl sm:text-3xl', opacity: 'opacity-15', duration: 7.2, delay: 0.3 },
];

export const StartScreen: React.FC = () => {
  const startGame = useGameStore((state) => state.actions.startGame);
  const isRelaxedMode = useGameStore((state) => state.isRelaxedMode);
  const setRelaxedMode = useGameStore((state) => state.actions.setRelaxedMode);

  const handleStart = () => {
    try {
      navigator?.vibrate?.(60);
    } catch {
      // Ignore vibration error on unsupported platforms
    }
    startGame();
  };

  const renderHeroCard = (customClasses: string) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1, y: [-4, 4, -4] }}
      transition={{
        opacity: { duration: 0.4 },
        scale: { duration: 0.4 },
        y: { duration: 4.5, repeat: Infinity, ease: 'easeInOut' },
      }}
      className={`rounded-2xl sm:rounded-3xl border-2 border-teal-400/30 shadow-[0_0_35px_rgba(20,184,166,0.25)] overflow-hidden relative bg-slate-900/90 group ${customClasses}`}
    >
      <img
        src="/images/cover-rescate.png"
        alt="Rescatista, perrito y ambulancia de Misión Rescate"
        className="w-full h-full object-cover object-[75%_center] select-none pointer-events-none group-hover:scale-102 transition-transform duration-500"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-slate-950/30 pointer-events-none" />

      {/* Badge superior de Protocolo */}
      <div className="absolute top-2.5 left-2.5 sm:top-3.5 sm:left-3.5 z-10 inline-flex items-center space-x-1.5 bg-slate-950/85 backdrop-blur-md border border-amber-400/50 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full shadow-lg">
        <span className="text-amber-400 text-[10px] sm:text-xs">🐾</span>
        <span className="text-[9px] sm:text-[11px] font-black text-amber-300 tracking-wider uppercase">
          Protocolo Oficial PASR
        </span>
      </div>

      {/* Badge inferior de Vidas Salvadas */}
      <div className="absolute bottom-2.5 right-2.5 sm:bottom-3.5 sm:right-3.5 z-10 inline-flex items-center space-x-1.5 bg-slate-950/85 backdrop-blur-md border border-emerald-400/40 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full shadow-lg">
        <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-400 animate-ping" />
        <span className="text-[9px] sm:text-[11px] font-bold text-emerald-300">
          +100 Vidas Salvadas
        </span>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-[100dvh] lg:h-[100dvh] w-full flex flex-col justify-between p-3.5 sm:p-6 lg:p-8 relative overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal-900/40 via-slate-950 to-slate-950 select-none text-white">
      {/* 1. Malla táctica sutil */}
      <div className="absolute inset-0 opacity-15 pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="tactical-grid" width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M 32 0 L 0 0 0 32" fill="none" stroke="rgba(45, 212, 191, 0.25)" strokeWidth="0.8" />
              <circle cx="32" cy="0" r="1.2" fill="rgba(45, 212, 191, 0.4)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#tactical-grid)" />
        </svg>
      </div>

      {/* 2. Dos orbes de luz difuminada */}
      <div className="absolute -top-28 -left-28 w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none animate-pulse" />
      <div
        className="absolute -bottom-28 -right-28 w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-amber-500/15 blur-3xl pointer-events-none animate-pulse"
        style={{ animationDelay: '1.5s' }}
      />

      {/* 3. Símbolos temáticos flotantes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {FLOATING_SYMBOLS.map((s, idx) => (
          <motion.div
            key={idx}
            style={{ top: s.top, left: s.left }}
            className={`absolute select-none ${s.size} ${s.opacity}`}
            animate={{
              y: [-10, 10, -10],
              rotate: [-5, 5, -5],
            }}
            transition={{
              repeat: Infinity,
              duration: s.duration,
              delay: s.delay,
              ease: 'easeInOut',
            }}
          >
            {s.icon}
          </motion.div>
        ))}
      </div>

      {/* 4. CONTENIDO PRINCIPAL */}
      <div className="w-full max-w-6xl mx-auto my-auto z-20 flex-1 flex flex-col justify-between lg:grid lg:grid-cols-12 lg:gap-8 lg:items-center">
        {/* COLUMNA IZQUIERDA EN PC (7 cols) / SUPERIOR & INFERIOR EN MÓVIL */}
        <div className="lg:col-span-7 flex flex-col justify-between h-full lg:h-auto lg:space-y-6">
          {/* Header */}
          <header className="text-center lg:text-left pr-12 lg:pr-0 pt-0.5 sm:pt-1">
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="inline-flex items-center space-x-1.5 bg-slate-900/80 border border-amber-400/50 px-3 py-1 rounded-full shadow-lg backdrop-blur-md mb-1.5"
            >
              <span className="text-[10px] sm:text-xs font-black text-amber-300 tracking-wider uppercase drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                🐾 JUEGO FAMILIAR & EDUCATIVO
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <h1 className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black uppercase tracking-wider leading-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-amber-200 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                MISIÓN RESCATE
              </h1>

              <p className="text-xs sm:text-sm lg:text-base font-extrabold text-teal-300 tracking-wider uppercase drop-shadow mt-0.5">
                CÓDIGO PASR • PRIMEROS AUXILIOS VETERINARIOS
              </p>

              <p className="text-xs sm:text-sm text-slate-300 font-medium mt-1 hidden sm:block">
                Aprende el protocolo vital para salvar vidas de animales en la calle ante emergencias y accidentes.
              </p>
            </motion.div>
          </header>

          {/* Tarjeta Heroica en Móvil (Visible solo en móvil/tablet pequeña entre header y acciones) */}
          <div className="lg:hidden my-2 sm:my-3">
            {renderHeroCard('h-40 xs:h-48 sm:h-56 w-full')}
          </div>

          {/* Dock de Acciones, Selector de Modo y Tarjetas PASR */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.2 }}
            className="flex flex-col gap-2.5 sm:gap-4 lg:gap-5"
          >
            {/* Botón Principal + Selector de Modo */}
            <div className="flex flex-col items-center lg:items-start gap-2">
              <button
                type="button"
                onClick={handleStart}
                className="animate-bounce-gentle w-full sm:w-auto bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 active:scale-95 text-white font-black text-sm xs:text-base sm:text-lg lg:text-xl px-6 sm:px-8 py-3 sm:py-3.5 rounded-full shadow-[0_0_25px_rgba(16,185,129,0.6)] hover:shadow-[0_0_40px_rgba(16,185,129,0.95)] border-b-4 border-teal-800 transition-all hover:scale-105 flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <span className="tracking-wide">¡COMENZAR MISIÓN!</span>
                <span className="text-lg sm:text-2xl filter drop-shadow">🐾</span>
                <span className="text-base sm:text-xl filter drop-shadow">▶</span>
              </button>

              {/* Selector de Modo */}
              <div className="flex flex-col items-center lg:items-start gap-1">
                <div className="inline-flex p-1 rounded-full bg-slate-950/80 border border-white/20 shadow-md backdrop-blur-md">
                  <button
                    type="button"
                    onClick={() => setRelaxedMode(false)}
                    className={`px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                      !isRelaxedMode
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md'
                        : 'text-slate-300 hover:text-white'
                    }`}
                    title="Partida con 120s iniciales y bonificación de tiempo"
                  >
                    <span>⏱️</span>
                    <span>Con Tiempo</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRelaxedMode(true)}
                    className={`px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                      isRelaxedMode
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md'
                        : 'text-slate-300 hover:text-white'
                    }`}
                    title="Partida relajada sin presión de reloj"
                  >
                    <span>🌿</span>
                    <span>Sin Tiempo (Relajado)</span>
                  </button>
                </div>
                <p className="text-[10px] sm:text-xs text-slate-300/90 font-medium px-1 text-center lg:text-left drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                  {isRelaxedMode
                    ? '🌿 Modo Relajado: ideal para leer cada caso con calma y sin presión.'
                    : '⏱️ Modo Con Tiempo: 120s iniciales + bonos de +15s por cada acierto.'}
                </p>
              </div>
            </div>

            {/* Tarjetas PASR */}
            <div className="grid grid-cols-3 gap-1.5 sm:gap-3 w-full">
              {/* Tarjeta 1: P: PROTEGER */}
              <div className="group bg-slate-900/85 backdrop-blur-md rounded-xl border border-amber-400/40 hover:border-amber-400 hover:shadow-[0_0_15px_rgba(251,191,36,0.5)] p-1.5 sm:p-2.5 text-center transition-all duration-200 hover:scale-102 flex flex-col items-center justify-center">
                <div className="text-base sm:text-xl lg:text-2xl mb-0.5 group-hover:scale-110 transition-transform">
                  🛡️⚠️
                </div>
                <div className="text-[10px] sm:text-xs font-black text-amber-300 tracking-tight text-center leading-tight">
                  P: PROTEGER
                </div>
                <p className="text-[9px] sm:text-[11px] text-slate-300 mt-0.5 leading-tight hidden xs:block">
                  Guantes y cinta
                </p>
              </div>

              {/* Tarjeta 2: A: ALERTAR */}
              <div className="group bg-slate-900/85 backdrop-blur-md rounded-xl border border-cyan-400/40 hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(34,211,238,0.5)] p-1.5 sm:p-2.5 text-center transition-all duration-200 hover:scale-102 flex flex-col items-center justify-center">
                <div className="text-base sm:text-xl lg:text-2xl mb-0.5 group-hover:scale-110 transition-transform">
                  📞📱
                </div>
                <div className="text-[10px] sm:text-xs font-black text-cyan-300 tracking-tight text-center leading-tight">
                  A: ALERTAR
                </div>
                <p className="text-[9px] sm:text-[11px] text-slate-300 mt-0.5 leading-tight hidden xs:block">
                  Llamar 911
                </p>
              </div>

              {/* Tarjeta 3: S Y R: SOCORRER */}
              <div className="group bg-slate-900/85 backdrop-blur-md rounded-xl border border-rose-400/40 hover:border-rose-400 hover:shadow-[0_0_15px_rgba(244,63,94,0.5)] p-1.5 sm:p-2.5 text-center transition-all duration-200 hover:scale-102 flex flex-col items-center justify-center">
                <div className="text-base sm:text-xl lg:text-2xl mb-0.5 group-hover:scale-110 transition-transform">
                  🚑🏥
                </div>
                <div className="text-[9px] sm:text-xs font-black text-rose-300 tracking-tight text-center leading-tight">
                  S Y R: SOCORRER
                </div>
                <p className="text-[9px] sm:text-[11px] text-slate-300 mt-0.5 leading-tight hidden xs:block">
                  Triage y botiquín
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* COLUMNA DERECHA EN PC (5 cols): Tarjeta Heroica Protagonista */}
        <div className="lg:col-span-5 hidden lg:flex justify-center items-center">
          {renderHeroCard('w-full aspect-[4/5] max-w-md')}
        </div>
      </div>
    </div>
  );
};
