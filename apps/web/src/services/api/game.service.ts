import { apiClient } from './client';
import type { Session } from './types';

export type { Session };

export interface GameStats {
  hits: number;
  misses: number;
  score: number;
}

class GameService {
  async startSession(mode: string = 'arcade'): Promise<Session> {
    return apiClient.post<Session>('/sessions', { mode });
  }

  async shoot(sessionId: string, hit: boolean, distance: number): Promise<{ accepted: boolean }> {
    return apiClient.post<{ accepted: boolean }>(`/sessions/${sessionId}/events`, {
      type: 'SHOT',
      ts: new Date().toISOString(),
      payload: { hit, distance },
    });
  }

  async finishSession(sessionId: string): Promise<Session> {
    return apiClient.post<Session>(`/sessions/${sessionId}/finish`);
  }

  async getSession(sessionId: string): Promise<Session> {
    return apiClient.get<Session>(`/sessions/${sessionId}`);
  }
}

export const gameService = new GameService();
