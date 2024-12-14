import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class AnalyticsService {
  private prisma = new PrismaClient();

  async trackEvent(event: string, metadata: string) {
    return this.prisma.analytics.create({
      data: { event, metadata },
    });
  }
}