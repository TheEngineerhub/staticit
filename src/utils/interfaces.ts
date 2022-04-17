import {
  BrowserConnectOptions,
  BrowserLaunchArgumentOptions,
  LaunchOptions,
  Product,
  WaitForOptions,
} from 'puppeteer';

interface IPuppeteerOpts {
  launchOpts: LaunchOptions &
    BrowserLaunchArgumentOptions &
    BrowserConnectOptions & {
      product?: Product;
      extraPrefsFirefox?: Record<string, unknown>;
    };
  waitForOpts: WaitForOptions;
}

export type PuppeteerLaunchOpts = IPuppeteerOpts['launchOpts'];
export type PuppeteerWaitForOpts = IPuppeteerOpts['waitForOpts'];
