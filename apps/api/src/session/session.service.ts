import { Injectable } from '@nestjs/common';
import { calculateScore } from '@shared/core';
import {
  SessionRepository,
  EventRepository,
  CreateSessionDto,
  CreateEventDto,
  Session,
  Event,
} from './repositories';
import { SessionNotFoundException } from '../common/errors/session.exceptions';

export interface LeaderboardEntry {
  id: string;
  mode: string;
  score: number | null;
  hits: number | null;
  misses: number | null;
  startedAt: Date;
  finishedAt: Date | null;
  userId: string;
  user: { email: string };
}

@Injectable()
export class SessionService {
  constructor(
    private readonly sessionRepository: SessionRepository,
    private readonly eventRepository: EventRepository,
  ) {}

  async startSession(userId: string, mode: string): Promise<Session> {
    const createDto: CreateSessionDto = { userId, mode };
    return this.sessionRepository.create(createDto);
  }

  async addEvent(
    sessionId: string,
    event: {
      type: string;
      ts: string;
      payload: { hit: boolean; distance: number };
    },
  ): Promise<{ accepted: boolean }> {
    const createDto: CreateEventDto = {
      sessionId,
      type: event.type,
      ts: new Date(event.ts),
      hit: event.payload.hit,
      distance: event.payload.distance,
    };
    await this.eventRepository.create(createDto);
    return { accepted: true };
  }

  async finishSession(sessionId: string): Promise<Session> {
    const sessionWithEvents =
      await this.sessionRepository.findWithEvents(sessionId);

    if (!sessionWithEvents) {
      throw new SessionNotFoundException();
    }

    const shotEvents = sessionWithEvents.events
      .filter((e: Event) => e.type === 'SHOT')
      .map((e: Event) => ({ hit: e.hit, distance: e.distance }));

    const { score, hits, misses } = calculateScore(shotEvents);

    const updated = await this.sessionRepository.update(sessionId, {
      score,
      hits,
      misses,
      finishedAt: new Date(),
    });

    return updated;
  }

  async getSession(sessionId: string) {
    const session = await this.sessionRepository.findWithEvents(sessionId);

    if (!session) {
      throw new SessionNotFoundException();
    }

    return session;
  }

  async getLeaderboard(mode: string, limit = 10): Promise<LeaderboardEntry[]> {
    return this.sessionRepository.findLeaderboard(mode, limit);
  }
}
