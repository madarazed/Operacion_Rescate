import React from 'react';
import { useGameStore } from './store/gameStore';
import { GameLayout } from './components/layouts/GameLayout';
import { StartScreen } from './components/levels/StartScreen';
import { Level1 } from './components/levels/Level1';
import { Level2 } from './components/levels/Level2';
import { Level3 } from './components/levels/Level3';
import { Level4 } from './components/levels/Level4';
import { VictoryScreen } from './components/levels/VictoryScreen';

export const App: React.FC = () => {
  const currentLevel = useGameStore((state) => state.currentLevel);
  const isGameOver = useGameStore((state) => state.isGameOver);
  const gameOverReason = useGameStore((state) => state.gameOverReason);
  const resetGame = useGameStore((state) => state.actions.resetGame);

  return (
    <>
      {/* Modal de Error / Game Over */}
      {isGameOver && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-red-200 text-center space-y-6">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-600">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-slate-800">¡Juego Terminado!</h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                {gameOverReason || 'Ha ocurrido un error en el protocolo de auxilio.'}
              </p>
            </div>

            <button
              onClick={resetGame}
              className="w-full bg-red-600 hover:bg-red-700 active:scale-95 text-white font-bold py-3 px-6 rounded-xl transition duration-150 shadow-md cursor-pointer"
            >
              Reiniciar Juego
            </button>
          </div>
        </div>
      )}

      {/* Renderizado condicional por nivel dentro de GameLayout */}
      <GameLayout>
        {currentLevel === 0 && <StartScreen />}
        {currentLevel === 1 && <Level1 />}
        {currentLevel === 2 && <Level2 />}
        {currentLevel === 3 && <Level3 />}
        {currentLevel === 4 && <Level4 />}
        {currentLevel > 4 && <VictoryScreen />}
      </GameLayout>
    </>
  );
};

export default App;
