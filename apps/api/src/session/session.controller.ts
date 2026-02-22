import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SessionService } from './session.service';
import { SessionGuard } from './session.guard';
import { StartSessionDto, AddEventDto } from './dto';

@Controller('sessions')
@UseGuards(JwtAuthGuard)
export class SessionController {
  constructor(private sessionService: SessionService) {}

  @Post()
  async startSession(
    @Request() req: { user: { sub: string } },
    @Body() dto: StartSessionDto,
  ) {
    return this.sessionService.startSession(req.user.sub, dto.mode);
  }

  @Post(':id/events')
  @UseGuards(SessionGuard)
  async addEvent(
    @Request() req: { user: { sub: string } },
    @Param('id') id: string,
    @Body() dto: AddEventDto,
  ) {
    return this.sessionService.addEvent(id, {
      type: dto.type,
      ts: dto.ts,
      payload: {
        hit: dto.payload.hit,
        distance: dto.payload.distance,
      },
    });
  }

  @Post(':id/finish')
  @UseGuards(SessionGuard)
  async finishSession(
    @Request() req: { user: { sub: string } },
    @Param('id') id: string,
  ) {
    return this.sessionService.finishSession(id);
  }

  @Get(':id')
  async getSession(@Param('id') id: string) {
    return this.sessionService.getSession(id);
  }
}

@Controller('leaderboard')
@UseGuards(JwtAuthGuard)
export class LeaderboardController {
  constructor(private sessionService: SessionService) {}

  @Get()
  async getLeaderboard(
    @Query('mode') mode = 'arcade',
    @Query('limit') limit?: string,
  ) {
    return this.sessionService.getLeaderboard(
      mode,
      limit ? parseInt(limit, 10) : 10,
    );
  }
}
