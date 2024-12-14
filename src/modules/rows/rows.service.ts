import { Injectable, Inject, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { PrismaClient } from '@prisma/client';
import { NotificationGateway } from '../../common/websocket.gateway';
import { EmailService } from '../email/email.service';
import { GoogleSheetsService } from '../google-sheets/google-sheets.service';

@Injectable()
export class RowsService {
  private readonly logger = new Logger(RowsService.name);
  private readonly prisma = new PrismaClient();
  private readonly googleSheetId = '1nSKmgKCkUHCJqWMquRIEBTOJZpp3ohisf4j-2YEybw0'; 
  constructor(
    private readonly gateway: NotificationGateway,
    private readonly emailService: EmailService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly googleSheetsService: GoogleSheetsService,
  ) {}

  async addRow(content: string, reviewer: string) {
    const newRow = await this.prisma.row.create({ data: { content, reviewer } });

    await this.cacheManager.del('allRows');
    this.gateway.sendNotification({ event: 'row_added', data: newRow });

    try {
      await this.googleSheetsService.addRow(this.googleSheetId, [reviewer, content]);
      this.logger.log('Row successfully added to Google Sheet.');
    } catch (error) {
      this.logger.error('Failed to add row to Google Sheet', error.stack);
    }

    let fileUsers: string[] = [];
    try {
      fileUsers = await this.googleSheetsService.getAllRecipients(this.googleSheetId);
      this.logger.log(`File users fetched: ${fileUsers}`);
    } catch (error) {
      this.logger.error('Failed to fetch file users', error.stack);
    }

    if (fileUsers.length > 0) {
      await this.emailService.sendNotification(
        fileUsers,
        'Row Added Notification',
        `${reviewer} has added a new row to the Google Sheet.`,
      );
    }

    const reviewers = await this.googleSheetsService.getReviewers(this.googleSheetId);
    for (const { reviewer, rowsAdded } of reviewers) {
      if (rowsAdded % 10 === 0) {
        await this.emailService.sendNotification(
          fileUsers,
          'Milestone Reached!',
          `${reviewer} has added ${rowsAdded} rows to the Google Sheet!`,
        );
      }
    }

    return newRow;
  }
  
  async getAllRows() {
    const cachedRows = await this.cacheManager.get('allRows');
    if (cachedRows) return cachedRows;
    
    const rows = await this.prisma.row.findMany();
    await this.cacheManager.set('allRows', rows, 1000);

    return rows;
  }

  async getRowById(id: number) {
    const cacheKey = `row-${id}`;
    const cachedRow = await this.cacheManager.get(cacheKey);
    if (cachedRow) return cachedRow;
    
    const row = await this.prisma.row.findUnique({
      where: { id },
    });

    if (row) await this.cacheManager.set(cacheKey, row, 1000);
    
    return row;
  }
}