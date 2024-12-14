import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager'; 
import { LoggingMiddleware } from './common/decorators/logging.decorator';
import { RowsModule } from './modules/rows/rows.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { EmailModule } from './modules/email/email.module';
import { GoogleSheetsModule } from './modules/google-sheets/google-sheets.module';

@Module({
  imports: [
    CacheModule.register({ isGlobal: true }),
    GoogleSheetsModule,
    RowsModule, 
    AnalyticsModule, 
    EmailModule
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
