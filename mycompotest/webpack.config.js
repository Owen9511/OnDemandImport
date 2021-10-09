module.exports = {
    mode: 'none',
    entry: './lib/index.js',
    output: {
        filename: 'index.js',
        path: __dirname + '/dist',
        library: {
            name: 'myCompoTest',
            type: 'umd'
        },
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
    }
}