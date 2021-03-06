const path = require('path');

const pathTo = function (src) {
    return path.resolve(__dirname, src);
}

module.exports = {
    dev: {
        // Paths
        assetsSubDirectory: 'static',
        assetsPublicPath: '/',
        // Various Dev Server settings
        host: '192.168.60.49', // can be overwritten by process.env.HOST
        port: 8080, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
        autoOpenBrowser: false,
        errorOverlay: true,
        notifyOnErrors: true,
        poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-
        proxyTable: {},
        // Use Eslint Loader?
        // If true, your code will be linted during bundling and
        // linting errors and warnings will be shown in the console.
        useEslint: true,
        // If true, eslint errors and warnings will also be shown in the error overlay
        // in the browser.
        showEslintErrorsInOverlay: false,

        /**
         * Source Maps
         */

        // https://webpack.js.org/configuration/devtool/#development
        devtool: 'inline-source-map',

        // If you have problems debugging vue-files in devtools,
        // set this to false - it *may* help
        // https://vue-loader.vuejs.org/en/options.html#cachebusting
        cacheBusting: true,

        cssSourceMap: true
    },
    prod: {
        // Template for index.html
        index: path.resolve(__dirname, '../dist/index.html'),

        // Paths
        assetsRoot: path.resolve(__dirname, '../dist'),
        assetsSubDirectory: 'static',
        assetsPublicPath: '/',

        /**
         * Source Maps
         */

        productionSourceMap: true,
        // https://webpack.js.org/configuration/devtool/#production
        devtool: '#source-map',

        // Gzip off by default as many popular static hosts such as
        // Surge or Netlify already gzip all static assets for you.
        // Before setting to `true`, make sure to:
        // npm install --save-dev compression-webpack-plugin
        productionGzip: false,
        productionGzipExtensions: ['js', 'css'],

        // Run the build command with an extra argument to
        // View the bundle analyzer report after build finishes:
        // `npm run build --report`
        // Set to `true` or `false` to always turn it on or off
        bundleAnalyzerReport: process.env.npm_config_report,
        maxEntrypointSize: 250000
    },
    common: {
        // multi or single
        // put html in template while select multi
        // put index.html in root while select single
        mode: 'multi',
        entryPoint: [
            {
                filename: pathTo('../dist/main.html'),
                template: pathTo('../template/index.html'),
                inject: true,
                chunks: ['app']
            },
            {
                filename: pathTo('../dist/index.html'),
                template: pathTo('../template/entry/index.html'),
                inject: true,
                chunks: ['app']
            },
            {
                filename: pathTo('../dist/index.1.html'),
                template: pathTo('../template/entry/index.1.html'),
                inject: true,
                chunks: ['app2']
            }
        ]
    }
}