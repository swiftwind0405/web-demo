const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const common = require('./common');

const NODE_ENV = 'production';

const assetsRoot = common.assetsRoot;
const srcRoot = common.srcRoot;
const outputRoot = common.buildOutputRoot;
const extractPluginLoader = MiniCssExtractPlugin.loader;

module.exports = {
  mode: 'production',

  context: srcRoot,

  entry: common.entry,

  output: {
    filename: `js/[name]-[hash:6].js`,
    chunkFilename: `js/chunk-[name]-[hash:6].js`,
    path: outputRoot,
  },

  module: {
    rules: [
      common.createJsRule(false, false),
      common.createAntDLessRule(false, extractPluginLoader),
      common.createLessRule(false, extractPluginLoader),
      common.createCssRule(false, extractPluginLoader),
    ],
  },

  resolve: common.resolve,

  resolveLoader: common.resolveLoader,

  optimization: {
    splitChunks: {
      chunks: 'all',// 指明要分割的插件类型, async:异步插件(动态导入),inital:同步插件,all：全部类型
      minSize: 20000,// 文件最小大小,单位bite;即超过minSize有可能被分割；
      minRemainingSize: 0,// webpack5新属性，防止0尺寸的chunk
      minChunks: 1,
      maxAsyncRequests: 30,// webpack4,5区别较大
      maxInitialRequests: 30,// webpack4,5区别较大
      enforceSizeThreshold: 50000,
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          reuseExistingChunk: true
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    },
    minimize: true,
    minimizer: [
      // This is only used in production mode
      new TerserPlugin({
        terserOptions: {
          parse: {
            // we want terser to parse ecma 8 code. However, we don't want it
            // to apply any minfication steps that turns valid ecma 5 code
            // into invalid ecma 5 code. This is why the 'compress' and 'output'
            // sections only apply transformations that are ecma 5 safe
            // https://github.com/facebook/create-react-app/pull/4234
            ecma: 8,
          },
          compress: {
            ecma: 5,
            warnings: false,
            // Disabled because of an issue with Uglify breaking seemingly valid code:
            // https://github.com/facebook/create-react-app/issues/2376
            // Pending further investigation:
            // https://github.com/mishoo/UglifyJS2/issues/2011
            comparisons: false,
            // Disabled because of an issue with Terser breaking valid code:
            // https://github.com/facebook/create-react-app/issues/5250
            // Pending futher investigation:
            // https://github.com/terser-js/terser/issues/120
            inline: 2,
          },
          mangle: {
            safari10: true,
          },
          format: {
            ecma: 5,
            comments: false,
            // Turned on because emoji and regex is not minified properly using default
            // https://github.com/facebook/create-react-app/issues/2488
            ascii_only: true,
          },
          format: {
            comments: false,
          },
        },
        extractComments: false,
        // Use multi-process parallel running to improve the build speed
        // Default number of concurrent runs: os.cpus().length - 1
        parallel: true,
      }),
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../assets/index.html'),
      publicPath: '/',
      minify: false,
    }),
    new webpack.EnvironmentPlugin({ NODE_ENV: NODE_ENV }),
    new webpack.ProvidePlugin({
      React: 'react',
    }),
    new MiniCssExtractPlugin({
      filename: '[name]-[contenthash:6].css',
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          context: assetsRoot,
          from: '**/*',
        },
      ]
    }),
    // new webpack.optimize.AggressiveMergingPlugin(),
  ],
};
