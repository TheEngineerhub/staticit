import chalk from 'chalk';
import readline from 'readline';

type MessageType = 'error' | 'success' | 'info';
type RouteInfo = { route: string; size: number };

let spinnerInterval: NodeJS.Timeout | null = null;
let spinnerFrameIndex = 0;
let spinnerStartTime: number | null = null; // To store the time when spinner starts
const spinnerFrames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];

/**
 * @param {any} msg Message or array of routes with size to print.
 * @param {string} type 'error' | 'success' | 'info'
 * @param {string} [errorSummary] Summary for error type.
 */
export const printMessage = (msg: any, type: MessageType, errorSummary?: any): void => {
  switch (type) {
    case 'error':
      stopSpinner(false);
      console.error(`${chalk.red.bold('\u{10102}')} ${msg}\n${errorSummary?.stack || errorSummary}\n`);
      break;
    case 'success': {
      const routes: RouteInfo[] = msg;
      if (routes && routes.length) {
        routes.forEach((routeInfo) => {
          console.log(`${chalk.green.bold('\u{1F5F8}')} generated ${routeInfo.route} (${routeInfo.size}kb)`);
        });
      } else {
        console.log('No pages were generated.');
      }
      break;
    }
    case 'info': {
      spinnerFrameIndex = 0;
      if (!spinnerInterval) {
        spinnerStartTime = Date.now(); // Capture the time when spinner starts
        spinnerInterval = setInterval(() => {
          const frame = spinnerFrames[spinnerFrameIndex];
          readline.cursorTo(process.stdout, 0);
          process.stdout.write(`${frame} Processing pages...`);
          spinnerFrameIndex = (spinnerFrameIndex + 1) % spinnerFrames.length;
        }, 80);
      }
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
  if (spinnerInterval) {
    clearInterval(spinnerInterval);
    spinnerInterval = null;

    const endTime = Date.now(); // Capture the time when the spinner stops
    const elapsedTime = ((endTime - (spinnerStartTime || 0)) / 1000).toFixed(2);

    readline.cursorTo(process.stdout, 0); // Move cursor to start of line
    readline.clearLine(process.stdout, 0); // Clear the current line

    if (success) {
      console.log(chalk.green.bold(`All pages are processed. Took ${elapsedTime} seconds.`));
    } else {
      console.log(chalk.red.bold(`Error processing routes.`));
    }

    spinnerStartTime = null;
  }
};
