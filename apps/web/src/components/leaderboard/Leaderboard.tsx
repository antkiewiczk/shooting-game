import { Suspense, useState, useTransition } from "react";
import { fetchLeaderboard } from "../../api";
import { ErrorBoundary, ErrorFallback } from "./LeaderboardErrorBoundary";
import { LeaderboardSkeleton } from "./LeaderboardSkeleton";
import { LeaderboardTable } from "./LeaderboardTable";

interface LeaderboardProps {
  token: string;
}

export const Leaderboard = ({ token }: LeaderboardProps) => {
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
          <p className="mt-1 text-sm text-zinc-500">
            Top players ranked by score
          </p>
        </div>
        <button
          onClick={refresh}
          disabled={isPending}
          className="group relative inline-flex items-center gap-2 rounded-lg bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-300 transition-all hover:bg-zinc-700 hover:text-white disabled:opacity-50"
        >
          <svg
            className={`h-4 w-4 transition-transform ${
              isPending ? "animate-spin" : "group-hover:rotate-180"
            }`}
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
          {isPending ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      <ErrorBoundary
        key={key}
        fallback={(error, retry) => (
          <ErrorFallback error={error} retry={retry} />
        )}
        onRetry={refresh}
      >
        <Suspense fallback={<LeaderboardSkeleton />}>
          <LeaderboardTable dataPromise={dataPromise} />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};
