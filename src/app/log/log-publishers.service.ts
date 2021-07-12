// Source: https://www.codemag.com/article/1711021/Logging-in-Angular-Applications

import {Injectable} from '@angular/core';

import {LogPublisher, LogConsole, LogLocalStorage} from './log-publishers';

@Injectable()
export class LogPublishersService {
  // Public properties
  publishers: LogPublisher[] = [];

  constructor() {
    // Build publishers arrays
    this.buildPublishers();
  }

  // Build publishers array
  buildPublishers(): void {
    // Create instance of LogConsole Class
    this.publishers.push(new LogConsole());

    // Create instance of LogLocalStorage Class
    this.publishers.push(new LogLocalStorage());
  }
}
