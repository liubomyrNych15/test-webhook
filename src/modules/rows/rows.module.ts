import { Module } from '@nestjs/common';
import { RowsController } from './rows.controller';
import { RowsService } from './rows.service';
import { NotificationGateway } from '../../common/websocket.gateway';
import { EmailModule } from '../email/email.module';
import { GoogleSheetsModule } from '../google-sheets/google-sheets.module';

@Module({
  imports: [EmailModule, GoogleSheetsModule], 
  controllers: [RowsController],
  providers: [RowsService, NotificationGateway],
})
export class RowsModule {}