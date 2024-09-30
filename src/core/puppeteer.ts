import puppeteer, { Browser } from 'puppeteer';
import { writeFileSync } from 'node:fs';
import { format } from 'prettier';
import fs from 'node:fs';

import { printMessage, stopSpinner } from '../utils/cli';
import { ensureDirectory, setDefaultMIMEType } from '../utils/helpers';
import { PuppeteerLaunchOpts, PuppeteerWaitForOpts } from '../utils/interfaces';

type RouteInfo = { route: string; size: number };
const generatedRoutes: RouteInfo[] = [];

/**
 * Reads HTML page.
 * @param {Browser} browser Puppeteer browser instance.
 * @param {string} url Page URL.
 * @param {object} opts Puppeteer goto options.
 * @returns HTML page.
 */
const getHTML = async (
  browser: Browser,
  url: string,
  opts: PuppeteerWaitForOpts
): Promise<string | null> => {
  try {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle0', ...opts });
    const html = await page.content();

    return html;
  } catch (error) {
    printMessage(`Cannot read URL ${url}.`, 'error', error);
  }
};

/**
 * Creates HTML page.
 * @param {string} route Route.
 * @param {string} html HTML page.
 * @param {string} path File path.
 * @param {boolean} prettify Whether to prettify HTML.
 */
const createHTML = async (
  route: string,
  html: string,
  path: string,
  prettify: boolean
): Promise<void> => {
  try {
    if (route.includes('/') && route.lastIndexOf('/') !== 0) {
      const subPath = route.slice(0, route.lastIndexOf('/'));
      await ensureDirectory(`${path}${subPath}`);
    }

    let formatted = html;

    if (!prettify) {
      formatted = await format(formatted, { parser: 'html' });
    }

    const fileName = setDefaultMIMEType(route);
    const filePath = `${path}${fileName}`;
    writeFileSync(filePath, formatted, { encoding: 'utf8', flag: 'w' });

    const stats = fs.statSync(filePath);
    const fileSizeInKB = (stats.size / 1024).toFixed(2);
    generatedRoutes.push({ route: fileName, size: parseFloat(fileSizeInKB) });
  } catch (error) {
    printMessage(`Cannot create HTML for ${route}.`, 'error', error);
  }
};

/**
 * Starts puppeteer instance and generates HTML pages.
 * @param {string} url Static server URL.
 * @param {string[]} routes Array of routes to generate.
 * @param {string} outDir Output directory.
 * @param {PuppeteerLaunchOpts} launchOpts Puppeteer launch options.
 * @param {PuppeteerWaitForOpts} waitForOpts Puppeteer goto options.
 * @param {boolean} prettify Whether to prettify the HTML output.
 */
export const startPuppeteer = async (
  url: string,
  routes: string[],
  outDir: string,
  launchOpts: PuppeteerLaunchOpts,
  waitForOpts: PuppeteerWaitForOpts,
  prettify: boolean
): Promise<void> => {
  const browser: Browser = await puppeteer.launch(launchOpts);

  try {
    // Start the spinner while processing routes
    printMessage(null, 'info');

    for (const route of routes) {
      const html = await getHTML(browser, `${url}${route}`, waitForOpts);

      if (html) {
        await createHTML(route, html, outDir, prettify);
      }
    }

    // Stop the spinner and print success message after all routes are processed
    stopSpinner(true);
    printMessage(generatedRoutes || [], 'success');
  } catch (error) {
    stopSpinner(false);
    printMessage('Error while generating pages.', 'error', error);
  } finally {
    await browser.close();
  }
};
