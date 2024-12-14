import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRowDto {
  @ApiProperty({
    description: 'Content of the row to be added',
    example: 'This is a new row.',
  })
  @IsString()
  @MinLength(1, { message: 'Content must not be empty' })
  content: string;
  reviewer: string;
}