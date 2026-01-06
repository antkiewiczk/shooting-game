export const LeaderboardSkeleton = () => (
  <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50">
    <div className="animate-pulse">
      <div className="border-b border-zinc-800 bg-zinc-900/80 px-6 py-4">
        <div className="h-4 w-full rounded bg-zinc-800" />
      </div>
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="flex gap-4 border-b border-zinc-800/50 px-6 py-4"
        >
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
