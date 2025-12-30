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

interface StartSessionDto {
  mode: string;
}

interface AddEventDto {
  type: string;
  ts: string;
  payload: {
    hit: boolean;
    distance: number;
  };
}

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
  async addEvent(
    @Request() req: { user: { sub: string } },
    @Param('id') id: string,
    @Body() dto: AddEventDto,
  ) {
    return this.sessionService.addEvent(id, req.user.sub, dto);
  }

  @Post(':id/finish')
  async finishSession(
    @Request() req: { user: { sub: string } },
    @Param('id') id: string,
  ) {
    return this.sessionService.finishSession(id, req.user.sub);
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
