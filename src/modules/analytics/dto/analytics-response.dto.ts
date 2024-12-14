import { ApiProperty } from '@nestjs/swagger';

export class AnalyticsResponseDto {
  @ApiProperty({
    description: 'Unique identifier for the tracked event',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Name of the tracked event',
    example: 'Row Created',
  })
  event: string;

  @ApiProperty({
    description: 'Metadata or additional details about the event',
    example: 'Row ID: 1',
  })
  metadata: string;

  @ApiProperty({
    description: 'Timestamp of when the event was tracked',
    example: '2024-12-14T15:12:00.000Z',
  })
  createdAt: Date;
}