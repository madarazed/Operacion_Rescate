import React, { useState } from 'react';
import {
  DndContext,
  useDraggable,
  useDroppable,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
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
}

const PATIENTS: Patient[] = [
  {
    id: 'patient-red',
    name: 'Paciente A (Canino)',
    targetZone: 'zone-red',
    condition: 'Inconsciente con respiración agitada y sangrado profuso.',
    image: patientRedImg,
    colorName: 'Rojo (Crítico)',
    badgeClass: 'bg-red-500/20 text-red-300 border-red-500/40',
  },
  {
    id: 'patient-yellow',
    name: 'Paciente B (Canino)',
    targetZone: 'zone-yellow',
    condition: 'Consciente con fractura visible en pata y dolor agudo.',
    image: patientYellowImg,
    colorName: 'Amarillo (Urgente)',
    badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
  },
  {
    id: 'patient-green',
    name: 'Paciente C (Canino)',
    targetZone: 'zone-green',
    condition: 'Alerta sin lesiones evidentes, deambula con calma.',
    image: patientGreenImg,
    colorName: 'Verde (Leve)',
    badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
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
    activeClass: 'bg-red-900/60 ring-2 ring-red-400 border-red-400',
  },
  {
    id: 'zone-yellow',
    title: '🟡 Triage Amarillo',
    subtitle: 'Urgente / Espera',
    colorClass: 'text-amber-400',
    borderClass: 'border-amber-500/60',
    bgClass: 'bg-amber-950/40',
    activeClass: 'bg-amber-900/60 ring-2 ring-amber-400 border-amber-400',
  },
  {
    id: 'zone-green',
    title: '🟢 Triage Verde',
    subtitle: 'Leve / Estable',
    colorClass: 'text-emerald-400',
    borderClass: 'border-emerald-500/60',
    bgClass: 'bg-emerald-950/40',
    activeClass: 'bg-emerald-900/60 ring-2 ring-emerald-400 border-emerald-400',
  },
];

interface DraggablePatientProps {
  patient: Patient;
  hasError: boolean;
  onDirectAssign: (patientId: string, zoneId: 'zone-red' | 'zone-yellow' | 'zone-green') => void;
}

const DraggablePatient: React.FC<DraggablePatientProps> = ({ patient, hasError, onDirectAssign }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: patient.id,
  });

  const style: React.CSSProperties = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    zIndex: isDragging ? 50 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`select-none p-2 sm:py-2 sm:px-2.5 rounded-xl backdrop-blur-md transition-all border ${
        hasError
          ? 'bg-red-950/80 border-red-500 ring-2 ring-red-500 animate-pulse'
          : isDragging
          ? 'bg-slate-800/95 border-blue-400 shadow-2xl scale-105'
          : 'bg-slate-900/85 hover:bg-slate-800/90 border-slate-700/60 shadow-lg'
      }`}
    >
      <div
        className="flex items-center space-x-2.5 cursor-grab active:cursor-grabbing touch-none"
        {...listeners}
        {...attributes}
      >
        <img
          src={patient.image}
          alt={patient.name}
          className="w-12 h-12 sm:w-14 sm:h-14 object-contain rounded-lg bg-black/40 p-1 border border-slate-700 flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-0.5">
            <span className="text-xs sm:text-sm font-bold text-white truncate">
              {patient.name}
            </span>
            <span className="text-[10px] text-slate-400 ml-1">🖐️ Arrastrar</span>
          </div>
          <p className="text-xs text-slate-200 leading-snug line-clamp-2">
            {patient.condition}
          </p>
        </div>
      </div>

      {/* Botones secundarios de asignación rápida para móvil / táctil */}
      <div className="flex items-center gap-1 pt-1.5 border-t border-slate-800/80 mt-1.5">
        <span className="text-[10px] text-slate-400 font-medium">Asignar:</span>
        <div className="flex items-center gap-1 flex-1">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDirectAssign(patient.id, 'zone-red');
            }}
            className="flex-1 py-1 px-1 bg-red-600/80 hover:bg-red-500 active:scale-95 text-[10px] font-bold text-white rounded transition shadow-sm border border-red-400/30 text-center"
            title="Asignar a Rojo (Crítico)"
          >
            🔴 Rojo
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDirectAssign(patient.id, 'zone-yellow');
            }}
            className="flex-1 py-1 px-1 bg-amber-600/80 hover:bg-amber-500 active:scale-95 text-[10px] font-bold text-white rounded transition shadow-sm border border-amber-400/30 text-center"
            title="Asignar a Amarillo (Urgente)"
          >
            🟡 Amarillo
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDirectAssign(patient.id, 'zone-green');
            }}
            className="flex-1 py-1 px-1 bg-emerald-600/80 hover:bg-emerald-500 active:scale-95 text-[10px] font-bold text-white rounded transition shadow-sm border border-emerald-400/30 text-center"
            title="Asignar a Verde (Leve)"
          >
            🟢 Verde
          </button>
        </div>
      </div>
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
      className={`rounded-xl sm:rounded-2xl border-2 p-1.5 sm:p-3 backdrop-blur-md transition-all flex flex-col justify-between min-h-[70px] sm:min-h-[110px] ${
        isOver ? zone.activeClass : `${zone.borderClass} ${zone.bgClass}`
      }`}
    >
      <div>
        <div className="flex items-center justify-between">
          <h3 className={`font-bold text-xs sm:text-sm truncate ${zone.colorClass}`}>
            {zone.title}
          </h3>
          {assignedPatient && (
            <span className="text-[9px] sm:text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-1 sm:px-1.5 py-0.5 rounded-full font-semibold">
              ✓
            </span>
          )}
        </div>
        <p className="text-[10px] sm:text-xs text-slate-300 truncate hidden xs:block">{zone.subtitle}</p>
      </div>

      {assignedPatient ? (
        <div className="bg-black/50 rounded-lg p-1 sm:p-1.5 border border-white/10 flex items-center space-x-1.5 animate-fade-in">
          <img
            src={assignedPatient.image}
            alt={assignedPatient.name}
            className="w-6 h-6 sm:w-8 sm:h-8 object-contain rounded bg-black/60 p-0.5 border border-slate-600 flex-shrink-0"
          />
          <div className="min-w-0 flex-1">
            <p className="text-[10px] sm:text-xs font-bold text-white truncate">{assignedPatient.name}</p>
          </div>
        </div>
      ) : (
        <div className="border border-dashed border-white/20 rounded-lg p-1 text-center flex items-center justify-center h-7 sm:h-10 bg-black/20">
          <span className="text-[9px] sm:text-xs text-slate-400 truncate">
            {isOver ? '¡Suelta!' : 'Arrastra o Toca'}
          </span>
        </div>
      )}
    </div>
  );
};

export const Level2: React.FC = () => {
  const addScore = useGameStore((state) => state.actions.addScore);
  const deductTime = useGameStore((state) => state.actions.deductTime);
  const nextLevel = useGameStore((state) => state.actions.nextLevel);

  const [assignedPatients, setAssignedPatients] = useState<Record<string, string>>({});
  const [errorPatientId, setErrorPatientId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: {
      distance: 8,
    },
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 150,
      tolerance: 5,
    },
  });
  const sensors = useSensors(pointerSensor, touchSensor);

  const processAssignment = (patientId: string, zoneId: 'zone-red' | 'zone-yellow' | 'zone-green') => {
    const patient = PATIENTS.find((p) => p.id === patientId);
    if (!patient) return;

    if (patient.targetZone === zoneId) {
      playSuccessDrop();
      setErrorMessage(null);
      setErrorPatientId(null);
      addScore(100);

      const nextAssigned = { ...assignedPatients, [zoneId]: patientId };
      setAssignedPatients(nextAssigned);

      if (Object.keys(nextAssigned).length === PATIENTS.length) {
        setIsCompleted(true);
      }
    } else {
      playErrorBuzzer();
      deductTime(5);
      setErrorPatientId(patientId);
      setErrorMessage('¡Clasificación incorrecta! Penalización: -5 segundos.');

      setTimeout(() => {
        setErrorPatientId(null);
        setErrorMessage(null);
      }, 1800);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const patientId = String(active.id);
    const zoneId = String(over.id) as 'zone-red' | 'zone-yellow' | 'zone-green';
    processAssignment(patientId, zoneId);
  };

  const handleDirectAssign = (patientId: string, zoneId: 'zone-red' | 'zone-yellow' | 'zone-green') => {
    processAssignment(patientId, zoneId);
  };

  const unassignedPatients = PATIENTS.filter(
    (patient) => !Object.values(assignedPatients).includes(patient.id)
  );

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div
        className="w-full h-[100dvh] pt-14 relative overflow-hidden bg-cover bg-center flex flex-col justify-between"
        style={{ backgroundImage: `url(${triageBg})` }}
      >
        {/* Capa de oscurecimiento suave */}
        <div className="absolute inset-0 bg-black/45 pointer-events-none" />

        {/* Modal de Éxito al Completar */}
        {isCompleted && (
          <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
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
                onClick={() => nextLevel()}
                className="w-full bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold py-3 px-6 rounded-xl transition duration-150 shadow-md"
              >
                Avanzar al Siguiente Nivel
              </button>
            </div>
          </div>
        )}

        {/* Encabezado y Zonas de Triage (Parte Superior / Media) */}
        <div className="relative z-20 w-full max-w-5xl mx-auto pt-2 sm:pt-4 px-3 sm:px-6 space-y-2 sm:space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
            <div>
              <span className="inline-block bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider mb-0.5">
                Fase 2: Socorrer (Triage START)
              </span>
              <h2 className="text-base sm:text-xl font-bold text-white tracking-tight">
                Tablero de Triage de Campo
              </h2>
            </div>
            {errorMessage && (
              <span className="bg-red-500/90 text-white text-[11px] sm:text-xs font-semibold px-2 sm:px-3 py-1 rounded-lg shadow-lg border border-red-400 animate-bounce self-start sm:self-auto">
                ⚠️ {errorMessage}
              </span>
            )}
          </div>

          {/* Grid de 3 Zonas de Drop compactas */}
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

        {/* Mesa de Evaluación (Pacientes Arrastrables anclada en la parte inferior) */}
        <div className="relative z-20 w-full max-w-4xl mx-auto px-3 sm:px-6 pb-2 sm:pb-4 pointer-events-auto">
          <div className="w-full bg-slate-950/90 backdrop-blur-md rounded-2xl p-2.5 sm:p-4 border border-slate-800 shadow-2xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Mesa de Evaluación ({unassignedPatients.length}/3)
              </span>
              <span className="text-[11px] text-slate-400 hidden sm:inline">
                Arrastra o pulsa en los botones para asignar según su gravedad clínica
              </span>
            </div>

            {unassignedPatients.length === 0 ? (
              <div className="p-2 sm:p-3 text-center text-xs sm:text-sm font-semibold text-emerald-400 bg-emerald-950/30 rounded-xl border border-emerald-500/30">
                ✓ Todos los pacientes han sido asignados correctamente a sus áreas de triage.
              </div>
            ) : (
              <div className="max-h-[32vh] overflow-y-auto pr-0.5 space-y-2 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-2.5">
                {unassignedPatients.map((patient) => (
                  <DraggablePatient
                    key={patient.id}
                    patient={patient}
                    hasError={errorPatientId === patient.id}
                    onDirectAssign={handleDirectAssign}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DndContext>
  );
};
