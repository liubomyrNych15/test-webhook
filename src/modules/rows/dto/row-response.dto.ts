import { ApiProperty } from '@nestjs/swagger';

export class RowResponseDto {
  @ApiProperty({
    description: 'Unique identifier of the row',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Content of the row',
    example: 'This is a new row.',
  })
  content: string;

  @ApiProperty({
    description: 'Timestamp of when the row was created',
    example: '2024-12-14T15:12:00.000Z',
  })
  createdAt: Date;
}