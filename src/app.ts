import fs from 'fs';

import { startPuppeteer } from './core/puppeteer';
import { startServer } from './core/server';
import { printMessage } from './utils/cli';
import { PuppeteerLaunchOpts, PuppeteerWaitForOpts } from './utils/interfaces';

export class Staticit {
  confName;
  config: any = {};
  puppeteer = {
    launchOpts: <PuppeteerLaunchOpts>{},
    waitForOpts: <PuppeteerWaitForOpts>{},
  };
  port = 8080;
  routes: string[] = [];
  outDir = './dist';

  constructor() {
    this.confName = process.env.confName;
    this.run();
  }

  /**
   * Reads config from file.
   */
  private getConfig(): void {
    try {
      this.config = JSON.parse(
        fs.readFileSync(
          `${process.cwd()}/${this.confName ? this.confName : '.staticit.json'}`,
          'utf8'
        )
      );
    } catch (error) {
      printMessage(error, 'error', 'Cannot read config file.');
      process.exit(0);
    }
  }

  /**
   * Parses config and sets variables with defaults.
   */
  private parseConfig(): void {
    if (this.config) {
      this.puppeteer.launchOpts = { ...this.config.puppeteer.launchOpts } || {};
      this.puppeteer.waitForOpts = { ...this.config.puppeteer.waitForOpts } || {};
      this.port = this.config.port || 8080;
      this.outDir = this.config.outDir || './dist';
      this.routes = this.config.routes || [];
    }
  }

  private async run(): Promise<void> {
    try {
      printMessage('Starting static-it.', 'info');
      this.getConfig();
      this.parseConfig();
      await startServer(this.port, this.routes, this.outDir);
      await startPuppeteer(
        `http://localhost:${this.port}`,
        this.routes,
        this.outDir,
        this.puppeteer.launchOpts,
        this.puppeteer.waitForOpts
      );
      printMessage('Successfully generated static files.', 'success');
      process.exit(0);
    } catch (error) {
      printMessage(error, 'error', 'Stack: ');
    }
  }
}
