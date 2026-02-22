import { IsEnum, IsNotEmpty } from 'class-validator';

export enum GameMode {
  ARCADE = 'arcade',
  CLASSIC = 'classic',
}

export class StartSessionDto {
  @IsEnum(GameMode, { message: 'Mode must be either arcade or classic' })
  @IsNotEmpty({ message: 'Mode is required' })
  mode: GameMode;
}
