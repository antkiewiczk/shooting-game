import { useState, useCallback } from 'react';
import { gameService, Session } from '../../services/api/game.service';
import { Button } from '../common/Button';
import { Card } from '../common/Card';

export const Game = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [stats, setStats] = useState({ hits: 0, misses: 0, score: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const startGame = useCallback(async () => {
    setIsLoading(true);
    setMessage('');
    try {
      const newSession = await gameService.startSession('arcade');
      setSession(newSession);
      setStats({ hits: 0, misses: 0, score: 0 });
      setMessage('Game started! Click Shoot to play.');
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Failed to start game');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const shoot = useCallback(async (hit: boolean) => {
    if (!session) return;
    
    setIsLoading(true);
    try {
      await gameService.shoot(session.id, hit, Math.floor(Math.random() * 20) + 5);
      
      if (hit) {
        const distance = Math.floor(Math.random() * 20) + 5;
        const points = 10 + (distance > 10 ? 5 : 0);
        setStats(prev => ({
          ...prev,
          hits: prev.hits + 1,
          score: prev.score + points,
        }));
        setMessage(`Hit! +${points} points (distance: ${distance})`);
      } else {
        setStats(prev => ({
          ...prev,
          misses: prev.misses + 1,
        }));
        setMessage('Miss! +0 points');
      }
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Failed to shoot');
    } finally {
      setIsLoading(false);
    }
  }, [session]);

  const finishGame = useCallback(async () => {
    if (!session) return;
    
    setIsLoading(true);
    try {
      const finishedSession = await gameService.finishSession(session.id);
      setSession(finishedSession);
      setStats({
        hits: finishedSession.hits ?? 0,
        misses: finishedSession.misses ?? 0,
        score: finishedSession.score ?? 0,
      });
      setMessage(`Game over! Final score: ${finishedSession.score}`);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Failed to finish game');
    } finally {
      setIsLoading(false);
    }
  }, [session]);

  return (
    <Card className="mb-8">
      <h3 className="mb-4 text-xl font-bold text-white">🎮 Play Game</h3>
      
      {!session ? (
        <Button onClick={startGame} disabled={isLoading} size="lg">
          {isLoading ? 'Starting...' : 'Start New Game'}
        </Button>
      ) : (
        <div>
          <div className="mb-4 grid grid-cols-3 gap-4 text-center">
            <div className="rounded-lg bg-zinc-800 p-3">
              <div className="text-2xl font-bold text-emerald-400">{stats.hits}</div>
              <div className="text-xs text-zinc-500">Hits</div>
            </div>
            <div className="rounded-lg bg-zinc-800 p-3">
              <div className="text-2xl font-bold text-red-400">{stats.misses}</div>
              <div className="text-xs text-zinc-500">Misses</div>
            </div>
            <div className="rounded-lg bg-zinc-800 p-3">
              <div className="text-2xl font-bold text-cyan-400">{stats.score}</div>
              <div className="text-xs text-zinc-500">Score</div>
            </div>
          </div>

          <div className="mb-4 flex gap-3">
            <Button 
              onClick={() => shoot(true)} 
              disabled={isLoading || !!session.finishedAt}
              variant="primary"
              size="lg"
              className="flex-1"
            >
              🎯 Shoot (Hit)
            </Button>
            <Button 
              onClick={() => shoot(false)} 
              disabled={isLoading || !!session.finishedAt}
              variant="secondary"
              size="lg"
              className="flex-1"
            >
              ❌ Shoot (Miss)
            </Button>
          </div>

          {!session.finishedAt && (
            <Button 
              onClick={finishGame} 
              disabled={isLoading}
              variant="ghost"
              className="w-full"
            >
              🏁 Finish Game
            </Button>
          )}

          {session.finishedAt && (
            <Button 
              onClick={startGame} 
              disabled={isLoading}
              variant="primary"
              className="w-full"
            >
              🔄 Play Again
            </Button>
          )}
        </div>
      )}

      {message && (
        <p className="mt-4 text-center text-sm text-zinc-400">{message}</p>
      )}
    </Card>
  );
};
