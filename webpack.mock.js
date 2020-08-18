const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const merge = require('webpack-merge');
const path = require('path');
const webpack = require('webpack');

const common = require('./webpack.common.js');

// TODO: single webpack file that reads env should be all I need, none of this merge stuff
module.exports = (env) => {
    let plugins = [new webpack.NormalModuleReplacementPlugin(/ajax\/prod_ajax\.js/, './mock_ajax.js')];
    let watch = false;

    if (env !== undefined && (env.dev === true))
    {
        plugins.push(new BrowserSyncPlugin({server: './mock_site_dist'}));
        watch = true;
    }

    // Order of "entry" matters: we need the mock backend handlers to be hooked up before app.js calls them.
    return merge(common, {
        'entry': ['./frontend_src/mock_site/mock_app_main.js', './frontend_src/app.js'],
        'output': {
            'filename': 'main.js',
            'path': path.resolve(__dirname, 'mock_site_dist')
        },

        'mode': 'production',
        'devtool': 'source-map',
        'watch': watch,
        'plugins': plugins
    });
};
