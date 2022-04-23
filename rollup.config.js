import run from '@rollup/plugin-run';
import dts from 'rollup-plugin-dts';
import esbuild from 'rollup-plugin-esbuild';

const name = require('./package.json').main.replace(/\.js$/, '');

const dev = process.env.NODE_ENV === 'development';

const bundle = config => ({
  ...config,
  input: 'src/index.ts',
  external: id => !/^[./]/.test(id),
});

export default [
  bundle({
    treeshake: true,
    plugins: [esbuild()],
    output: [
      {
        file: `${name}.js`,
        format: 'cjs',
        exports: 'named',
      },
    ],
  }),
  bundle({
    plugins: [dts(), dev && run()],
    output: {
      file: `${name}.d.ts`,
      format: 'es',
    },
  }),
];
