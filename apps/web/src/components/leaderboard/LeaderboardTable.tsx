import { use } from "react";
import { type LeaderboardEntry } from "../../api";
import { RankBadge } from "../RankBadge";

interface LeaderboardTableProps {
  dataPromise: Promise<LeaderboardEntry[]>;
}

export const LeaderboardTable = ({ dataPromise }: LeaderboardTableProps) => {
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
                  {entry.user.email.split("@")[0]}
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                <span className="font-mono text-lg font-bold text-emerald-400">
                  {entry.score?.toLocaleString() ?? "-"}
                </span>
              </td>
              <td className="px-6 py-4 text-right text-zinc-400">
                {entry.hits ?? "-"}/{(entry.hits ?? 0) + (entry.misses ?? 0)}
              </td>
              <td className="px-6 py-4 text-right text-sm text-zinc-500">
                {entry.finishedAt
                  ? new Date(entry.finishedAt).toLocaleDateString()
                  : "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
