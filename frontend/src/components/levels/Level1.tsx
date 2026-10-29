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
    <div className="w-full h-[100dvh] pt-14 flex flex-col justify-between overflow-hidden bg-slate-950 select-none">
      {/* Área Escénica Cinematográfica (Top 55-60% de pantalla) */}
      <div className="flex-1 w-full relative overflow-hidden flex items-end justify-center min-h-0">
        {/* Imagen panorámica de la calle con encuadre optimizado para centrar al perro */}
        <img
          src={streetBg}
          alt="Escena del hallazgo: perro herido en la calle"
          className="w-full h-full object-cover object-bottom sm:object-center select-none pointer-events-none"
        />

        {/* Destellos ambientales de luces de emergencia (Rojo / Azul) */}
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/15 via-transparent to-blue-600/15 mix-blend-screen pointer-events-none animate-pulse" />

        {/* Indicador visual pulsante sobre el perrito (Radar / Badge de riesgo) */}
        <div className="absolute bottom-8 sm:bottom-12 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center pointer-events-none">
          <div className="relative flex items-center justify-center">
            <span className="absolute animate-ping inline-flex h-9 w-9 rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-500 border-2 border-white shadow-lg"></span>
          </div>
          <div className="mt-1.5 bg-slate-950/90 text-amber-300 border border-amber-500/50 backdrop-blur-md px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold tracking-wide shadow-2xl flex items-center space-x-1.5">
            <span>⚠️</span>
            <span>Paciente en riesgo</span>
          </div>
        </div>

        {/* Degradado sutil para transición orgánica hacia el panel de comandos */}
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent pointer-events-none z-10" />
      </div>

      {/* Panel de Decisión (Bottom 40-45% de pantalla sin sobreponerse al perro) */}
      <div className="w-full z-20 flex justify-center">
        <div className="w-full max-w-lg mx-auto p-4 sm:p-6 bg-slate-900/95 backdrop-blur-xl rounded-t-3xl sm:rounded-2xl border-t sm:border border-amber-500/30 shadow-[0_-10px_30px_rgba(0,0,0,0.6)] space-y-3 sm:space-y-4">
          {phase === 'PROTEGER' && (
            <>
              {/* Header temático con badge dorado / ámbar */}
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

              {/* Botones de acción estilo control arcade / móvil */}
              <div className="space-y-2.5 pt-1">
                <button
                  type="button"
                  onClick={handleAlzarInmediato}
                  className="w-full min-h-[52px] bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 active:scale-95 text-white font-bold py-3 px-4 rounded-xl transition-all text-left shadow-lg border-2 border-red-500/50 flex items-center justify-between text-sm sm:text-base cursor-pointer"
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
                  className="w-full min-h-[52px] bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 active:scale-95 text-white font-bold py-3 px-4 rounded-xl transition-all text-left shadow-lg border-2 border-emerald-400/50 flex items-center justify-between text-sm sm:text-base cursor-pointer ring-1 ring-emerald-400/30"
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
            </>
          )}

          {phase === 'ALERTAR' && (
            <>
              {/* Header temático para la fase Alertar */}
              <div className="flex items-center justify-between pb-0.5">
                <span className="inline-flex items-center space-x-1.5 bg-blue-500/15 text-blue-300 border border-blue-500/40 text-[11px] sm:text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                  <span>📞</span>
                  <span>PROTOCOLO PAS: ALERTAR</span>
                </span>
                <span className="text-slate-400 text-xs font-mono font-semibold">Paso 2 de 2</span>
              </div>

              <div className="space-y-1">
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Central de Emergencias 911
                </h2>
                <p className="text-slate-200 text-xs sm:text-sm leading-relaxed">
                  Área asegurada. Marca el 911 en el teclado virtual o pulsa llamar para alertar a la brigada especializada de rescate.
                </p>
              </div>

              {/* Marcador telefónico compacto */}
              <div className="bg-slate-950/90 rounded-xl p-2.5 sm:p-3 border border-slate-800 space-y-2">
                <div className="bg-slate-900 rounded-lg p-2 text-center h-10 flex items-center justify-center border border-slate-700 shadow-inner">
                  <span className="text-xl font-mono tracking-widest text-emerald-400 font-bold">
                    {dialedNumber || '911'}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-1.5">
                  {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map((digit) => (
                    <button
                      key={digit}
                      type="button"
                      onClick={() => handleKeyPress(digit)}
                      className="bg-slate-800 hover:bg-slate-700 active:scale-95 text-sm sm:text-base font-bold py-1.5 rounded-lg flex items-center justify-center transition duration-150 cursor-pointer border border-slate-700 text-white shadow"
                    >
                      {digit}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-2 pt-0.5">
                  <button
                    type="button"
                    onClick={handleClearDial}
                    className="bg-slate-800 hover:bg-slate-700 active:scale-95 text-xs py-2 rounded-lg font-bold transition duration-150 cursor-pointer border border-slate-700 text-slate-300"
                  >
                    Borrar
                  </button>
                  <button
                    type="button"
                    onClick={handleFinalizarProtocolo}
                    className="bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-xs py-2 rounded-lg font-extrabold transition duration-150 cursor-pointer text-white shadow border border-emerald-400/40"
                  >
                    Conectar
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={handleFinalizarProtocolo}
                className="w-full min-h-[52px] bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 active:scale-95 text-white font-extrabold py-3 px-4 rounded-xl transition duration-150 text-center shadow-xl border-2 border-blue-400/40 flex items-center justify-center space-x-2 text-sm sm:text-base cursor-pointer"
              >
                <span className="text-xl">📞</span>
                <span>Llamar al 911 (Finalizar Fase)</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
