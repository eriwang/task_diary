const path = require('path');

const BrowserSyncPlugin = require('browser-sync-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: './frontend_src/app.js',
    output: {
        'filename': 'main.js',
        path: path.resolve(__dirname, 'backend_src/static_gen')
    },
    externals: {
        jquery: 'jQuery'
    },
    devtool: 'inline-source-map',
    watch: true,

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: [/node_modules/, /venv/],
                loader: 'babel-loader'
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    },

    plugins: [
        new BrowserSyncPlugin({
            host: 'localhost',
            port: 5001,
            proxy: 'http://localhost:5000',  // flask server,
            files: ['./backend_src/templates/*']
        })
    ]
};
