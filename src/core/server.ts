import { App, Cluster, sendFile } from '@sifrr/server';
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
    const app = new App();
    const resolvePath = resolve(dir);
    const cluster = new Cluster([
      {
        app: app,
        port: port,
      },
    ]);

    // @ts-ignore
    app.folder('/', resolvePath);
    routes.forEach(route => {
      app.get(route, (req, res) => {
        sendFile(req, res, `${resolvePath}/index.html`, {});
      });
    });

    cluster.listen();
    printMessage(`Static server is running.`, 'success');
  } catch (error) {
    printMessage(error, 'error', 'Cannot start static server.');
  }
};
