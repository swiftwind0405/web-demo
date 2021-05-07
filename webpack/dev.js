const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const common = require('./common');

const NODE_ENV = 'development';

const assetsRoot = common.assetsRoot;
const srcRoot = common.srcRoot;
const outputRoot = common.devOutputRoot;

module.exports = {
  mode: 'development',

  context: srcRoot,

  devtool: 'eval-source-map',

  entry: common.entry,

  output: {
    path: outputRoot,
    filename: '[name].js',
  },

  module: {
    rules: [
      common.createJsRule(true, false),
      common.createAntDLessRule(true, null),
      common.createLessRule(true, null),
      common.createCssRule(true, null),
    ],
  },

  resolve: common.resolve,

  resolveLoader: common.resolveLoader,

  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../assets/index.html'),
      publicPath: '/',
    }),
    new webpack.EnvironmentPlugin({ NODE_ENV: NODE_ENV }),
    new webpack.ProvidePlugin({
      React: 'react',
    }),
  ],

  devServer: {
    port: '3100',
    open: true,
    hot: true,
    contentBase: [assetsRoot, outputRoot],
    compress: true,
    historyApiFallback: true,
  },
};
