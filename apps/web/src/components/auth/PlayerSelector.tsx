interface PlayerSelectorProps {
  players: string[];
  onSelect: (email: string) => void;
}

export const PlayerSelector = ({ players, onSelect }: PlayerSelectorProps) => {
  return (
    <div className="mt-6">
      <p className="mb-3 text-center text-sm text-zinc-500">
        Or choose a player:
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        {players.map((player) => (
          <button
            key={player}
            onClick={() => onSelect(player)}
            className="rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-white"
          >
            {player.split('@')[0]}
          </button>
        ))}
      </div>
    </div>
  );
};
