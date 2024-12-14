import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TrackEventDto {
  @ApiProperty({
    description: 'Name of the event being tracked',
    example: 'Row Created',
  })
  @IsString()
  event: string;

  @ApiProperty({
    description: 'Metadata or additional details about the event',
    example: 'Row ID: 1',
  })
  @IsOptional()
  @IsString()
  metadata?: string;
}