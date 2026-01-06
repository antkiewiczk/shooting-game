import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { calculateScore } from '@shared/core';

@Injectable()
export class SessionService {
  constructor(private prisma: PrismaService) {}

  async startSession(userId: string, mode: string) {
    return this.prisma.session.create({
      data: {
        userId,
        mode,
      },
      select: {
        id: true,
        userId: true,
        mode: true,
        startedAt: true,
      },
    });
  }

  async addEvent(
    sessionId: string,
    event: {
      type: string;
      ts: string;
      payload: { hit: boolean; distance: number };
    },
  ) {
    await this.prisma.event.create({
      data: {
        sessionId,
        type: event.type,
        ts: new Date(event.ts),
        hit: event.payload.hit,
        distance: event.payload.distance,
      },
    });

    return { accepted: true };
  }

  async finishSession(sessionId: string) {
    const session = await this.prisma.session.findUnique({
      where: { id: sessionId },
      include: { events: { orderBy: { ts: 'asc' } } },
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    const shotEvents = session.events
      .filter((e) => e.type === 'SHOT')
      .map((e) => ({ hit: e.hit, distance: e.distance }));

    const { score, hits, misses } = calculateScore(shotEvents);

    const updated = await this.prisma.session.update({
      where: { id: sessionId },
      data: {
        score,
        hits,
        misses,
        finishedAt: new Date(),
      },
      select: {
        id: true,
        userId: true,
        score: true,
        hits: true,
        misses: true,
        finishedAt: true,
      },
    });

    return updated;
  }

  async getSession(sessionId: string) {
    const session = await this.prisma.session.findUnique({
      where: { id: sessionId },
      include: {
        events: { orderBy: { ts: 'asc' } },
        user: { select: { email: true } },
      },
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    return session;
  }

  async getLeaderboard(mode: string, limit = 10) {
    // Get best session per user for the given mode
    const sessions = await this.prisma.session.findMany({
      where: {
        mode,
        finishedAt: { not: null },
        score: { not: null },
      },
      orderBy: { score: 'desc' },
      take: limit * 3, // Get more to filter unique users
      include: {
        user: { select: { email: true } },
      },
    });

    // Keep only best session per user
    const seen = new Set<string>();
    const uniqueUserSessions = sessions.filter((s) => {
      if (seen.has(s.userId)) return false;
      seen.add(s.userId);
      return true;
    });

    return uniqueUserSessions.slice(0, limit);
  }
}
