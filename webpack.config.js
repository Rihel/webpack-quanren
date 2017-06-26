const webpack = require('webpack');
const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const Browser = require('open-browser-webpack-plugin')

const ROOT = path.resolve(__dirname)
const map = require('./map');
let cliententry = {
    // 'vendor': ['plupload']
};
let htmlPlugin = [];


let serverentry = {

};

for (chunk in map.client) {
    cliententry[chunk] = map.client[chunk].src
    htmlPlugin.push(new htmlWebpackPlugin({
        alwaysWriteToDisk: true,
        filename: ROOT + '/dist/client/' + map.client[chunk].tpl,
        template: ROOT + '/views/client/' + map.client[chunk].tpl,
        chunks: ['common', chunk],

    }))
}
for (chunk in map.server) {
    serverentry[chunk] = map.server[chunk].src
    htmlPlugin.push(new htmlWebpackPlugin({
        alwaysWriteToDisk: true,
        filename: ROOT + '/dist/server/' + map.server[chunk].tpl,
        template: ROOT + '/views/server/' + map.server[chunk].tpl,
        chunks: ['common', chunk],
    }))
}
let baseConfig = {
    context: path.resolve(__dirname, './src'),
    entry: Object.assign(cliententry, serverentry),
    output: {
        filename: 'js/[name].js',
        path: path.resolve(__dirname, './dist/'),

    },
    resolve: {
        extensions: ['.js', '.scss'],
    },
    module: {
        rules: [{
            test: /\.js$/,
            // 跳过 node_modules 目录
            exclude: /node_modules/,
            loader: 'babel-loader',
            options: {
                // 缓存结果
                cacheDirectory: true
            }
        },
        {
            test: /\.css$/,
            use: [
                'style-loader', 'css-loader', 'postcss-loader'
            ]
        }, {
            test: /\.(sass|scss)$/,
            use: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: [{
                    loader: 'css-loader',
                    options: {
                        importLoaders: 1
                    }
                },
                {
                    loader: 'postcss-loader',
                    options: {
                        plugins: function () {
                            return [
                                require('autoprefixer')
                            ];
                        }
                    }
                },
                {
                    loader: 'sass-loader'
                },

                ]
            })
        },
        {
            // 处理图片文件
            test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
            loader: 'url-loader?name=img/[name].[ext]&limit=8192',

        },
        {
            // 处理字体文件
            test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
            loader: 'url-loader',
            options: {
                limit: 7186, // inline base64 if <= 7K
                name: 'css/fonts/[name].[ext]'
            }
        },

        ],
    },

    externals: {
        'jquery': 'window.jQuery',
    },
    plugins: htmlPlugin.concat([
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery',
            'window.$': 'jquery',
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'common',
            filename: 'js/[name].js',
            minchuck: 2
        }),

        new Browser()
    ])
}


let mode = process.env.NODE_ENV;

if (mode === 'dev') {
    baseConfig.devtool = 'source-map';
    baseConfig.devServer = {
        historyApiFallback: true,
        hot: true,
        inline: true,
        // host:"192.168.0.101"
    }
    baseConfig.plugins.push(
        new ExtractTextPlugin({
            filename: '[name].css',
            allChunks: true
        })
    )
} else if (mode === 'pros') {
    baseConfig.output = {
        filename: 'js/[name].[hash:4].js',
        path: path.resolve(__dirname, './dist/'),
    }
    baseConfig.plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
                drop_debugger: true,
                drop_console: true
            },
            except: ['$super', '$', 'exports', 'require']
        }), new ExtractTextPlugin({
            filename: '[name].[hash:8].css',
            allChunks: true
        })
    )
}



module.exports = baseConfig