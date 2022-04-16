import { readFileSync } from 'fs';

import { staticServer } from './core/server';
import { printMessage } from './utils/cli';

export class ReactSSG {
  config: any = {};
  puppeteerOpts = {};
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
      printMessage(error, 'error');
      process.exit(0);
    }
  }

  async run() {
    await staticServer(this.port, this.routes, this.outDir);
  }
}
