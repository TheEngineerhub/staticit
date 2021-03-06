import json from '@rollup/plugin-json';
import dts from 'rollup-plugin-dts';
import esbuild from 'rollup-plugin-esbuild';

const name = require('./package.json').main.replace(/\.js$/, '');

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
        banner: '#!/usr/bin/env node',
      },
    ],
  }),
  bundle({
    plugins: [dts()],
    output: {
      file: `${name}.d.ts`,
      format: 'es',
    },
  }),
];
