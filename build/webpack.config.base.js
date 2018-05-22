'use strict'
const webpack = require('webpack');
const path = require('path');
const {
    CheckerPlugin
} = require('awesome-typescript-loader');
const argv = require('yargs').argv;
const OfflinePlugin = require('offline-plugin');
const config = require('../config');
const utils = require('./utils');
const bundleConfig = require("../static/bundle-config.json"); //调入生成的的路径json

const resolve = dir => { return path.join(__dirname, '..', dir) };

module.exports = {
    // context is useful for config of entry and loader
    context: path.resolve(__dirname, '../'),
    entry: {
        'app': './src/main.tsx',
        'app2': './src/main.1.tsx'
    },
    output: {
        path: config.prod.assetsRoot,
        publicPath: argv.env.NODE_ENV === 'production' ?
            config.prod.assetsPublicPath :
            config.dev.assetsPublicPath
    },
    plugins: [
        new webpack.DllReferencePlugin({
            context: __dirname,
            manifest: require('../static/libs-mainfest.json') // 指向生成的manifest.json
        }),
        // new CheckerPlugin()
        new OfflinePlugin({
            externals: argv.env.NODE_ENV === 'production' ?
                [`${config.prod.assetsPublicPath}static/${bundleConfig.libs.js}`, './index.html'] :
                [`${config.dev.assetsPublicPath}static/${bundleConfig.libs.js}`, './index.html'],
            ServiceWorker: {
                events: true
            }
        })
    ],
    resolve: {
        extensions: ['.js', '.ts', '.tsx', '.json'],
        alias: {
            '@': resolve('src')
        }
    },
    mode: argv.env.NODE_ENV,
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: ['babel-loader', 'awesome-typescript-loader'],
                exclude: /node_modules/
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                include: [resolve('src'), resolve('test'), resolve('node_modules/webpack-dev-server/client')]
            }, {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: utils.assetsPath('img/[name].[hash:7].[ext]')
                }
            }, {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: utils.assetsPath('media/[name].[hash:7].[ext]')
                }
            }, {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
                }
            }
        ]
    },
    node: {
        setImmediate: false,
        dgram: 'empty',
        fs: 'empty',
        net: 'empty',
        tls: 'empty',
        child_process: 'empty'
    }
}