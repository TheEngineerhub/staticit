import { mkdir } from 'node:fs/promises';

import { printMessage } from '../utils/cli';

/**
 * Ensures directory exists at given path.
 * @param {string} path
 * @returns {Promise}
 */
export const ensureDirectory = (path: string): Promise<string> => {
  try {
    return mkdir(path, { recursive: true });
  } catch (error) {
    printMessage(error, 'error', `Cannot create directory ${path}`);
  }
};

/**
 * Sets .html mime type if not exist.
 * @param {string} route
 * @returns {string} Full file name
 */
export const setDefaultMIMEType = (route: string): string => {
  const fileName = route === '/' ? '/index' : route;
  const withMIMEType = !!fileName.match(/(.htm$|.html$|.php$)/i);

  return withMIMEType ? fileName : `${fileName}.html`;
};
