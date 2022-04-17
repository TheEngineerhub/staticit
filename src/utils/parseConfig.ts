import { ReactSSG } from '../ssg';

export class ParseConfig extends ReactSSG {
  constructor() {
    super();
    this.parse();
  }

  /**
   * Parses config file sets variables with defaults.
   */
  parse() {
    if (this.config) {
      this.puppeteer.launchOpts = this.config.puppeteer.launchOpts || {};
      this.puppeteer.waitForOpts = this.config.puppeteer.waitForOpts || {};
      this.port = this.config.port || 1818;
      this.outDir = this.config.outDir || './dist';
      this.routes = this.config.routes || [];
    }
  }
}
