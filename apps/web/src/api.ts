const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export interface LeaderboardEntry {
  id: string;
  mode: string;
  score: number | null;
  hits: number | null;
  misses: number | null;
  startedAt: string;
  finishedAt: string | null;
  userId: string;
  user: {
    email: string;
  };
}

export async function fetchLeaderboard(
  token: string,
  mode = 'arcade',
  limit = 10,
): Promise<LeaderboardEntry[]> {
  const res = await fetch(
    `${API_URL}/leaderboard?mode=${mode}&limit=${limit}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!res.ok) {
    throw new Error('Failed to fetch leaderboard');
  }

  return res.json();
}
