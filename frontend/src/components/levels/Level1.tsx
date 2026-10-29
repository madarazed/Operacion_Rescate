import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';
import streetBg from '../../assets/backgrounds/level1-street-dog.jpg';
import { playDialTone } from '../../utils/soundEffects';

type Phase = 'PROTEGER' | 'ALERTAR';

interface DialKey {
  digit: string;
  sub?: string;
}

const DIAL_KEYS: DialKey[] = [
  { digit: '1', sub: ' ' },
  { digit: '2', sub: 'ABC' },
  { digit: '3', sub: 'DEF' },
  { digit: '4', sub: 'GHI' },
  { digit: '5', sub: 'JKL' },
  { digit: '6', sub: 'MNO' },
  { digit: '7', sub: 'PQRS' },
  { digit: '8', sub: 'TUV' },
  { digit: '9', sub: 'WXYZ' },
  { digit: '*', sub: ' ' },
  { digit: '0', sub: '+' },
  { digit: '#', sub: ' ' },
];

export const Level1: React.FC = () => {
  const triggerGameOver = useGameStore((state) => state.actions.triggerGameOver);
  const addScore = useGameStore((state) => state.actions.addScore);
  const nextLevel = useGameStore((state) => state.actions.nextLevel);

  const [phase, setPhase] = useState<Phase>('PROTEGER');
  const [dialedNumber, setDialedNumber] = useState<string>('');

  const triggerVibration = (ms = 40) => {
    try {
      navigator?.vibrate?.(ms);
    } catch {
      // Ignore if vibration is not supported
    }
  };

  const handleAlzarInmediato = () => {
    triggerVibration(60);
    triggerGameOver('El animal te mordió por dolor y estrés al intentar alzarlo sin protección.');
  };

  const handleEvaluarEntorno = () => {
    triggerVibration(40);
    addScore(100);
    setPhase('ALERTAR');
  };

  const handleKeyPress = (num: string) => {
    triggerVibration(30);
    playDialTone();
    if (dialedNumber.length < 6) {
      setDialedNumber((prev) => prev + num);
    }
  };

  const handleClearDial = () => {
    triggerVibration(20);
    setDialedNumber((prev) => prev.slice(0, -1));
  };

  const handleResetDial = () => {
    triggerVibration(20);
    setDialedNumber('');
  };

  const handleFinalizarProtocolo = () => {
    triggerVibration(50);
    nextLevel();
  };

  return (
    <div className="w-full h-[100dvh] pt-14 flex flex-col justify-between overflow-hidden bg-slate-950 select-none">
      {/* Área Escénica Cinematográfica (Top 50-55% de pantalla) */}
      <div className="flex-1 w-full relative overflow-hidden flex items-end justify-center min-h-0">
        {/* Imagen panorámica de la calle */}
        <img
          src={streetBg}
          alt="Escena del hallazgo: perro herido en la calle"
          className="w-full h-full object-cover object-bottom sm:object-center select-none pointer-events-none"
        />

        {/* Destellos ambientales de luces de emergencia */}
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/15 via-transparent to-blue-600/15 mix-blend-screen pointer-events-none animate-pulse" />

        {/* Indicador visual pulsante sobre el perrito */}
        <div className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center pointer-events-none">
          <div className="relative flex items-center justify-center">
            <span className="absolute animate-ping inline-flex h-9 w-9 rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-500 border-2 border-white shadow-lg"></span>
          </div>
          <div className="mt-1 bg-slate-950/90 text-amber-300 border border-amber-500/50 backdrop-blur-md px-3 py-0.5 rounded-full text-[11px] sm:text-xs font-bold tracking-wide shadow-2xl flex items-center space-x-1.5">
            <span>⚠️</span>
            <span>Paciente en riesgo</span>
          </div>
        </div>

        {/* Degradado sutil para transición orgánica hacia el panel de comandos */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent pointer-events-none z-10" />
      </div>

      {/* Panel de Comandos con Transición Framer Motion */}
      <div className="w-full z-20 flex justify-center">
        <div className="w-full max-w-lg mx-auto p-4 sm:p-5 bg-slate-900/95 backdrop-blur-xl rounded-t-3xl sm:rounded-2xl border-t sm:border border-amber-500/30 shadow-[0_-10px_35px_rgba(0,0,0,0.7)]">
          <AnimatePresence mode="wait">
            {phase === 'PROTEGER' && (
              <motion.div
                key="fase-proteger"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="space-y-3"
              >
                {/* Header temático con badge dorado */}
                <div className="flex items-center justify-between pb-0.5">
                  <span className="inline-flex items-center space-x-1.5 bg-amber-500/15 text-amber-300 border border-amber-500/40 text-[11px] sm:text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                    <span>🚨</span>
                    <span>PROTOCOLO PAS: PROTEGER</span>
                  </span>
                  <span className="text-slate-400 text-xs font-mono font-semibold">Paso 1 de 2</span>
                </div>

                <div className="space-y-1">
                  <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    Escena del Hallazgo
                  </h2>
                  <p className="text-slate-200 text-xs sm:text-sm leading-relaxed">
                    Encuentras a un perro atropellado en la vía. Está consciente pero asustado y adolorido, e intenta morder por reflejo defensivo. ¿Cuál es tu primera acción?
                  </p>
                </div>

                {/* Botones de acción estilo control arcade */}
                <div className="space-y-2.5 pt-1">
                  <button
                    type="button"
                    onClick={handleAlzarInmediato}
                    className="w-full min-h-[50px] bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 active:scale-95 text-white font-bold py-2.5 px-4 rounded-xl transition-all text-left shadow-lg border-2 border-red-500/50 flex items-center justify-between text-sm sm:text-base cursor-pointer"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl flex-shrink-0">🛑</span>
                      <div>
                        <div className="font-extrabold tracking-wide text-white">Alzar de inmediato</div>
                        <div className="text-[11px] text-red-200 font-normal">Acción impulsiva de riesgo</div>
                      </div>
                    </div>
                    <svg className="w-5 h-5 text-red-200 flex-shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>

                  <button
                    type="button"
                    onClick={handleEvaluarEntorno}
                    className="w-full min-h-[50px] bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 active:scale-95 text-white font-bold py-2.5 px-4 rounded-xl transition-all text-left shadow-lg border-2 border-emerald-400/50 flex items-center justify-between text-sm sm:text-base cursor-pointer ring-1 ring-emerald-400/30"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl flex-shrink-0">🛡️</span>
                      <div>
                        <div className="font-extrabold tracking-wide text-white">Evaluar entorno y usar barreras</div>
                        <div className="text-[11px] text-emerald-200 font-normal">Seguridad vial y precaución</div>
                      </div>
                    </div>
                    <svg className="w-5 h-5 text-emerald-200 flex-shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </motion.div>
            )}

            {phase === 'ALERTAR' && (
              <motion.div
                key="fase-alertar"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.25 }}
                className="space-y-2.5"
              >
                {/* Header temático para la fase Alertar */}
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center space-x-1.5 bg-blue-500/15 text-blue-300 border border-blue-500/40 text-[11px] sm:text-xs font-extrabold px-3 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                    <span>📞</span>
                    <span>PROTOCOLO PAS: ALERTAR</span>
                  </span>
                  <span className="text-slate-400 text-xs font-mono font-semibold">Paso 2 de 2</span>
                </div>

                {/* Smartphone Dialer Container */}
                <div className="bg-slate-950/95 rounded-2xl p-3 border border-slate-800 shadow-2xl space-y-2">
                  {/* Pantalla del teléfono */}
                  <div className="bg-slate-900/90 rounded-xl p-2 text-center border border-slate-700/80 shadow-inner flex flex-col items-center justify-center">
                    <span className="text-[10px] text-slate-400 tracking-wider uppercase font-semibold">
                      Llamada de Emergencia
                    </span>
                    <span className="text-2xl font-mono tracking-widest text-emerald-400 font-extrabold h-8 flex items-center justify-center">
                      {dialedNumber || '911'}
                    </span>
                  </div>

                  {/* Teclas circulares estilo Smartphone moderno */}
                  <div className="grid grid-cols-3 gap-2 justify-items-center max-w-[280px] mx-auto py-1">
                    {DIAL_KEYS.map((item) => (
                      <button
                        key={item.digit}
                        type="button"
                        onClick={() => handleKeyPress(item.digit)}
                        className="w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-slate-800/90 hover:bg-slate-700 active:scale-95 text-white flex flex-col items-center justify-center transition-all cursor-pointer border border-slate-700 shadow-md group"
                      >
                        <span className="text-base sm:text-lg font-bold leading-none group-hover:scale-110 transition-transform">
                          {item.digit}
                        </span>
                        {item.sub && (
                          <span className="text-[8px] text-slate-400 font-bold tracking-tight leading-none mt-0.5">
                            {item.sub}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Barra de acción: Borrar, Botón Llamar con pulso, y Reset */}
                  <div className="flex items-center justify-center space-x-5 pt-1">
                    <button
                      type="button"
                      onClick={handleResetDial}
                      title="Reiniciar a 911"
                      className="w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 active:scale-90 text-slate-300 font-bold text-xs flex items-center justify-center border border-slate-700 cursor-pointer shadow transition"
                    >
                      911
                    </button>

                    {/* Botón verde de llamada telefónica con efecto de pulso */}
                    <button
                      type="button"
                      onClick={handleFinalizarProtocolo}
                      className="w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-600 to-emerald-400 hover:from-emerald-500 hover:to-emerald-300 active:scale-90 text-white flex items-center justify-center shadow-lg shadow-emerald-500/40 animate-pulse border-2 border-emerald-300/50 cursor-pointer transition"
                      aria-label="Conectar llamada de emergencia"
                    >
                      <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-2.2 2.2a15.053 15.053 0 01-6.59-6.59l2.2-2.21a.96.96 0 00.25-1A11.36 11.36 0 018.57 4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.62c0-.55-.45-1-1-1z" />
                      </svg>
                    </button>

                    <button
                      type="button"
                      onClick={handleClearDial}
                      title="Borrar dígito"
                      className="w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 active:scale-90 text-slate-300 font-bold text-xs flex items-center justify-center border border-slate-700 cursor-pointer shadow transition"
                    >
                      ⌫
                    </button>
                  </div>
                </div>

                {/* Botón de acceso rápido directo */}
                <button
                  type="button"
                  onClick={handleFinalizarProtocolo}
                  className="w-full min-h-[46px] bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 active:scale-95 text-white font-extrabold py-2.5 px-4 rounded-xl transition duration-150 text-center shadow-xl border border-blue-400/40 flex items-center justify-center space-x-2 text-sm cursor-pointer"
                >
                  <span className="text-lg">📞</span>
                  <span>Conectar Central 911 (Avanzar)</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
