import * as nanoexpress from 'nanoexpress';
import { resolve } from 'path';

import { printMessage } from '../utils/cli';

export const staticServer = async (port: number, routes: string[], dir: string) => {
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
    printMessage(error, 'error');
  }
};
