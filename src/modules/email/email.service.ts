import { Injectable, Logger } from '@nestjs/common';
import * as sgMail from '@sendgrid/mail';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor() {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  }

  async sendNotification(to: string[], subject: string, content: string) {
    try {
      const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 0;
            background-color: #f4f4f9;
          }
          .email-container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background: #ffffff;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .header {
            text-align: center;
            background-color: #0078d4;
            padding: 20px 0;
            color: white;
            border-radius: 8px 8px 0 0;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
          }
          .content {
            padding: 20px;
            font-size: 16px;
            color: #333333;
          }
          .footer {
            text-align: center;
            padding: 10px;
            font-size: 12px;
            color: #aaaaaa;
            background: #f9f9f9;
            border-radius: 0 0 8px 8px;
          }
          .button {
            display: inline-block;
            padding: 10px 20px;
            margin: 20px 0;
            background-color: #0078d4;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            font-size: 14px;
          }
          .button:hover {
            background-color: #005bb5;
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">
            <h1>Test Webhook Notification</h1>
          </div>
          <div class="content">
            <p>Hi there,</p>
            <p>${content}</p>
            <p>Thank you for using our Test Webhook. We are here to keep you updated with real-time notifications and analytics.</p>
            <a href="https://docs.google.com/spreadsheets/d/1nSKmgKCkUHCJqWMquRIEBTOJZpp3ohisf4j-2YEybw0/edit?gid=0#gid=0" class="button">View Google Sheet</a>
          </div>
          <div class="footer">
            <p>You are receiving this email because you subscribed to Test Tracker updates.</p>
          </div>
        </div>
      </body>
      </html>
      `;

      const msg = {
        to,
        from: 'liubomyr.nych@gmail.com',
        subject,
        text: content,
        html: htmlContent,
      };

      await sgMail.sendMultiple(msg);
      this.logger.log(`Email sent successfully to: ${to.join(', ')}`);
    } catch (error) {
      this.logger.error(`Failed to send email: ${error.message}`, error.stack);
    }
  }
}