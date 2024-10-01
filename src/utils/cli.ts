import chalk from 'chalk';
import { Zolt } from 'zolt';

type MessageType = 'error' | 'success' | 'info';
type RouteInfo = { route: string; size: number };

let spinnerStartTime: number | null = null; // To store the time when spinner starts

/**
 * @param {any} msg Message or array of routes with size to print.
 * @param {string} type 'error' | 'success' | 'info'
 * @param {string} [errorSummary] Summary for error type.
 */
export const printMessage = (msg: any, type: MessageType, errorSummary?: any): void => {
  switch (type) {
    case 'error':
      stopSpinner(false);
      console.error(
        `${chalk.red.bold('\u{10102}')} ${msg}\n${errorSummary?.stack || errorSummary}\n`,
      );
      break;
    case 'success': {
      const routes: RouteInfo[] = msg;
      if (routes && routes.length) {
        routes.forEach(routeInfo => {
          console.log(
            `${chalk.green.bold('\u{1F5F8}')} generated ${routeInfo.route} (${routeInfo.size}kb)`,
          );
        });
      } else {
        console.log('No pages were generated.');
      }
      break;
    }
    case 'info': {
      Zolt.start('dots', 'green', 'Processing pages...');
      spinnerStartTime = Date.now();
      break;
    }
    default:
      break;
  }
};

/**
 * Stop the spinner after processing is complete.
 * @param {boolean} success Whether the processing was successful.
 */
export const stopSpinner = (success: boolean = true): void => {
  const endTime = Date.now(); // Capture the time when the spinner stops
  const elapsedTime = ((endTime - (spinnerStartTime || 0)) / 1000).toFixed(2);
  let finishText: string = '';

  if (success) {
    finishText = chalk.green.bold(`All pages are processed. Took ${elapsedTime} seconds.`);
  } else {
    finishText = chalk.red.bold(`Error processing routes.`);
  }

  Zolt.stop(() => console.log(finishText));
};
