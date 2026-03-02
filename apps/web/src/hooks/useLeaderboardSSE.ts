import { useEffect, useRef, useState, useCallback } from 'react';
import { API_URL } from '../services/api/client';

export interface LeaderboardEntry {
  id: string;
  mode: string;
  score: number | null;
  hits: number | null;
  misses: number | null;
  startedAt: string;
  finishedAt: string | null;
  userId: string;
  user: { email: string };
}

export interface UseLeaderboardSSEOptions {
  mode?: string;
  limit?: number;
}

export interface UseLeaderboardSSEReturn {
  data: LeaderboardEntry[] | null;
  isConnected: boolean;
  error: string | null;
  reconnect: () => void;
}

export function useLeaderboardSSE(
  token: string,
  options: UseLeaderboardSSEOptions = {},
): UseLeaderboardSSEReturn {
  const { mode = 'arcade', limit = 10 } = options;
  const [data, setData] = useState<LeaderboardEntry[] | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  const connect = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    const url = `${API_URL}/leaderboard/stream?mode=${mode}&limit=${limit}&token=${token}`;
    const eventSource = new EventSource(url);

    eventSource.onopen = () => {
      setIsConnected(true);
      setError(null);
    };

    eventSource.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);
        if (parsed.type === 'leaderboard' && parsed.data) {
          setData(parsed.data);
        } else if (parsed.type === 'connected') {
          console.log('SSE connected:', parsed.data);
        }
      } catch (err) {
        console.error('Failed to parse SSE message:', err);
      }
    };

    eventSource.onerror = (err) => {
      console.error('SSE error:', err);
      setIsConnected(false);
      setError('Connection lost. Reconnecting...');
      eventSource.close();
    };

    eventSourceRef.current = eventSource;
  }, [mode, limit, token]);

  const reconnect = useCallback(() => {
    connect();
  }, [connect]);

  useEffect(() => {
    if (!token) return;
    connect();

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    };
  }, [token, connect]);

  return {
    data,
    isConnected,
    error,
    reconnect,
  };
}
