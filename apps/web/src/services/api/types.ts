export interface User {
  id: string;
  email: string;
}

export interface Session {
  id: string;
  mode: string;
  score: number | null;
  hits: number | null;
  misses: number | null;
  startedAt: string;
  finishedAt: string | null;
  userId: string;
  user?: User;
  events?: Event[];
}

export interface Event {
  id: string;
  type: 'SHOT';
  ts: string;
  hit: boolean;
  distance: number;
}

export interface ShotPayload {
  hit: boolean;
  distance: number;
}

export interface AddEventRequest {
  type: 'SHOT';
  ts: string;
  payload: ShotPayload;
}

export interface StartSessionRequest {
  mode: string;
}

export interface StartSessionResponse {
  id: string;
  userId: string;
  mode: string;
  startedAt: string;
}

export interface FinishSessionResponse {
  id: string;
  userId: string;
  score: number;
  hits: number;
  misses: number;
  finishedAt: string;
}

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
