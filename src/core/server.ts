import * as nanoexpress from 'nanoexpress';
import { resolve } from 'path';

import { printMessage } from '../utils/cli';

/**
 * Starts nanoexpress server.
 * @param {number} port Port to serve
 * @param {string[]} routes Routes
 * @param {string} dir Path to entry for serve files.
 */
export const startServer = async (port: number, routes: string[], dir: string) => {
  try {
    const app = nanoexpress();
    const resolvePath = resolve(dir);

    routes.map(route => {
      app.get(route, (req, res) => {
        res.sendFile(`${resolvePath}/index.html`);
      });
    });

    await app.listen(port);
    printMessage(`Static server is running.`, 'success');
  } catch (error) {
    printMessage(error, 'error', 'Cannot start static server.');
  }
};
