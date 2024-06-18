import { Injectable, LoggerService } from '@nestjs/common';
import { format } from 'date-fns';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class MyLogger implements LoggerService {
  log(message: string) {
    this.writeToFile(message, 'log');
  }

  error(message: string) {
    this.writeToFile(message, 'error');
  }

  warn(message: string) {
    this.writeToFile(message, 'warn');
  }

  debug?(message: string) {
    this.writeToFile(message, 'debug');
  }

  fatal?(message: string) {
    this.writeToFile(message, 'fatal');
  }

  private async writeToFile(message: string, level: string) {
    const filePath = `${path.resolve(__dirname, `../../logs/${level}.log`)}`;

    const logTime = format(new Date(), 'dd/MM/yyyy, h:m:s a'); // 12/06/2024 7:23:34 PM

    const logMessage = `${level.toUpperCase()} - ${logTime} - ${message}`;

    switch (level) {
      case 'log':
        await fs.appendFile(filePath, logMessage, { flag: 'a' });
        break;

      case 'error':
        await fs.appendFile(filePath, logMessage, { flag: 'a' });
        break;

      case 'warn':
        await fs.appendFile(filePath, logMessage, { flag: 'a' });
        break;

      case 'fatal':
        await fs.appendFile(filePath, logMessage, { flag: 'a' });
        break;

      default:
        await fs.appendFile(filePath, logMessage, { flag: 'a' });
        break;
    }
  }
}
