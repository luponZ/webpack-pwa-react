var path = require('path');
var webpack = require('webpack'); //调用webpack内置DllPlugin插件
var config = require('../config')
var ExtractTextPlugin = require('extract-text-webpack-plugin'); // 提取css
var AssetsPlugin = require('assets-webpack-plugin'); // 生成文件名，配合HtmlWebpackPlugin增加打包后dll的缓存
var CleanWebpackPlugin = require('clean-webpack-plugin'); //清空文件夹
var UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
    entry: {
        libs: [ 
            'axios',
            'react',
            'react-dom'
        ]
    },
    output: {
        path: path.resolve(__dirname, '../static'),
        filename: '[name].[chunkhash:7].js',
        library: '[name]_library'
    },
    plugins: [
        new webpack.DllPlugin({
            path: path.resolve(__dirname, '../static/[name]-mainfest.json'),
            name: '[name]_library',
            context: __dirname // 执行的上下文环境，对之后DllReferencePlugin有用
        }),
        new ExtractTextPlugin('[name].[contenthash:7].css'),
        new UglifyJsPlugin({
            uglifyOptions: {
                compress: {
                    warnings: false
                }
            },
            sourceMap: true,
            parallel: true
        }),
        new AssetsPlugin({
            filename: 'bundle-config.json',
            path: './static'
        }),
        new CleanWebpackPlugin(['static'], {
            root: path.join(__dirname, '../'), // 绝对路径
            verbose: true, // 是否显示到控制台
            dry: false, // 不删除所有
            exclude: ['img']
        }),
    ],
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: [{
                        loader: 'css-loader',
                        options: {
                            minimize: true //启用压缩
                        }
                    }]
                })
            }, {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                query: {
                    limit: 10000,
                    name: 'img/[name].[hash:7].[ext]'
                }
            }, {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                query: {
                    limit: 10000,
                    name: 'fonts/[name].[hash:7].[ext]'
                }
            }
        ]
    },
}
