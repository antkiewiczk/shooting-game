interface AppHeaderProps {
  onSignOut: () => void;
}

export const AppHeader = ({ onSignOut }: AppHeaderProps) => {
  return (
    <header className="border-b border-zinc-800/50 bg-zinc-900/50 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <h1 className="bg-linear-to-r from-emerald-400 to-cyan-400 bg-clip-text text-xl font-bold text-transparent">
          🎯 Shooting Game
        </h1>
        <button
          onClick={onSignOut}
          className="rounded-lg px-3 py-1.5 text-sm text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white"
        >
          Sign out
        </button>
      </div>
    </header>
  );
};
