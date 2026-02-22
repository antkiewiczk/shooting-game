import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import {
  ISessionRepository,
  Session,
  CreateSessionDto,
  UpdateSessionDto,
  SessionWithEvents,
} from './session.repository.interface';

@Injectable()
export class SessionRepository implements ISessionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Session | null> {
    return this.prisma.session.findUnique({
      where: { id },
    }) as Promise<Session | null>;
  }

  async findAll(): Promise<Session[]> {
    return this.prisma.session.findMany();
  }

  async create(data: CreateSessionDto): Promise<Session> {
    return this.prisma.session.create({
      data,
    }) as Promise<Session>;
  }

  async update(id: string, data: UpdateSessionDto): Promise<Session> {
    return this.prisma.session.update({
      where: { id },
      data,
    }) as Promise<Session>;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.session.delete({ where: { id } });
  }

  async findByUserId(userId: string): Promise<Session[]> {
    return this.prisma.session.findMany({
      where: { userId },
      orderBy: { startedAt: 'desc' },
    });
  }

  async findWithEvents(sessionId: string): Promise<SessionWithEvents | null> {
    const session = await this.prisma.session.findUnique({
      where: { id: sessionId },
      include: {
        events: { orderBy: { ts: 'asc' } },
        user: { select: { email: true } },
      },
    });
    return session as SessionWithEvents | null;
  }

  async findByUserIdAndMode(
    userId: string,
    mode: string,
    limit = 10,
  ): Promise<Session[]> {
    return this.prisma.session.findMany({
      where: { userId, mode },
      orderBy: { score: 'desc' },
      take: limit,
    });
  }

  async findBestByUserId(
    userId: string,
    mode: string,
  ): Promise<Session | null> {
    return this.prisma.session.findFirst({
      where: { userId, mode, finishedAt: { not: null }, score: { not: null } },
      orderBy: { score: 'desc' },
    });
  }

  async findLeaderboard(
    mode: string,
    limit = 10,
  ): Promise<SessionWithEvents[]> {
    const sessions = await this.prisma.session.findMany({
      where: {
        mode,
        finishedAt: { not: null },
        score: { not: null },
      },
      orderBy: { score: 'desc' },
      take: limit * 3,
      include: {
        user: { select: { email: true } },
      },
    });

    const seen = new Set<string>();
    const uniqueUserSessions: SessionWithEvents[] = [];

    for (const session of sessions) {
      if (uniqueUserSessions.length >= limit) break;
      if (seen.has(session.userId)) continue;

      seen.add(session.userId);
      uniqueUserSessions.push(session as SessionWithEvents);
    }

    return uniqueUserSessions;
  }
}
