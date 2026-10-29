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
}

const ZONES: ZoneConfig[] = [
  {
    id: 'zone-red',
    title: '🔴 Triage Rojo',
    subtitle: 'Crítico / Inmediato',
    colorClass: 'text-red-400',
    borderClass: 'border-red-500/60',
    bgClass: 'bg-red-950/40',
    activeClass: 'bg-red-900/70 ring-4 ring-red-400 border-red-300',
  },
  {
    id: 'zone-yellow',
    title: '🟡 Triage Amarillo',
    subtitle: 'Urgente / Espera',
    colorClass: 'text-amber-400',
    borderClass: 'border-amber-500/60',
    bgClass: 'bg-amber-950/40',
    activeClass: 'bg-amber-900/70 ring-4 ring-amber-400 border-amber-300',
  },
  {
    id: 'zone-green',
    title: '🟢 Triage Verde',
    subtitle: 'Leve / Estable',
    colorClass: 'text-emerald-400',
    borderClass: 'border-emerald-500/60',
    bgClass: 'bg-emerald-950/40',
    activeClass: 'bg-emerald-900/70 ring-4 ring-emerald-400 border-emerald-300',
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
      className={`rounded-2xl border-2 p-2 sm:p-2.5 backdrop-blur-md transition-all flex flex-col justify-between min-h-[80px] sm:min-h-[100px] ${
        isOver
          ? `${zone.activeClass} scale-105 shadow-xl`
          : assignedPatient
          ? `${zone.borderClass} bg-black/60 shadow-md`
          : `${zone.borderClass} ${zone.bgClass}`
      }`}
    >
      <div>
        <div className="flex items-center justify-between">
          <h3 className={`font-bold text-xs sm:text-sm truncate ${zone.colorClass}`}>
            {zone.title}
          </h3>
          {assignedPatient && (
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-1.5 py-0.2 rounded-full font-bold">
              ✓
            </span>
          )}
        </div>
        <p className="text-[10px] text-slate-300 truncate hidden xs:block">{zone.subtitle}</p>
      </div>

      {assignedPatient ? (
        <div className="bg-black/50 rounded-xl p-1 sm:p-1.5 border border-white/10 flex items-center space-x-1.5 animate-fade-in">
          <img
            src={assignedPatient.image}
            alt={assignedPatient.name}
            className="w-6 h-6 sm:w-7 sm:h-7 object-contain rounded-lg bg-black/60 p-0.5 border border-slate-600 flex-shrink-0"
          />
          <div className="min-w-0 flex-1">
            <p className="text-[10px] sm:text-xs font-bold text-white truncate">{assignedPatient.name}</p>
          </div>
        </div>
      ) : (
        <div
          className={`border border-dashed rounded-xl p-1 text-center flex items-center justify-center h-7 sm:h-9 transition-colors ${
            isOver ? 'border-white bg-white/25 text-white' : 'border-white/20 bg-black/20 text-slate-400'
          }`}
        >
          <span className="text-[10px] sm:text-xs font-medium truncate">
            {isOver ? '¡Soltar aquí!' : 'Bahía libre'}
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
      className={`relative select-none p-3 sm:p-4 rounded-2xl backdrop-blur-md transition-all border ${
        hasError
          ? 'bg-red-950/90 border-red-500 ring-4 ring-red-500 animate-pulse'
          : isDragging
          ? 'opacity-30 border-blue-400'
          : 'bg-slate-900/90 hover:bg-slate-900/95 border-slate-700/70 shadow-2xl'
      }`}
    >
      {/* Zona táctil y arrastrable */}
      <div
        className="flex items-center space-x-3 sm:space-x-4 cursor-grab active:cursor-grabbing touch-none"
        {...listeners}
        {...attributes}
      >
        <div className="relative">
          <img
            src={patient.image}
            alt={patient.name}
            className="w-16 h-16 sm:w-20 sm:h-20 object-contain rounded-2xl bg-black/50 p-1.5 border border-slate-700 shadow-inner flex-shrink-0"
          />
          <span className="absolute -bottom-1 -right-1 bg-blue-500 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full shadow">
            Arrastrar
          </span>
        </div>

        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-sm sm:text-base font-bold text-white truncate">
              {patient.name}
            </span>
            <span className="text-[10px] text-blue-300 bg-blue-500/20 px-2 py-0.5 rounded-full border border-blue-500/30">
              Mesa de Triage
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-200 leading-snug">
            {patient.condition}
          </p>
        </div>
      </div>

      {/* Botones secundarios de asignación rápida para tocar directamente */}
      <div className="pt-3 border-t border-slate-800/80 mt-3 space-y-1.5">
        <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
          <span>O toca un código para clasificar:</span>
          <span className="text-[10px] text-slate-500">Toque directo</span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => onDirectAssign(patient.id, 'zone-red')}
            className="py-2 px-2 bg-red-600/90 hover:bg-red-500 active:scale-95 text-xs sm:text-sm font-bold text-white rounded-xl transition shadow-md border border-red-400/40 flex items-center justify-center space-x-1 cursor-pointer"
          >
            <span>🔴</span>
            <span>Rojo</span>
          </button>
          <button
            type="button"
            onClick={() => onDirectAssign(patient.id, 'zone-yellow')}
            className="py-2 px-2 bg-amber-600/90 hover:bg-amber-500 active:scale-95 text-xs sm:text-sm font-bold text-white rounded-xl transition shadow-md border border-amber-400/40 flex items-center justify-center space-x-1 cursor-pointer"
          >
            <span>🟡</span>
            <span>Amarillo</span>
          </button>
          <button
            type="button"
            onClick={() => onDirectAssign(patient.id, 'zone-green')}
            className="py-2 px-2 bg-emerald-600/90 hover:bg-emerald-500 active:scale-95 text-xs sm:text-sm font-bold text-white rounded-xl transition shadow-md border border-emerald-400/40 flex items-center justify-center space-x-1 cursor-pointer"
          >
            <span>🟢</span>
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
        className="w-full h-[100dvh] pt-14 p-3 sm:p-4 relative overflow-hidden bg-cover bg-center flex flex-col justify-between"
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

        {/* Bahías de Triage (Parte Superior Fija) */}
        <div className="relative z-20 w-full max-w-3xl mx-auto space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <span className="inline-block bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                Fase 2: Socorrer (Triage START)
              </span>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Bahías de Triage
              </h2>
            </div>

            {/* Chips de progreso de pacientes */}
            <div className="flex items-center space-x-1.5">
              <span className="text-[11px] text-slate-300 font-semibold hidden xs:inline">
                Progreso:
              </span>
              <span className="text-xs font-bold text-white bg-slate-900/80 px-2.5 py-0.5 rounded-full border border-slate-700">
                {totalClassified} / {PATIENTS.length}
              </span>
            </div>
          </div>

          {/* Grid de 3 Bahías en fila balanceada */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 w-full">
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
        <div className="relative z-20 w-full max-w-lg mx-auto min-h-[36px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            {feedbackToast && (
              <motion.div
                key={feedbackToast.message}
                initial={{ opacity: 0, y: -6, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.96 }}
                className={`w-full py-1.5 px-3 rounded-xl text-center text-xs font-medium border shadow-lg ${
                  feedbackToast.type === 'success'
                    ? 'bg-emerald-950/90 text-emerald-200 border-emerald-500/50'
                    : 'bg-red-950/90 text-red-200 border-red-500/50'
                }`}
              >
                {feedbackToast.type === 'success' ? '💡 ' : '⚠️ '}
                {feedbackToast.message}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Mesa de Examen (1 Solo Paciente por Turno, sin scroll) */}
        <div className="relative z-20 w-full max-w-lg mx-auto pb-1">
          <div className="bg-slate-950/90 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-slate-800 shadow-2xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Mesa de Examen ({currentPatient ? `Paciente ${totalClassified + 1} de 3` : 'Completado'})
              </span>
              <span className="text-[10px] text-slate-400">
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
            <div className="w-72 sm:w-80 p-3.5 rounded-2xl bg-slate-900/95 border-2 border-blue-400 shadow-2xl scale-105 rotate-2 opacity-95 backdrop-blur-xl text-white pointer-events-none">
              <div className="flex items-center space-x-3">
                <img
                  src={activeDraggedPatient.image}
                  alt={activeDraggedPatient.name}
                  className="w-14 h-14 object-contain rounded-xl bg-black/60 p-1 border border-slate-700 flex-shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-bold text-white truncate">
                    {activeDraggedPatient.name}
                  </p>
                  <p className="text-[11px] text-slate-200 line-clamp-2 mt-0.5">
                    {activeDraggedPatient.condition}
                  </p>
                </div>
              </div>
              <div className="mt-2 text-center text-[10px] text-blue-300 font-semibold bg-blue-950/60 rounded-lg py-1 border border-blue-500/30">
                Suelta en la bahía Rojo, Amarillo o Verde
              </div>
            </div>
          ) : null}
        </DragOverlay>
      </div>
    </DndContext>
  );
};
