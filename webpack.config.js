const path = require('path');

const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const merge = require('webpack-merge');
const webpack = require('webpack');

function getConfig(env)
{
    const isDev = _getEnvBooleanValue(env, 'dev');
    const isMock = _getEnvBooleanValue(env, 'mock');

    const commonConfig = {
        'externals': {
            'jquery': 'jQuery'
        },
    
        'module': {
            'rules': [
                {
                    'test': /\.js$/,
                    'exclude': [/node_modules/, /venv/],
                    'loader': 'babel-loader'
                },
                {
                    'test': /\.css$/,
                    'use': ['style-loader', 'css-loader']
                }
            ]
        }
    };

    return merge(commonConfig, _getEnvConfig(isDev, isMock));
}

function _getEnvConfig(isDev, isMock)
{
    let baseDevConfigValues = {
        'mode': 'development',
        'devtool': 'inline-source-map',
        'watch': true,
    };

    let baseProdConfigValues = {
        'mode': 'production',
        'devtool': 'source-map'
    };

    const APP_ENTRY_POINT = './frontend_src/app.js';
    let baseMockConfigValues = {
        // Order of "entry" matters, we need the backend handlers to be hooked up before app.js calls them.
        'entry': ['./frontend_src/mock_site/mock_app_main.js', APP_ENTRY_POINT],
        'output': {
            'filename': 'main.js',
            'path': path.resolve(__dirname, 'docs')
        }
    };

    let baseFrontEndConfigValues = {
        'entry': APP_ENTRY_POINT,
        'output': {
            'filename': 'main.js',
            'path': path.resolve(__dirname, 'backend_src/static_gen')
        },
    };

    let devOrProdConfigValues = (isDev) ? baseDevConfigValues : baseProdConfigValues;
    let mockOrFrontEndConfigValues = (isMock) ? baseMockConfigValues : baseFrontEndConfigValues;

    let config = merge(devOrProdConfigValues, mockOrFrontEndConfigValues);
    config.plugins = _getEnvConfigPlugins(isDev, isMock);
    return config;
}

function _getEnvConfigPlugins(isDev, isMock)
{
    let plugins = [];
    if (isDev)
    {
        const browserSyncConfig = (isMock) ? {'server': './docs'} : {
            host: 'localhost',
            port: 5001,
            proxy: 'http://localhost:5000',  // flask server
            files: ['./backend_src/templates/*']
        };
        plugins.push(new BrowserSyncPlugin(browserSyncConfig));
    }
    if (isMock)
    {
        plugins.push(new webpack.NormalModuleReplacementPlugin(/ajax\/prod_ajax\.js/, './mock_ajax.js'));
    }

    return plugins;
}

function _getEnvBooleanValue(env, envValue)
{
    // We need an explicit "=== true" here because "&& undefined" returns "undefined"
    return env !== undefined && (env[envValue] === true);
}

module.exports = getConfig;