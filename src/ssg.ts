import { readFileSync } from 'fs';

import { startServer } from './core/server';
import { printMessage } from './utils/cli';
import { PuppeteerLaunchOpts, PuppeteerWaitForOpts } from './utils/interfaces';

export class Staticit {
  config: any = {};
  puppeteer = {
    launchOpts: <PuppeteerLaunchOpts>{},
    waitForOpts: <PuppeteerWaitForOpts>{},
  };
  port = 8080;
  routes: string[] = [];
  outDir = './dist';

  constructor() {
    this.run();
  }

  /**
   * Reads config from file.
   */
  getConfig() {
    try {
      this.config = JSON.parse(readFileSync(`${process.cwd()}/.ssg.json`, 'utf8'));
    } catch (error) {
      printMessage(error, 'error', 'Cannot read config file.');
      process.exit(0);
    }
  }

  /**
   * Parses config and sets variables with defaults.
   */
  parseConfig() {
    if (this.config) {
      this.puppeteer.launchOpts = { ...this.config.puppeteer.launchOpts } || {};
      this.puppeteer.waitForOpts = { ...this.config.puppeteer.waitForOpts } || {};
      this.port = this.config.port || 8080;
      this.outDir = this.config.outDir || './dist';
      this.routes = this.config.routes || [];
    }
  }

  async run() {
    try {
      printMessage('Starting static-it.', 'info');
      this.getConfig();
      this.parseConfig();
      await startServer(this.port, this.routes, this.outDir);
    } catch (error) {
      printMessage(error, 'error', 'Stack: ');
    }
  }
}
