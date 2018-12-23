const webpack = require('webpack')
const path = require('path')
const config = require('./config')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    css: {
        loaderOptions: {
            sass: {
                includePaths: [path.resolve(__dirname, 'node_modules')]
            }
        }
    },
    configureWebpack: {
        plugins: [
            new webpack.DefinePlugin({
                'process.env': {
                    NODE_ENV: JSON.stringify(process.env.NODE_ENV || config.dev.env.NODE_ENV),
                    CLIENT_ID: JSON.stringify(process.env.CLIENT_ID || config.dev.env.CLIENT_ID),
                    CALLBACK_URL: JSON.stringify(process.env.CALLBACK_URL || config.dev.env.CALLBACK_URL)
                }
            }),
            // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
            new webpack.HotModuleReplacementPlugin(),
            new webpack.NoEmitOnErrorsPlugin(),
            // https://github.com/ampedandwired/html-webpack-plugin
            new HtmlWebpackPlugin({filename: 'index.html', template: 'index.html', inject: true}),
            // new FriendlyErrorsPlugin()
        ]
    }

}