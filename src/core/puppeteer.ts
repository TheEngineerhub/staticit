import { writeFile } from 'node:fs/promises';
import * as puppeteer from 'puppeteer';

import { printMessage } from '../utils/cli';
import { ensureDirectory, setDefaultMIMEType } from '../utils/helpers';
import { PuppeteerLaunchOpts, PuppeteerWaitForOpts } from '../utils/interfaces';

/**
 * Reads HTML page.
 * @param {Browser} browser Puppeteer browser instance.
 * @param {string} url
 * @param {object} opts Puppeteer goto options
 * @returns HTML page.
 */
const getHTML = async (
  browser: puppeteer.Browser,
  url: string,
  opts: PuppeteerWaitForOpts
): Promise<string | undefined> => {
  try {
    const page = await browser.newPage();

    await page.goto(url, Object.assign({ waitUntil: 'networkidle0' }, opts));
    const html = await page.content();

    if (!html) return;

    return html;
  } catch (error) {
    printMessage(error, 'error', `Cannot read URL ${url}.`);
  }
};

/**
 * Creates HTML page.
 * @param {string} route
 * @param {string} html HTML page
 * @param {string} path
 */
const createHTML = async (route: string, html: string, path: string): Promise<void> => {
  try {
    if (route.indexOf('/') !== route.lastIndexOf('/')) {
      const subPath = route.slice(0, route.lastIndexOf('/'));
      await ensureDirectory(`${path}${subPath}`);
    }

    const fileName = setDefaultMIMEType(route);

    await writeFile(`${path}${fileName}`, html, { encoding: 'utf8', flag: 'w' });
    printMessage(`Successfully created ${fileName}.`, 'success');
  } catch (error) {
    printMessage(error, 'error', `Cannot create route ${route}.`);
  }
};

/**
 * Starts puppeteer instance and generates HTML pages.
 * @param {string} url
 * @param {string} routes
 * @param {string} outDir Output directory
 * @param {object} launchOpts Puppeteer launch options
 * @param {object} waitForOpts Puppeteer goto options
 */
export const startPuppeteer = async (
  url: string,
  routes: string[],
  outDir: string,
  launchOpts: PuppeteerLaunchOpts,
  waitForOpts: PuppeteerWaitForOpts
): Promise<void> => {
  const browser: puppeteer.Browser = await puppeteer.launch(launchOpts);

  for (const route of routes) {
    try {
      printMessage(`Processing route ${route}`, 'info');
      const html = await getHTML(browser, `${url}${route}`, waitForOpts);
      if (html) {
        createHTML(route, html, outDir);
      } else {
        return;
      }
    } catch (error) {
      printMessage(error, 'error', `Error while processing route ${route}`);
    }
  }

  await browser.close();
};
