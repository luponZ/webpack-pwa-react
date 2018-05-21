const path = require('path');
const webpack = require('webpack');
const dllConfig = require('./webpack.config.dll');

const chalk = require('chalk')
const rm = require('rimraf')
const ora = require('ora')
const spinner = ora({
    color: 'green',
    text: '正为生产环境打包dll包...'
})
spinner.start()
rm(path.resolve(__dirname, '../public'), err => {
    if (err) throw err
    webpack(dllConfig, function (err, stats) {
        spinner.stop()
        if (err) throw err
        process.stdout.write(stats.toString({
            colors: true,
            modules: true,
            children: false,
            chunks: false,
            chunkModules: false
        }) + '\n\n')

        console.log(chalk.cyan('  dll打包完成.\n'))
    })
});
