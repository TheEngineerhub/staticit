import { readFileSync } from 'fs';

import { startServer } from './core/server';
import { printMessage } from './utils/cli';
import { PuppeteerLaunchOpts, PuppeteerWaitForOpts } from './utils/interfaces';

export class ReactSSG {
  config: any = {};
  puppeteer = {
    launchOpts: <PuppeteerLaunchOpts>{},
    waitForOpts: <PuppeteerWaitForOpts>{},
  };
  routes: string[] = [];
  port = 1818;
  outDir = '';

  constructor() {
    this.getConfig();
    this.run();
  }

  getConfig() {
    try {
      this.config = readFileSync(`${process.cwd()}/.ssg.json`, 'utf8');
    } catch (error) {
      printMessage(error, 'error', 'Cannot read config file.');
      process.exit(0);
    }
  }

  async run() {
    await startServer(this.port, this.routes, this.outDir);
  }
}
