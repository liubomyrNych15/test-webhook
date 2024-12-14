import { Injectable, Logger } from '@nestjs/common';
import { google, sheets_v4 } from 'googleapis';
import { JWT } from 'google-auth-library';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class GoogleSheetsService {
  private readonly logger = new Logger(GoogleSheetsService.name);
  private readonly range: string = process.env.GOOGLE_SHEET_RANGE;
  private sheets: sheets_v4.Sheets;
  private auth: JWT;

  constructor() {
    try {
      const credentialsPath = path.join(process.cwd(), process.env.GOOGLE_CREDENTIALS_PATH);
      const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));

      this.auth = new google.auth.JWT(
        credentials.client_email,
        null,
        credentials.private_key,
        [
          'https://www.googleapis.com/auth/spreadsheets',
        ],
      );

      this.sheets = google.sheets({ version: 'v4', auth: this.auth });

      this.logger.log('Google Sheets initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize Google Sheets APIs', error.stack);
      throw error;
    }
  }

  async addRow(sheetId: string, row: string[]): Promise<void> {
    try {
      await this.sheets.spreadsheets.values.append({
        spreadsheetId: sheetId,
        range: this.range,
        valueInputOption: 'RAW',
        requestBody: {
          values: [row],
        },
      });
      this.logger.log(`Row added to Google Sheet: ${JSON.stringify(row)}`);
    } catch (error) {
      this.logger.error(`Failed to add row to Google Sheet`, error.stack);
      throw error;
    }
  }

  async getSheetNames(sheetId: string): Promise<string[]> {
    try {
      const response = await this.sheets.spreadsheets.get({ spreadsheetId: sheetId });
      const sheets = response.data.sheets || [];
      const sheetNames = sheets.map(sheet => sheet.properties?.title || '');
      this.logger.log(`Fetched sheet names: ${sheetNames}`);
      return sheetNames;
    } catch (error) {
      this.logger.error(`Failed to fetch sheet names for sheet`, error.stack);
      throw error;
    }
  }

  async getReviewers(sheetId: string): Promise<{ reviewer: string; rowsAdded: number }[]> {
    try {
      const result = await this.sheets.spreadsheets.values.get({
        spreadsheetId: sheetId,
        range: this.range,
      });

      const rows = result.data.values || [];
      const reviewers = rows.reduce((acc, row) => {
        const reviewer = row[0];
        if (!reviewer) return acc;

        acc[reviewer] = (acc[reviewer] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const reviewerData = Object.entries(reviewers).map(([reviewer, rowsAdded]) => ({
        reviewer,
        rowsAdded,
      }));

      return reviewerData;
    } catch (error) {
      this.logger.error(`Failed to fetch reviewers from Google Sheet`, error.stack);
      throw error;
    }
  }

  async getRecipients(sheetId: string): Promise<string[]> {
    try {
      const result = await this.sheets.spreadsheets.values.get({
        spreadsheetId: sheetId,
        range: this.range,
      });

      const rows = result.data.values || [];
      const emailColumnIndex = 1; 

      const recipients = rows
        .map(row => row[emailColumnIndex])
        .filter(email => email && email.includes('@'));

      this.logger.log(`Fetched recipients: ${recipients}`);
      return recipients;
    } catch (error) {
      this.logger.error(`Failed to fetch recipients from Google Sheet`, error.stack);
      throw error;
    }
  }

  async getAllRecipients(sheetId: string): Promise<string[]> {
    try {
      const result = await this.sheets.spreadsheets.values.get({
        spreadsheetId: sheetId,
        range: this.range,
      });
  
      const rows = result.data.values || [];
  
      const recipients = rows
        .flat() 
        .filter(email => email && email.includes('@'))
        .map(email => email.trim()) 
        .reduce((uniqueEmails, email) => {
          if (!uniqueEmails.includes(email)) uniqueEmails.push(email);
          return uniqueEmails;
        }, [] as string[]);
  
      this.logger.log(`Fetched recipients from Column A: ${recipients}`);
      return recipients;
    } catch (error) {
      this.logger.error(`Failed to fetch recipients from Column A`, error.stack);
      throw error;
    }
  }
}