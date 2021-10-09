import postcss from 'rollup-plugin-postcss';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

const fs = require('fs');
const pkJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));

export default {
    input: 'lib/index.js',
    output: {
      file: 'dist/index.js',
      format: 'umd',
      name: pkJson._globalName
    },
    plugins: [
        nodeResolve(),
        postcss(),
        commonjs(),
    ]
}