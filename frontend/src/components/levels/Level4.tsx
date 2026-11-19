import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';
import { playSuccessDrop, playErrorBuzzer, playHeartbeat } from '../../utils/soundEffects';
import { LevelCompleteOverlay } from '../ui/LevelCompleteOverlay';

import triageBg from '../../assets/backgrounds/level2-triage-room.jpg';
import examineDogImg from '../../assets/characters/level3-examine-dog.png';
import firstAidKitImg from '../../assets/items/level4-first-aid-kit.png';
import gauzeCleanImg from '../../assets/items/level4-gauze-clean.png';
import gauzeBloodyImg from '../../assets/items/level4-gauze-bloody.png';
import bandageRollImg from '../../assets/items/level4-bandage-roll.png';

type ClinicalStep = 'INITIAL' | 'COMPRESSING' | 'SATURATED' | 'SECOND_GAUZE' | 'BANDAGED';

interface ClinicalFeedback {
  type: 'info' | 'warning' | 'error' | 'success';
  message: string;
}

export const Level4: React.FC = () => {
  const addScore = useGameStore((state) => state.actions.addScore);
  const addTime = useGameStore((state) => state.actions.addTime);
  const deductTime = useGameStore((state) => state.actions.deductTime);
  const finishMission = useGameStore((state) => state.actions.finishMission);
  const completeGame = useGameStore((state) => state.actions.completeGame);
  const setGameState = useGameStore((state) => state.actions.setGameState);
  const nextLevel = useGameStore((state) => state.actions.nextLevel);

  const [step, setStep] = useState<ClinicalStep>('INITIAL');
  const [feedback, setFeedback] = useState<ClinicalFeedback | null>(null);
  const [shakeError, setShakeError] = useState(false);
  const [shakeAntiseptic, setShakeAntiseptic] = useState(false);
  const [isLevelComplete, setIsLevelComplete] = useState<boolean>(false);

  const triggerVibration = (pattern: number | number[] = 40) => {
    try {
      navigator?.vibrate?.(pattern);
    } catch {
      // Ignore vibration error on unsupported platforms
    }
  };

  // Acción directa para avanzar a VictoryScreen sin depender de números de nivel frágiles
  const handleFinishMission = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    triggerVibration([40, 30, 60]);
    playSuccessDrop();

    if (finishMission) {
      finishMission();
    } else if (completeGame) {
      completeGame();
    } else if (setGameState) {
      setGameState('victory');
    } else {
      nextLevel();
    }
  };

  // Etapa 1: Presión directa con gasa estéril limpia
  const handleApplyFirstGauze = () => {
    if (step !== 'INITIAL') return;
    triggerVibration(40);
    playHeartbeat();
    setFeedback({
      type: 'info',
      message: 'Ejerciendo compresión directa firme sobre el vaso lesionado (1.8s)...',
    });
    setStep('COMPRESSING');
    addScore(50);

    // Tras 2 segundos, la gasa se satura de sangre y requiere decisión clínica
    setTimeout(() => {
      triggerVibration([50, 40]);
      setStep('SATURATED');
      setFeedback({
        type: 'warning',
        message: '¡La primera gasa se ha empapado de sangre! ¿Qué haces ahora?',
      });
    }, 2000);
  };

  // Etapa 2 - Opción A (Error): Retirar la gasa empapada
  const handleOptionRetirarGasa = () => {
    if (step === 'BANDAGED') return;
    triggerVibration([60, 40, 60]);
    playErrorBuzzer();
    deductTime(10);
    setShakeError(true);
    setFeedback({
      type: 'error',
      message:
        '¡Cuidado! Retirar la primera gasa arranca el coágulo en formación y reinicia el sangrado.',
    });
    setTimeout(() => setShakeError(false), 600);
  };

  // Etapa 2 - Opción B (Correcta): Superponer segunda gasa limpia encima
  const handleOptionSuperponerGasa = () => {
    if (step !== 'SATURATED') return;
    triggerVibration(40);
    playSuccessDrop();
    setFeedback({
      type: 'success',
      message:
        '¡Excelente criterio! La segunda gasa protege el coágulo primario sin arrancarlo y refuerza la absorción.',
    });
    addScore(100);
    addTime(15);
    setStep('SECOND_GAUZE');
  };

  // Etapa 3: Aplicación del vendaje elástico compresivo (100% Hemostasia)
  const handleApplyBandage = () => {
    if (step !== 'SECOND_GAUZE') return;
    triggerVibration([40, 30, 60]);
    playSuccessDrop();
    addScore(100);
    addTime(15);
    // Limpieza de cualquier advertencia de error previa
    setShakeError(false);
    setShakeAntiseptic(false);
    setStep('BANDAGED');
    setFeedback({
      type: 'success',
      message:
        '¡Vendaje compresivo completado con éxito! 100% Hemostasia lograda, coágulo protegido y signos estables.',
    });

    // Despliega automáticamente el LevelCompleteOverlay con 600ms de delay
    setTimeout(() => {
      setIsLevelComplete(true);
    }, 600);
  };

  // Distractor Pedagógico: Antiséptico / Suero (Deshabilitado totalmente al alcanzar el 100%)
  const handleSelectAntiseptic = () => {
    if (step === 'BANDAGED') return; // Deshabilitado en 100%
    triggerVibration([60, 40, 60]);
    playErrorBuzzer();
    deductTime(5);
    setShakeAntiseptic(true);
    setFeedback({
      type: 'error',
      message:
        'Primero debes detener la hemorragia por presión directa; lavar ahora arrastra los factores de coagulación y diluye las plaquetas.',
    });
    setTimeout(() => setShakeAntiseptic(false), 600);
  };

  // Configuración del Estado Hemodinámico
  const getHemostasisInfo = () => {
    switch (step) {
      case 'INITIAL':
        return {
          percent: 0,
          label: '0% • Sangrado Activo',
          colorText: 'text-red-400',
          badgeBg: 'bg-red-500/20 border-red-500/40 text-red-300',
          barGradient: 'from-red-600 via-rose-600 to-red-500',
          icon: '🩸',
        };
      case 'COMPRESSING':
        return {
          percent: 25,
          label: '25% • Presión Directa',
          colorText: 'text-orange-400',
          badgeBg: 'bg-orange-500/20 border-orange-500/40 text-orange-300',
          barGradient: 'from-orange-600 via-amber-500 to-orange-400',
          icon: '⏱️',
        };
      case 'SATURATED':
        return {
          percent: 40,
          label: '40% • Gasa Saturada',
          colorText: 'text-rose-300',
          badgeBg: 'bg-rose-500/20 border-rose-500/40 text-rose-300',
          barGradient: 'from-rose-600 via-amber-600 to-rose-500',
          icon: '⚠️',
        };
      case 'SECOND_GAUZE':
        return {
          percent: 75,
          label: '75% • Coágulo en Formación',
          colorText: 'text-amber-300',
          badgeBg: 'bg-amber-500/20 border-amber-500/40 text-amber-300',
          barGradient: 'from-amber-500 via-yellow-400 to-emerald-500',
          icon: '🟡',
        };
      case 'BANDAGED':
        return {
          percent: 100,
          label: '100% • Hemostasia Estable',
          colorText: 'text-emerald-300',
          badgeBg: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300',
          barGradient: 'from-teal-400 via-emerald-500 to-teal-300',
          icon: '🛡️',
        };
    }
  };

  const hemostasis = getHemostasisInfo();

  return (
    <div
      className="w-full h-[100dvh] pt-14 pb-2 px-3 sm:px-6 relative overflow-hidden bg-cover bg-center flex flex-col lg:flex-row items-center justify-between select-none"
      style={{ backgroundImage: `url(${triageBg})` }}
    >
      {/* Capa de oscurecimiento ambiental táctico */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/92 via-slate-950/65 to-slate-950/85 pointer-events-none" />

      {/* PANEL CLÍNICO: Arriba en móvil (order-1) e izquierda en PC (lg:order-1) */}
      <div className="order-1 lg:order-1 relative z-30 w-full lg:w-[430px] xl:w-[460px] max-w-md flex-shrink-0 flex flex-col justify-between space-y-1.5 sm:space-y-2 bg-slate-900/90 text-white backdrop-blur-xl rounded-2xl border border-teal-500/30 p-2.5 sm:p-4 shadow-2xl">
        <div className="space-y-1.5 sm:space-y-2">
          {/* Cabecera temática */}
          <div className="flex items-center justify-between">
            <div>
              <span className="inline-block bg-red-500/20 text-red-300 border border-red-500/30 text-[10px] sm:text-xs font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Fase 4: Socorrer (Hemostasia)
              </span>
              <h2 className="text-sm sm:text-lg font-black text-white tracking-tight mt-0.5">
                Control de Sangrado
              </h2>
            </div>

            <span
              className={`text-[9px] sm:text-xs font-black px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full border ${hemostasis.badgeBg} flex items-center gap-1`}
            >
              <span>{hemostasis.icon}</span>
              <span>{hemostasis.label}</span>
            </span>
          </div>

          {/* BARRA DE ESTADO HEMODINÁMICO / CONTROL DE SANGRADO */}
          <div className="bg-slate-950/90 rounded-xl p-2 sm:p-2.5 border border-slate-800 space-y-1 shadow-inner">
            <div className="flex items-center justify-between text-[10px] sm:text-[11px]">
              <span className="font-bold text-slate-300 flex items-center gap-1">
                <span>🩸</span> Control Hemodinámico
              </span>
              <span className={`font-black ${hemostasis.colorText}`}>
                {hemostasis.percent}%
              </span>
            </div>

            {/* Pista de la barra */}
            <div className="w-full h-2 sm:h-2.5 bg-slate-900 rounded-full border border-slate-700/80 p-0.5 overflow-hidden">
              <motion.div
                className={`h-full rounded-full bg-gradient-to-r ${hemostasis.barGradient}`}
                initial={{ width: 0 }}
                animate={{ width: `${hemostasis.percent}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </div>

            <div className="flex justify-between text-[8px] sm:text-[9px] font-semibold text-slate-400">
              <span className={hemostasis.percent >= 0 ? 'text-red-400 font-bold' : ''}>0% Sangrado</span>
              <span className={hemostasis.percent >= 75 ? 'text-amber-400 font-bold' : ''}>50% Coágulo</span>
              <span className={hemostasis.percent === 100 ? 'text-emerald-400 font-black' : ''}>100% Hemostasia</span>
            </div>
          </div>

          {/* BANDEJA DE INSUMOS MÉDICOS (3 INSUMOS ESTÉRILES LIMPIOS) */}
          <div className="bg-slate-950/90 rounded-xl p-1.5 sm:p-2 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[9px] sm:text-[10px] font-black tracking-wider uppercase text-teal-400 flex items-center gap-1">
                <img src={firstAidKitImg} alt="Botiquín" className="w-3.5 h-3.5 object-contain" />
                Bandeja de Insumos Médicos
              </span>
              <span className="text-[8px] sm:text-[9px] text-slate-400 font-medium">Insumos Estériles</span>
            </div>

            <div className="grid grid-cols-3 gap-1 sm:gap-2">
              {/* Insumo 1: Gasa Estéril */}
              <button
                type="button"
                disabled={step === 'BANDAGED'}
                onClick={() => {
                  if (step === 'INITIAL') handleApplyFirstGauze();
                  else if (step === 'SATURATED') handleOptionSuperponerGasa();
                }}
                className={`flex flex-col items-center justify-between p-1 sm:p-1.5 rounded-xl border text-center transition-all ${
                  step === 'BANDAGED'
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300 opacity-80 cursor-default'
                    : step === 'INITIAL'
                    ? 'bg-blue-950/60 border-blue-400 text-blue-200 ring-2 ring-blue-400/50 animate-pulse shadow-[0_0_15px_rgba(59,130,246,0.3)] cursor-pointer'
                    : step === 'SATURATED'
                    ? 'bg-amber-950/50 border-amber-400 text-amber-200 ring-1 ring-amber-400 animate-pulse cursor-pointer'
                    : step === 'SECOND_GAUZE'
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300 cursor-default'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300 cursor-pointer'
                }`}
              >
                <div className="relative">
                  <img src={gauzeCleanImg} alt="Gasa Estéril" className="w-6 h-6 sm:w-8 sm:h-8 object-contain mb-0.5" />
                  {(step === 'SECOND_GAUZE' || step === 'BANDAGED') && (
                    <span className="absolute -top-1 -right-1 bg-emerald-500 text-slate-950 text-[8px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center">
                      ✓
                    </span>
                  )}
                </div>
                <span className="text-[9px] sm:text-[10px] font-black leading-tight">🩹 Gasa Estéril</span>
                <span className="text-[7px] sm:text-[8px] text-slate-400">Compresión</span>
              </button>

              {/* Insumo 2: Venda Elástica */}
              <button
                type="button"
                disabled={step === 'BANDAGED'}
                onClick={() => {
                  if (step === 'SECOND_GAUZE') {
                    handleApplyBandage();
                  } else if (step === 'BANDAGED') {
                    // Ya asegurada
                  } else {
                    triggerVibration([60, 40, 60]);
                    playErrorBuzzer();
                    setFeedback({
                      type: 'error',
                      message:
                        '¡Procedimiento incorrecto! No apliques el vendaje directamente sin antes colocar los apósitos de gasa estéril y consolidar el coágulo.',
                    });
                  }
                }}
                className={`flex flex-col items-center justify-between p-1 sm:p-1.5 rounded-xl border text-center transition-all ${
                  step === 'BANDAGED'
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300 opacity-80 cursor-default'
                    : step === 'SECOND_GAUZE'
                    ? 'bg-emerald-950/70 border-emerald-400 text-emerald-200 ring-2 ring-emerald-400/60 animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.35)] cursor-pointer'
                    : 'bg-slate-900/40 border-slate-800 text-slate-400 opacity-70 cursor-pointer'
                }`}
              >
                <div className="relative">
                  <img src={bandageRollImg} alt="Venda Elástica" className="w-6 h-6 sm:w-8 sm:h-8 object-contain mb-0.5" />
                  {step === 'BANDAGED' && (
                    <span className="absolute -top-1 -right-1 bg-emerald-500 text-slate-950 text-[8px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center">
                      ✓
                    </span>
                  )}
                </div>
                <span className="text-[9px] sm:text-[10px] font-black leading-tight">🎗️ Venda Elástica</span>
                <span className="text-[7px] sm:text-[8px] text-slate-400">Fijación</span>
              </button>

              {/* Insumo 3: Antiséptico / Suero (Distractor deshabilitado al 100%) */}
              <motion.button
                type="button"
                disabled={step === 'BANDAGED'}
                onClick={handleSelectAntiseptic}
                animate={shakeAntiseptic ? { x: [-8, 8, -6, 6, -3, 3, 0] } : {}}
                transition={{ duration: 0.4 }}
                className={`flex flex-col items-center justify-between p-1 sm:p-1.5 rounded-xl border text-center transition-all ${
                  step === 'BANDAGED'
                    ? 'border-slate-800 bg-slate-950/50 text-slate-500 opacity-40 cursor-not-allowed'
                    : 'border-cyan-800/40 bg-slate-900/50 text-cyan-200 hover:border-cyan-600/60 cursor-pointer'
                }`}
                title={step === 'BANDAGED' ? 'Insumo no requerido tras vendaje' : 'Antiséptico / Solución Salina'}
              >
                <div className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center mb-0.5 text-cyan-400">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M10 2h4M9 5h6M7 8h10v12a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V8z" />
                    <path d="M12 11v6M9 14h6" strokeWidth="2" strokeLinecap="round" />
                    <circle cx="12" cy="5" r="1" fill="currentColor" />
                  </svg>
                </div>
                <span className="text-[9px] sm:text-[10px] font-black leading-tight">🧴 Antiséptico</span>
                <span className="text-[7px] sm:text-[8px] text-slate-400">Lavado / Suero</span>
              </motion.button>
            </div>
          </div>

          {/* BANNER DE RETROALIMENTACIÓN CLÍNICA DIDÁCTICA */}
          <AnimatePresence>
            {feedback && (
              <motion.div
                initial={{ opacity: 0, y: -4, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -3, scale: 0.97 }}
                className={`p-2 rounded-xl border text-[11px] sm:text-xs shadow-lg flex items-start space-x-2 ${
                  feedback.type === 'error'
                    ? 'bg-red-950/95 border-red-500 text-red-200'
                    : feedback.type === 'warning'
                    ? 'bg-amber-950/95 border-amber-500 text-amber-200'
                    : feedback.type === 'success'
                    ? 'bg-emerald-950/95 border-emerald-500 text-emerald-200'
                    : 'bg-cyan-950/95 border-cyan-500 text-cyan-200'
                }`}
              >
                <span className="text-sm sm:text-base flex-shrink-0">
                  {feedback.type === 'error'
                    ? '⚠️'
                    : feedback.type === 'warning'
                    ? '🩸'
                    : feedback.type === 'success'
                    ? '✅'
                    : 'ℹ️'}
                </span>
                <p className="leading-snug font-semibold">{feedback.message}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* CONSOLA DE DECISIONES Y ACCIONES SECUENCIALES */}
          <div>
            {step === 'INITIAL' && (
              <button
                type="button"
                onClick={handleApplyFirstGauze}
                className="w-full bg-blue-600 hover:bg-blue-500 active:scale-98 text-white font-extrabold py-2 px-3 rounded-xl transition shadow-lg flex items-center justify-center space-x-2 text-xs sm:text-sm cursor-pointer border border-blue-400/50"
              >
                <span>🩹</span>
                <span>Aplicar Gasa Estéril (Presión Directa)</span>
              </button>
            )}

            {step === 'COMPRESSING' && (
              <div className="w-full bg-cyan-950/70 border border-cyan-400 text-cyan-200 p-2 rounded-xl text-center text-xs font-bold animate-pulse flex items-center justify-center space-x-2">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                <span>Ejerciendo compresión directa sobre la herida...</span>
              </div>
            )}

            {step === 'SATURATED' && (
              <motion.div
                animate={shakeError ? { x: [-8, 8, -6, 6, -3, 3, 0] } : {}}
                transition={{ duration: 0.4 }}
                className="space-y-1.5"
              >
                <p className="text-[10px] sm:text-[11px] font-black text-amber-300">
                  ¿Qué decisión clínica tomas ante la gasa empapada?
                </p>

                {/* Opción A (Error pedagógico) */}
                <button
                  type="button"
                  onClick={handleOptionRetirarGasa}
                  className="w-full bg-red-950/70 hover:bg-red-900/90 active:scale-98 text-red-200 font-semibold p-2 rounded-xl border border-red-500/60 transition text-xs text-left cursor-pointer flex items-center space-x-2"
                >
                  <span className="text-sm flex-shrink-0">❌</span>
                  <div className="leading-tight">
                    <p className="font-bold text-red-100 text-[11px]">Retirar gasa empapada y poner una nueva</p>
                    <p className="text-[8px] sm:text-[9px] text-red-300">Quita el apósito saturado para cambiarlo</p>
                  </div>
                </button>

                {/* Opción B (Correcta) */}
                <button
                  type="button"
                  onClick={handleOptionSuperponerGasa}
                  className="w-full bg-emerald-950/80 hover:bg-emerald-900 active:scale-98 text-emerald-200 font-bold p-2 rounded-xl border-2 border-emerald-400 transition text-xs text-left shadow-[0_0_15px_rgba(16,185,129,0.3)] ring-1 ring-emerald-400/40 cursor-pointer flex items-center space-x-2"
                >
                  <span className="text-sm flex-shrink-0">✅</span>
                  <div className="leading-tight">
                    <p className="font-black text-emerald-100 text-[11px]">Mantener gasa y superponer segunda gasa limpia</p>
                    <p className="text-[8px] sm:text-[9px] text-emerald-300">Protege el coágulo en formación y absorbe el exceso</p>
                  </div>
                </button>
              </motion.div>
            )}

            {step === 'SECOND_GAUZE' && (
              <button
                type="button"
                onClick={handleApplyBandage}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-98 text-white font-black py-2.5 px-3 rounded-xl transition shadow-lg flex items-center justify-center space-x-2 text-xs sm:text-sm cursor-pointer border border-emerald-300 ring-2 ring-emerald-400/40 animate-pulse"
              >
                <span>🎗️</span>
                <span>Aplicar Venda Elástica (Fijación Compresiva)</span>
              </button>
            )}

            {step === 'BANDAGED' && (
              <div className="bg-emerald-950/70 border border-emerald-500/80 text-emerald-200 p-2 rounded-xl text-xs flex items-center space-x-2">
                <span className="text-base flex-shrink-0">🛡️</span>
                <div>
                  <p className="font-bold text-[11px]">¡Hemorragia controlada al 100%!</p>
                  <p className="text-[9px] text-slate-300">Vendaje seguro, coágulo protegido y signos estables.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Estado clínico del procedimiento */}
        <div className="pt-0.5">
          <div className="w-full py-1.5 px-3 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-400 text-[10px] sm:text-[11px] text-center font-medium">
            {step === 'INITIAL' && 'Paso 1: Aplica la gasa limpia sobre la herida sangrante'}
            {step === 'COMPRESSING' && 'Paso 2: Ejerciendo compresión directa firme...'}
            {step === 'SATURATED' && 'Paso 2: Decide el procedimiento ante la gasa saturada'}
            {step === 'SECOND_GAUZE' && 'Paso 3: Aplica la venda elástica para asegurar la hemostasia'}
            {step === 'BANDAGED' && (
              <span className="text-emerald-400 font-bold flex items-center justify-center gap-1.5">
                <span>🛡️</span> Hemostasia 100% Estable • Vendaje Asegurado
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ESCENA DEL PACIENTE CANINO: Posicionado en la camilla/suelo inferior, libre de solapamientos */}
      <div className="order-2 lg:order-2 relative z-10 flex-1 w-full flex items-end justify-center px-2 sm:px-4 pb-2 sm:pb-4 lg:pb-8 max-h-[36vh] sm:max-h-[42vh] lg:max-h-full">
        <div className="relative max-w-sm sm:max-w-md lg:max-w-xl w-full flex items-end justify-center translate-y-3 sm:translate-y-6 lg:translate-y-8">
          {/* Sombra de contacto sobre la camilla/suelo para descansar visualmente al paciente */}
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-4/5 h-6 bg-black/60 rounded-full blur-md pointer-events-none" />

          {/* Sprite del paciente canino descansando sobre la superficie clínica */}
          <motion.img
            src={examineDogImg}
            alt="Paciente Canino descansando sobre la camilla"
            animate={{
              y: [-2, 2, -2],
              scale: [1, 1.012, 1],
            }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="w-full max-h-[200px] sm:max-h-[280px] lg:max-h-[380px] object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.65)] select-none pointer-events-none"
          />

          {/* PUNTO ANATÓMICO: HERIDA Y CAPAS DE GASA / VENDAJE EN PATA POSTERIOR */}
          <div
            style={{ top: '60%', left: '74%' }}
            className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center z-30"
          >
            {/* ETAPA 1: Herida con sangrado activo */}
            {step === 'INITIAL' && (
              <button
                type="button"
                onClick={handleApplyFirstGauze}
                title="Herida con sangrado activo - Clic para aplicar gasa estéril"
                className="relative flex items-center justify-center cursor-pointer group focus:outline-none"
              >
                <span className="animate-ping absolute inline-flex h-12 w-12 rounded-full bg-red-600 opacity-80" />
                <span className="relative flex items-center justify-center h-10 w-10 rounded-full bg-red-600 border-2 border-red-300 text-white font-bold text-sm shadow-[0_0_20px_rgba(239,68,68,0.7)]">
                  🩸
                </span>
                <span className="absolute -bottom-7 whitespace-nowrap bg-red-950/95 text-red-200 text-[9px] font-black px-2 py-0.5 rounded-full border border-red-500 shadow">
                  Sangrado Activo
                </span>
              </button>
            )}

            {/* ETAPA 1 EN PROGRESO: Gasa limpia ejerciendo compresión directa */}
            {step === 'COMPRESSING' && (
              <motion.div
                initial={{ scale: 0.3, y: -20, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="relative flex flex-col items-center"
              >
                <div className="relative flex items-center justify-center">
                  <span className="animate-ping absolute inline-flex h-14 w-14 rounded-full bg-cyan-400 opacity-40" />
                  <img
                    src={gauzeCleanImg}
                    alt="Gasa limpia sobre herida"
                    className="w-14 h-14 sm:w-16 sm:h-16 object-contain drop-shadow-xl"
                  />
                </div>
                <span className="text-[9px] font-black bg-slate-950/90 text-cyan-300 px-2 py-0.5 rounded-full mt-1 border border-cyan-400 shadow">
                  Compresión Directa...
                </span>
              </motion.div>
            )}

            {/* ETAPA 2: Gasa empapada de sangre (Saturada) */}
            {step === 'SATURATED' && (
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: [1, 1.06, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                className="relative flex flex-col items-center"
              >
                <div className="relative flex items-center justify-center">
                  <span className="absolute -inset-1 rounded-full bg-red-600/40 blur-sm animate-pulse" />
                  <img
                    src={gauzeBloodyImg}
                    alt="Gasa empapada de sangre"
                    className="w-14 h-14 sm:w-16 sm:h-16 object-contain drop-shadow-xl relative"
                  />
                </div>
                <span className="text-[9px] font-black bg-red-950 text-red-300 px-2 py-0.5 rounded-full mt-1 border border-red-500 shadow animate-pulse">
                  ⚠️ Gasa Saturada
                </span>
              </motion.div>
            )}

            {/* ETAPA 2 RESUELTA: Segunda gasa limpia superpuesta sobre la primera */}
            {step === 'SECOND_GAUZE' && (
              <div className="relative flex flex-col items-center">
                <div className="relative w-16 h-16 flex items-center justify-center">
                  {/* Capa inferior: gasa saturada */}
                  <img
                    src={gauzeBloodyImg}
                    alt="Gasa saturada inferior"
                    className="w-16 h-16 object-contain absolute opacity-70 scale-95"
                  />
                  {/* Capa superior: segunda gasa limpia superpuesta con animación */}
                  <motion.img
                    initial={{ scale: 0.4, y: -15, opacity: 0 }}
                    animate={{ scale: 1, y: 0, opacity: 1 }}
                    transition={{ type: 'spring', damping: 14 }}
                    src={gauzeCleanImg}
                    alt="Segunda gasa limpia superpuesta"
                    className="w-14 h-14 object-contain relative drop-shadow-2xl z-10"
                  />
                </div>
                <span className="text-[9px] font-black bg-amber-950 text-amber-200 px-2 py-0.5 rounded-full mt-1 border border-amber-500 shadow">
                  ✓ Coágulo Protegido (75%)
                </span>
              </div>
            )}

            {/* ETAPA 3: Vendaje compresivo elástico aplicado y asegurado (Clic también abre el overlay) */}
            {step === 'BANDAGED' && (
              <motion.button
                type="button"
                onClick={() => setIsLevelComplete(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="Misión completada - Clic para ver Certificado"
                className="relative flex flex-col items-center cursor-pointer group"
              >
                <div className="relative w-16 h-16 flex items-center justify-center">
                  <span className="absolute -inset-2 rounded-full bg-emerald-500/40 blur-md animate-pulse" />
                  <img
                    src={bandageRollImg}
                    alt="Vendaje compresivo asegurado"
                    className="w-14 h-14 sm:w-16 sm:h-16 object-contain drop-shadow-2xl relative"
                  />
                  <span className="absolute -top-1 -right-1 bg-emerald-500 text-slate-950 font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                    ✓
                  </span>
                </div>
                <span className="text-[9px] font-black bg-emerald-600 text-white px-2.5 py-0.5 rounded-full mt-1 shadow-lg border border-emerald-300 flex items-center gap-1">
                  <span>🛡️</span>
                  <span>100% Vendado</span>
                </span>
              </motion.button>
            )}
          </div>
        </div>
      </div>

      {/* Modal / Overlay de Misión Cumplida (Fase 4 - Final) */}
      <LevelCompleteOverlay
        isOpen={isLevelComplete}
        phaseBadge="Fase 4: Socorrer (Hemostasia y Soporte)"
        icon="🏆"
        title="¡Misión de Rescate Cumplida!"
        subtitle="Hemorragia arterial controlada, coágulo protegido y signos estables."
        learningPill="Superponer apósitos limpios sin retirar la primera gasa saturada preserva el coágulo inicial de plaquetas y fibrina, deteniendo la pérdida sanguínea sin reactivar el sangrado."
        scoreBonus="+250 Puntos • 100% Hemostasia"
        primaryButtonText="🎓 Ver Certificado Oficial ➔"
        onPrimaryAction={handleFinishMission}
      />
    </div>
  );
};
