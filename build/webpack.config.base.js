'use strict'
const webpack = require('webpack');
const path = require('path');
const {
    CheckerPlugin
} = require('awesome-typescript-loader')
const config = require('../config');
const utils = require('./utils');
const argv = require('yargs').argv;

const resolve = dir => { return path.join(__dirname, '..', dir) };

module.exports = {
    context: path.resolve(__dirname, '../'),
    entry: {
        'app': './src/main.tsx'
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
    ],
    resolve: {
        extensions: ['.js', '.ts', '.tsx', '.json'],
        alias: {
            '@': resolve('src')
        }
    },
    // externals: {
    //     "react": "React",
    //     "react-dom": "ReactDOM"
    // },
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