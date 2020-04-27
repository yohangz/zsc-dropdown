import babel from 'rollup-plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import pkg from './package.json';

export default {
  input: 'src/index.js',
  plugins: [
    resolve(),
    babel({
        exclude: 'node_modules/**'
    })
  ],
  external: Object.keys(pkg.dependencies),
  output: [
    {
      format: 'es',
      file: `dist/${pkg.module}`,
      sourcemap: true
    },
    {
      name: 'zsc',
      format: 'umd',
      file: `dist/${pkg.main}`,
      sourcemap: true
    }
  ]
}