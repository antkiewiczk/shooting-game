import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SessionService } from './session.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Controller('leaderboard')
export class LeaderboardSseController {
  constructor(
    private readonly sessionService: SessionService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @Get('stream')
  @UseGuards(JwtAuthGuard)
  stream(@Res() res: Response) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    const sendEvent = (data: object) => {
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    };

    const onFinish = () => {
      this.sessionService
        .getLeaderboard('arcade', 10)
        .then((leaderboard) => {
          sendEvent({ type: 'leaderboard', data: leaderboard });
        })
        .catch((error) => {
          console.error('Error fetching leaderboard:', error);
        });
    };

    this.eventEmitter.on('session.finished', onFinish);

    sendEvent({ type: 'connected', data: { message: 'SSE connected' } });

    const keepAlive = setInterval(() => {
      res.write(
        `data: ${JSON.stringify({ type: 'ping', data: { timestamp: Date.now() } })}\n\n`,
      );
    }, 30000);

    res.on('close', () => {
      this.eventEmitter.off('session.finished', onFinish);
      clearInterval(keepAlive);
    });
  }
}
