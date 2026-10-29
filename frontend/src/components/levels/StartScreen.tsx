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
      className="h-[100dvh] w-full relative overflow-hidden flex flex-col md:flex-row select-none bg-[68%_bottom] md:bg-center bg-cover bg-no-repeat"
      style={{
        backgroundImage: "url('/images/cover-rescate.png')",
      }}
    >
      {/* Overlays: Sin difuminados ni gradientes en móvil (100% brillante y natural). Sutil gradiente solo en PC a la izquierda */}
      <div className="hidden md:block absolute inset-0 md:bg-gradient-to-r md:from-slate-950/80 md:to-transparent pointer-events-none" />

      {/* COLUMNA IZQUIERDA (UI Y CONTROLES) */}
      <div className="w-full md:w-[48%] lg:w-[42%] xl:w-[38%] h-full flex flex-col justify-between p-3.5 sm:p-6 md:p-8 lg:p-10 z-20">
        {/* Cabecera Flotante */}
        <header className="text-center md:text-left pt-1 sm:pt-2 md:pt-0">
          {/* Badge dorado */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="inline-flex items-center space-x-1.5 bg-slate-900/80 border border-amber-400/50 px-3 py-1 rounded-full shadow-lg backdrop-blur-md mb-1.5 sm:mb-2"
          >
            <span className="text-[10px] sm:text-xs font-black text-amber-300 tracking-wider uppercase drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
              🐾 JUEGO FAMILIAR & EDUCATIVO
            </span>
          </motion.div>

          {/* Título principal con sombra fuerte para legibilidad sin opacar el arte */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] uppercase tracking-wider leading-tight">
              MISIÓN RESCATE
            </h1>

            {/* Subtítulo en turquesa con sombra fuerte */}
            <p className="text-xs sm:text-sm md:text-base font-bold text-teal-300 tracking-wider uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] mt-0.5 sm:mt-1">
              CÓDIGO PASR • PRIMEROS AUXILIOS VETERINARIOS
            </p>

            {/* Eslogan educativo */}
            <p className="text-xs sm:text-sm md:text-base text-slate-100 font-semibold mt-1 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] hidden sm:block">
              APRENDE A SALVAR VIDAS ANIMALES EN LA CALLE
            </p>
          </motion.div>
        </header>

        {/* Espaciador visual para móvil: deja visible el tercio superior/medio con los personajes brillantes */}
        <div className="flex-1 md:hidden min-h-[30vh] pointer-events-none" />

        {/* Panel flotante estilo dock en móvil y sección integrada en PC */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="w-full max-w-lg mx-auto md:max-w-none bg-slate-900/80 backdrop-blur-md rounded-2xl sm:rounded-3xl border border-white/20 p-3 sm:p-4 shadow-2xl md:bg-transparent md:backdrop-blur-none md:border-0 md:p-0 md:shadow-none flex flex-col gap-3 md:gap-6"
        >
          {/* Botón Principal de Acción interactivo con pulso continuo y resplandor esmeralda */}
          <div className="w-full flex justify-center md:justify-start">
            <button
              type="button"
              onClick={handleStart}
              className="animate-bounce-gentle w-full sm:w-auto bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-white font-black text-base sm:text-lg md:text-xl lg:text-2xl px-6 sm:px-8 py-3.5 sm:py-4 rounded-full shadow-[0_0_25px_rgba(16,185,129,0.7)] hover:shadow-[0_0_40px_rgba(16,185,129,0.95)] border-b-4 border-teal-800 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3 cursor-pointer"
            >
              <span className="tracking-wide">¡COMENZAR MISIÓN!</span>
              <span className="text-xl sm:text-2xl lg:text-3xl filter drop-shadow">🐾</span>
              <span className="text-lg sm:text-xl lg:text-2xl filter drop-shadow">▶</span>
            </button>
          </div>

          {/* Tarjetas / Burbujas interactivas del Protocolo PASR */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 w-full">
            {/* Tarjeta 1: P: PROTEGER (Neón Amarillo) */}
            <div className="group bg-slate-900/80 backdrop-blur-md rounded-xl border border-white/20 hover:border-amber-400 hover:shadow-[0_0_15px_rgba(251,191,36,0.6)] px-2.5 sm:px-3 py-2 text-center transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer flex flex-col items-center justify-center">
              <div className="text-lg sm:text-xl lg:text-2xl mb-0.5 group-hover:scale-110 transition-transform">
                🛡️⚠️
              </div>
              <div className="text-[9px] xs:text-[10px] sm:text-xs font-black text-amber-300 tracking-tight whitespace-nowrap overflow-hidden text-ellipsis w-full">
                P: PROTEGER
              </div>
              <p className="text-[9px] sm:text-[11px] text-slate-300 mt-0.5 leading-tight hidden xs:block sm:block">
                Guantes y cinta
              </p>
            </div>

            {/* Tarjeta 2: A: ALERTAR (Neón Azul) */}
            <div className="group bg-slate-900/80 backdrop-blur-md rounded-xl border border-white/20 hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(34,211,238,0.6)] px-2.5 sm:px-3 py-2 text-center transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer flex flex-col items-center justify-center">
              <div className="text-lg sm:text-xl lg:text-2xl mb-0.5 group-hover:scale-110 transition-transform">
                📞📱
              </div>
              <div className="text-[9px] xs:text-[10px] sm:text-xs font-black text-cyan-300 tracking-tight whitespace-nowrap overflow-hidden text-ellipsis w-full">
                A: ALERTAR
              </div>
              <p className="text-[9px] sm:text-[11px] text-slate-300 mt-0.5 leading-tight hidden xs:block sm:block">
                Llamar emergencias
              </p>
            </div>

            {/* Tarjeta 3: S Y R: SOCORRER Y REMITIR (Neón Rojo) */}
            <div className="group bg-slate-900/80 backdrop-blur-md rounded-xl border border-white/20 hover:border-rose-400 hover:shadow-[0_0_15px_rgba(244,63,94,0.6)] px-2.5 sm:px-3 py-2 text-center transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer flex flex-col items-center justify-center">
              <div className="text-lg sm:text-xl lg:text-2xl mb-0.5 group-hover:scale-110 transition-transform">
                🚑🏥
              </div>
              <div className="text-[9px] xs:text-[10px] sm:text-xs font-black text-rose-300 tracking-tight whitespace-nowrap overflow-hidden text-ellipsis w-full">
                S Y R: SOCORRER Y REMITIR
              </div>
              <p className="text-[9px] sm:text-[11px] text-slate-300 mt-0.5 leading-tight hidden xs:block sm:block">
                Triage y traslado
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* COLUMNA DERECHA (Espacio despejado para que se aprecie la ambulancia, el perrito y la rescatista) */}
      <div className="hidden md:flex flex-1 h-full pointer-events-none" />
    </div>
  );
};
