import express, { Request, Response } from 'express';
import { resolve } from 'path';

import { printMessage } from '../utils/cli';

/**
 * Starts sifrr server.
 * @param {number} port Port to serve.
 * @param {string[]} routes Routes.
 * @param {string} dir Path to entry for serve files.
 */
export const startServer = async (port: number, routes: string[], dir: string): Promise<void> => {
  try {
    const app = express();
    const resolvePath = resolve(dir);
    app.use(express.static(resolvePath));

    for (const route of routes) {
      app.get(route, (req: Request, res: Response) => {
        res.sendFile(`${resolvePath}/index.html`);
      });
    }

    app.listen(port, '0.0.0.0', () => {
      printMessage(`Static server is running.`, 'success');
    });
  } catch (error) {
    printMessage(error, 'error', 'Cannot start static server.');
  }
};
