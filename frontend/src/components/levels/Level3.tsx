import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { playHeartbeat } from '../../utils/soundEffects';

import triageBg from '../../assets/backgrounds/level2-triage-room.jpg';
import examineDogImg from '../../assets/characters/level3-examine-dog.png';

type InspectionKey = 'airway' | 'breathing' | 'circulation';

interface InspectionConfig {
  key: InspectionKey;
  letter: 'A' | 'B' | 'C';
  title: string;
  locationLabel: string;
  findingText: string;
  hotspotTop: string;
  hotspotLeft: string;
}

const INSPECTIONS: InspectionConfig[] = [
  {
    key: 'airway',
    letter: 'A',
    title: 'Comprobar Vía Aérea',
    locationLabel: 'Cabeza / Hocico',
    findingText: 'El animal responde con la mirada, vía aérea despejada.',
    hotspotTop: '28%',
    hotspotLeft: '22%',
  },
  {
    key: 'breathing',
    letter: 'B',
    title: 'Evaluar Ventilación',
    locationLabel: 'Tórax / Pecho',
    findingText: 'Respiración rápida pero regular (35 rpm), sin ruidos obstructivos.',
    hotspotTop: '46%',
    hotspotLeft: '48%',
  },
  {
    key: 'circulation',
    letter: 'C',
    title: 'Verificar Circulación',
    locationLabel: 'Extremidades / Femoral',
    findingText: 'Pulso femoral rápido pero perceptible, mucosas rosadas.',
    hotspotTop: '60%',
    hotspotLeft: '74%',
  },
];

export const Level3: React.FC = () => {
  const addScore = useGameStore((state) => state.actions.addScore);
  const nextLevel = useGameStore((state) => state.actions.nextLevel);

  const [checks, setChecks] = useState<Record<InspectionKey, boolean>>({
    airway: false,
    breathing: false,
    circulation: false,
  });

  const [activeInspection, setActiveInspection] = useState<InspectionConfig | null>(null);

  const handleInspect = (inspection: InspectionConfig) => {
    playHeartbeat();
    setActiveInspection(inspection);

    if (!checks[inspection.key]) {
      addScore(50);
      setChecks((prev) => ({
        ...prev,
        [inspection.key]: true,
      }));
    }
  };

  const allCompleted = checks.airway && checks.breathing && checks.circulation;

  return (
    <div
      className="w-full h-full pt-14 relative overflow-hidden bg-cover bg-center flex flex-col md:flex-row items-center justify-between p-4 md:p-8"
      style={{ backgroundImage: `url(${triageBg})` }}
    >
      {/* Capa de oscurecimiento ambiental */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-black/70 pointer-events-none" />

      {/* Panel Flotante Lateral Izquierdo: Checklist e Información */}
      <div className="relative z-20 w-full md:w-96 max-w-sm flex-shrink-0 flex flex-col justify-between space-y-4 bg-slate-900/85 text-white backdrop-blur-md rounded-2xl border border-slate-700/50 p-4 sm:p-5 shadow-2xl">
        <div className="space-y-3">
          <div>
            <span className="inline-block bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-1">
              Fase 3: Socorrer (Examen ABCDE)
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              Evaluación Primaria
            </h2>
            <p className="text-slate-300 text-xs mt-1">
              Haz clic en los puntos anatómicos del paciente o en el checklist para auscultar:
            </p>
          </div>

          {/* Checklist interactivo */}
          <div className="space-y-2">
            {INSPECTIONS.map((item) => {
              const isChecked = checks[item.key];
              const isSelected = activeInspection?.key === item.key;

              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => handleInspect(item)}
                  className={`w-full text-left p-2.5 rounded-xl border transition duration-150 flex items-center justify-between text-xs sm:text-sm ${
                    isChecked
                      ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
                      : isSelected
                      ? 'bg-cyan-950/50 border-cyan-400 text-cyan-200 ring-1 ring-cyan-400'
                      : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <span
                      className={`w-5 h-5 rounded-md flex items-center justify-center font-bold text-xs flex-shrink-0 border ${
                        isChecked
                          ? 'bg-emerald-500 border-emerald-400 text-white'
                          : 'border-slate-500 text-slate-400 bg-slate-900'
                      }`}
                    >
                      {isChecked ? '✓' : item.letter}
                    </span>
                    <span className="font-semibold truncate">
                      {item.letter}. {item.title}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 ml-2 flex-shrink-0">
                    {item.locationLabel}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Cuadro de Hallazgo Clínico Actual */}
          <div className="bg-slate-950/90 rounded-xl p-3 border border-slate-800 space-y-1">
            <span className="text-[10px] font-bold tracking-wider uppercase text-cyan-400">
              Diagnóstico / Observación
            </span>
            <p className="text-xs text-slate-200 leading-relaxed min-h-[40px] flex items-center">
              {activeInspection ? (
                activeInspection.findingText
              ) : (
                <span className="text-slate-400 italic">
                  Toca un punto interactivo en el cuerpo del perro para auscultar sus signos vitales.
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Botón de desbloqueo al completar los 3 checks */}
        <div>
          <button
            type="button"
            disabled={!allCompleted}
            onClick={() => nextLevel()}
            className={`w-full py-3 px-4 rounded-xl font-bold text-sm transition duration-200 shadow-lg flex items-center justify-center space-x-2 ${
              allCompleted
                ? 'bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white ring-2 ring-emerald-400 animate-pulse cursor-pointer'
                : 'bg-slate-800/80 text-slate-500 cursor-not-allowed border border-slate-700/50'
            }`}
          >
            <span>{allCompleted ? '✓ Continuar al Tratamiento' : 'Completa las 3 Inspecciones (ABC)'}</span>
          </button>
        </div>
      </div>

      {/* Escena Central: Mesa Quirúrgica + Sprite del Perro con Hotspots */}
      <div className="relative z-10 flex-1 w-full h-full flex items-center justify-center p-2 sm:p-6">
        <div className="relative max-w-md md:max-w-xl w-full flex items-center justify-center">
          {/* Sprite del animal sobre la mesa con transparencia nativa */}
          <img
            src={examineDogImg}
            alt="Paciente en mesa de exploración clínica"
            className="w-full max-h-[360px] sm:max-h-[440px] object-contain drop-shadow-2xl select-none pointer-events-none"
          />

          {/* Hotspots interactivos */}
          {INSPECTIONS.map((item) => {
            const isChecked = checks[item.key];
            const isSelected = activeInspection?.key === item.key;

            return (
              <button
                key={item.key}
                type="button"
                onClick={() => handleInspect(item)}
                style={{ top: item.hotspotTop, left: item.hotspotLeft }}
                aria-label={`Inspeccionar ${item.title}`}
                className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group focus:outline-none z-30"
              >
                <span className="relative flex h-10 w-10 items-center justify-center">
                  {!isChecked && (
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-80" />
                  )}
                  <span
                    className={`relative inline-flex rounded-full h-9 w-9 items-center justify-center text-xs font-bold shadow-2xl transition-transform group-hover:scale-125 ${
                      isChecked
                        ? 'bg-emerald-500 text-white ring-2 ring-emerald-300'
                        : isSelected
                        ? 'bg-cyan-400 text-slate-950 ring-4 ring-cyan-200'
                        : 'bg-cyan-500 text-slate-950 ring-2 ring-white/90 group-hover:bg-cyan-300'
                    }`}
                  >
                    {isChecked ? '✓' : item.letter}
                  </span>
                </span>

                <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/85 text-[10px] text-white px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition pointer-events-none border border-white/20 shadow">
                  {item.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
