const path = require('path');

module.exports = {
    mode: 'development',
    entry: './frontend_src/index.js',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'backend_src/static_gen')
    },
    devtool: 'inline-source-map',
    watch: true
};
