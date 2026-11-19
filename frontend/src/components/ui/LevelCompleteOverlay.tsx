import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface LevelCompleteOverlayProps {
  isOpen: boolean;
  phaseBadge?: string;
  icon?: string;
  title: string;
  subtitle?: string;
  learningPill: string;
  scoreBonus?: string;
  primaryButtonText: string;
  onPrimaryAction: () => void;
}

export const LevelCompleteOverlay: React.FC<LevelCompleteOverlayProps> = ({
  isOpen,
  phaseBadge = '¡Misión Cumplida!',
  icon = '✅',
  title,
  subtitle,
  learningPill,
  scoreBonus,
  primaryButtonText,
  onPrimaryAction,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="level-complete-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md select-none pointer-events-auto"
        >
          {/* Tarjeta Modal Táctica Central */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 10 }}
            transition={{ type: 'spring', damping: 22, stiffness: 260 }}
            className="max-w-md w-full bg-slate-900/95 border-2 border-emerald-400/50 rounded-3xl p-5 sm:p-7 text-center shadow-[0_0_50px_rgba(16,185,129,0.35)] space-y-4 relative overflow-hidden backdrop-blur-xl"
          >
            {/* Halo de resplandor ambiental superior */}
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-56 h-56 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

            {/* Icono Celebratorio Animado */}
            <div className="relative flex justify-center">
              <motion.div
                initial={{ scale: 0, rotate: -25 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.1 }}
                className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-500/20 text-emerald-300 rounded-full flex items-center justify-center text-3xl sm:text-4xl border-2 border-emerald-400/60 shadow-[0_0_25px_rgba(16,185,129,0.4)]"
              >
                {icon}
              </motion.div>
            </div>

            {/* Cabecera y Título */}
            <div className="space-y-1">
              {phaseBadge && (
                <span className="inline-block px-3 py-0.5 bg-emerald-500/20 border border-emerald-500/40 rounded-full text-emerald-300 text-[10px] sm:text-xs font-black uppercase tracking-wider">
                  {phaseBadge}
                </span>
              )}
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-tight">
                {title}
              </h2>
              {subtitle && (
                <p className="text-xs sm:text-sm text-slate-300 leading-snug font-medium pt-0.5">
                  {subtitle}
                </p>
              )}
            </div>

            {/* Píldora de Aprendizaje Médico */}
            <div className="bg-slate-950/90 rounded-2xl p-3 sm:p-3.5 border border-emerald-500/30 text-left space-y-1 shadow-inner">
              <div className="flex items-center justify-between text-[10px] font-black tracking-wider uppercase text-emerald-400">
                <span className="flex items-center gap-1.5">
                  <span>🩺</span>
                  <span>Aprendizaje Clínico Clave</span>
                </span>
                {scoreBonus && (
                  <span className="text-amber-300 bg-amber-500/15 border border-amber-500/30 px-2 py-0.2 rounded-full font-bold normal-case text-[9px] sm:text-[10px]">
                    {scoreBonus}
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-[13px] text-slate-200 leading-relaxed font-normal">
                {learningPill}
              </p>
            </div>

            {/* Botón Principal Centrado (a la altura cómoda del pulgar) */}
            <div className="pt-1">
              <motion.button
                type="button"
                onClick={onPrimaryAction}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                className="w-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 hover:from-emerald-400 hover:to-teal-300 active:scale-95 text-slate-950 font-black py-3 sm:py-3.5 px-6 rounded-2xl transition duration-150 shadow-[0_0_30px_rgba(45,212,191,0.55)] text-sm sm:text-base flex items-center justify-center space-x-2 border-2 border-teal-200 cursor-pointer animate-pulse pointer-events-auto"
              >
                <span>{primaryButtonText}</span>
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
