import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
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

  // Cargar tabla inicial, reproducir fanfarria y disparar confeti festivo al montar
  useEffect(() => {
    playVictoryFanfare();
    fetchLeaderboard();

    try {
      const duration = 2.5 * 1000;
      const animationEnd = Date.now() + duration;
      const colors = ['#f59e0b', '#10b981', '#38bdf8', '#fbbf24', '#ffffff'];

      const frame = () => {
        confetti({
          particleCount: 4,
          angle: 60,
          spread: 60,
          origin: { x: 0, y: 0.7 },
          colors,
        });
        confetti({
          particleCount: 4,
          angle: 120,
          spread: 60,
          origin: { x: 1, y: 0.7 },
          colors,
        });

        if (Date.now() < animationEnd) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    } catch {
      // Ignorar si el navegador restringe animaciones de canvas
    }
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
    const cleanName = playerName.trim() || 'Rescatista Canino';
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
      playerName.trim() || 'Rescatista Canino',
      score,
      new Date().toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    );
  };

  const formattedDate = new Date().toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="w-full min-h-[100dvh] lg:h-[100dvh] lg:overflow-hidden flex flex-col justify-center items-center p-3 sm:p-6 bg-slate-950 select-none overflow-y-auto lg:overflow-y-hidden">
      <div className="w-full max-w-5xl mx-auto my-auto grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 items-center">
        {/* COLUMNA IZQUIERDA: Graduación, Certificado Dorado y Acciones */}
        <div className="flex flex-col justify-center space-y-3 sm:space-y-4">
          {/* Cabecera breve de graduación con confeti */}
          <div className="text-center lg:text-left space-y-1">
            <div className="inline-flex items-center space-x-2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold px-3 py-0.5 rounded-full uppercase tracking-wider">
              <span>🎓</span>
              <span>Misión Cumplida con Honores</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              ¡Graduación de Rescatista!
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-snug">
              Completaste con éxito el protocolo <strong>PASR</strong> (Proteger, Alertar, Socorrer y Remitir).
            </p>
          </div>

          {/* TARJETA DEL CERTIFICADO CON BORDES DECORATIVOS DORADOS */}
          <div className="relative rounded-2xl p-1 bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-500 shadow-[0_0_35px_rgba(245,158,11,0.2)]">
            <div className="bg-slate-950/95 rounded-[14px] p-4 sm:p-5 border border-amber-400/40 text-center space-y-2.5 relative overflow-hidden">
              {/* Esquinas ornamentales */}
              <div className="absolute top-2 left-2 text-amber-400 text-xs font-serif">❖</div>
              <div className="absolute top-2 right-2 text-amber-400 text-xs font-serif">❖</div>
              <div className="absolute bottom-2 left-2 text-amber-400 text-xs font-serif">❖</div>
              <div className="absolute bottom-2 right-2 text-amber-400 text-xs font-serif">❖</div>

              <div className="space-y-0.5">
                <span className="text-[10px] font-mono font-bold text-amber-300 tracking-widest uppercase block">
                  DISTINCIÓN DE PRIMER RESPONDIENTE VETERINARIO
                </span>
                <h3 className="text-lg sm:text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-100 to-amber-400">
                  Rescatista Canino Oficial
                </h3>
                <p className="text-[11px] text-slate-300 italic">
                  Acreditado por temple y pericia en primeros auxilios caninos en situaciones de emergencia.
                </p>
              </div>

              {/* Recuadro del nombre del rescatista */}
              <div className="py-2 px-3 bg-slate-900/90 rounded-xl border border-amber-500/30 max-w-sm mx-auto">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
                  Otorgado con honor a:
                </span>
                <span className="text-base sm:text-lg font-extrabold text-white tracking-wide block truncate">
                  {playerName.trim() || 'Rescatista Canino'}
                </span>
              </div>

              {/* Métricas destacadas del certificado */}
              <div className="grid grid-cols-2 gap-2.5 max-w-xs mx-auto">
                <div className="bg-slate-900/60 p-2 rounded-xl border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 block font-medium">Puntaje</span>
                  <span className="text-base sm:text-lg font-black text-emerald-400">{score} pts</span>
                </div>
                <div className="bg-slate-900/60 p-2 rounded-xl border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 block font-medium">Fecha</span>
                  <span className="text-xs font-bold text-cyan-300">{formattedDate}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Botones de acción: Descargar Certificado Oficial y Jugar de Nuevo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            <button
              type="button"
              onClick={handleDownloadCertificate}
              className="w-full py-3 px-4 bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 active:scale-95 text-slate-950 font-black rounded-xl transition duration-150 shadow-lg shadow-amber-500/25 flex items-center justify-center space-x-2 text-xs sm:text-sm border border-amber-200 cursor-pointer"
            >
              <span className="text-lg">📜</span>
              <span>Descargar Certificado Oficial</span>
            </button>

            <button
              type="button"
              onClick={resetGame}
              className="w-full py-3 px-4 bg-slate-800 hover:bg-slate-700 active:scale-95 text-white font-extrabold rounded-xl transition duration-150 border border-slate-700 shadow-md text-xs sm:text-sm flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>🔄</span>
              <span>Jugar de Nuevo</span>
            </button>
          </div>
        </div>

        {/* COLUMNA DERECHA: Personalización / Guardar y Leaderboard (Top 5) */}
        <div className="bg-slate-900/95 backdrop-blur-xl rounded-2xl p-4 sm:p-5 border border-slate-800 shadow-2xl space-y-4 max-h-[70vh] flex flex-col justify-between">
          {/* Formulario para Ingresar Nombre y Guardar Puntuación */}
          <form onSubmit={handleSaveScore} className="space-y-2.5 bg-slate-950/80 p-3.5 rounded-xl border border-slate-800/80">
            <label htmlFor="playerNameInput" className="text-xs font-semibold text-slate-300 flex items-center justify-between">
              <span>Personaliza tu nombre oficial:</span>
              <span className="text-[10px] text-slate-500">Ranking & Certificado</span>
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                id="playerNameInput"
                type="text"
                maxLength={50}
                required
                disabled={hasSaved}
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Escribe tu nombre o alias..."
                className="flex-1 bg-slate-900 border border-slate-700 focus:border-amber-400 rounded-xl px-3 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none transition disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={isSaving || hasSaved}
                className={`py-2 px-3.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center space-x-1.5 flex-shrink-0 cursor-pointer ${
                  hasSaved
                    ? 'bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700'
                    : 'bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white shadow-md'
                }`}
              >
                <span>💾</span>
                <span>{isSaving ? 'Guardando...' : hasSaved ? 'Guardado' : 'Guardar'}</span>
              </button>
            </div>

            {feedbackNotice && (
              <p className="text-[11px] font-semibold text-emerald-400 bg-emerald-950/40 p-1.5 rounded-lg border border-emerald-500/30 text-center animate-fade-in">
                {feedbackNotice}
              </p>
            )}
          </form>

          {/* Tabla Leaderboard (Top 5) */}
          <div className="space-y-2 flex-1 flex flex-col justify-between min-h-0">
            <div className="flex items-center justify-between">
              <h3 className="text-xs sm:text-sm font-bold text-white flex items-center space-x-1.5">
                <span>🏆</span>
                <span>Tabla de Clasificación (Top 5)</span>
              </h3>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                Salón de Honor PASR
              </span>
            </div>

            <div className="overflow-y-auto max-h-[200px] rounded-xl border border-slate-800/80 bg-slate-950/60">
              <table className="w-full text-left text-xs">
                <thead className="sticky top-0 bg-slate-900 border-b border-slate-800 text-slate-400">
                  <tr>
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
                        <td className="py-1.5 px-2 font-bold text-amber-400">
                          {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `${idx + 1}º`}
                        </td>
                        <td className="py-1.5 px-2 font-medium text-slate-200 truncate max-w-[130px]">
                          {item.player_name}
                        </td>
                        <td className="py-1.5 px-2 text-right font-bold text-emerald-400">
                          {item.score}
                        </td>
                        <td className="py-1.5 px-2 text-right font-mono text-cyan-300">
                          {item.time_left}s
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
