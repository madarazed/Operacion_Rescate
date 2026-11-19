import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';
import { playHeartbeat, playSuccessDrop, playErrorBuzzer } from '../../utils/soundEffects';
import { LevelCompleteOverlay } from '../ui/LevelCompleteOverlay';

import triageBg from '../../assets/backgrounds/level2-triage-room.jpg';
import examineDogImg from '../../assets/characters/level3-examine-dog.png';

type InspectionKey = 'airway' | 'breathing' | 'circulation';

interface InspectionConfig {
  key: InspectionKey;
  letter: 'A' | 'B' | 'C';
  icon: string;
  name: string;
  locationLabel: string;
  systemName: string;
  findingText: string;
  referenceValue: string;
  hotspotTop: string;
  hotspotLeft: string;
  statusBadge: string;
}

const INSPECTIONS: InspectionConfig[] = [
  {
    key: 'airway',
    letter: 'A',
    icon: '💨',
    name: 'Vía Aérea',
    locationLabel: 'Hocico / Cuello',
    systemName: 'Paso A: Vía Aérea (Airway)',
    findingText: 'Vía aérea permeable, sin obstrucciones ni cuerpos extraños.',
    referenceValue: 'Ref. normal: Mucosas rosadas y húmedas.',
    hotspotTop: '28%',
    hotspotLeft: '22%',
    statusBadge: 'Permeable',
  },
  {
    key: 'breathing',
    letter: 'B',
    icon: '🫁',
    name: 'Ventilación',
    locationLabel: 'Tórax / Pecho',
    systemName: 'Paso B: Ventilación (Breathing)',
    findingText: 'Expansión torácica bilateral simétrica (24 rpm).',
    referenceValue: 'Ref. normal en reposo: 15-30 resp/min.',
    hotspotTop: '46%',
    hotspotLeft: '48%',
    statusBadge: 'Eupneico',
  },
  {
    key: 'circulation',
    letter: 'C',
    icon: '💓',
    name: 'Circulación',
    locationLabel: 'Femoral / Extremidad',
    systemName: 'Paso C: Circulación (Circulation)',
    findingText: 'Pulso femoral fuerte y rítmico; tiempo de llenado capilar < 2s.',
    referenceValue: 'Ref. normal canina: 70-120 lpm.',
    hotspotTop: '60%',
    hotspotLeft: '74%',
    statusBadge: 'Normotenso',
  },
];

export const Level3: React.FC = () => {
  const addScore = useGameStore((state) => state.actions.addScore);
  const addTime = useGameStore((state) => state.actions.addTime);
  const nextLevel = useGameStore((state) => state.actions.nextLevel);

  const [checks, setChecks] = useState<Record<InspectionKey, boolean>>({
    airway: false,
    breathing: false,
    circulation: false,
  });

  const [activeInspection, setActiveInspection] = useState<InspectionConfig | null>(null);
  const [activeScannerKey, setActiveScannerKey] = useState<InspectionKey | null>(null);
  const [sequenceError, setSequenceError] = useState<string | null>(null);
  const [shakeKey, setShakeKey] = useState<InspectionKey | null>(null);
  const [isLevelComplete, setIsLevelComplete] = useState<boolean>(false);

  const triggerVibration = (pattern: number | number[] = 40) => {
    try {
      navigator?.vibrate?.(pattern);
    } catch {
      // Ignore vibration error on unsupported platforms
    }
  };

  const isUnlocked = (key: InspectionKey): boolean => {
    if (key === 'airway') return true;
    if (key === 'breathing') return checks.airway;
    if (key === 'circulation') return checks.airway && checks.breathing;
    return false;
  };

  const handleInspect = (inspection: InspectionConfig) => {
    // Verificación secuencial estricta del protocolo ABCDE
    if (!isUnlocked(inspection.key)) {
      triggerVibration([50, 30, 50]);
      playErrorBuzzer();

      if (inspection.key === 'breathing') {
        setSequenceError('Protocolo ABCDE: Primero debes asegurar la Vía Aérea (💨 A) antes de evaluar ventilación o circulación.');
      } else if (inspection.key === 'circulation') {
        if (!checks.airway) {
          setSequenceError('Protocolo ABCDE: Primero debes asegurar la Vía Aérea (💨 A) antes de evaluar ventilación o circulación.');
        } else {
          setSequenceError('Protocolo ABCDE: Debes evaluar la Ventilación (🫁 B) antes de verificar la circulación (💓 C).');
        }
      }

      setShakeKey(inspection.key);
      setTimeout(() => setShakeKey(null), 600);
      setTimeout(() => setSequenceError(null), 3500);
      return;
    }

    // Paso válido y desbloqueado
    setSequenceError(null);
    triggerVibration(40);
    playHeartbeat();
    setActiveInspection(inspection);

    // Activar onda de escaneo clínico
    setActiveScannerKey(inspection.key);
    setTimeout(() => setActiveScannerKey(null), 1200);

    if (!checks[inspection.key]) {
      addScore(50);
      const nextChecks = {
        ...checks,
        [inspection.key]: true,
      };
      setChecks(nextChecks);

      // Si se completan los 3 pasos (A, B y C)
      if (nextChecks.airway && nextChecks.breathing && nextChecks.circulation) {
        setTimeout(() => {
          triggerVibration([40, 30, 60]);
          playSuccessDrop();
          addTime(15);
        }, 400);

        setTimeout(() => {
          setIsLevelComplete(true);
        }, 600);
      }
    }
  };

  const completedCount = Object.values(checks).filter(Boolean).length;
  const allCompleted = checks.airway && checks.breathing && checks.circulation;

  return (
    <div
      className="w-full h-[100dvh] pt-14 p-2.5 sm:p-5 relative overflow-hidden bg-cover bg-center flex flex-col md:flex-row items-center justify-between select-none"
      style={{ backgroundImage: `url(${triageBg})` }}
    >
      {/* Capa de oscurecimiento ambiental */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/60 to-slate-950/80 pointer-events-none" />

      {/* PANEL CLÍNICO (Izquierda en PC, Abajo en móvil) */}
      <div className="order-2 md:order-1 relative z-20 w-full md:w-[410px] lg:w-[440px] max-w-md flex-shrink-0 flex flex-col justify-between space-y-2.5 bg-slate-900/90 text-white backdrop-blur-xl rounded-2xl border border-teal-500/30 p-3 sm:p-4 shadow-2xl">
        <div className="space-y-2">
          {/* Cabecera temática */}
          <div className="flex items-center justify-between">
            <div>
              <span className="inline-block bg-teal-500/20 text-teal-300 border border-teal-500/40 text-[10px] sm:text-xs font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Fase 3: Socorrer (Protocolo ABCDE)
              </span>
              <h2 className="text-base sm:text-lg font-black text-white tracking-tight mt-0.5">
                Evaluación Primaria
              </h2>
            </div>

            <span className="text-xs font-extrabold text-teal-300 bg-slate-950/80 px-2.5 py-1 rounded-full border border-teal-500/30">
              {completedCount} / 3 Pasos
            </span>
          </div>

          {/* Checklist Interactivo Secuencial (A → B → C) */}
          <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
            {INSPECTIONS.map((item) => {
              const isChecked = checks[item.key];
              const isSelected = activeInspection?.key === item.key;
              const unlocked = isUnlocked(item.key);
              const isNextTarget = unlocked && !isChecked;

              return (
                <motion.button
                  key={item.key}
                  type="button"
                  onClick={() => handleInspect(item)}
                  animate={shakeKey === item.key ? { x: [-6, 6, -4, 4, 0] } : {}}
                  transition={{ duration: 0.4 }}
                  className={`p-2 rounded-xl border text-left transition-all duration-200 flex flex-col justify-between cursor-pointer ${
                    isChecked
                      ? 'bg-emerald-950/70 border-emerald-500/60 text-emerald-200 shadow-md ring-1 ring-emerald-500/30'
                      : isNextTarget
                      ? 'bg-teal-950/80 border-teal-400 text-teal-200 ring-2 ring-teal-400/50 shadow-[0_0_15px_rgba(45,212,191,0.3)] animate-pulse'
                      : isSelected
                      ? 'bg-cyan-950/70 border-cyan-400 text-cyan-200'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-base">{item.icon}</span>
                    <span
                      className={`w-4 h-4 rounded-full flex items-center justify-center font-black text-[10px] ${
                        isChecked
                          ? 'bg-emerald-500 text-slate-950'
                          : isNextTarget
                          ? 'bg-teal-400 text-slate-950 animate-ping'
                          : 'bg-slate-800 text-slate-500'
                      }`}
                    >
                      {isChecked ? '✓' : item.letter}
                    </span>
                  </div>

                  <div className="mt-1">
                    <p className="text-[11px] font-black tracking-tight leading-tight">
                      {item.letter}. {item.name}
                    </p>
                    <p className="text-[9px] text-slate-400 truncate">
                      {unlocked ? (isChecked ? 'Completado' : 'Pendiente') : 'Bloqueado 🔒'}
                    </p>
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Banner de alerta pedagógica si se rompe la secuencia */}
          <AnimatePresence>
            {sequenceError && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.96 }}
                className="bg-amber-950/95 border border-amber-500 text-amber-200 text-xs p-2.5 rounded-xl shadow-lg flex items-start space-x-2"
              >
                <span className="text-base flex-shrink-0">⚠️</span>
                <p className="leading-snug font-semibold">{sequenceError}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* VISOR DE DIAGNÓSTICO E INFORMACIÓN FISIOLÓGICA */}
          <div className="bg-slate-950/90 rounded-2xl p-2.5 sm:p-3 border border-teal-500/30 shadow-inner space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black tracking-wider uppercase text-teal-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                <span>Diagnóstico / Hallazgo Clínico</span>
              </span>
              {activeInspection && (
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.2 rounded-full font-bold">
                  {activeInspection.statusBadge}
                </span>
              )}
            </div>

            <AnimatePresence mode="wait">
              {activeInspection ? (
                <motion.div
                  key={activeInspection.key}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-1.5"
                >
                  <div className="flex items-start space-x-2">
                    <span className="text-xl p-1 rounded-lg bg-slate-900 border border-slate-700 flex-shrink-0">
                      {activeInspection.icon}
                    </span>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-black text-white">
                        {activeInspection.systemName}
                      </h4>
                      <p className="text-xs text-emerald-300 font-semibold leading-snug mt-0.5">
                        {activeInspection.findingText}
                      </p>
                    </div>
                  </div>

                  {/* Píldora de Parámetro Fisiológico Normal */}
                  <div className="bg-slate-900/90 border border-teal-500/30 rounded-xl p-2 flex items-start space-x-2 shadow-inner">
                    <span className="text-teal-400 text-xs flex-shrink-0 mt-0.5">🩺</span>
                    <div className="text-[11px] leading-tight text-slate-300">
                      <span className="font-extrabold text-teal-300">Dato educativo: </span>
                      <span>{activeInspection.referenceValue}</span>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="py-2.5 text-center text-xs text-slate-400 italic">
                  Toca el punto pulsante en el paciente (o en la lista) para iniciar con el Paso A.
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Estado del Protocolo ABC */}
        <div className="w-full py-2 px-3 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-400 text-xs text-center font-medium">
          {allCompleted ? (
            <span className="text-emerald-400 font-bold flex items-center justify-center gap-1.5">
              <span>✓</span> Protocolo ABC completado (3 de 3)
            </span>
          ) : (
            <span>Inspección clínica en curso ({completedCount} de 3 completados)</span>
          )}
        </div>
      </div>

      {/* ESCENA CENTRAL: Mesa Quirúrgica + Sprite del Perro con Hotspots y Escáner */}
      <div className="order-1 md:order-2 relative z-10 flex-1 w-full h-full min-h-[42vh] md:min-h-0 flex items-center justify-center p-2 sm:p-6">
        <div className="relative max-w-md md:max-w-xl w-full flex items-center justify-center">
          {/* Sprite del animal con micro-animación de respiración orgánica */}
          <motion.img
            src={examineDogImg}
            alt="Paciente en mesa de exploración clínica"
            animate={{ y: [-2, 2, -2], scale: [1, 1.015, 1] }}
            transition={{ repeat: Infinity, duration: 3.2, ease: 'easeInOut' }}
            className="w-full max-h-[340px] sm:max-h-[430px] object-contain drop-shadow-2xl select-none pointer-events-none"
          />

          {/* Hotspots interactivos con escáner clínico */}
          {INSPECTIONS.map((item) => {
            const isChecked = checks[item.key];
            const isSelected = activeInspection?.key === item.key;
            const unlocked = isUnlocked(item.key);
            const isNextTarget = unlocked && !isChecked;

            return (
              <motion.button
                key={item.key}
                type="button"
                onClick={() => handleInspect(item)}
                style={{ top: item.hotspotTop, left: item.hotspotLeft }}
                aria-label={`Inspeccionar ${item.name}`}
                animate={shakeKey === item.key ? { x: [-8, 8, -5, 5, 0] } : {}}
                transition={{ duration: 0.4 }}
                className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group focus:outline-none z-30 select-none"
              >
                <span className="relative flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center">
                  {/* Onda expansiva de escáner clínico */}
                  {activeScannerKey === item.key && (
                    <motion.span
                      initial={{ scale: 0.6, opacity: 0.9 }}
                      animate={{ scale: 3.2, opacity: 0 }}
                      transition={{ duration: 1.1, ease: 'easeOut' }}
                      className="absolute inset-0 rounded-full bg-teal-400/40 pointer-events-none ring-4 ring-teal-300"
                    />
                  )}

                  {/* Pulso de atención para el siguiente paso activo */}
                  {isNextTarget && (
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75" />
                  )}

                  {/* Botón principal del hotspot */}
                  <span
                    className={`relative inline-flex rounded-full h-10 w-10 sm:h-11 sm:w-11 items-center justify-center text-xs font-black shadow-2xl transition-all duration-200 group-hover:scale-120 ${
                      isChecked
                        ? 'bg-emerald-500 text-white ring-2 ring-emerald-300 shadow-emerald-500/40'
                        : isNextTarget
                        ? 'bg-gradient-to-tr from-teal-500 to-emerald-400 text-slate-950 ring-4 ring-teal-200 shadow-teal-500/50 scale-110'
                        : isSelected
                        ? 'bg-cyan-400 text-slate-950 ring-4 ring-cyan-200'
                        : 'bg-slate-900/90 text-slate-400 border border-slate-700/80 ring-1 ring-white/10 opacity-70 group-hover:opacity-100'
                    }`}
                  >
                    {isChecked ? '✓' : unlocked ? item.letter : '🔒'}
                  </span>
                </span>

                {/* Etiqueta tooltip flotante */}
                <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-950/90 text-[10px] font-bold text-white px-2 py-0.5 rounded-full border border-teal-500/40 shadow-lg pointer-events-none flex items-center space-x-1">
                  <span>{item.icon}</span>
                  <span>{item.name}</span>
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Modal / Overlay de Misión Cumplida (Fase 3) */}
      <LevelCompleteOverlay
        isOpen={isLevelComplete}
        phaseBadge="Fase 3: Socorrer (Evaluación ABCDE)"
        icon="🩺"
        title="¡Evaluación ABCDE Completada!"
        subtitle="Vía aérea, ventilación y pulso femoral verificados clínicamente."
        learningPill="La secuencia A (Vía aérea), B (Ventilación) y C (Circulación) garantiza que el paciente reciba oxígeno a nivel cerebral y miocárdico antes de atender otras lesiones secundarias."
        scoreBonus="+150 Puntos • +15s Bonificación"
        primaryButtonText="Continuar a Hemostasia (Nivel 4) ➔"
        onPrimaryAction={nextLevel}
      />
    </div>
  );
};
