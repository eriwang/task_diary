const merge = require('webpack-merge');
const path = require('path');
const webpack = require('webpack');

const common = require('./webpack.common.js');

module.exports = merge(common, {
    'mode': 'production',
    'devtool': 'source-map',
    'output': {
        'filename': 'main.js',
        'path': path.resolve(__dirname, 'mock_site_dist')
    },
    'plugins': [
        new webpack.NormalModuleReplacementPlugin(/ajax\/prod_ajax\.js/, './mock_ajax.js')
    ]
});
