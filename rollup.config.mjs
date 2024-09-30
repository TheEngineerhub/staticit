import json from '@rollup/plugin-json';
import esbuild from 'rollup-plugin-esbuild';
import pkg from './package.json' assert { type: 'json' };

const name = pkg.main.replace(/\.js$/, '');

const bundle = config => ({
  ...config,
  input: 'src/index.ts',
  external: id => !/^[./]/.test(id),
});

export default [
  bundle({
    treeshake: true,
    plugins: [esbuild(), json()],
    output: [
      {
        file: `${name}.js`,
        format: 'cjs',
        exports: 'named',
        banner: '#!/usr/bin/env node', // Add shebang for node scripts
      },
    ],
  }),
];
