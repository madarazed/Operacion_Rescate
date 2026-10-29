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
      className="h-[100dvh] w-full relative overflow-hidden flex flex-col md:flex-row select-none bg-cover bg-[right_bottom] sm:bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/images/cover-rescate.png')",
      }}
    >
      {/* Overlays Cinematográficos */}
      {/* Móvil: Degradado oscuro vertical para que los controles inferiores no tapen el arte y los textos sean legibles */}
      <div className="absolute inset-0 bg-slate-950/20 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent md:hidden pointer-events-none" />
      {/* Escritorio: Degradado lateral suave para la columna de UI y controles */}
      <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/50 to-transparent pointer-events-none" />

      {/* COLUMNA IZQUIERDA (UI Y CONTROLES) */}
      <div className="w-full md:w-[48%] lg:w-[42%] xl:w-[38%] h-full flex flex-col justify-between p-3.5 sm:p-6 md:p-8 lg:p-10 z-20">
        {/* Cabecera y Título */}
        <header className="text-center md:text-left pt-1 sm:pt-2 md:pt-0">
          {/* Badge dorado centrado en móvil / alineado a la izquierda en PC */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="inline-flex items-center space-x-1.5 bg-gradient-to-r from-amber-500/20 via-amber-400/20 to-amber-500/20 border border-amber-400/40 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full shadow-md backdrop-blur-md mb-1.5 sm:mb-2"
          >
            <span className="text-[10px] sm:text-xs font-black text-amber-300 tracking-wider uppercase">
              🐾 JUEGO FAMILIAR & EDUCATIVO
            </span>
          </motion.div>

          {/* Título principal con tipografía enérgica */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-black uppercase tracking-wider filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.8)] text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 via-amber-300 to-orange-400 leading-tight">
              MISIÓN RESCATE
            </h1>

            {/* Subtítulo en turquesa / verde suave */}
            <p className="text-[11px] sm:text-xs md:text-sm lg:text-base font-bold text-teal-300 tracking-wider uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] mt-0.5 sm:mt-1">
              CÓDIGO PASR • PRIMEROS AUXILIOS VETERINARIOS
            </p>

            {/* Eslogan educativo */}
            <p className="text-xs sm:text-sm md:text-base text-slate-200 font-semibold mt-1 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] hidden sm:block">
              APRENDE A SALVAR VIDAS ANIMALES EN LA CALLE
            </p>
          </motion.div>
        </header>

        {/* Espaciador visual para móvil: deja visible el tercio superior/medio con la rescatista y el perro */}
        <div className="flex-1 md:hidden min-h-[30vh] pointer-events-none" />

        {/* Panel flotante compacto estilo cápsula/dock en móvil y sección integrada en PC */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="w-full max-w-lg mx-auto md:max-w-none bg-slate-900/85 backdrop-blur-md rounded-2xl sm:rounded-3xl border border-white/10 p-3 sm:p-4 shadow-2xl md:bg-transparent md:backdrop-blur-none md:border-0 md:p-0 md:shadow-none flex flex-col gap-3 md:gap-6"
        >
          {/* Botón Principal de Acción */}
          <div className="w-full flex justify-center md:justify-start">
            <button
              type="button"
              onClick={handleStart}
              className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-white font-black text-base sm:text-lg md:text-xl lg:text-2xl px-6 sm:px-8 py-3.5 sm:py-4 rounded-full shadow-[0_0_25px_rgba(16,185,129,0.5)] hover:shadow-[0_0_35px_rgba(16,185,129,0.7)] border-b-4 border-teal-800 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 sm:gap-3 cursor-pointer"
            >
              <span className="tracking-wide">¡COMENZAR MISIÓN!</span>
              <span>🐾</span>
              <span>▶</span>
            </button>
          </div>

          {/* Tarjetas Protocolo PASR */}
          <div className="grid grid-cols-3 gap-1.5 sm:gap-2.5 lg:gap-3 w-full">
            {/* Tarjeta 1: P: PROTEGER */}
            <div className="bg-slate-800/80 md:bg-slate-900/85 backdrop-blur-md border border-white/10 p-2 sm:p-2.5 lg:p-3 rounded-xl sm:rounded-2xl flex flex-col items-center text-center shadow-lg transition-transform hover:scale-102">
              <div className="text-base sm:text-xl lg:text-2xl mb-0.5 sm:mb-1">🛡️⚠️</div>
              <div className="text-[9px] xs:text-[10px] sm:text-xs font-black text-amber-300 tracking-tight whitespace-nowrap overflow-hidden text-ellipsis w-full">
                P: PROTEGER
              </div>
              <p className="text-[9px] sm:text-[11px] text-slate-300 mt-0.5 leading-tight hidden xs:block sm:block">
                Guantes y precaución
              </p>
            </div>

            {/* Tarjeta 2: A: ALERTAR */}
            <div className="bg-slate-800/80 md:bg-slate-900/85 backdrop-blur-md border border-white/10 p-2 sm:p-2.5 lg:p-3 rounded-xl sm:rounded-2xl flex flex-col items-center text-center shadow-lg transition-transform hover:scale-102">
              <div className="text-base sm:text-xl lg:text-2xl mb-0.5 sm:mb-1">📞📱</div>
              <div className="text-[9px] xs:text-[10px] sm:text-xs font-black text-cyan-300 tracking-tight whitespace-nowrap overflow-hidden text-ellipsis w-full">
                A: ALERTAR
              </div>
              <p className="text-[9px] sm:text-[11px] text-slate-300 mt-0.5 leading-tight hidden xs:block sm:block">
                Llamar emergencias
              </p>
            </div>

            {/* Tarjeta 3: S Y R: SOCORRER Y REMITIR */}
            <div className="bg-slate-800/80 md:bg-slate-900/85 backdrop-blur-md border border-white/10 p-2 sm:p-2.5 lg:p-3 rounded-xl sm:rounded-2xl flex flex-col items-center text-center shadow-lg transition-transform hover:scale-102">
              <div className="text-base sm:text-xl lg:text-2xl mb-0.5 sm:mb-1">🚑🏥</div>
              <div className="text-[9px] xs:text-[10px] sm:text-xs font-black text-emerald-300 tracking-tight whitespace-nowrap overflow-hidden text-ellipsis w-full">
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
