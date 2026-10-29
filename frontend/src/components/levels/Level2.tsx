import React, { useState } from 'react';
import { DndContext, useDraggable, useDroppable } from '@dnd-kit/core';
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
}

const DraggablePatient: React.FC<DraggablePatientProps> = ({ patient, hasError }) => {
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
      {...listeners}
      {...attributes}
      className={`touch-none select-none cursor-grab active:cursor-grabbing p-3 rounded-xl backdrop-blur-md transition-all border ${
        hasError
          ? 'bg-red-950/80 border-red-500 ring-2 ring-red-500 animate-pulse'
          : isDragging
          ? 'bg-slate-800/95 border-blue-400 shadow-2xl scale-105'
          : 'bg-slate-900/85 hover:bg-slate-800/90 border-slate-700/60 shadow-lg'
      }`}
    >
      <div className="flex items-center space-x-3">
        <img
          src={patient.image}
          alt={patient.name}
          className="w-14 h-14 sm:w-16 sm:h-16 object-contain rounded-lg bg-black/40 p-1 border border-slate-700 flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs sm:text-sm font-bold text-white truncate">
              {patient.name}
            </span>
            <span className="text-[10px] text-slate-400 ml-1">🖐️ Arrastrar</span>
          </div>
          <p className="text-[11px] sm:text-xs text-slate-200 leading-snug line-clamp-2">
            {patient.condition}
          </p>
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
      className={`rounded-2xl border-2 p-3 sm:p-4 backdrop-blur-md transition-all flex flex-col justify-between min-h-[140px] sm:min-h-[160px] ${
        isOver ? zone.activeClass : `${zone.borderClass} ${zone.bgClass}`
      }`}
    >
      <div>
        <div className="flex items-center justify-between mb-1">
          <h3 className={`font-bold text-sm sm:text-base ${zone.colorClass}`}>
            {zone.title}
          </h3>
          {assignedPatient && (
            <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-semibold">
              ✓ Clasificado
            </span>
          )}
        </div>
        <p className="text-[11px] sm:text-xs text-slate-300 mb-2">{zone.subtitle}</p>
      </div>

      {assignedPatient ? (
        <div className="bg-black/40 rounded-xl p-2.5 border border-white/10 flex items-center space-x-2.5 animate-fade-in">
          <img
            src={assignedPatient.image}
            alt={assignedPatient.name}
            className="w-10 h-10 object-contain rounded bg-black/50 p-0.5 border border-slate-600 flex-shrink-0"
          />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-white truncate">{assignedPatient.name}</p>
            <p className="text-[10px] text-slate-300 truncate">{assignedPatient.condition}</p>
          </div>
        </div>
      ) : (
        <div className="border border-dashed border-white/20 rounded-xl p-3 text-center flex flex-col items-center justify-center h-16 sm:h-20 bg-black/20">
          <span className="text-xs text-slate-400">
            {isOver ? '¡Suelta aquí!' : 'Arrastra aquí el paciente'}
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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const patientId = String(active.id);
    const zoneId = String(over.id) as 'zone-red' | 'zone-yellow' | 'zone-green';

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

  const unassignedPatients = PATIENTS.filter(
    (patient) => !Object.values(assignedPatients).includes(patient.id)
  );

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div
        className="w-full h-full pt-14 relative overflow-hidden bg-cover bg-center flex flex-col justify-between"
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
        <div className="relative z-20 w-full max-w-5xl mx-auto pt-4 px-4 sm:px-6 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
            <div>
              <span className="inline-block bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-1">
                Fase 2: Socorrer (Triage START)
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                Tablero de Triage de Campo
              </h2>
            </div>
            {errorMessage && (
              <span className="bg-red-500/90 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-lg border border-red-400 animate-bounce">
                ⚠️ {errorMessage}
              </span>
            )}
          </div>

          {/* Grid de 3 Zonas de Drop distribuidas */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 w-full">
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
        <div className="absolute bottom-4 sm:bottom-6 left-0 right-0 px-4 sm:px-6 flex justify-center z-20 pointer-events-auto">
          <div className="w-full max-w-4xl bg-slate-950/90 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-slate-800 shadow-2xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Mesa de Evaluación (Pacientes Pendientes: {unassignedPatients.length}/3)
              </span>
              <span className="text-[11px] text-slate-400 hidden sm:inline">
                Arrastra cada paciente a la zona superior correcta según su gravedad clínica
              </span>
            </div>

            {unassignedPatients.length === 0 ? (
              <div className="p-3 text-center text-sm font-semibold text-emerald-400 bg-emerald-950/30 rounded-xl border border-emerald-500/30">
                ✓ Todos los pacientes han sido asignados correctamente a sus áreas de triage.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
                {unassignedPatients.map((patient) => (
                  <DraggablePatient
                    key={patient.id}
                    patient={patient}
                    hasError={errorPatientId === patient.id}
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
