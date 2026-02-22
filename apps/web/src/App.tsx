import { useState } from 'react';
import { Leaderboard } from './components/leaderboard/Leaderboard';
import { authService } from './services/auth.service';

const DEV_TOKEN = import.meta.env.VITE_DEV_TOKEN || '';

function App() {
  const [token, setToken] = useState(DEV_TOKEN);
  const [inputToken, setInputToken] = useState('');
  const [email, setEmail] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  const handleGenerateToken = async () => {
    if (!email.trim()) return;
    
    setIsGenerating(true);
    setError('');
    
    try {
      const newToken = await authService.generateToken(email.trim());
      setInputToken(newToken);
      setToken(newToken);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate token');
    } finally {
      setIsGenerating(false);
    }
  };

  if (!token) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 p-8">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="bg-linear-to-r from-emerald-400 via-cyan-400 to-blue-500 bg-clip-text text-4xl font-black tracking-tight text-transparent">
              🎯 Shooting Game
            </h1>
            <p className="mt-2 text-zinc-500">Enter your JWT token to view the leaderboard</p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur">
            <div className="mb-4">
              <label className="block text-sm font-medium text-zinc-400">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="player1@test.com"
                className="mt-2 w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-4 py-3 text-sm text-zinc-200 placeholder-zinc-600 transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <button
              onClick={handleGenerateToken}
              disabled={!email.trim() || isGenerating}
              className="mb-4 w-full rounded-lg bg-zinc-800 px-4 py-3 text-sm font-semibold text-zinc-300 transition-all hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isGenerating ? 'Generating...' : 'Generate Token'}
            </button>

            {error && (
              <p className="mb-4 rounded-lg bg-red-500/10 p-3 text-sm text-red-400">
                {error}
              </p>
            )}

            {inputToken && (
              <>
                <label className="block text-sm font-medium text-zinc-400">
                  Your Token (auto-filled)
                </label>
                <textarea
                  value={inputToken}
                  onChange={(e) => setInputToken(e.target.value)}
                  className="mt-2 w-full resize-none rounded-lg border border-zinc-700 bg-zinc-800/50 px-4 py-3 font-mono text-sm text-zinc-200 placeholder-zinc-600 transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  rows={4}
                />
                <button
                  onClick={() => setToken(inputToken.trim())}
                  disabled={!inputToken.trim()}
                  className="mt-4 w-full rounded-lg bg-linear-to-r from-emerald-500 to-cyan-500 px-4 py-3 font-semibold text-black transition-all hover:from-emerald-400 hover:to-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Enter Leaderboard
                </button>
              </>
            )}
          </div>

          <p className="mt-6 text-center text-xs text-zinc-600">
            Or enter your token manually above
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Header */}
      <header className="border-b border-zinc-800/50 bg-zinc-900/50 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <h1 className="bg-linear-to-r from-emerald-400 to-cyan-400 bg-clip-text text-xl font-bold text-transparent">
            🎯 Shooting Game
          </h1>
          <button
            onClick={() => setToken('')}
            className="rounded-lg px-3 py-1.5 text-sm text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white"
          >
            Sign out
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-7xl px-6 py-12">
        <Leaderboard token={token} />
      </main>

      {/* Background effects */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-1/2 left-1/2 h-[800px] w-[800px] -translate-x-1/2 rounded-full bg-emerald-500/5 blur-3xl" />
        <div className="absolute -bottom-1/2 right-0 h-[600px] w-[600px] rounded-full bg-cyan-500/5 blur-3xl" />
      </div>
    </div>
  );
}

export default App;
