import typescript from 'rollup-plugin-typescript2';
import resolve from '@rollup/plugin-node-resolve';
import { getBabelOutputPlugin } from '@rollup/plugin-babel';

export default {
  input: 'index.ts',
  output: [
    {
      file: 'lib/index.js',
      format: 'cjs',
      sourcemap: false,
    },
    {
      file: 'lib/es/index.js',
      format: 'es',
      sourcemap: false,
    },
  ],
  plugins: [typescript(), resolve(), getBabelOutputPlugin()],
};
