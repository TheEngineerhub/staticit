import { ReactSSG } from '../ssg';

export class ParseConfig extends ReactSSG {
  constructor() {
    super();
    this.parse();
  }

  parse() {
    if (this.config) {
      this.puppeteerOpts = this.config.puppeteer || {};
      this.port = this.config.port || 1818;
      this.outDir = this.config.outDir || './dist';
      this.routes = this.config.routes || [];
    }
  }
}
