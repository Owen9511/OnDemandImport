module.exports = {
    mode: 'none',
    entry: './index.js',
    output: {
        filename: 'index.js',
        path: __dirname + '/dist',
    },
    module: {
        rules: [{
            test: /\.css$/,
            use: [
                'style-loader',
                'css-loader'
            ]
        },{
            test: /\.js$/,
            use: 'babel-loader'
        },]
    },
    // 3.借助tree-shaking
    // optimization: {
    //     usedExports: true,
    //     minimize: true,
    // },
}