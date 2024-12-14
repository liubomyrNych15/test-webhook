import { Controller, Get, Post, Param, Body, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { RowsService } from './rows.service';
import { CreateRowDto } from './dto/create-row.dto';
import { RowResponseDto } from './dto/row-response.dto';

@Controller('rows')
@ApiTags('Rows')
export class RowsController {
  constructor(private readonly rowsService: RowsService) {}

  @Post('/webhook')
  @ApiOperation({ summary: 'Trigger the webhook to add a new row' })
  @ApiBody({ type: CreateRowDto })
  @ApiResponse({
    status: 201,
    description: 'Row successfully created',
    type: RowResponseDto,
  })
  async handleWebhook(@Body() createRowDto: CreateRowDto) {
    return this.rowsService.addRow(createRowDto.content, createRowDto.reviewer);
  }

  @Get('/')
  @ApiOperation({ summary: 'Retrieve all rows' })
  @ApiResponse({
    status: 200,
    description: 'Array of all rows',
    type: [RowResponseDto],
  })
  async getAllRows() {
    return this.rowsService.getAllRows();
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Retrieve a single row by ID' })
  @ApiParam({ name: 'id', description: 'Unique identifier of the row', type: 'number', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'The row with the specified ID',
    type: RowResponseDto,
  })
  async getRowById(@Param('id', ParseIntPipe) id: number) {
    return this.rowsService.getRowById(id);
  }
}