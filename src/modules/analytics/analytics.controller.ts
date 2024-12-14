import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { TrackEventDto } from './dto/track-event.dto';
import { AnalyticsResponseDto } from './dto/analytics-response.dto';

@Controller('analytics')
@ApiTags('Analytics') 
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Post('/track')
  @ApiOperation({
    summary: 'Track an analytics event',
    description: 'Logs an analytics event along with optional metadata.',
  })
  @ApiBody({
    description: 'Event details to be tracked',
    type: TrackEventDto,
  })
  @ApiResponse({
    status: 201,
    description: 'The event was successfully tracked',
    type: AnalyticsResponseDto,
  })
  async trackEvent(@Body() trackEventDto: TrackEventDto) {
    return this.analyticsService.trackEvent(trackEventDto.event, trackEventDto.metadata);
  }
}