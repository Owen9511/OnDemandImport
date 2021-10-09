import postcss from 'rollup-plugin-postcss';

export default {
    input: 'lib/index.js',
    output: {
      file: 'es/index.js',
      format: 'esm'
    },
    plugins: [
        postcss()
    ]
}