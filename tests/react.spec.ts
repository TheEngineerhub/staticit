import finalhandler from 'finalhandler';
import { createServer, Server } from 'http';
import { resolve } from 'path';
import puppeteer from 'puppeteer';
import serveStatic from 'serve-static';
import * as shell from 'shelljs';

let page: puppeteer.Page;
let browser: puppeteer.Browser;
let server: Server;

describe('React e2e tests', () => {
  beforeAll(async () => {
    const root = resolve('examples', 'react');
    shell.cd(root);
    shell.exec('pnpm build');

    const serve = serveStatic(`${root}/dist`, { extensions: ['html'] });
    server = createServer(function onRequest(req: any, res: any) {
      // @ts-ignore
      serve(req, res, finalhandler(req, res));
    });

    browser = await puppeteer.launch({ headless: true });
    page = await browser.newPage();
    await server.listen(4444);
  });

  afterAll(async () => {
    await browser.close();
    await server.close();
  });

  it('Should prerender home page', async () => {
    await page.goto('http://localhost:4444/');

    if (!page) {
      throw new Error('Error while navigating with puppeteer.');
    }

    const h1 = await page.$('#home');

    if (!h1) {
      throw new Error('Cannot find <h1> element.');
    }

    const h1Content = await h1.evaluate(node => (<HTMLElement>node).innerText);
    expect(h1Content).toBe('Home');
  });

  it('Should prerender about page', async () => {
    await page.goto('http://localhost:4444/about');

    if (!page) {
      throw new Error('Error while navigating with puppeteer.');
    }

    const h1 = await page.$('#about');

    if (!h1) {
      throw new Error('Cannot find <h1> element.');
    }

    const h1Content = await h1.evaluate(node => (<HTMLElement>node).innerText);
    expect(h1Content).toBe('About');
  });

  it('Should not prerender private page', async () => {
    await page.goto('http://localhost:4444/private');

    if (!page) {
      throw new Error('Error while navigating with puppeteer.');
    }

    const content = await page.content();

    expect(content.includes('Cannot GET /private')).toBe(true);
  });
});
