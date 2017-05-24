const webpack = require('webpack');
const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');


module.exports = {
    context: path.resolve(__dirname, './src'),
    entry: {
        app: './app.js',
        
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, './dist/'),

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
                    'style-loader', 'css-loader?importLoaders=1', 'postcss-loader'
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
                loader: 'url-loader',
                options: {
                    limit: 7186, // inline base64 if <= 7K
                    name: 'static/images/[name].[ext]'
                }
            },
            {
                // 处理字体文件
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 7186, // inline base64 if <= 7K
                    name: 'static/fonts/[name].[ext]'
                }
            }
        ],
    },
    devServer: {
        historyApiFallback: true,
        hot: true,
        inline: true,
    
    },






    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery'
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'common',
            filename: '[name].js'
        }),
        
        new htmlWebpackPlugin({
            title: '111'
        }),
        new ExtractTextPlugin({
            filename: 'css/[name].css',
            allChunks: true
        }),
        new webpack.LoaderOptionsPlugin({
            options: {
                postcss: function () {
                    return [
                        require("autoprefixer")({
                            browsers: ['ie>=8', '>1% in CN']
                        })
                    ]
                }
            }
        })
    ]
}