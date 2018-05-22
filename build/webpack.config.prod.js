'use strict'
const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const PrerenderSPAPlugin = require('prerender-spa-plugin');
const argv = require('yargs').argv;
const utils = require('./utils');
const baseWebpackConfig = require('./webpack.config.base');
const config = require('../config');

const env = require('../config/prod.env');
const bundleConfig = require("../static/bundle-config.json"); //调入生成的的路径json

const HtmlWebpackPlugins = config.common.entryPoint.map(item => {
    return new HtmlWebpackPlugin({
        filename: item.filename,
        template: item.template,
        libJsName: bundleConfig.libs.js,
        inject: item.inject,
        minify: {
            removeComments: true,
            collapseWhitespace: true,
            removeAttributeQuotes: true
        },
        // necessary to consistently work with multiple chunks via CommonsChunkPlugin
        chunksSortMode: 'dependency',
        chunks: item.chunks.concat(['default', 'vendor'])
    })
})

const webpackConfig = merge(baseWebpackConfig, {
    module: {
        rules: utils.styleLoaders({
            sourceMap: config.prod.productionSourceMap,
            extract: true,
            usePostCSS: true
        })
    },
    devtool: config.prod.productionSourceMap ? config.prod.devtool : false,
    output: {
        path: config.prod.assetsRoot,
        filename: utils.assetsPath('js/[name].[chunkhash].js'),
        chunkFilename: utils.assetsPath('js/[id].[chunkhash].js')
    },
    plugins: [
        // http://vuejs.github.io/vue-loader/en/workflow/production.html
        new webpack.DefinePlugin({
            'process.env': env,
            $MOCK: '""'
        }),
        new UglifyJsPlugin({
            uglifyOptions: {
                compress: {
                    warnings: false
                }
            },
            sourceMap: config.prod.productionSourceMap,
            parallel: true
        }),
        new MiniCssExtractPlugin({
            filename: utils.assetsPath('css/[name].[contenthash].css'),
            allChunks: true,
        }),
        // Compress extracted CSS. We are using this plugin so that possible
        // duplicated CSS from different components can be deduped.
        new OptimizeCSSPlugin({
            cssProcessorOptions: config.prod.productionSourceMap ? {
                safe: true,
                map: {
                    inline: false
                }
            } : {
                safe: true
            }
        }),
        // keep module.id stable when vendor modules does not change
        new webpack.HashedModuleIdsPlugin(),
        // enable scope hoisting
        new webpack.optimize.ModuleConcatenationPlugin(),
        // split vendor js into its own file
        new webpack.optimize.SplitChunksPlugin({
            chunks: "all", // it means all chunks, you can chioce 'initial ', 'async' and 'all', default: 'all'
            minSize: 20000, // the chunks's max size
            minChunks: 1, // Maximum number of chunks that is shared
            maxAsyncRequests: 5, //  Maximum number of parallel requests at on-demand loading
            maxInitialRequests: 3, // Maximum number of parallel requests at an entrypoint
            name: true,
            cacheGroups: {
                default: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true,
                },
                vendor: {
                    name: 'vendor',
                    minChunks(module) {
                        // any required modules inside node_modules are extracted to vendor
                        return (
                            module.resource &&
                            /\.js$/.test(module.resource) &&
                            module.resource.indexOf(
                                path.join(__dirname, '../node_modules')
                            ) === 0
                        )
                    }
                },
                // extract webpack runtime and module manifest to its own file in order to
                // prevent vendor hash from being updated whenever app bundle is updated
                manifest: {
                    name: 'manifest',
                    minChunks: Infinity
                },
                // This instance extracts shared chunks from code splitted chunks and bundles them
                // in a separate chunk, similar to the vendor chunk
                app: {
                    name: 'app',
                    async: 'vendor-async',
                    children: true,
                    minChunks: 3
                }
            }
        }),

        // copy custom static assets
        new CopyWebpackPlugin([{
            from: path.resolve(__dirname, '../static'),
            to: config.prod.assetsSubDirectory,
            ignore: ['.*']
        }]),
        // prerender page when you open it first
        new PrerenderSPAPlugin({
            // Required - The path to the webpack-outputted app to prerender.
            staticDir: path.join(__dirname, '../dist'),
            // Required - Routes to render.
            routes: ['/'],
        })
    ],
    performance: {
        hints: 'error',
        maxEntrypointSize: config.prod.maxEntrypointSize,
        assetFilter: function (assetFilename) {
            return assetFilename.endsWith('.js');
        }
    }
})

webpackConfig.plugins = webpackConfig.plugins.concat(HtmlWebpackPlugins);

if (config.prod.productionGzip) {
    const CompressionWebpackPlugin = require('compression-webpack-plugin')

    webpackConfig.plugins.push(
        new CompressionWebpackPlugin({
            asset: '[path].gz[query]',
            algorithm: 'gzip',
            test: new RegExp(
                '\\.(' +
                config.prod.productionGzipExtensions.join('|') +
                ')$'
            ),
            threshold: 10240,
            minRatio: 0.8
        })
    )
}

if (config.prod.bundleAnalyzerReport) {
    const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
    webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = webpackConfig