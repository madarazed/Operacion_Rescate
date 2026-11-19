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

interface Vitals {
  pulse: string;
  breathing: string;
  injury: string;
}

interface Patient {
  id: string;
  name: string;
  targetZone: 'zone-red' | 'zone-yellow' | 'zone-green';
  gravity: 'red' | 'yellow' | 'green';
  vitals: Vitals;
  condition: string;
  image: string;
  colorName: string;
  badgeClass: string;
  feedbackTip: string;
  didacticPill: string;
  getMistakeExplanation: (selectedZone: 'zone-red' | 'zone-yellow' | 'zone-green') => string;
}

const PATIENTS: Patient[] = [
  {
    id: 'patient-red',
    name: 'Max • Canino',
    targetZone: 'zone-red',
    gravity: 'red',
    vitals: {
      pulse: '160 lpm • Débil',
      breathing: 'Agitada • 45 rpm',
      injury: 'Hemorragia Arterial',
    },
    condition: 'Inconsciente con respiración agitada y sangrado profuso activo en extremidad.',
    image: patientRedImg,
    colorName: 'Rojo (Crítico)',
    badgeClass: 'bg-red-500/20 text-red-300 border-red-500/40',
    feedbackTip: '¡Excelente decisión clínica! La inconsciencia y el sangrado masivo exigen atención médica de choque inmediata.',
    didacticPill: 'Riesgo vital inminente: Prioridad Roja (0 min de espera)',
    getMistakeExplanation: (zone) =>
      zone === 'zone-green'
        ? '¡Error crítico! Este paciente tiene compromiso vital inminente e inconsciencia; jamás puede esperar en triage Verde.'
        : '¡Atención! Aunque hay fractura, la inconsciencia y hemorragia arterial lo elevan por encima de Amarillo a Código Rojo.',
  },
  {
    id: 'patient-yellow',
    name: 'Luna • Felino',
    targetZone: 'zone-yellow',
    gravity: 'yellow',
    vitals: {
      pulse: '120 lpm • Rítmico',
      breathing: 'Estable • 28 rpm',
      injury: 'Fractura Ósea',
    },
    condition: 'Consciente con fractura visible en pata y dolor agudo; constantes hemodinámicas estables.',
    image: patientYellowImg,
    colorName: 'Amarillo (Urgente)',
    badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    feedbackTip: '¡Muy bien! Fracturas con dolor pero constantes fisiológicas estables son urgencias de espera controlada.',
    didacticPill: 'Urgencia sin shock hemodinámico: Prioridad Amarilla (Espera controlada)',
    getMistakeExplanation: (zone) =>
      zone === 'zone-red'
        ? 'Luna tiene dolor agudo pero sus signos vitales están estables. Reservar Rojo para riesgo vital inminente; corresponde a Amarillo.'
        : 'Una fractura ósea con dolor agudo no puede enviarse a Triage Verde. Requiere analgesia e inmovilización pronta (Amarillo).',
  },
  {
    id: 'patient-green',
    name: 'Toby • Canino',
    targetZone: 'zone-green',
    gravity: 'green',
    vitals: {
      pulse: '90 lpm • Fuerte',
      breathing: 'Normal • 20 rpm',
      injury: 'Rasguño Superficial',
    },
    condition: 'Alerta sin lesiones graves, deambula con calma y presenta signos vitales normales.',
    image: patientGreenImg,
    colorName: 'Verde (Leve)',
    badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    feedbackTip: '¡Correcto! El paciente deambula por sí mismo y responde activamente al entorno; está fuera de peligro inmediato.',
    didacticPill: 'Lesión leve ambulatoria: Prioridad Verde (Atención diferida)',
    getMistakeExplanation: () =>
      'Toby deambula con calma y no presenta hemorragia ni dificultad respiratoria. Saturaría urgencias innecesariamente; corresponde a Verde (Leve).',
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
    title: '🛑 CRÍTICO',
    subtitle: 'Inmediato',
    colorClass: 'text-red-400',
    borderClass: 'border-red-500/60',
    bgClass: 'bg-red-950/40',
    activeClass: 'bg-red-900/80 ring-4 ring-red-400 border-red-300 shadow-[0_0_25px_rgba(239,68,68,0.7)] scale-105',
  },
  {
    id: 'zone-yellow',
    title: '⚠️ URGENTE',
    subtitle: 'Prioritario',
    colorClass: 'text-amber-400',
    borderClass: 'border-amber-500/60',
    bgClass: 'bg-amber-950/40',
    activeClass: 'bg-amber-900/80 ring-4 ring-amber-400 border-amber-300 shadow-[0_0_25px_rgba(245,158,11,0.7)] scale-105',
  },
  {
    id: 'zone-green',
    title: '🛡️ LEVE',
    subtitle: 'Estable',
    colorClass: 'text-emerald-400',
    borderClass: 'border-emerald-500/60',
    bgClass: 'bg-emerald-950/40',
    activeClass: 'bg-emerald-900/80 ring-4 ring-emerald-400 border-emerald-300 shadow-[0_0_25px_rgba(16,185,129,0.7)] scale-105',
  },
];

/**
 * Línea de pulso ECG animada que cambia de velocidad y color según la gravedad
 */
const ECGWave: React.FC<{ gravity: 'red' | 'yellow' | 'green' }> = ({ gravity }) => {
  const strokeColor =
    gravity === 'red' ? '#f87171' : gravity === 'yellow' ? '#fbbf24' : '#34d399';
  const duration = gravity === 'red' ? 0.85 : gravity === 'yellow' ? 1.4 : 2.2;
  const label =
    gravity === 'red' ? 'TAQUICARDIA SEVERA' : gravity === 'yellow' ? 'RITMO ACELERADO' : 'NORMOCARDIA';

  return (
    <div className="relative w-full h-7 overflow-hidden bg-slate-950/90 rounded-lg border border-slate-800 flex items-center px-2.5 shadow-inner">
      <div className="flex items-center space-x-1.5 text-[10px] font-mono font-extrabold mr-2 text-slate-300">
        <span
          className="w-2 h-2 rounded-full animate-ping"
          style={{ backgroundColor: strokeColor }}
        />
        <span>ECG</span>
      </div>

      <svg className="flex-1 h-5 w-full" viewBox="0 0 300 24" preserveAspectRatio="none">
        <motion.path
          d="M 0 12 L 35 12 L 42 6 L 48 20 L 54 2 L 60 22 L 66 12 L 100 12 L 107 6 L 113 20 L 119 2 L 125 22 L 131 12 L 165 12 L 172 6 L 178 20 L 184 2 L 190 22 L 196 12 L 230 12 L 237 6 L 243 20 L 249 2 L 255 22 L 261 12 L 300 12"
          fill="none"
          stroke={strokeColor}
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          animate={{ x: [-30, 0] }}
          transition={{ repeat: Infinity, duration, ease: 'linear' }}
        />
      </svg>

      <span
        className="text-[10px] font-mono font-black ml-2 whitespace-nowrap"
        style={{ color: strokeColor }}
      >
        {label}
      </span>
    </div>
  );
};

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
      className={`rounded-2xl border-2 p-2.5 sm:p-3 backdrop-blur-md transition-all duration-200 flex flex-col justify-between min-h-[110px] sm:min-h-[130px] ${
        isOver
          ? `${zone.activeClass}`
          : assignedPatient
          ? `${zone.borderClass} bg-slate-950/85 shadow-lg border-2`
          : `${zone.borderClass} ${zone.bgClass} shadow-md`
      }`}
    >
      <div>
        <div className="flex items-center justify-between gap-1 w-full">
          <span className={`font-black text-xs xs:text-sm sm:text-base tracking-wide whitespace-nowrap ${zone.colorClass}`}>
            {zone.title}
          </span>
          {assignedPatient && (
            <span className="text-[10px] sm:text-xs bg-emerald-500/25 text-emerald-300 border border-emerald-500/50 px-1.5 sm:px-2 py-0.2 rounded-full font-bold shadow-sm whitespace-nowrap">
              ✓ Listo
            </span>
          )}
        </div>
        <p className="text-[11px] sm:text-xs text-slate-300 font-semibold tracking-tight mt-0.5">
          {zone.subtitle}
        </p>
      </div>

      {assignedPatient ? (
        <div className="bg-slate-950/90 rounded-xl p-1.5 sm:p-2 border border-white/15 flex items-center space-x-2 animate-fade-in shadow-inner mt-1">
          <img
            src={assignedPatient.image}
            alt={assignedPatient.name}
            className="w-7 h-7 sm:w-9 sm:h-9 object-contain rounded-lg bg-black/60 p-0.5 border border-slate-600 flex-shrink-0"
          />
          <div className="min-w-0 flex-1 leading-tight">
            <p className="text-xs sm:text-sm font-extrabold text-white">{assignedPatient.name}</p>
            <p className="text-[10px] text-emerald-300 font-medium">Asignado con éxito</p>
          </div>
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-xl p-1.5 text-center flex items-center justify-center h-9 sm:h-11 transition-all mt-1 ${
            isOver
              ? 'border-white bg-white/30 text-white font-bold shadow-lg scale-102'
              : 'border-white/20 bg-black/25 text-slate-400'
          }`}
        >
          <span className="text-[11px] sm:text-xs font-bold tracking-wide flex items-center justify-center space-x-1">
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
  successPill: string | null;
  onDirectAssign: (patientId: string, zoneId: 'zone-red' | 'zone-yellow' | 'zone-green') => void;
}

const ActivePatientCard: React.FC<ActivePatientCardProps> = ({
  patient,
  hasError,
  successPill,
  onDirectAssign,
}) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: patient.id,
  });

  return (
    <motion.div
      ref={setNodeRef}
      animate={hasError ? { x: [-8, 8, -6, 6, -3, 3, 0] } : {}}
      transition={{ duration: 0.5 }}
      className={`relative select-none p-3.5 sm:p-4 rounded-2xl backdrop-blur-xl transition-all border-2 ${
        hasError
          ? 'bg-red-950/95 border-red-500 ring-4 ring-red-500'
          : isDragging
          ? 'opacity-30 border-blue-400'
          : 'bg-slate-900/90 border-teal-500/30 shadow-2xl'
      }`}
    >
      {/* 1. Línea ECG animada del Monitor */}
      <ECGWave gravity={patient.gravity} />

      {/* Sello didáctico de éxito si se clasificó */}
      <AnimatePresence>
        {successPill && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="mt-2 bg-emerald-950/95 border border-emerald-400 text-emerald-200 text-xs p-2 rounded-xl shadow-lg flex items-center justify-center space-x-2 text-center"
          >
            <span>✅</span>
            <span className="font-extrabold">{successPill}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Zona central: Avatar respirando + Nombre + Badges de signos vitales */}
      <div
        className="flex items-center space-x-3 sm:space-x-4 cursor-grab active:cursor-grabbing touch-none mt-2.5"
        {...listeners}
        {...attributes}
      >
        {/* Contenedor del animal con animación de respiración */}
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-b from-slate-800 to-black/85 p-2 border-2 border-slate-700/80 shadow-xl flex items-center justify-center flex-shrink-0">
          <motion.img
            src={patient.image}
            alt={patient.name}
            animate={{ y: [-2, 2, -2], scale: [1, 1.02, 1] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
            className="w-16 h-16 sm:w-20 sm:h-20 object-contain drop-shadow-md select-none"
          />
          <span className="absolute -bottom-2 px-2.5 py-0.5 bg-blue-600 text-white text-[10px] sm:text-xs font-bold rounded-full shadow border border-blue-400 tracking-wide whitespace-nowrap">
            🖐️ Arrastrar
          </span>
        </div>

        {/* Ficha Clínica del Paciente */}
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center justify-between gap-1.5">
            <h3 className="text-base sm:text-lg font-black text-white tracking-tight">
              {patient.name}
            </h3>
            <span className="text-[11px] text-blue-300 font-bold bg-blue-500/20 px-2 py-0.5 rounded-full border border-blue-500/40 flex-shrink-0">
              En Evaluación
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-200 leading-snug font-medium">
            {patient.condition}
          </p>
        </div>
      </div>

      {/* 3. Badges de Signos Vitales Didácticos */}
      <div className="grid grid-cols-3 gap-1.5 sm:gap-2 w-full mt-3 pt-2.5 border-t border-slate-800/80">
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-1.5 text-center flex flex-col items-center">
          <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
            <span>💓</span> <span>Pulso</span>
          </span>
          <span className="text-xs sm:text-sm font-black text-rose-300 mt-0.5 leading-tight">
            {patient.vitals.pulse}
          </span>
        </div>

        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-1.5 text-center flex flex-col items-center">
          <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
            <span>🫁</span> <span>Respiración</span>
          </span>
          <span className="text-xs sm:text-sm font-black text-cyan-300 mt-0.5 leading-tight">
            {patient.vitals.breathing}
          </span>
        </div>

        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-1.5 text-center flex flex-col items-center">
          <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
            <span>🩸</span> <span>Lesión</span>
          </span>
          <span className="text-xs sm:text-sm font-black text-amber-300 mt-0.5 leading-tight">
            {patient.vitals.injury}
          </span>
        </div>
      </div>

      {/* 4. Botones Arcade táctiles con Iconos Universales */}
      <div className="pt-2.5 mt-2.5 border-t border-slate-800/80 space-y-1.5">
        <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold px-1">
          <span>O asigna con un toque directo:</span>
          <span className="text-[10px] text-slate-500">Acceso rápido</span>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => onDirectAssign(patient.id, 'zone-red')}
            className="h-11 sm:h-12 py-2 px-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 active:scale-95 text-white text-xs sm:text-sm font-black shadow-lg shadow-red-500/25 border-2 border-red-400/50 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <span className="text-base sm:text-lg">🛑</span>
            <span>Crítico</span>
          </button>
          <button
            type="button"
            onClick={() => onDirectAssign(patient.id, 'zone-yellow')}
            className="h-11 sm:h-12 py-2 px-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 active:scale-95 text-white text-xs sm:text-sm font-black shadow-lg shadow-amber-500/25 border-2 border-amber-400/50 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <span className="text-base sm:text-lg">⚠️</span>
            <span>Urgente</span>
          </button>
          <button
            type="button"
            onClick={() => onDirectAssign(patient.id, 'zone-green')}
            className="h-11 sm:h-12 py-2 px-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 active:scale-95 text-white text-xs sm:text-sm font-black shadow-lg shadow-emerald-500/25 border-2 border-emerald-400/50 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <span className="text-base sm:text-lg">🛡️</span>
            <span>Leve</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export const Level2: React.FC = () => {
  const addScore = useGameStore((state) => state.actions.addScore);
  const addTime = useGameStore((state) => state.actions.addTime);
  const deductTime = useGameStore((state) => state.actions.deductTime);
  const nextLevel = useGameStore((state) => state.actions.nextLevel);

  const [assignedPatients, setAssignedPatients] = useState<Record<string, string>>({});
  const [activeId, setActiveId] = useState<string | null>(null);
  const [errorPatientId, setErrorPatientId] = useState<string | null>(null);
  const [successPill, setSuccessPill] = useState<string | null>(null);
  const [feedbackToast, setFeedbackToast] = useState<{
    title: string;
    message: string;
    type: 'success' | 'error';
  } | null>(null);
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
      addTime(15);

      setSuccessPill(`✅ ¡Clasificación Correcta! • ${patient.didacticPill}`);
      setFeedbackToast({
        title: '¡Criterio Veterinario Correcto! (+15s)',
        message: patient.feedbackTip,
        type: 'success',
      });
      setErrorPatientId(null);

      const nextAssigned = { ...assignedPatients, [zoneId]: patientId };
      setAssignedPatients(nextAssigned);

      setTimeout(() => {
        setSuccessPill(null);
      }, 2000);

      if (Object.keys(nextAssigned).length === PATIENTS.length) {
        setTimeout(() => {
          setIsCompleted(true);
        }, 600);
      }
    } else {
      triggerVibration([60, 40, 60]);
      playErrorBuzzer();
      deductTime(3);
      setErrorPatientId(patientId);
      setSuccessPill(null);

      const errorExplanation = patient.getMistakeExplanation(zoneId);
      setFeedbackToast({
        title: 'Orientación Pedagógica de Triage',
        message: errorExplanation,
        type: 'error',
      });

      setTimeout(() => {
        setErrorPatientId(null);
      }, 2000);
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
        className="w-full h-[100dvh] pt-14 p-2.5 sm:p-5 relative overflow-hidden bg-cover bg-center flex flex-col justify-between select-none"
        style={{ backgroundImage: `url(${triageBg})` }}
      >
        {/* Capa de oscurecimiento suave */}
        <div className="absolute inset-0 bg-slate-950/60 pointer-events-none" />

        {/* Modal de Transición Victoriosa al Completar 3/3 */}
        <AnimatePresence>
          {isCompleted && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.85, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ type: 'spring', damping: 20 }}
                className="bg-slate-900 border-2 border-emerald-500/60 rounded-3xl p-6 sm:p-8 max-w-md w-full text-center space-y-4 shadow-2xl ring-4 ring-emerald-500/20"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto text-3xl sm:text-4xl border-2 border-emerald-400/50 shadow-lg shadow-emerald-500/30 animate-bounce">
                  🌟
                </div>
                <div>
                  <span className="inline-block px-3 py-1 bg-emerald-500/20 border border-emerald-500/40 rounded-full text-emerald-300 text-xs font-bold uppercase tracking-wider mb-1">
                    ¡Triage 3/3 Completado!
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    ¡Triage Superado con Éxito!
                  </h2>
                </div>
                <p className="text-slate-200 text-xs sm:text-sm leading-relaxed">
                  Has clasificado correctamente a los 3 pacientes caninos y felinos según la prioridad vital del protocolo START. Salvaste minutos vitales para su atención especializada.
                </p>
                <div className="bg-slate-950/80 rounded-xl p-2.5 border border-slate-800 text-emerald-300 text-xs font-semibold flex items-center justify-center space-x-2">
                  <span>+300 Puntos Totales</span>
                  <span>•</span>
                  <span>Evaluación Primaria Desbloqueada</span>
                </div>
                <button
                  type="button"
                  disabled={Object.keys(assignedPatients).length !== PATIENTS.length}
                  onClick={() => {
                    if (Object.keys(assignedPatients).length === PATIENTS.length) {
                      nextLevel();
                    }
                  }}
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-95 text-white font-extrabold py-3.5 px-6 rounded-xl transition duration-150 shadow-lg shadow-emerald-500/30 cursor-pointer text-sm sm:text-base border border-emerald-400/40 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continuar a Fase 3: Evaluación ABCDE →
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bahías de Triage (Parte Superior Fija y Ampliada con Etiquetas Cortas) */}
        <div className="relative z-20 w-full max-w-4xl mx-auto space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <span className="inline-block bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Fase 2: Socorrer (Triage START)
              </span>
              <h2 className="text-base sm:text-lg font-black text-white tracking-tight">
                Bahías de Atención
              </h2>
            </div>

            {/* Chips de progreso de pacientes */}
            <div className="flex items-center space-x-2">
              <span className="text-xs text-slate-300 font-semibold hidden xs:inline">
                Clasificados:
              </span>
              <span className="text-xs sm:text-sm font-extrabold text-white bg-slate-900/90 px-3 py-1 rounded-full border border-slate-700 shadow">
                {totalClassified} / {PATIENTS.length}
              </span>
            </div>
          </div>

          {/* Grid de 3 Bahías en fila balanceada y etiquetas legibles */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3.5 w-full">
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

        {/* Zona Central: Banner Flotante de Feedback Pedagógico */}
        <div className="relative z-20 w-full max-w-lg mx-auto min-h-[44px] flex items-center justify-center my-1">
          <AnimatePresence mode="wait">
            {feedbackToast && (
              <motion.div
                key={feedbackToast.message}
                initial={{ opacity: 0, y: -6, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className={`w-full py-2 px-3.5 rounded-xl text-left border shadow-2xl flex items-start space-x-2.5 ${
                  feedbackToast.type === 'success'
                    ? 'bg-slate-900/95 border-emerald-500/70 shadow-emerald-500/10 text-emerald-100 ring-1 ring-emerald-400/30'
                    : 'bg-slate-900/95 border-amber-500/70 shadow-amber-500/10 text-amber-100 ring-1 ring-amber-400/30'
                }`}
              >
                <span className="text-lg flex-shrink-0 mt-0.5">
                  {feedbackToast.type === 'success' ? '🩺' : '💡'}
                </span>
                <div className="min-w-0 flex-1">
                  <p className={`text-xs font-bold ${feedbackToast.type === 'success' ? 'text-emerald-400' : 'text-amber-300'}`}>
                    {feedbackToast.title}
                  </p>
                  <p className="text-[11px] sm:text-xs text-slate-200 mt-0.5 leading-snug">
                    {feedbackToast.message}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Monitor Veterinario Portátil (Mesa de Examen) */}
        <div className="relative z-20 w-full max-w-xl mx-auto pb-1">
          <div className="bg-slate-950/90 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-teal-500/30 shadow-2xl space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                <span>Monitor Clínico ({currentPatient ? `Paciente ${totalClassified + 1} de 3` : 'Completado'})</span>
              </span>
              <span className="text-[11px] text-slate-400">
                {currentPatient ? 'Arrastra a la bahía o toca el botón' : 'Todos asignados'}
              </span>
            </div>

            {currentPatient ? (
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentPatient.id}
                  initial={{ opacity: 0, x: 20, scale: 0.98 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -20, scale: 0.98 }}
                  transition={{ duration: 0.22 }}
                >
                  <ActivePatientCard
                    patient={currentPatient}
                    hasError={errorPatientId === currentPatient.id}
                    successPill={successPill}
                    onDirectAssign={handleDirectAssign}
                  />
                </motion.div>
              </AnimatePresence>
            ) : (
              <div className="p-4 text-center text-sm font-bold text-emerald-400 bg-emerald-950/30 rounded-xl border border-emerald-500/30 animate-fade-in">
                ✓ ¡Excelente trabajo! Todos los pacientes han sido clasificados con pericia médica.
              </div>
            )}
          </div>
        </div>

        {/* DragOverlay para que el paciente siga el dedo/cursor sin recortarse */}
        <DragOverlay dropAnimation={null}>
          {activeDraggedPatient ? (
            <div className="w-80 sm:w-96 p-3.5 rounded-2xl bg-slate-900/95 border-2 border-teal-400 shadow-2xl scale-105 rotate-2 opacity-95 backdrop-blur-xl text-white pointer-events-none ring-4 ring-teal-500/30 space-y-2">
              <ECGWave gravity={activeDraggedPatient.gravity} />
              <div className="flex items-center space-x-3">
                <div className="w-16 h-16 rounded-xl bg-black/70 p-1 border border-slate-600 flex-shrink-0 flex items-center justify-center">
                  <img
                    src={activeDraggedPatient.image}
                    alt={activeDraggedPatient.name}
                    className="w-14 h-14 object-contain"
                  />
                </div>
                <div className="min-w-0 flex-1 leading-snug">
                  <p className="text-base font-black text-white">
                    {activeDraggedPatient.name}
                  </p>
                  <p className="text-xs text-slate-200 line-clamp-2 mt-0.5">
                    {activeDraggedPatient.condition}
                  </p>
                </div>
              </div>
              <div className="text-center text-xs text-teal-300 font-bold bg-teal-950/80 rounded-lg py-1 border border-teal-500/40">
                Suelta en 🛑 Crítico, ⚠️ Urgente o 🛡️ Leve
              </div>
            </div>
          ) : null}
        </DragOverlay>
      </div>
    </DndContext>
  );
};
