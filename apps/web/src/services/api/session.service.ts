import { apiClient } from './client';
import type {
  Session,
  LeaderboardEntry,
  StartSessionRequest,
  StartSessionResponse,
  AddEventRequest,
  FinishSessionResponse,
} from './types';

export class SessionService {
  async startSession(data: StartSessionRequest): Promise<StartSessionResponse> {
    return apiClient.post<StartSessionResponse>('/sessions', data);
  }

  async addEvent(sessionId: string, event: AddEventRequest): Promise<{ accepted: boolean }> {
    return apiClient.post<{ accepted: boolean }>(`/sessions/${sessionId}/events`, event);
  }

  async finishSession(sessionId: string): Promise<FinishSessionResponse> {
    return apiClient.post<FinishSessionResponse>(`/sessions/${sessionId}/finish`);
  }

  async getSession(sessionId: string): Promise<Session> {
    return apiClient.get<Session>(`/sessions/${sessionId}`);
  }

  async getLeaderboard(mode = 'arcade', limit = 10): Promise<LeaderboardEntry[]> {
    return apiClient.get<LeaderboardEntry[]>(`/leaderboard?mode=${mode}&limit=${limit}`);
  }
}

export const sessionService = new SessionService();
