import { program } from 'commander';
import fs from 'fs';

import { version } from '../package.json';
import { startPuppeteer } from './core/puppeteer';
import { startServer } from './core/server';
import { printMessage } from './utils/cli';
import { PuppeteerLaunchOpts, PuppeteerWaitForOpts } from './utils/interfaces';

export class Staticit {
  confName;
  config: any = {};
  options = {
    config: '',
    disablePrettier: false,
  };
  puppeteer = {
    launchOpts: <PuppeteerLaunchOpts>{},
    waitForOpts: <PuppeteerWaitForOpts>{},
  };
  port = 8080;
  routes: string[] = [];
  outDir = './dist';

  constructor() {
    this.readOpts();
    this.confName = this.options.config || process.env.CONFIG_NAME;
    this.run();
  }

  /**
   * Reads CLI options.
   */
  private readOpts = (): void => {
    program
      .name('staticit')
      .description(
        'Minimal, zero-configuration and fast solution for static site generation in any front-end framework.'
      )
      .option('-c, --config <file>', 'Reads config from given name. Example: --config .routes.json')
      .option(
        '--disable-prettier',
        'By default Staticit will prettify the generated static files. To disable it pass this option.'
      );

    program.parse(process.argv);

    this.options = program.opts();
  };

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
      if (this.config.puppeteer) {
        this.puppeteer.launchOpts = { ...this.config.puppeteer.launchOpts };
        this.puppeteer.waitForOpts = { ...this.config.puppeteer.waitForOpts };
      }
      if (Number.isNaN(parseInt(this.config.port))) {
        printMessage('Port should be a number, using default port 8080.', 'info');
      } else {
        this.port = +this.config.port;
      }
      this.outDir = this.config.outDir || './dist';
      this.routes = this.config.routes || [];
    }
  }

  /**
   * Static-it!
   */
  private async run(): Promise<void> {
    try {
      printMessage(`Starting static-it. Ver: ${version}`, 'info');
      this.getConfig();
      this.parseConfig();
      await startServer(this.port, this.routes, this.outDir);
      await startPuppeteer(
        `http://localhost:${this.port}`,
        this.routes,
        this.outDir,
        this.puppeteer.launchOpts,
        this.puppeteer.waitForOpts,
        this.options.disablePrettier
      );
      printMessage('Successfully generated static files.', 'success');
      process.exit(0);
    } catch (error) {
      printMessage(error, 'error', 'Stack: ');
    }
  }
}
