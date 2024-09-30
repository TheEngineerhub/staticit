import {
  BrowserConnectOptions,
  BrowserLaunchArgumentOptions,
  LaunchOptions,
  WaitForOptions,
} from 'puppeteer';

interface IPuppeteerOpts {
  launchOpts: LaunchOptions &
    BrowserLaunchArgumentOptions &
    BrowserConnectOptions & {
      extraPrefsFirefox?: Record<string, unknown>;
    };
  waitForOpts: WaitForOptions;
}

export type PuppeteerLaunchOpts = IPuppeteerOpts['launchOpts'];
export type PuppeteerWaitForOpts = IPuppeteerOpts['waitForOpts'];
