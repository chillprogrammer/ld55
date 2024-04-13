// webpack.config.js
'use strict';

const path = require('path');
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackObfuscator = require('webpack-obfuscator');


module.exports = {
    entry: {
        main: './src/index.ts'
    },
    output: {
        filename: '[name].[contenthash:8].js',
        path: path.resolve(__dirname, 'dist'),
        clean: true
    },
    optimization: {
        runtimeChunk: 'single',
        splitChunks: {
            chunks: 'all',
            minSize: 20000,
            maxSize: 30000,
            name: false
        }
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                enforce: 'post',
                use: {
                    loader: WebpackObfuscator.loader,
                    options: {
                        rotateStringArray: true
                    }
                },
                exclude: /node_modules/
            }

        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                { from: 'src/assets', to: 'assets' },
            ],
        }),
        new HtmlWebpackPlugin({
            title: "Game"
        }),
        new WebpackObfuscator(
            {
                rotateStringArray: true
            }, [])

    ]
};