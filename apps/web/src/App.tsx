import { useState } from 'react';
import { Game } from './components/game/Game';
import { Leaderboard } from './components/leaderboard/Leaderboard';
import { LoginForm, PlayerSelector } from './components/auth';
import { AppHeader } from './components/layout';
import { authService } from './services/auth.service';

const DEV_TOKEN = import.meta.env.VITE_DEV_TOKEN || '';

const AVAILABLE_PLAYERS = [
  'player1@test.com',
  'player2@test.com',
  'player3@test.com',
  'sharpshooter@test.com',
  'aimbot@test.com',
  'triggerhappy@test.com',
  'bullseye@test.com',
  'sniper@test.com',
  'hunter@test.com',
  'marksman@test.com',
];

function App() {
  const [token, setToken] = useState(DEV_TOKEN);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  const handleGenerateToken = async (email: string) => {
    setIsGenerating(true);
    setError('');
    
    try {
      const newToken = await authService.generateToken(email);
      authService.setToken(newToken);
      setToken(newToken);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate token');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSignOut = () => {
    authService.clearToken();
    setToken('');
  };

  if (!token) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 p-8">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="bg-linear-to-r from-emerald-400 via-cyan-400 to-blue-500 bg-clip-text text-4xl font-black tracking-tight text-transparent">
              🎯 Shooting Game
            </h1>
            <p className="mt-2 text-zinc-500">Enter your email to play</p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur">
            <LoginForm 
              onSubmit={handleGenerateToken}
              isLoading={isGenerating}
              error={error}
            />
            <PlayerSelector 
              players={AVAILABLE_PLAYERS}
              onSelect={handleGenerateToken}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <AppHeader onSignOut={handleSignOut} />

      <main className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <Game />
          </div>
          <div>
            <Leaderboard token={token} />
          </div>
        </div>
      </main>

      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-1/2 left-1/2 h-[800px] w-[800px] -translate-x-1/2 rounded-full bg-emerald-500/5 blur-3xl" />
        <div className="absolute -bottom-1/2 right-0 h-[600px] w-[600px] rounded-full bg-cyan-500/5 blur-3xl" />
      </div>
    </div>
  );
}

export default App;
