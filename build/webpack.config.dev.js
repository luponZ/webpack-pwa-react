'use strict'
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const path = require('path')
const baseWebpackConfig = require('./webpack.config.base')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const portfinder = require('portfinder')

const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)
const rootPath = path.resolve(__dirname, '../')
const bundleConfig = require("../static/bundle-config.json") //调入生成的的路径json

const HtmlWebpackPlugins = config.common.mode === 'multi' ? config.common.entryPoint.map(item => {
    return new HtmlWebpackPlugin({
        filename: item.filename,
        template: item.template,
        libJsName: bundleConfig.libs.js,
        inject: item.inject,
        publicPath: config.dev.assetsPublicPath,
        env: config.dev.env,
        // necessary to consistently work with multiple chunks via CommonsChunkPlugin
        chunksSortMode: 'dependency',
        chunks: item.chunks.concat(['default', 'vendor'])
    })
}) : [new HtmlWebpackPlugin({
        filename: 'index.html',
        template: 'index.html',
        inject: true,
        libJsName: bundleConfig.libs.js,
        libCssName: bundleConfig.libs.css,
        publicPath: config.dev.assetsPublicPath,
        env: config.dev.env,
})];

const devServer = {
        clientLogLevel: 'warning',
        historyApiFallback: config.common.mode === 'multi' ? false : {
            rewrites: [{
                from: /.*/,
                to: path.posix.join(config.dev.assetsPublicPath, 'index.html')
            }, ],
        },
        hot: true,
        contentBase: false, // since we use CopyWebpackPlugin.
        compress: true,
        host: HOST || config.dev.host,
        port: PORT || config.dev.port,
        open: config.dev.autoOpenBrowser,
        overlay: config.dev.errorOverlay ? {
            warnings: false,
            errors: true
        } : false,
        publicPath: config.dev.assetsPublicPath,
        proxy: config.dev.proxyTable,
        quiet: true, // necessary for FriendlyErrorsPlugin
        watchOptions: {
            poll: config.dev.poll,
        },
        // before: mock
    };

const devWebpackConfig = merge(baseWebpackConfig, {
    module: {
        rules: utils.styleLoaders({
            sourceMap: config.dev.cssSourceMap,
            usePostCSS: true
        })
    },
    // cheap-module-eval-source-map is faster for development
    devtool: config.dev.devtool,

    plugins: [
        new webpack.DefinePlugin({
            'process.env': require('../config/dev.env'),
            PRODUCTION: JSON.stringify(false),
            PUBLICPATH: JSON.stringify(config.prod.assetsPublicPath),
            $MOCK: '"/mock"'
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
        new webpack.NoEmitOnErrorsPlugin(),
        // copy custom static assets
        new CopyWebpackPlugin([{
            from: path.resolve(__dirname, '../static'),
            to: config.dev.assetsSubDirectory,
            ignore: ['.*']
        }])
    ]
});

devWebpackConfig.plugins = devWebpackConfig.plugins.concat(HtmlWebpackPlugins);
devWebpackConfig.devServer = devServer;

module.exports = new Promise((resolve, reject) => {
    portfinder.basePort = process.env.PORT || config.dev.port
    portfinder.getPort((err, port) => {
        if (err) {
            reject(err)
        } else {
            // publish the new Port, necessary for e2e tests
            process.env.PORT = port
            // add port to devServer config
            devWebpackConfig.devServer.port = port

            // Add FriendlyErrorsPlugin
            devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
                compilationSuccessInfo: {
                    messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`],
                },
                onErrors: config.dev.notifyOnErrors ?
                    utils.createNotifierCallback() :
                    undefined
            }))

            resolve(devWebpackConfig)
        }
    })
})