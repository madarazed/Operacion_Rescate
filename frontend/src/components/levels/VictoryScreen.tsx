import React, { useState, useEffect } from 'react';
import { useGameStore } from '../../store/gameStore';
import { playVictoryFanfare } from '../../utils/soundEffects';
import { downloadRescueCertificate } from '../../utils/certificateGenerator';

interface LeaderboardEntry {
  id?: number;
  player_name: string;
  score: number;
  time_left: number;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
const LOCAL_STORAGE_KEY = 'pasr_rescue_leaderboard';

export const VictoryScreen: React.FC = () => {
  const score = useGameStore((state) => state.score);
  const globalTimer = useGameStore((state) => state.globalTimer);
  const resetGame = useGameStore((state) => state.actions.resetGame);

  const [playerName, setPlayerName] = useState<string>('');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [hasSaved, setHasSaved] = useState<boolean>(false);
  const [feedbackNotice, setFeedbackNotice] = useState<string | null>(null);

  // Cargar tabla inicial y reproducir fanfarria al montar
  useEffect(() => {
    playVictoryFanfare();
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/rescue-sessions/leaderboard`, {
        headers: { Accept: 'application/json' },
      });
      if (!response.ok) throw new Error('API offline o no disponible');
      const result = await response.json();
      if (result.success && Array.isArray(result.data)) {
        setLeaderboard(result.data.slice(0, 5));
        return;
      }
    } catch {
      // Fallback a localStorage
      const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (cached) {
        try {
          const parsed = JSON.parse(cached) as LeaderboardEntry[];
          setLeaderboard(parsed.slice(0, 5));
        } catch {
          setLeaderboard([]);
        }
      }
    }
  };

  const handleSaveScore = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = playerName.trim() || 'Rescatista Anónimo';
    setIsSaving(true);
    setFeedbackNotice(null);

    const payload = {
      player_name: cleanName,
      score,
      time_left: globalTimer,
    };

    let savedViaApi = false;

    try {
      const response = await fetch(`${API_BASE_URL}/rescue-sessions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        savedViaApi = true;
        setFeedbackNotice('✓ Puntuación registrada exitosamente en el servidor.');
      }
    } catch {
      // Fallback local silencioso
    }

    // Persistencia local de respaldo
    try {
      const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
      const list: LeaderboardEntry[] = cached ? JSON.parse(cached) : [];
      list.push({ ...payload, id: Date.now() });
      list.sort((a, b) => b.score - a.score || b.time_left - a.time_left);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
      if (!savedViaApi) {
        setFeedbackNotice('✓ Puntuación guardada localmente (Modo Offline).');
      }
    } catch {
      // Ignore local storage error
    }

    setHasSaved(true);
    setIsSaving(false);
    await fetchLeaderboard();
  };

  const handleDownloadCertificate = () => {
    downloadRescueCertificate(
      playerName.trim() || 'Rescatista PASR',
      score,
      new Date().toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    );
  };

  return (
    <div className="w-full h-full pt-16 pb-8 px-4 sm:px-6 overflow-y-auto flex items-center justify-center">
      <div className="w-full max-w-2xl bg-slate-900/90 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-slate-700/60 shadow-2xl text-white space-y-6 my-auto">
        {/* Cabecera de Graduación */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto text-3xl border border-emerald-500/40 shadow-inner">
            🎓
          </div>
          <span className="inline-block bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Graduación Médica
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            ¡Misión Rescate Cumplida!
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-lg mx-auto">
            Has dominado el protocolo <strong>PASR</strong> (Proteger, Alertar, Socorrer y Remitir).
            Tus decisiones de triage y hemostasia salvaron la vida del paciente.
          </p>
        </div>

        {/* Métricas del Jugador */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800">
          <div className="text-center">
            <span className="text-[11px] text-slate-400 font-medium block">Puntaje Final</span>
            <span className="text-2xl sm:text-3xl font-black text-emerald-400">{score} pts</span>
          </div>
          <div className="text-center">
            <span className="text-[11px] text-slate-400 font-medium block">Tiempo Restante</span>
            <span className="text-2xl sm:text-3xl font-black text-cyan-400 font-mono">{globalTimer}s</span>
          </div>
        </div>

        {/* Formulario de Registro y Certificado */}
        <form onSubmit={handleSaveScore} className="space-y-3">
          <div className="space-y-1.5">
            <label htmlFor="playerNameInput" className="text-xs font-semibold text-slate-300 block">
              Nombre o Alias del Rescatista
            </label>
            <input
              id="playerNameInput"
              type="text"
              maxLength={60}
              required
              disabled={hasSaved}
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Ej: Dra. García / Rescatista Alpha"
              className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none transition disabled:opacity-60"
            />
          </div>

          {feedbackNotice && (
            <p className="text-xs font-semibold text-emerald-400 bg-emerald-950/40 p-2 rounded-lg border border-emerald-500/30 text-center animate-fade-in">
              {feedbackNotice}
            </p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            <button
              type="submit"
              disabled={isSaving || hasSaved}
              className={`py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition shadow-md flex items-center justify-center space-x-1.5 ${
                hasSaved
                  ? 'bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700'
                  : 'bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white'
              }`}
            >
              <span>💾</span>
              <span>{isSaving ? 'Guardando...' : hasSaved ? 'Puntuación Registrada' : 'Guardar Puntuación'}</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadCertificate}
              className="py-2.5 px-4 bg-amber-600 hover:bg-amber-500 active:scale-95 text-white text-xs sm:text-sm font-bold rounded-xl transition shadow-md flex items-center justify-center space-x-1.5 border border-amber-400/40"
            >
              <span>📜</span>
              <span>Descargar Certificado Oficial</span>
            </button>
          </div>
        </form>

        {/* Tabla Leaderboard (Top 5) */}
        <div className="bg-slate-950/80 rounded-2xl p-4 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs sm:text-sm font-bold text-white flex items-center space-x-1.5">
              <span>🏆</span>
              <span>Tabla de Clasificación (Top 5)</span>
            </h3>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider">Honor PASR</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="py-1.5 px-2 font-semibold">#</th>
                  <th className="py-1.5 px-2 font-semibold">Rescatista</th>
                  <th className="py-1.5 px-2 font-semibold text-right">Puntaje</th>
                  <th className="py-1.5 px-2 font-semibold text-right">Tiempo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {leaderboard.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-3 text-center text-slate-500 text-xs">
                      Sé el primer rescatista en registrar tu puntuación oficial.
                    </td>
                  </tr>
                ) : (
                  leaderboard.map((item, idx) => (
                    <tr key={item.id ?? idx} className="hover:bg-slate-900/50 transition">
                      <td className="py-2 px-2 font-bold text-amber-400">
                        {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `${idx + 1}º`}
                      </td>
                      <td className="py-2 px-2 font-medium text-slate-200 truncate max-w-[150px]">
                        {item.player_name}
                      </td>
                      <td className="py-2 px-2 text-right font-bold text-emerald-400">
                        {item.score}
                      </td>
                      <td className="py-2 px-2 text-right font-mono text-cyan-300">
                        {item.time_left}s
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Botón para reiniciar partida */}
        <div className="pt-1">
          <button
            type="button"
            onClick={resetGame}
            className="w-full py-3 px-4 bg-slate-800 hover:bg-slate-700 active:scale-95 text-white font-bold rounded-xl transition duration-150 border border-slate-700 shadow-lg text-xs sm:text-sm flex items-center justify-center space-x-2"
          >
            <span>🔄</span>
            <span>Jugar de Nuevo (Reiniciar Protocolo)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
