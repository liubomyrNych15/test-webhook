import { Controller, Get, Query, Logger } from '@nestjs/common';
import { GoogleSheetsService } from '../google-sheets/google-sheets.service';

@Controller('sheets')
export class GoogleSheetsController {
  private readonly logger = new Logger(GoogleSheetsController.name);

  constructor(private readonly googleSheetsService: GoogleSheetsService) {}

  @Get('/sheet-names')
  async getSheetNames(@Query('sheetId') sheetId: string) {
    try {
      if (!sheetId) {
        throw new Error('The "sheetId" query parameter is required.');
      }

      this.logger.log(`Fetching sheet names for spreadsheet ID: ${sheetId}`);

      const sheetNames = await this.googleSheetsService.getSheetNames(sheetId);
      this.logger.log(`Fetched sheet names: ${sheetNames.join(', ')}`);

      return { sheetNames };
    } catch (error) {
      this.logger.error(`Failed to fetch sheet names for spreadsheet ID: ${sheetId}`, error.stack);
      throw error; 
    }
  }
}