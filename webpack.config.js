const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const path = require('path');

module.exports = {
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      }
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },

  plugins: [
    new HtmlWebpackPlugin({
      title: 'our project',
      template: 'src/index.html'
    })
  ],
  plugins: [
    new CopyWebpackPlugin({
        patterns: [
            { from: 'src/assets', to: 'assets' },
        ],
    }),
    new HtmlWebpackPlugin({
        title: "Game"
    })
],
  devServer: {
    static: path.join(__dirname, "dist"),
    compress: true,
    port: 4000,
  },

};
