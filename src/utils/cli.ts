import * as chalk from 'chalk';

const message = new Set(['error', 'success', 'info'] as const);
type MessageType = typeof message extends Set<infer T> ? T : never;

/**
 * Beautified console log.
 * @param {any} msg Message to print, stack if type is an error.
 * @param {string} type 'error' | 'success' | 'info'
 * @param {string} errorSummary Summary for error type.
 */
export const printMessage = (msg: any, type: MessageType, errorSummary?: string): void => {
  switch (type) {
    case 'error':
      console.log(`${chalk.black.bgRed.bold('  ERROR  ')} ${errorSummary}`);
      throw new Error(msg);
    case 'success':
      console.log(`${chalk.black.bgGreen.bold(' SUCCESS ')} ${msg}`);
      break;
    case 'info':
      console.log(`${chalk.black.bgCyanBright.bold(' LOADING ')} ${msg}`);
      break;
    default:
      break;
  }
};
