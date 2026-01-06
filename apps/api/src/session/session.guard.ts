import {
  Injectable,
  CanActivate,
  ExecutionContext,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { Request } from 'express';
import { PrismaService } from '../../prisma/prisma.service';

interface RequestWithUser extends Request {
  user?: { id?: string; sub?: string };
  userId?: string;
  body: { sessionId?: string; id?: string };
  session: { id: string; userId: string; finishedAt?: Date | null };
}

@Injectable()
export class SessionGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<RequestWithUser>();

    const userId = req.user?.id ?? req.user?.sub ?? req.userId;
    const sessionId =
      req.params?.sessionId ??
      req.params?.id ??
      req.body?.sessionId ??
      req.body?.id ??
      req.query?.sessionId ??
      req.query?.id;

    if (!sessionId) {
      throw new BadRequestException('Missing session id');
    }
    if (!userId) {
      throw new ForbiddenException('Unauthenticated');
    }

    const session = await this.prisma.session.findUnique({
      where: { id: sessionId },
      select: { id: true, userId: true, finishedAt: true },
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }
    if (session.userId !== userId) {
      throw new ForbiddenException('Not your session');
    }
    if (session.finishedAt) {
      throw new BadRequestException('Session already finished');
    }

    req.session = session;
    return true;
  }
}
