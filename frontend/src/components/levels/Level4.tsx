import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { playSuccessDrop, playErrorBuzzer } from '../../utils/soundEffects';

import triageBg from '../../assets/backgrounds/level2-triage-room.jpg';
import examineDogImg from '../../assets/characters/level3-examine-dog.png';
import firstAidKitImg from '../../assets/items/level4-first-aid-kit.png';
import gauzeCleanImg from '../../assets/items/level4-gauze-clean.png';
import gauzeBloodyImg from '../../assets/items/level4-gauze-bloody.png';
import bandageRollImg from '../../assets/items/level4-bandage-roll.png';

type ClinicalStep = 'INITIAL' | 'COMPRESSING' | 'SATURATED' | 'SECOND_GAUZE' | 'BANDAGED';

export const Level4: React.FC = () => {
  const addScore = useGameStore((state) => state.actions.addScore);
  const deductTime = useGameStore((state) => state.actions.deductTime);
  const nextLevel = useGameStore((state) => state.actions.nextLevel);

  const [step, setStep] = useState<ClinicalStep>('INITIAL');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleApplyFirstGauze = () => {
    if (step !== 'INITIAL') return;
    setErrorMessage(null);
    setStep('COMPRESSING');
    addScore(50);

    setTimeout(() => {
      setStep('SATURATED');
    }, 1500);
  };

  const handleOptionRetirarGasa = () => {
    playErrorBuzzer();
    deductTime(10);
    setErrorMessage('¡Error! Retirar la gasa rompe el coágulo primario y reactiva el sangrado profuso.');
  };

  const handleOptionSuperponerGasa = () => {
    playSuccessDrop();
    setErrorMessage(null);
    addScore(100);
    setStep('SECOND_GAUZE');
  };

  const handleApplyBandage = () => {
    if (step !== 'SECOND_GAUZE') return;
    playSuccessDrop();
    addScore(100);
    setStep('BANDAGED');
  };

  return (
    <div
      className="w-full h-full pt-14 relative overflow-hidden bg-cover bg-center flex flex-col md:flex-row items-center justify-between p-4 md:p-8"
      style={{ backgroundImage: `url(${triageBg})` }}
    >
      {/* Capa de oscurecimiento ambiental */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-black/70 pointer-events-none" />

      {/* Panel Lateral Flotante: Instrumental y Decisiones Clínicas */}
      <div className="relative z-20 w-full md:w-96 max-w-sm flex-shrink-0 flex flex-col justify-between space-y-4 bg-slate-900/85 text-white backdrop-blur-md rounded-2xl border border-slate-700/50 p-4 sm:p-5 shadow-2xl">
        <div className="space-y-3">
          <div>
            <span className="inline-block bg-red-500/20 text-red-300 border border-red-500/30 text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-1">
              Fase 4: Socorrer (Hemorragias)
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              Control de Sangrado
            </h2>
            <p className="text-slate-300 text-xs mt-1 leading-relaxed">
              El paciente presenta una herida lacerante con sangrado activo en la pata posterior.
              Aplica el protocolo estricto de hemostasia por presión.
            </p>
          </div>

          {/* Bandeja de Insumos */}
          <div className="bg-slate-950/90 rounded-xl p-3 border border-slate-800 space-y-2">
            <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400">
              Bandeja de Insumos Médicos
            </span>
            <div className="grid grid-cols-4 gap-2">
              <div className="flex flex-col items-center p-1.5 rounded-lg bg-slate-900/80 border border-slate-700 text-center">
                <img src={firstAidKitImg} alt="Botiquín" className="w-8 h-8 object-contain mb-1" />
                <span className="text-[9px] text-slate-300">Botiquín</span>
              </div>
              <div
                className={`flex flex-col items-center p-1.5 rounded-lg border text-center transition ${
                  step === 'INITIAL' || step === 'SATURATED'
                    ? 'bg-blue-950/40 border-blue-500/50 ring-1 ring-blue-400'
                    : 'bg-slate-900/50 border-slate-800 opacity-60'
                }`}
              >
                <img src={gauzeCleanImg} alt="Gasa Limpia" className="w-8 h-8 object-contain mb-1" />
                <span className="text-[9px] text-slate-300">Gasa Limpia</span>
              </div>
              <div
                className={`flex flex-col items-center p-1.5 rounded-lg border text-center transition ${
                  step === 'SATURATED' || step === 'SECOND_GAUZE'
                    ? 'bg-red-950/40 border-red-500/50 ring-1 ring-red-400'
                    : 'bg-slate-900/50 border-slate-800 opacity-60'
                }`}
              >
                <img src={gauzeBloodyImg} alt="Gasa Saturada" className="w-8 h-8 object-contain mb-1" />
                <span className="text-[9px] text-slate-300">Gasa Sangre</span>
              </div>
              <div
                className={`flex flex-col items-center p-1.5 rounded-lg border text-center transition ${
                  step === 'SECOND_GAUZE'
                    ? 'bg-emerald-950/40 border-emerald-500/50 ring-1 ring-emerald-400 animate-pulse'
                    : 'bg-slate-900/50 border-slate-800 opacity-60'
                }`}
              >
                <img src={bandageRollImg} alt="Venda Elástica" className="w-8 h-8 object-contain mb-1" />
                <span className="text-[9px] text-slate-300">Venda</span>
              </div>
            </div>
          </div>

          {/* Banner de Error Clínico */}
          {errorMessage && (
            <div className="bg-red-950/90 border border-red-500 text-red-200 text-xs p-3 rounded-xl shadow-lg flex items-start space-x-2 animate-bounce">
              <span className="text-base leading-none">⚠️</span>
              <p className="leading-snug">{errorMessage}</p>
            </div>
          )}

          {/* Opciones Interactivas Según la Fase */}
          <div className="space-y-2 pt-1">
            {step === 'INITIAL' && (
              <button
                type="button"
                onClick={handleApplyFirstGauze}
                className="w-full bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-bold py-3 px-4 rounded-xl transition shadow-lg flex items-center justify-center space-x-2 text-xs sm:text-sm"
              >
                <span>🩹</span>
                <span>Aplicar Gasa Limpia a la Herida</span>
              </button>
            )}

            {step === 'COMPRESSING' && (
              <div className="w-full bg-cyan-950/50 border border-cyan-500/50 text-cyan-200 p-3 rounded-xl text-center text-xs font-semibold animate-pulse flex items-center justify-center space-x-2">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                <span>Ejerciendo compresión directa firme (1.5s)...</span>
              </div>
            )}

            {step === 'SATURATED' && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-amber-300">
                  ¿Qué decisión tomas ante la gasa empapada de sangre?
                </p>
                <button
                  type="button"
                  onClick={handleOptionRetirarGasa}
                  className="w-full bg-red-900/60 hover:bg-red-800/80 active:scale-95 text-red-200 font-medium py-2.5 px-3 rounded-xl border border-red-600/50 transition text-xs text-left"
                >
                  ✖ Retirar la gasa llena de sangre y poner una nueva
                </button>
                <button
                  type="button"
                  onClick={handleOptionSuperponerGasa}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold py-2.5 px-3 rounded-xl border border-emerald-400 transition text-xs text-left shadow-lg"
                >
                  ✔ Mantener la gasa y colocar una segunda gasa limpia encima
                </button>
              </div>
            )}

            {step === 'SECOND_GAUZE' && (
              <div className="space-y-2">
                <p className="text-xs text-emerald-300 font-medium">
                  Coágulo protegido con la segunda gasa. Ahora asegura la hemostasia.
                </p>
                <button
                  type="button"
                  onClick={handleApplyBandage}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold py-3 px-4 rounded-xl transition shadow-lg flex items-center justify-center space-x-2 text-xs sm:text-sm"
                >
                  <span>🧻</span>
                  <span>Aplicar Vendaje Compresivo</span>
                </button>
              </div>
            )}

            {step === 'BANDAGED' && (
              <div className="space-y-2">
                <div className="bg-emerald-950/60 border border-emerald-500 text-emerald-200 p-3 rounded-xl text-xs space-y-1">
                  <p className="font-bold">✓ ¡Hemorragia controlada con éxito!</p>
                  <p className="text-[11px] text-slate-300">
                    Paciente estabilizado, vendaje compresivo firme y perfusión distal conservada.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Botón de Siguiente Nivel / Conclusión */}
        <div>
          {step === 'BANDAGED' && (
            <button
              type="button"
              onClick={() => nextLevel()}
              className="w-full bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold py-3 px-4 rounded-xl transition shadow-xl text-sm flex items-center justify-center space-x-2 animate-pulse"
            >
              <span>Finalizar Misión de Rescate</span>
              <span>➔</span>
            </button>
          )}
        </div>
      </div>

      {/* Escena Central: Paciente Canino con Herida y Capas de Insumos */}
      <div className="relative z-10 flex-1 w-full h-full flex items-center justify-center p-2 sm:p-6">
        <div className="relative max-w-md md:max-w-xl w-full flex items-center justify-center">
          {/* Sprite del animal con transparencia nativa */}
          <img
            src={examineDogImg}
            alt="Paciente Canino con hemorragia"
            className="w-full max-h-[360px] sm:max-h-[440px] object-contain drop-shadow-2xl select-none pointer-events-none"
          />

          {/* Zona de Herida / Hemorragia en pata posterior */}
          <div
            style={{ top: '60%', left: '74%' }}
            className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center z-30"
          >
            {/* Estado 1: Herida sangrante activa */}
            {step === 'INITIAL' && (
              <button
                type="button"
                onClick={handleApplyFirstGauze}
                title="Herida con sangrado activo - Clic para aplicar gasa"
                className="relative flex items-center justify-center group cursor-pointer focus:outline-none"
              >
                <span className="animate-ping absolute inline-flex h-12 w-12 rounded-full bg-red-600 opacity-90" />
                <span className="relative flex items-center justify-center h-10 w-10 rounded-full bg-red-600 ring-4 ring-red-400 text-white font-bold text-sm shadow-2xl">
                  🩸
                </span>
                <span className="absolute -bottom-7 whitespace-nowrap bg-red-950/90 text-red-200 text-[10px] px-2 py-0.5 rounded border border-red-500 shadow">
                  Sangrado Activo
                </span>
              </button>
            )}

            {/* Estado 2: Gasa limpia ejerciendo presión */}
            {step === 'COMPRESSING' && (
              <div className="relative flex flex-col items-center animate-pulse">
                <img
                  src={gauzeCleanImg}
                  alt="Gasa limpia sobre herida"
                  className="w-16 h-16 object-contain drop-shadow-lg"
                />
                <span className="text-[10px] bg-black/85 text-cyan-300 px-2 py-0.5 rounded mt-1 border border-cyan-400">
                  Presión directa
                </span>
              </div>
            )}

            {/* Estado 3: Gasa con sangre saturada */}
            {step === 'SATURATED' && (
              <div className="relative flex flex-col items-center animate-bounce">
                <img
                  src={gauzeBloodyImg}
                  alt="Gasa empapada de sangre"
                  className="w-16 h-16 object-contain drop-shadow-lg"
                />
                <span className="text-[10px] bg-red-950 text-red-300 px-2 py-0.5 rounded mt-1 border border-red-500 font-bold">
                  Gasa Saturada
                </span>
              </div>
            )}

            {/* Estado 4: Segunda gasa limpia superpuesta */}
            {step === 'SECOND_GAUZE' && (
              <div className="relative flex flex-col items-center">
                <div className="relative w-16 h-16 flex items-center justify-center">
                  <img
                    src={gauzeBloodyImg}
                    alt="Gasa con sangre inferior"
                    className="w-16 h-16 object-contain absolute opacity-70"
                  />
                  <img
                    src={gauzeCleanImg}
                    alt="Segunda gasa limpia superior"
                    className="w-14 h-14 object-contain relative drop-shadow-lg"
                  />
                </div>
                <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded mt-1 border border-emerald-500 font-bold">
                  Coágulo protegido
                </span>
              </div>
            )}

            {/* Estado 5: Vendaje compresivo aplicado */}
            {step === 'BANDAGED' && (
              <div className="relative flex flex-col items-center animate-fade-in">
                <div className="relative w-16 h-16 flex items-center justify-center">
                  <img
                    src={bandageRollImg}
                    alt="Vendaje compresivo"
                    className="w-16 h-16 object-contain drop-shadow-xl"
                  />
                  <span className="absolute text-xl font-bold text-emerald-400 drop-shadow">
                    ✓
                  </span>
                </div>
                <span className="text-[10px] bg-emerald-600 text-white px-2.5 py-0.5 rounded mt-1 shadow font-bold tracking-wide">
                  Vendaje Seguro
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
