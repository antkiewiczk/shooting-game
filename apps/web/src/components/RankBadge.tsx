export const RankBadge = ({ rank }: { rank: number }) => {
  const baseClasses =
    "inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold";

  if (rank === 1) {
    return (
      <span
        className={`${baseClasses} bg-linear-to-br from-amber-400 to-orange-500 text-black shadow-lg shadow-amber-500/25`}
      >
        🥇
      </span>
    );
  }
  if (rank === 2) {
    return (
      <span
        className={`${baseClasses} bg-linear-to-br from-zinc-300 to-zinc-400 text-black`}
      >
        🥈
      </span>
    );
  }
  if (rank === 3) {
    return (
      <span
        className={`${baseClasses} bg-linear-to-br from-amber-600 to-amber-700 text-black`}
      >
        🥉
      </span>
    );
  }
  return (
    <span className={`${baseClasses} bg-zinc-800 font-medium text-zinc-400`}>
      {rank}
    </span>
  );
};
