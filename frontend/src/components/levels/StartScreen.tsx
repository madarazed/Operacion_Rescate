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
      animate={{ opacity: 1, scale: 1, y: [-3, 3, -3] }}
      transition={{
        opacity: { duration: 0.35 },
        scale: { duration: 0.35 },
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
      <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10 inline-flex items-center space-x-1.5 bg-slate-950/85 backdrop-blur-md border border-amber-400/50 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full shadow-lg">
        <span className="text-amber-400 text-[10px] sm:text-xs">🐾</span>
        <span className="text-[9px] sm:text-[11px] font-black text-amber-300 tracking-wider uppercase">
          Protocolo Oficial PASR
        </span>
      </div>

      {/* Badge inferior de Vidas Salvadas */}
      <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 z-10 inline-flex items-center space-x-1.5 bg-slate-950/85 backdrop-blur-md border border-emerald-400/40 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full shadow-lg">
        <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-400 animate-ping" />
        <span className="text-[9px] sm:text-[11px] font-bold text-emerald-300">
          +100 Vidas Salvadas
        </span>
      </div>
    </motion.div>
  );

  return (
    <div className="h-[100dvh] w-full flex flex-col justify-between p-3 sm:p-6 lg:p-8 relative overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal-900/40 via-slate-950 to-slate-950 select-none text-white">
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

      {/* 4. VISTA MÓVIL (h-full flex flex-col justify-between lg:hidden z-20) */}
      <div className="flex-1 flex flex-col justify-between h-full min-h-0 w-full lg:hidden z-20">
        {/* Zona Superior (shrink-0 pt-2) */}
        <header className="shrink-0 pt-1 sm:pt-2 pr-12 text-center sm:text-left">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="inline-flex items-center space-x-1.5 bg-slate-900/80 border border-amber-400/50 px-2.5 py-0.5 rounded-full shadow-lg backdrop-blur-md mb-1"
          >
            <span className="text-[10px] font-black text-amber-300 tracking-wider uppercase">
              🐾 JUEGO FAMILIAR & EDUCATIVO
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <h1 className="text-2xl xs:text-3xl font-black uppercase tracking-wider leading-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-amber-200 drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
              MISIÓN RESCATE
            </h1>

            <p className="text-[11px] xs:text-xs font-extrabold text-teal-300 tracking-wider uppercase drop-shadow">
              CÓDIGO PASR • PRIMEROS AUXILIOS VETERINARIOS
            </p>
          </motion.div>
        </header>

        {/* Zona Central (flex-1 min-h-0 my-3 flex items-center): Tarjeta ilustrada flexible que ocupa el centro */}
        <div className="flex-1 min-h-0 my-2.5 sm:my-3 flex items-center justify-center">
          {renderHeroCard('h-full w-full max-h-[38vh]')}
        </div>

        {/* Zona Inferior / Dock (shrink-0 flex flex-col gap-2.5 pb-2) */}
        <div className="shrink-0 flex flex-col gap-2.5 pb-1 sm:pb-2">
          {/* 1. Las 3 Tarjetas PASR */}
          <div className="grid grid-cols-3 gap-1.5 sm:gap-2 w-full">
            {/* P: PROTEGER */}
            <div className="bg-slate-900/85 backdrop-blur-md rounded-xl border border-amber-400/40 p-1.5 text-center flex flex-col items-center justify-center">
              <span className="text-base sm:text-lg mb-0.5">🛡️⚠️</span>
              <span className="text-[10px] sm:text-xs font-black text-amber-300 tracking-tight leading-tight">
                P: PROTEGER
              </span>
              <span className="text-[9px] text-slate-300 hidden xs:block">
                Guantes y cinta
              </span>
            </div>

            {/* A: ALERTAR */}
            <div className="bg-slate-900/85 backdrop-blur-md rounded-xl border border-cyan-400/40 p-1.5 text-center flex flex-col items-center justify-center">
              <span className="text-base sm:text-lg mb-0.5">📞📱</span>
              <span className="text-[10px] sm:text-xs font-black text-cyan-300 tracking-tight leading-tight">
                A: ALERTAR
              </span>
              <span className="text-[9px] text-slate-300 hidden xs:block">
                Llamar 911
              </span>
            </div>

            {/* S Y R: SOCORRER */}
            <div className="bg-slate-900/85 backdrop-blur-md rounded-xl border border-rose-400/40 p-1.5 text-center flex flex-col items-center justify-center">
              <span className="text-base sm:text-lg mb-0.5">🚑🏥</span>
              <span className="text-[9px] sm:text-xs font-black text-rose-300 tracking-tight leading-tight">
                S Y R: SOCORRER
              </span>
              <span className="text-[9px] text-slate-300 hidden xs:block">
                Triage y botiquín
              </span>
            </div>
          </div>

          {/* 2. Selector de Modo con su descripción */}
          <div className="flex flex-col items-center gap-1">
            <div className="inline-flex p-1 rounded-full bg-slate-950/80 border border-white/20 shadow-md backdrop-blur-md">
              <button
                type="button"
                onClick={() => setRelaxedMode(false)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                  !isRelaxedMode
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <span>⏱️</span>
                <span>Con Tiempo</span>
              </button>
              <button
                type="button"
                onClick={() => setRelaxedMode(true)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                  isRelaxedMode
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <span>🌿</span>
                <span>Sin Tiempo</span>
              </button>
            </div>
            <p className="text-[10px] text-slate-300/90 font-medium px-1 text-center drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
              {isRelaxedMode
                ? '🌿 Modo Relajado: lee y aprende a tu ritmo sin reloj.'
                : '⏱️ Modo Con Tiempo: 120s iniciales + bonos de +15s por cada acierto.'}
            </p>
          </div>

          {/* 3. Botón Principal (Al final, al alcance natural del pulgar) */}
          <button
            type="button"
            onClick={handleStart}
            className="animate-bounce-gentle w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 active:scale-95 text-white font-black text-base sm:text-lg py-3 sm:py-3.5 rounded-full shadow-[0_0_25px_rgba(16,185,129,0.6)] hover:shadow-[0_0_40px_rgba(16,185,129,0.95)] border-b-4 border-teal-800 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
          >
            <span className="tracking-wide">¡COMENZAR MISIÓN!</span>
            <span className="text-xl filter drop-shadow">🐾</span>
            <span className="text-lg filter drop-shadow">▶</span>
          </button>
        </div>
      </div>

      {/* 5. VISTA ESCRITORIO (hidden lg:grid lg:grid-cols-12 max-w-6xl mx-auto my-auto z-20) */}
      <div className="hidden lg:grid lg:grid-cols-12 lg:gap-8 lg:items-center w-full max-w-6xl mx-auto my-auto z-20">
        {/* Columna Izquierda (7 cols) */}
        <div className="lg:col-span-7 flex flex-col space-y-6">
          <header className="text-left">
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="inline-flex items-center space-x-1.5 bg-slate-900/80 border border-amber-400/50 px-3 py-1 rounded-full shadow-lg backdrop-blur-md mb-2"
            >
              <span className="text-xs font-black text-amber-300 tracking-wider uppercase drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                🐾 JUEGO FAMILIAR & EDUCATIVO
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <h1 className="text-5xl xl:text-6xl font-black uppercase tracking-wider leading-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-amber-200 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                MISIÓN RESCATE
              </h1>

              <p className="text-base font-extrabold text-teal-300 tracking-wider uppercase drop-shadow mt-1">
                CÓDIGO PASR • PRIMEROS AUXILIOS VETERINARIOS
              </p>

              <p className="text-sm text-slate-300 font-medium mt-1.5">
                Aprende el protocolo vital para salvar vidas de animales en la calle ante emergencias y accidentes.
              </p>
            </motion.div>
          </header>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.2 }}
            className="flex flex-col gap-6"
          >
            {/* Botón Principal + Selector de Modo */}
            <div className="flex flex-col items-start gap-3">
              <button
                type="button"
                onClick={handleStart}
                className="animate-bounce-gentle bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 active:scale-95 text-white font-black text-xl px-8 py-4 rounded-full shadow-[0_0_25px_rgba(16,185,129,0.6)] hover:shadow-[0_0_40px_rgba(16,185,129,0.95)] border-b-4 border-teal-800 transition-all hover:scale-105 flex items-center justify-center gap-3 cursor-pointer"
              >
                <span className="tracking-wide">¡COMENZAR MISIÓN!</span>
                <span className="text-2xl filter drop-shadow">🐾</span>
                <span className="text-xl filter drop-shadow">▶</span>
              </button>

              {/* Selector de Modo */}
              <div className="flex flex-col items-start gap-1">
                <div className="inline-flex p-1 rounded-full bg-slate-950/80 border border-white/20 shadow-md backdrop-blur-md">
                  <button
                    type="button"
                    onClick={() => setRelaxedMode(false)}
                    className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                      !isRelaxedMode
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    <span>⏱️</span>
                    <span>Con Tiempo</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRelaxedMode(true)}
                    className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                      isRelaxedMode
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    <span>🌿</span>
                    <span>Sin Tiempo (Relajado)</span>
                  </button>
                </div>
                <p className="text-xs text-slate-300/90 font-medium px-1 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                  {isRelaxedMode
                    ? '🌿 Modo Relajado: ideal para leer cada caso con calma y sin presión.'
                    : '⏱️ Modo Con Tiempo: 120s iniciales + bonos de +15s por cada acierto.'}
                </p>
              </div>
            </div>

            {/* Tarjetas PASR */}
            <div className="grid grid-cols-3 gap-3 w-full">
              {/* P: PROTEGER */}
              <div className="group bg-slate-900/85 backdrop-blur-md rounded-xl border border-amber-400/40 hover:border-amber-400 hover:shadow-[0_0_15px_rgba(251,191,36,0.5)] p-2.5 text-center transition-all duration-200 hover:scale-102 flex flex-col items-center justify-center">
                <div className="text-2xl mb-0.5 group-hover:scale-110 transition-transform">
                  🛡️⚠️
                </div>
                <div className="text-xs font-black text-amber-300 tracking-tight text-center leading-tight">
                  P: PROTEGER
                </div>
                <p className="text-[11px] text-slate-300 mt-0.5 leading-tight">
                  Guantes y cinta
                </p>
              </div>

              {/* A: ALERTAR */}
              <div className="group bg-slate-900/85 backdrop-blur-md rounded-xl border border-cyan-400/40 hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(34,211,238,0.5)] p-2.5 text-center transition-all duration-200 hover:scale-102 flex flex-col items-center justify-center">
                <div className="text-2xl mb-0.5 group-hover:scale-110 transition-transform">
                  📞📱
                </div>
                <div className="text-xs font-black text-cyan-300 tracking-tight text-center leading-tight">
                  A: ALERTAR
                </div>
                <p className="text-[11px] text-slate-300 mt-0.5 leading-tight">
                  Llamar 911
                </p>
              </div>

              {/* S Y R: SOCORRER */}
              <div className="group bg-slate-900/85 backdrop-blur-md rounded-xl border border-rose-400/40 hover:border-rose-400 hover:shadow-[0_0_15px_rgba(244,63,94,0.5)] p-2.5 text-center transition-all duration-200 hover:scale-102 flex flex-col items-center justify-center">
                <div className="text-2xl mb-0.5 group-hover:scale-110 transition-transform">
                  🚑🏥
                </div>
                <div className="text-xs font-black text-rose-300 tracking-tight text-center leading-tight">
                  S Y R: SOCORRER
                </div>
                <p className="text-[11px] text-slate-300 mt-0.5 leading-tight">
                  Triage y botiquín
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Columna Derecha (5 cols): Tarjeta Heroica Protagonista */}
        <div className="lg:col-span-5 flex justify-center items-center">
          {renderHeroCard('w-full aspect-[4/5] max-w-md')}
        </div>
      </div>
    </div>
  );
};
