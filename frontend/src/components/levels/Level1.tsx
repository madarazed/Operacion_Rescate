import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import streetBg from '../../assets/backgrounds/level1-street-dog.jpg';
import { playDialTone } from '../../utils/soundEffects';

type Phase = 'PROTEGER' | 'ALERTAR';

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
    if (dialedNumber.length < 5) {
      setDialedNumber((prev) => prev + num);
    }
  };

  const handleClearDial = () => {
    triggerVibration(20);
    setDialedNumber('');
  };

  const handleFinalizarProtocolo = () => {
    triggerVibration(50);
    nextLevel();
  };

  return (
    <div
      className="w-full h-[100dvh] pt-14 relative overflow-hidden bg-cover bg-center flex flex-col justify-end"
      style={{ backgroundImage: `url(${streetBg})` }}
    >
      {/* Capa de oscurecimiento cinematográfico panorámico */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-black/40 pointer-events-none" />

      {/* Destellos ambientales de luces de emergencia (Rojo / Azul) */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-600/15 via-transparent to-blue-600/15 mix-blend-screen pointer-events-none animate-pulse" />

      {/* Cuadro de diálogo narrativo flotante en la parte inferior */}
      <div className="relative z-20 w-full px-3 pb-3 sm:px-6 sm:pb-6 flex justify-center">
        <div className="w-full max-w-lg bg-slate-900/85 backdrop-blur-md rounded-2xl border border-white/10 p-4 sm:p-6 shadow-2xl text-white space-y-3 sm:space-y-4">
          {phase === 'PROTEGER' && (
            <>
              <div className="space-y-1">
                <span className="inline-block bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Fase 1: Proteger
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Escena del Hallazgo
                </h2>
              </div>

              <p className="text-slate-200 text-xs sm:text-sm leading-relaxed">
                Encuentras a un perro atropellado en la vía. Está consciente pero
                asustado y adolorido, e intenta morder por reflejo defensivo.
                ¿Cuál es tu primera acción?
              </p>

              <div className="space-y-2.5 pt-1">
                <button
                  type="button"
                  onClick={handleAlzarInmediato}
                  className="w-full bg-red-600/90 hover:bg-red-600 active:scale-95 text-white font-semibold py-3 px-4 rounded-xl transition duration-150 text-left shadow border border-red-500/40 flex items-center justify-between text-sm sm:text-base cursor-pointer"
                >
                  <span>Alzar de inmediato</span>
                  <svg className="w-5 h-5 text-red-200 flex-shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                <button
                  type="button"
                  onClick={handleEvaluarEntorno}
                  className="w-full bg-emerald-600/90 hover:bg-emerald-600 active:scale-95 text-white font-semibold py-3 px-4 rounded-xl transition duration-150 text-left shadow border border-emerald-500/40 flex items-center justify-between text-sm sm:text-base cursor-pointer"
                >
                  <span>Evaluar entorno y usar barreras</span>
                  <svg className="w-5 h-5 text-emerald-200 flex-shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </button>
              </div>
            </>
          )}

          {phase === 'ALERTAR' && (
            <>
              <div className="space-y-1">
                <span className="inline-block bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Fase 2: Alertar
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Teléfono Virtual
                </h2>
              </div>

              <p className="text-slate-200 text-xs sm:text-sm leading-relaxed">
                Área asegurada con barreras de protección. Marca el 911 o pulsa llamar para alertar a la brigada de rescate.
              </p>

              {/* Marcador compacto */}
              <div className="bg-slate-950/90 rounded-xl p-2.5 sm:p-3 border border-slate-800 space-y-2">
                <div className="bg-slate-900 rounded-lg p-2 text-center h-10 flex items-center justify-center border border-slate-800">
                  <span className="text-xl font-mono tracking-widest text-emerald-400">
                    {dialedNumber || '911'}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-1.5">
                  {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map((digit) => (
                    <button
                      key={digit}
                      type="button"
                      onClick={() => handleKeyPress(digit)}
                      className="bg-slate-800/80 hover:bg-slate-700 active:scale-95 text-sm font-semibold py-1.5 rounded-lg flex items-center justify-center transition duration-150 cursor-pointer"
                    >
                      {digit}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-2 pt-0.5">
                  <button
                    type="button"
                    onClick={handleClearDial}
                    className="bg-slate-800 hover:bg-slate-700 active:scale-95 text-xs py-1.5 rounded-lg font-medium transition duration-150 cursor-pointer"
                  >
                    Borrar
                  </button>
                  <button
                    type="button"
                    onClick={handleFinalizarProtocolo}
                    className="bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-xs py-1.5 rounded-lg font-bold transition duration-150 cursor-pointer"
                  >
                    Llamar
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={handleFinalizarProtocolo}
                className="w-full bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-bold py-2.5 px-4 rounded-xl transition duration-150 text-center shadow-md flex items-center justify-center space-x-2 text-sm cursor-pointer"
              >
                <span>📞</span>
                <span>Llamar al 911 (Finalizar Fase)</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
