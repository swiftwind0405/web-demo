const path = require('path');
const autoPrefixer = require('autoprefixer');

const env = require('./env');

const themeVars = require('./theme');

const projectRoot = (module.exports.projectRoot = path.join(__dirname, '../'));
const srcRoot = (module.exports.srcRoot = path.join(projectRoot, 'src'));

module.exports.assetsRoot = path.join(projectRoot, 'assets');
module.exports.devOutputRoot = path.join(projectRoot, 'out');
module.exports.buildOutputRoot = path.join(projectRoot, 'dist');

module.exports.entry = {
  app: './entry/app.js',
};

const lessLoader = {
  loader: 'less-loader',
  options: {
    lessOptions: {
      javascriptEnabled: true,
      modifyVars: themeVars,
    },
  },
};

const createBabelLoader = function (isDev) {
  const plugins = isDev ? [] : [['import', { libraryName: 'antd', style: true }]];
  return {
    loader: 'babel-loader',
    options: {
      cacheDirectory: true,
      compact: false,
      presets: ['@babel/preset-env', '@babel/preset-react'],
      plugins: ['@babel/plugin-proposal-class-properties', ...plugins],
    },
  };
};

const createEslintLoader = function () {
  return {
    test: /\.(js|jsx)$/,
    loader: 'eslint-loader',
    enforce: 'pre',
    include: [path.join(__dirname, 'src')],
    options: {
      fix: true,
    },
  };
};

const createIfDefLoader = (module.exports.createIfDefLoader = function (options) {
  return {
    loader: 'ifdef-loader',
    options,
  };
});

module.exports.createJsRule = function (isDev, isMock) {
  return {
    test: /\.jsx?$/,
    exclude: /(node_modules|(NIM_Web_SDK.*\.js))/,
    include: [srcRoot],
    use: [
      createBabelLoader(isDev),
      createIfDefLoader({ ENV: env.ENV, MOCK: isMock }),
      // createEslintLoader,
    ],
  };
};

module.exports.createAntDLessRule = function (isDev, extractPluginLoader) {
  const antDLessRule = {
    test: /\.less$/,
    include: [
      path.resolve(projectRoot, 'node_modules', 'antd'),
      path.resolve(projectRoot, 'node_modules', '@ant-design'),
    ],
  };

  const postCssLoader = {
    loader: 'postcss-loader',
    options: {
      postcssOptions: {
        plugins: [autoPrefixer],
      },
    },
  };

  antDLessRule.use = [
    isDev ? 'style-loader' : extractPluginLoader,
    {
      loader: 'css-loader',
      options: {
        sourceMap: true,
      },
    },
    postCssLoader,
    lessLoader,
  ];

  return antDLessRule;
};

module.exports.createLessRule = function (isDev, extractPluginLoader) {
  const lessRule = {
    test: /\.less$/,
    exclude: path.resolve(projectRoot, 'node_modules'),
  };

  const cssLoader = {
    loader: 'css-loader',
    options: {
      url: false,
      sourceMap: true,
      modules: {
        mode: 'local',
        localIdentContext: path.resolve(__dirname, '../src'),
        localIdentName: isDev ? '[path][name]-[local]' : 'H[hash:base64:6]',
      },
    },
  };

  const postCssLoader = {
    loader: 'postcss-loader',
    options: {
      postcssOptions: {
        plugins: [autoPrefixer],
      },
    },
  };

  const styleResourcesLoader = {
    loader: 'style-resources-loader',
    options: {
      patterns: [path.join(srcRoot, 'less/variable.less'), path.join(srcRoot, 'less/mixin.less')],
      injector: (source, resources) => source + resources.map(({ content }) => content).join(''),
    },
  };

  lessRule.use = [
    'css-hot-loader',
    isDev ? 'style-loader' : extractPluginLoader,
    cssLoader,
    postCssLoader,
    lessLoader,
    styleResourcesLoader,
  ];

  return lessRule;
};

module.exports.createCssRule = function (isDev, extractPluginLoader) {
  const cssRule = {
    test: /\.css$/,
  };

  const cssLoader = {
    loader: 'css-loader',
    options: {
      url: false,
      sourceMap: true,
    },
  };

  const postCssLoader = {
    loader: 'postcss-loader',
    options: {
      postcssOptions: {
        plugins: [['autoprefixer']],
      },
    },
  };
  cssRule.use = [isDev ? 'style-loader' : extractPluginLoader, cssLoader, postCssLoader];

  return cssRule;
};

module.exports.createFontRule = function () {
  return {
    test: /\.(woff|woff2|eot|ttf)((\??.*)?|(\?\w+))$/,
    exclude: /node_modules/,
    include: [srcRoot],
    use: [
      {
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'font/[hash:6].[ext]',
        },
      },
    ],
  };
};

module.exports.resolve = {
  alias: {
    '@': srcRoot,
  },
};
