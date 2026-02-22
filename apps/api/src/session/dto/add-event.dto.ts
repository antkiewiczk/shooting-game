import {
  IsEnum,
  IsNotEmpty,
  IsBoolean,
  IsNumber,
  IsDateString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum EventType {
  SHOT = 'SHOT',
}

export class ShotPayloadDto {
  @IsBoolean({ message: 'hit must be a boolean' })
  hit: boolean;

  @IsNumber({}, { message: 'distance must be a number' })
  @IsNotEmpty({ message: 'distance is required' })
  distance: number;
}

export class AddEventDto {
  @IsEnum(EventType, { message: 'type must be SHOT' })
  @IsNotEmpty({ message: 'type is required' })
  type: EventType;

  @IsDateString({}, { message: 'ts must be a valid ISO date string' })
  @IsNotEmpty({ message: 'ts is required' })
  ts: string;

  @ValidateNested()
  @Type(() => ShotPayloadDto)
  payload: ShotPayloadDto;
}
