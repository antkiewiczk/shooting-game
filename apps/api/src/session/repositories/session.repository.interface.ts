import { IBaseRepository } from '../../common/interfaces/base-repository.interface';

export interface Session {
  id: string;
  mode: string;
  score: number | null;
  hits: number | null;
  misses: number | null;
  startedAt: Date;
  finishedAt: Date | null;
  userId: string;
}

export interface CreateSessionDto {
  userId: string;
  mode: string;
}

export interface UpdateSessionDto {
  score?: number;
  hits?: number;
  misses?: number;
  finishedAt?: Date;
}

export interface SessionWithEvents extends Session {
  events: Event[];
  user: { email: string };
}

export interface Event {
  id: string;
  type: string;
  ts: Date;
  hit: boolean;
  distance: number;
  sessionId: string;
}

export interface CreateEventDto {
  sessionId: string;
  type: string;
  ts: Date;
  hit: boolean;
  distance: number;
}

export interface ISessionRepository extends IBaseRepository<
  Session,
  CreateSessionDto,
  UpdateSessionDto
> {
  findByUserId(userId: string): Promise<Session[]>;
  findWithEvents(sessionId: string): Promise<SessionWithEvents | null>;
  findByUserIdAndMode(
    userId: string,
    mode: string,
    limit?: number,
  ): Promise<Session[]>;
  findBestByUserId(userId: string, mode: string): Promise<Session | null>;
  findLeaderboard(mode: string, limit?: number): Promise<SessionWithEvents[]>;
}

export interface IEventRepository extends IBaseRepository<
  Event,
  CreateEventDto,
  never
> {
  findBySessionId(sessionId: string): Promise<Event[]>;
}
