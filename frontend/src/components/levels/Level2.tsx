import React, { useState } from 'react';
import {
  DndContext,
  useDraggable,
  useDroppable,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { DragStartEvent, DragEndEvent } from '@dnd-kit/core';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';
import { playSuccessDrop, playErrorBuzzer } from '../../utils/soundEffects';

import triageBg from '../../assets/backgrounds/level2-triage-room.jpg';
import patientRedImg from '../../assets/characters/level2-patient-red.png';
import patientYellowImg from '../../assets/characters/level2-patient-yellow.png';
import patientGreenImg from '../../assets/characters/level2-patient-green.png';

interface Patient {
  id: string;
  name: string;
  targetZone: 'zone-red' | 'zone-yellow' | 'zone-green';
  condition: string;
  image: string;
  colorName: string;
  badgeClass: string;
  feedbackTip: string;
}

const PATIENTS: Patient[] = [
  {
    id: 'patient-red',
    name: 'Paciente A (Canino)',
    targetZone: 'zone-red',
    condition: 'Inconsciente con respiración agitada y sangrado profuso en extremidad.',
    image: patientRedImg,
    colorName: 'Rojo (Crítico)',
    badgeClass: 'bg-red-500/20 text-red-300 border-red-500/40',
    feedbackTip: '¡Excelente! Inconsciencia y sangrado activo requieren atención crítica inmediata (Código Rojo).',
  },
  {
    id: 'patient-yellow',
    name: 'Paciente B (Canino)',
    targetZone: 'zone-yellow',
    condition: 'Consciente con fractura visible en pata y dolor agudo; constantes estables.',
    image: patientYellowImg,
    colorName: 'Amarillo (Urgente)',
    badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    feedbackTip: '¡Muy bien! Fracturas con dolor pero estables son urgencias que pueden esperar unos minutos (Código Amarillo).',
  },
  {
    id: 'patient-green',
    name: 'Paciente C (Canino)',
    targetZone: 'zone-green',
    condition: 'Alerta sin lesiones evidentes, deambula con calma y signos vitales normales.',
    image: patientGreenImg,
    colorName: 'Verde (Leve)',
    badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    feedbackTip: '¡Correcto! El paciente camina y está alerta; está fuera de peligro inmediato (Código Verde).',
  },
];

interface ZoneConfig {
  id: 'zone-red' | 'zone-yellow' | 'zone-green';
  title: string;
  subtitle: string;
  colorClass: string;
  borderClass: string;
  bgClass: string;
  activeClass: string;
  icon: string;
}

const ZONES: ZoneConfig[] = [
  {
    id: 'zone-red',
    title: '🔴 Triage Rojo',
    subtitle: 'Crítico / Inmediato',
    colorClass: 'text-red-400',
    borderClass: 'border-red-500/70',
    bgClass: 'bg-red-950/50',
    activeClass: 'bg-red-900/80 ring-4 ring-red-400 border-red-300 shadow-red-500/40',
    icon: '🔴',
  },
  {
    id: 'zone-yellow',
    title: '🟡 Triage Amarillo',
    subtitle: 'Urgente / Espera',
    colorClass: 'text-amber-400',
    borderClass: 'border-amber-500/70',
    bgClass: 'bg-amber-950/50',
    activeClass: 'bg-amber-900/80 ring-4 ring-amber-400 border-amber-300 shadow-amber-500/40',
    icon: '🟡',
  },
  {
    id: 'zone-green',
    title: '🟢 Triage Verde',
    subtitle: 'Leve / Estable',
    colorClass: 'text-emerald-400',
    borderClass: 'border-emerald-500/70',
    bgClass: 'bg-emerald-950/50',
    activeClass: 'bg-emerald-900/80 ring-4 ring-emerald-400 border-emerald-300 shadow-emerald-500/40',
    icon: '🟢',
  },
];

interface DroppableZoneProps {
  zone: ZoneConfig;
  assignedPatient?: Patient;
}

const DroppableZone: React.FC<DroppableZoneProps> = ({ zone, assignedPatient }) => {
  const { isOver, setNodeRef } = useDroppable({
    id: zone.id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`rounded-2xl border-2 p-3 backdrop-blur-md transition-all flex flex-col justify-between min-h-[115px] sm:min-h-[135px] ${
        isOver
          ? `${zone.activeClass} scale-105 shadow-2xl ring-4 ring-offset-2 ring-offset-slate-900 animate-pulse`
          : assignedPatient
          ? `${zone.borderClass} bg-black/70 shadow-lg border-2`
          : `${zone.borderClass} ${zone.bgClass} shadow-md`
      }`}
    >
      <div>
        <div className="flex items-center justify-between gap-1">
          <h3 className={`font-bold text-sm sm:text-base tracking-wide truncate ${zone.colorClass}`}>
            {zone.title}
          </h3>
          {assignedPatient && (
            <span className="text-xs bg-emerald-500/25 text-emerald-300 border border-emerald-500/50 px-2 py-0.5 rounded-full font-bold shadow-sm">
              ✓ Clasificado
            </span>
          )}
        </div>
        <p className="text-xs text-slate-300 font-medium tracking-tight mt-0.5">{zone.subtitle}</p>
      </div>

      {assignedPatient ? (
        <div className="bg-black/60 rounded-xl p-2 border border-white/15 flex items-center space-x-2.5 animate-fade-in shadow-inner">
          <img
            src={assignedPatient.image}
            alt={assignedPatient.name}
            className="w-8 h-8 sm:w-10 sm:h-10 object-contain rounded-lg bg-black/70 p-0.5 border border-slate-600 flex-shrink-0"
          />
          <div className="min-w-0 flex-1">
            <p className="text-xs sm:text-sm font-bold text-white truncate">{assignedPatient.name}</p>
            <p className="text-[11px] text-emerald-300 font-medium">Asignado con éxito</p>
          </div>
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-xl p-2 text-center flex items-center justify-center h-10 sm:h-12 transition-all ${
            isOver
              ? 'border-white bg-white/30 text-white font-bold shadow-lg scale-102'
              : 'border-white/25 bg-black/30 text-slate-300'
          }`}
        >
          <span className="text-xs sm:text-sm font-bold tracking-wide flex items-center justify-center space-x-1">
            <span>{isOver ? '🎯 ¡Soltar aquí!' : '📥 Bahía libre'}</span>
          </span>
        </div>
      )}
    </div>
  );
};

interface ActivePatientCardProps {
  patient: Patient;
  hasError: boolean;
  onDirectAssign: (patientId: string, zoneId: 'zone-red' | 'zone-yellow' | 'zone-green') => void;
}

const ActivePatientCard: React.FC<ActivePatientCardProps> = ({
  patient,
  hasError,
  onDirectAssign,
}) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: patient.id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`relative select-none p-4 sm:p-5 rounded-2xl backdrop-blur-xl transition-all border-2 ${
        hasError
          ? 'bg-red-950/95 border-red-500 ring-4 ring-red-500 animate-pulse'
          : isDragging
          ? 'opacity-30 border-blue-400'
          : 'bg-slate-900/95 hover:bg-slate-900 border-slate-700/80 shadow-2xl'
      }`}
    >
      {/* Zona táctil y arrastrable - Paciente Hero */}
      <div
        className="flex items-center space-x-4 sm:space-x-5 cursor-grab active:cursor-grabbing touch-none"
        {...listeners}
        {...attributes}
      >
        {/* Contenedor grande del animal w-24 h-24 sm:w-28 sm:h-28 */}
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-b from-slate-800 to-black/85 p-2 border-2 border-slate-600/80 shadow-xl flex items-center justify-center flex-shrink-0">
          <img
            src={patient.image}
            alt={patient.name}
            className="w-20 h-20 object-contain animate-pulse drop-shadow-md select-none"
          />
          <span className="absolute -bottom-2 px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full shadow-md border border-blue-400 tracking-wide">
            🖐️ Arrastrar
          </span>
        </div>

        {/* Información Clínica Hero */}
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight truncate">
              {patient.name}
            </h3>
            <span className="text-xs text-blue-300 font-bold bg-blue-500/20 px-2.5 py-0.5 rounded-full border border-blue-500/40 flex-shrink-0">
              En Evaluación
            </span>
          </div>

          <p className="text-sm sm:text-base text-slate-200 leading-snug font-medium mt-1">
            {patient.condition}
          </p>
        </div>
      </div>

      {/* Botones arcade táctiles de gran impacto */}
      <div className="pt-4 border-t border-slate-800/90 mt-4 space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400 font-semibold px-1">
          <span>O selecciona el código de triage con un toque:</span>
          <span className="text-[11px] text-slate-500">Asignación táctil</span>
        </div>

        <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
          <button
            type="button"
            onClick={() => onDirectAssign(patient.id, 'zone-red')}
            className="h-12 sm:h-14 py-2.5 px-3 rounded-xl sm:rounded-2xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 active:scale-95 text-white text-sm sm:text-base font-bold shadow-lg shadow-red-500/25 border-2 border-red-400/50 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <span className="text-lg">🔴</span>
            <span>Rojo</span>
          </button>
          <button
            type="button"
            onClick={() => onDirectAssign(patient.id, 'zone-yellow')}
            className="h-12 sm:h-14 py-2.5 px-3 rounded-xl sm:rounded-2xl bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 active:scale-95 text-white text-sm sm:text-base font-bold shadow-lg shadow-amber-500/25 border-2 border-amber-400/50 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <span className="text-lg">🟡</span>
            <span>Amarillo</span>
          </button>
          <button
            type="button"
            onClick={() => onDirectAssign(patient.id, 'zone-green')}
            className="h-12 sm:h-14 py-2.5 px-3 rounded-xl sm:rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 active:scale-95 text-white text-sm sm:text-base font-bold shadow-lg shadow-emerald-500/25 border-2 border-emerald-400/50 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <span className="text-lg">🟢</span>
            <span>Verde</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export const Level2: React.FC = () => {
  const addScore = useGameStore((state) => state.actions.addScore);
  const deductTime = useGameStore((state) => state.actions.deductTime);
  const nextLevel = useGameStore((state) => state.actions.nextLevel);

  const [assignedPatients, setAssignedPatients] = useState<Record<string, string>>({});
  const [activeId, setActiveId] = useState<string | null>(null);
  const [errorPatientId, setErrorPatientId] = useState<string | null>(null);
  const [feedbackToast, setFeedbackToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const triggerVibration = (pattern: number | number[] = 40) => {
    try {
      navigator?.vibrate?.(pattern);
    } catch {
      // Ignore vibration error on unsupported devices
    }
  };

  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: {
      distance: 6,
    },
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 100,
      tolerance: 5,
    },
  });
  const sensors = useSensors(pointerSensor, touchSensor);

  const processAssignment = (patientId: string, zoneId: 'zone-red' | 'zone-yellow' | 'zone-green') => {
    const patient = PATIENTS.find((p) => p.id === patientId);
    if (!patient) return;

    if (patient.targetZone === zoneId) {
      triggerVibration(40);
      playSuccessDrop();
      addScore(100);

      setFeedbackToast({
        message: patient.feedbackTip,
        type: 'success',
      });
      setErrorPatientId(null);

      const nextAssigned = { ...assignedPatients, [zoneId]: patientId };
      setAssignedPatients(nextAssigned);

      if (Object.keys(nextAssigned).length === PATIENTS.length) {
        setTimeout(() => {
          setIsCompleted(true);
        }, 600);
      }
    } else {
      triggerVibration([60, 40, 60]);
      playErrorBuzzer();
      deductTime(5);
      setErrorPatientId(patientId);
      setFeedbackToast({
        message: '¡Clasificación incorrecta! Penalización: -5 segundos. Evalúa signos vitales.',
        type: 'error',
      });

      setTimeout(() => {
        setErrorPatientId(null);
      }, 1500);
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    triggerVibration(20);
    setActiveId(String(event.active.id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;

    const patientId = String(active.id);
    const zoneId = String(over.id) as 'zone-red' | 'zone-yellow' | 'zone-green';
    processAssignment(patientId, zoneId);
  };

  const handleDirectAssign = (patientId: string, zoneId: 'zone-red' | 'zone-yellow' | 'zone-green') => {
    processAssignment(patientId, zoneId);
  };

  // Pacientes pendientes y paciente activo actual en la mesa
  const unassignedPatients = PATIENTS.filter(
    (patient) => !Object.values(assignedPatients).includes(patient.id)
  );
  const currentPatient = unassignedPatients[0] || null;
  const activeDraggedPatient = PATIENTS.find((p) => p.id === activeId);

  const totalClassified = Object.keys(assignedPatients).length;

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveId(null)}
    >
      <div
        className="w-full h-[100dvh] pt-14 p-3.5 sm:p-6 relative overflow-hidden bg-cover bg-center flex flex-col justify-between select-none"
        style={{ backgroundImage: `url(${triageBg})` }}
      >
        {/* Capa de oscurecimiento suave */}
        <div className="absolute inset-0 bg-slate-950/50 pointer-events-none" />

        {/* Modal de Éxito al Completar */}
        {isCompleted && (
          <div className="absolute inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-emerald-500/50 rounded-2xl p-6 max-w-md w-full text-center space-y-4 shadow-2xl animate-fade-in">
              <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto text-3xl border border-emerald-500/40">
                ✓
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">
                ¡Triage Completado!
              </h2>
              <p className="text-slate-200 text-sm leading-relaxed">
                Has clasificado con éxito a los 3 pacientes según el código START y el protocolo
                PASR. Salvaste minutos críticos para su atención veterinaria.
              </p>
              <button
                type="button"
                onClick={() => nextLevel()}
                className="w-full bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold py-3 px-6 rounded-xl transition duration-150 shadow-md cursor-pointer"
              >
                Avanzar al Siguiente Nivel
              </button>
            </div>
          </div>
        )}

        {/* Bahías de Triage (Parte Superior Fija y Ampliada) */}
        <div className="relative z-20 w-full max-w-4xl mx-auto space-y-2.5">
          <div className="flex items-center justify-between">
            <div>
              <span className="inline-block bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Fase 2: Socorrer (Triage START)
              </span>
              <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
                Bahías de Triage
              </h2>
            </div>

            {/* Chips de progreso de pacientes */}
            <div className="flex items-center space-x-2">
              <span className="text-xs text-slate-300 font-semibold hidden xs:inline">
                Progreso:
              </span>
              <span className="text-xs sm:text-sm font-bold text-white bg-slate-900/90 px-3 py-1 rounded-full border border-slate-700 shadow">
                {totalClassified} / {PATIENTS.length}
              </span>
            </div>
          </div>

          {/* Grid de 3 Bahías en fila balanceada y ampliada */}
          <div className="grid grid-cols-3 gap-2.5 sm:gap-4 w-full">
            {ZONES.map((zone) => {
              const assignedId = assignedPatients[zone.id];
              const assignedPatient = PATIENTS.find((p) => p.id === assignedId);
              return (
                <DroppableZone
                  key={zone.id}
                  zone={zone}
                  assignedPatient={assignedPatient}
                />
              );
            })}
          </div>
        </div>

        {/* Zona Central: Feedback Pedagógico (Toast) */}
        <div className="relative z-20 w-full max-w-lg mx-auto min-h-[38px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            {feedbackToast && (
              <motion.div
                key={feedbackToast.message}
                initial={{ opacity: 0, y: -6, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.96 }}
                className={`w-full py-2 px-3.5 rounded-xl text-center text-xs sm:text-sm font-semibold border shadow-xl ${
                  feedbackToast.type === 'success'
                    ? 'bg-emerald-950/95 text-emerald-200 border-emerald-500/60'
                    : 'bg-red-950/95 text-red-200 border-red-500/60'
                }`}
              >
                {feedbackToast.type === 'success' ? '💡 ' : '⚠️ '}
                {feedbackToast.message}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Mesa de Examen (1 Solo Paciente por Turno con Hero Card) */}
        <div className="relative z-20 w-full max-w-xl mx-auto pb-1">
          <div className="bg-slate-950/90 backdrop-blur-md rounded-2xl p-3.5 sm:p-5 border border-slate-800 shadow-2xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm font-bold text-slate-300 uppercase tracking-wider">
                Mesa de Examen ({currentPatient ? `Paciente ${totalClassified + 1} de 3` : 'Completado'})
              </span>
              <span className="text-xs text-slate-400">
                {currentPatient ? 'Arrastra o toca para clasificar' : 'Todos clasificados'}
              </span>
            </div>

            {currentPatient ? (
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentPatient.id}
                  initial={{ opacity: 0, x: 25, scale: 0.98 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -25, scale: 0.98 }}
                  transition={{ duration: 0.22 }}
                >
                  <ActivePatientCard
                    patient={currentPatient}
                    hasError={errorPatientId === currentPatient.id}
                    onDirectAssign={handleDirectAssign}
                  />
                </motion.div>
              </AnimatePresence>
            ) : (
              <div className="p-4 text-center text-sm font-semibold text-emerald-400 bg-emerald-950/30 rounded-xl border border-emerald-500/30 animate-fade-in">
                ✓ ¡Excelente trabajo! Todos los pacientes han sido asignados correctamente a sus áreas de triage.
              </div>
            )}
          </div>
        </div>

        {/* DragOverlay para que el paciente siga el dedo/cursor sin recortarse */}
        <DragOverlay dropAnimation={null}>
          {activeDraggedPatient ? (
            <div className="w-80 sm:w-96 p-4 rounded-2xl bg-slate-900/95 border-2 border-blue-400 shadow-2xl scale-105 rotate-2 opacity-95 backdrop-blur-xl text-white pointer-events-none ring-4 ring-blue-500/30">
              <div className="flex items-center space-x-3.5">
                <div className="w-20 h-20 rounded-xl bg-black/70 p-1.5 border border-slate-600 flex-shrink-0 flex items-center justify-center">
                  <img
                    src={activeDraggedPatient.image}
                    alt={activeDraggedPatient.name}
                    className="w-16 h-16 object-contain"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-base font-extrabold text-white truncate">
                    {activeDraggedPatient.name}
                  </p>
                  <p className="text-xs text-slate-200 line-clamp-2 mt-0.5 font-medium leading-snug">
                    {activeDraggedPatient.condition}
                  </p>
                </div>
              </div>
              <div className="mt-2.5 text-center text-xs text-blue-300 font-bold bg-blue-950/80 rounded-lg py-1.5 border border-blue-500/40">
                Suelta en la bahía Rojo, Amarillo o Verde
              </div>
            </div>
          ) : null}
        </DragOverlay>
      </div>
    </DndContext>
  );
};
