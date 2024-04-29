const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
// const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ResourceHintWebpackPlugin = require('resource-hints-webpack-plugin');
const autoprefixer = require('autoprefixer');
const HappyPack = require('happypack');
// const friendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const WebpackBar = require('webpackbar');
const webpack = require('webpack');
// const { UnusedFilesWebpackPlugin } = require('unused-files-webpack-plugin');
const PreloadWebpackPlugin = require('preload-webpack-plugin');
const globConfig = require('./glob.config.js');
const MonacoWebpackPlugin = require('monaco-editor-esm-webpack-plugin');
const isDevMode = process.env.NODE_ENV === 'development';
// console.log('globConfig', globConfig);
// const glob = require('./glob.config');

// const publicPath = glob.APP_VERSION === 'smoba' ? '../' : '/ht-asset/';
const publicPath = '/ht-asset/';

module.exports = {
  node: {
    setImmediate: false,
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty',
  },
  entry: {
    app: path.resolve(__dirname, '../src/index.js'),
  },
  output: {
    // publicPath: '/ht-asset/',
    publicPath,
    path: path.resolve(__dirname, '../dist'),
    filename: '[name].[hash].js',
    sourceMapFilename: '[name].[hash].map',
    chunkFilename: '[name].[hash].js',
    libraryTarget: 'umd',
  },
  externals: {},
  stats: {
    children: false,
  },
  module: {
    noParse: /^(vue|vue-router|vuex|vuex-router-sync|lodash)$/,
    rules: [
      {
        test: /\.js$/,
        use: ['happypack/loader?id=babel'],
        exclude: [/node_modules/, /\.min\.js$/],
      },
      {
        test: /\.js/,
        enforce: 'pre',
        include: /node_modules[\\/]monaco-editor[\\/]esm/,
        use: MonacoWebpackPlugin.loader,
      },
      {
        test: /\.css$/,
        use: [
          isDevMode
            ? 'vue-style-loader'
            : {
                loader: MiniCssExtractPlugin.loader,
                options: {
                  // publicPath: '../',
                  publicPath,
                  filename: '[name].[contenthash].css',
                },
              },
          {
            loader: 'css-loader',
            options: { importLoaders: 1 },
          },
          'postcss-loader',
        ],
      },
      {
        test: /\.less$/,
        use: [
          isDevMode
            ? 'vue-style-loader'
            : {
                loader: MiniCssExtractPlugin.loader,
                options: {
                  // publicPath: '../',
                  publicPath,
                  filename: '[name].[contenthash].css',
                },
              },
          'css-loader',
          'postcss-loader',
          {
            loader: 'less-loader',
            options: { lessOptions: { javascriptEnabled: true } },
          },
          {
            loader: 'style-resources-loader',
            options: {
              patterns: [
                path.resolve(__dirname, '../src/asset/style/mixin.less'),
              ],
            },
          },
        ],
      },
      {
        test: /\.(png|jpe?g|gif|webp|woff2?|eot|otf|ttf)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: 'img/[name].[hash:8].[ext]',
              limit: 2000,
              esModule: false,
            },
          },
        ],
      },
      {
        // vue文件处理
        test: /\.vue$/,
        use: [
          {
            loader: 'cache-loader',
            options: {
              cacheIdentifier: '96e6c5e4',
            },
          },
          {
            loader: 'vue-loader',
            options: {
              loaders: {
                scss: [
                  isDevMode
                    ? 'vue-style-loader'
                    : {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                          publicPath: '../',
                          // publicPath,
                          filename: '[name].[contenthash].css',
                        },
                      },
                  'css-loader',
                  //   'sass-loader'
                ],
              },
              postcss: [autoprefixer()],
            },
          },
          {
            loader: 'iview-loader',
            options: {
              prefix: false, // iView 组件标签名都可以使用前缀 i-，例如 <i-row>
            },
          },
        ],
      },
      {
        test: /\.svg$/i,
        exclude: [path.resolve(__dirname, '../src/asset/svg/')],
        use: [
          {
            loader: 'url-loader',
            options: {
              name: 'img/[name].[hash:8].[ext]',
              limit: 2000,
              esModule: false,
            },
          },
        ],
      },
      {
        test: /\.svg$/i,
        include: [path.resolve(__dirname, '../src/asset/svg/')],
        use: [
          {
            loader: 'svg-sprite-loader',
            options: {
              spriteModule: path.resolve(__dirname, './svgBrowserSprite.js'),
              extract: false,
            },
          },
          'svgo-loader',
        ],
      },
    ],
  },
  resolve: {
    mainFields: ['main', 'browser'],
    extensions: ['.js', '.vue', '.json'],
    alias: {
      vue: 'vue/dist/vue.runtime.min.js',
      '@': path.resolve(__dirname, '../src'),
      asset: path.resolve(__dirname, '../src/asset'),
    },
  },
  performance: {
    hints: 'warning',
    // 入口起点的最大体积 整数类型（以字节为单位）
    maxEntrypointSize: 50000000,
    // 生成文件的最大体积 整数类型（以字节为单位 1000k）
    maxAssetSize: 100000000,
    // 只给出 js 文件的性能提示
    assetFilter(assetFilename) {
      return assetFilename.endsWith('.js');
    },
  },
  plugins: [
    // 传递NODE_ENV
    new webpack.DefinePlugin({
      GLOB_CONFIG: JSON.stringify(globConfig),
    }),
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
    }),
    new OptimizeCssAssetsPlugin({
      assetNameRegExp: /\.css\.*(?!.*map)$/g,
      cssProcessorOptions: {
        discardComments: {
          removeAll: true,
        },
        safe: true,
        autoprefixer: false,
      },
    }),
    new HappyPack({
      id: 'babel',
      loaders: ['babel-loader?cacheDirectory'],
    }),
    new HappyPack({
      id: 'url',
      loaders: [
        {
          loader: 'url-loader',
          options: {
            name: 'img/[name].[hash:8].[ext]',
            limit: 2000,
            esModule: false,
          },
        },
      ],
    }),
    // svg导出
    // new SpriteLoaderPlugin({
    //   plainSprite: true
    // }),
    new HtmlWebpackPlugin({
      inject: 'body',
      template: path.resolve(__dirname, '../src/index.html'),
      favicon: path.resolve(__dirname, '../src/asset/image/hetu-mini-logo.png'),
      minify: {
        collapseWhitespace: true,
        removeComments: true,
        minifyJS: true,
      },
      preload: ['**/vendor*.*'],
      prefetch: false,
    }),
    new ResourceHintWebpackPlugin(),
    // 资源预加载
    new PreloadWebpackPlugin({
      rel: 'preload',
      include: ['initial', 'app', 'home', 'index'],
    }),
    // new PreloadWebpackPlugin({
    //   rel: 'prefetch',
    //   include: 'asyncChunks'
    // }),
    // 预渲染
    // new PrerenderSPAPlugin({
    //   staticDir: path.join(__dirname, '../dist'),
    //   routes: [ '/', '/portal/home' ],
    // }),
    new WebpackBar(),
    new MonacoWebpackPlugin({
      languages: ['sql', 'mysql', 'python'],
      features: [
        'anchorSelect',
        'bracketMatching',
        'caretOperations',
        'clipboard',
        'codeAction',
        'codelens',
        'comment',
        'contextmenu',
        'coreCommands',
        'cursorUndo',
        'dnd',
        'documentSymbols',
        'find',
        'folding',
        'fontZoom',
        'gotoError',
        'gotoLine',
        'hover',
        'inPlaceReplace',
        'indentation',
        'inlayHints',
        'inlineCompletions',
        'inspectTokens',
        'linesOperations',
        'linkedEditing',
        'links',
        'multicursor',
        'parameterHints',
        'quickCommand',
        'quickHelp',
        'quickOutline',
        'referenceSearch',
        'rename',
        'smartSelect',
        'snippets',
        'suggest',
        'toggleHighContrast',
        'toggleTabFocusMode',
        'transpose',
        'unusualLineTerminators',
        'viewportSemanticTokens',
        'wordHighlighter',
        'wordOperations',
        'wordPartOperations',
        'format',
      ],
    }),
    // new UnusedFilesWebpackPlugin({
    //   root: '../src/', // 项目目录
    //   out: '../fileList.json', // 输出文件列表
    //   clean: false,// 删除文件
    // })
    // new friendlyErrorsWebpackPlugin(),
  ],
};
