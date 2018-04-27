import babel from 'rollup-plugin-babel'
import butternut from 'rollup-plugin-butternut'

import pkg from './package.json'

const isTest = process.env.TEST

const globals = { net: 'net' }

export default {
  external: ['net', 'web3-eth-accounts'],
  input: './lib/index.js',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      globals: globals,
      name: pkg.name,
      sourcemap: true,
    },
    {
      file: pkg.module,
      format: 'es',
      globals: globals,
      sourcemap: true,
    },
  ],
  plugins: [
    babel({
      exclude: 'node_modules/**',
    }),
    !isTest && butternut(),
  ],
}
