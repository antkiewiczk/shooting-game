import { useState, useCallback, useTransition } from 'react';
import { sessionService } from '../services/api/session.service';
import type { LeaderboardEntry } from '../services/api/types';
import { ApiError } from '../services/api/client';

export interface UseLeaderboardOptions {
  mode?: string;
  limit?: number;
}

export interface UseLeaderboardReturn {
  data: LeaderboardEntry[] | null;
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  refresh: () => void;
  clearError: () => void;
}

export function useLeaderboard(
  _token: string,
  options: UseLeaderboardOptions = {},
): UseLeaderboardReturn {
  const { mode = 'arcade', limit = 10 } = options;
  const [data, setData] = useState<LeaderboardEntry[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const result = await sessionService.getLeaderboard(mode, limit);
      setData(result);
      setError(null);
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Failed to fetch leaderboard';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [mode, limit]);

  const refresh = useCallback(() => {
    startTransition(() => {
      setIsLoading(true);
      fetchData();
    });
  }, [fetchData]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    data,
    isLoading,
    isRefreshing: isPending,
    error,
    refresh,
    clearError,
  };
}
