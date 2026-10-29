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

  const handleAlzarInmediato = () => {
    triggerGameOver('El animal te mordió por dolor y estrés.');
  };

  const handleEvaluarEntorno = () => {
    addScore(100);
    setPhase('ALERTAR');
  };

  const handleKeyPress = (num: string) => {
    playDialTone();
    if (dialedNumber.length < 5) {
      setDialedNumber((prev) => prev + num);
    }
  };

  const handleClearDial = () => {
    setDialedNumber('');
  };

  const handleFinalizarProtocolo = () => {
    nextLevel();
  };

  return (
    <div
      className="w-full h-full pt-14 relative overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: `url(${streetBg})` }}
    >
      {/* Capa de oscurecimiento suave */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent pointer-events-none" />

      {/* Panel flotante de decisiones PASR */}
      <div className="absolute top-20 left-4 md:left-8 z-20 w-[90%] sm:w-96 p-5 bg-slate-900/85 backdrop-blur-md rounded-2xl border border-slate-700/50 shadow-2xl text-white space-y-4">
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
                onClick={handleAlzarInmediato}
                className="w-full bg-red-600/90 hover:bg-red-600 active:scale-95 text-white font-semibold py-3 px-4 rounded-xl transition duration-150 text-left shadow border border-red-500/40 flex items-center justify-between text-sm"
              >
                <span>Alzar de inmediato</span>
                <svg className="w-4 h-4 text-red-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <button
                onClick={handleEvaluarEntorno}
                className="w-full bg-emerald-600/90 hover:bg-emerald-600 active:scale-95 text-white font-semibold py-3 px-4 rounded-xl transition duration-150 text-left shadow border border-emerald-500/40 flex items-center justify-between text-sm"
              >
                <span>Evaluar entorno y usar barreras</span>
                <svg className="w-4 h-4 text-emerald-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              <h2 className="text-xl font-bold text-white tracking-tight">
                Teléfono Virtual
              </h2>
            </div>

            <p className="text-slate-200 text-xs leading-relaxed">
              Área asegurada con barreras de protección. Marca el 911 o pulsa llamar para alertar a la brigada de rescate.
            </p>

            {/* Marcador compacto */}
            <div className="bg-slate-950/90 rounded-xl p-3 border border-slate-800 space-y-2.5">
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
                    className="bg-slate-800/80 hover:bg-slate-700 active:scale-95 text-sm font-semibold py-1.5 rounded-lg flex items-center justify-center transition duration-150"
                  >
                    {digit}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-2 pt-0.5">
                <button
                  type="button"
                  onClick={handleClearDial}
                  className="bg-slate-800 hover:bg-slate-700 active:scale-95 text-xs py-1.5 rounded-lg font-medium transition duration-150"
                >
                  Borrar
                </button>
                <button
                  type="button"
                  onClick={handleFinalizarProtocolo}
                  className="bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-xs py-1.5 rounded-lg font-bold transition duration-150"
                >
                  Llamar
                </button>
              </div>
            </div>

            <button
              onClick={handleFinalizarProtocolo}
              className="w-full bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-bold py-2.5 px-4 rounded-xl transition duration-150 text-center shadow-md flex items-center justify-center space-x-2 text-sm"
            >
              <span>📞</span>
              <span>Llamar al 911 (Finalizar Fase)</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};
