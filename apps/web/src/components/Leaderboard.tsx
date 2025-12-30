import { use, Suspense, useState, useTransition, Component, type ReactNode } from 'react';
import { fetchLeaderboard, type LeaderboardEntry } from '../api';

// Error Boundary for handling fetch errors
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback: (error: Error, retry: () => void) => ReactNode;
  onRetry?: () => void;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  retry = () => {
    this.setState({ hasError: false, error: null });
    this.props.onRetry?.();
  };

  render() {
    if (this.state.hasError && this.state.error) {
      return this.props.fallback(this.state.error, this.retry);
    }
    return this.props.children;
  }
}

interface LeaderboardTableProps {
  dataPromise: Promise<LeaderboardEntry[]>;
}

function LeaderboardTable({ dataPromise }: LeaderboardTableProps) {
  const entries = use(dataPromise);

  if (entries.length === 0) {
    return (
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-12 text-center">
        <p className="text-lg text-zinc-400">No scores yet</p>
        <p className="mt-2 text-sm text-zinc-600">Be the first to play!</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50 backdrop-blur">
      <table className="w-full">
        <thead>
          <tr className="border-b border-zinc-800 bg-zinc-900/80">
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Rank
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Player
            </th>
            <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Score
            </th>
            <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Hits
            </th>
            <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Date
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800/50">
          {entries.map((entry, index) => (
            <tr
              key={entry.id}
              className="transition-colors hover:bg-zinc-800/30"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <td className="px-6 py-4">
                <RankBadge rank={index + 1} />
              </td>
              <td className="px-6 py-4">
                <span className="font-medium text-zinc-200">
                  {entry.user.email.split('@')[0]}
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                <span className="font-mono text-lg font-bold text-emerald-400">
                  {entry.score?.toLocaleString() ?? '-'}
                </span>
              </td>
              <td className="px-6 py-4 text-right text-zinc-400">
                {entry.hits ?? '-'}/{(entry.hits ?? 0) + (entry.misses ?? 0)}
              </td>
              <td className="px-6 py-4 text-right text-sm text-zinc-500">
                {entry.finishedAt ? new Date(entry.finishedAt).toLocaleDateString() : '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RankBadge({ rank }: { rank: number }) {
  const baseClasses = 'inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold';
  
  if (rank === 1) {
    return (
      <span className={`${baseClasses} bg-gradient-to-br from-amber-400 to-orange-500 text-black shadow-lg shadow-amber-500/25`}>
        🥇
      </span>
    );
  }
  if (rank === 2) {
    return (
      <span className={`${baseClasses} bg-gradient-to-br from-zinc-300 to-zinc-400 text-black`}>
        🥈
      </span>
    );
  }
  if (rank === 3) {
    return (
      <span className={`${baseClasses} bg-gradient-to-br from-amber-600 to-amber-700 text-black`}>
        🥉
      </span>
    );
  }
  return (
    <span className={`${baseClasses} bg-zinc-800 font-medium text-zinc-400`}>
      {rank}
    </span>
  );
}

function LeaderboardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50">
      <div className="animate-pulse">
        <div className="border-b border-zinc-800 bg-zinc-900/80 px-6 py-4">
          <div className="h-4 w-full rounded bg-zinc-800" />
        </div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex gap-4 border-b border-zinc-800/50 px-6 py-4">
            <div className="h-8 w-8 rounded-full bg-zinc-800" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-24 rounded bg-zinc-800" />
            </div>
            <div className="h-4 w-16 rounded bg-zinc-800" />
          </div>
        ))}
      </div>
    </div>
  );
}

function ErrorFallback({ error, retry }: { error: Error; retry: () => void }) {
  return (
    <div className="rounded-xl border border-red-900/50 bg-red-950/20 p-8 text-center">
      <p className="text-lg font-medium text-red-400">Failed to load leaderboard</p>
      <p className="mt-2 text-sm text-zinc-500">{error.message}</p>
      <button
        onClick={retry}
        className="mt-4 rounded-lg bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-700"
      >
        Try again
      </button>
    </div>
  );
}

interface LeaderboardProps {
  token: string;
}

export function Leaderboard({ token }: LeaderboardProps) {
  const [dataPromise, setDataPromise] = useState(() => fetchLeaderboard(token));
  const [isPending, startTransition] = useTransition();
  const [key, setKey] = useState(0);

  const refresh = () => {
    startTransition(() => {
      setDataPromise(fetchLeaderboard(token));
      setKey((k) => k + 1);
    });
  };

  return (
    <div className="w-full max-w-4xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            🎯 Leaderboard
          </h2>
          <p className="mt-1 text-sm text-zinc-500">Top players ranked by score</p>
        </div>
        <button
          onClick={refresh}
          disabled={isPending}
          className="group relative inline-flex items-center gap-2 rounded-lg bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-300 transition-all hover:bg-zinc-700 hover:text-white disabled:opacity-50"
        >
          <svg
            className={`h-4 w-4 transition-transform ${isPending ? 'animate-spin' : 'group-hover:rotate-180'}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          {isPending ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      <ErrorBoundary
        key={key}
        fallback={(error, retry) => <ErrorFallback error={error} retry={retry} />}
        onRetry={refresh}
      >
        <Suspense fallback={<LeaderboardSkeleton />}>
          <LeaderboardTable dataPromise={dataPromise} />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
