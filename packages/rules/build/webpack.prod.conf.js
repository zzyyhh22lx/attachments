// const PrerenderSPAPlugin = require('prerender-spa-plugin');
// const Renderer = PrerenderSPAPlugin.PuppeteerRenderer;
// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
// import glob from './glob.config';
const { merge } = require('webpack-merge');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// const path = require('path');
const webpack = require('webpack');
const baseConfig = require('./webpack.base.conf');
const AutoDllPlugin = require('autodll-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const cacheList = require('./cacheList.js');

const { GenerateSW } = require('workbox-webpack-plugin');
const glob = require('./glob.config');

console.log('gbl', glob);
// const env = process.env.NODE_ENV;

const chunkSet = new Set();
const nameLength = 4;
// const publicPath = glob.APP_VERSION === 'smoba' ? './' : '/ht-asset/';
const publicPath = '/ht-asset/';

const manifestEntries = cacheList.map((url) => ({ url, revision: null }));

const proConf = {
  mode: 'production',
  devtool: false,
  output: {
    filename: '[name].[chunkhash].js',
    sourceMapFilename: '[name].[chunkhash].map',
    chunkFilename: '[name].[chunkhash].js',
    // publicPath: './',
    publicPath,
  },
  optimization: {
    runtimeChunk: 'single',
    namedModules: true,
    namedChunks: true,
    minimize: true,
    minimizer: [
      new TerserPlugin({
        minify: TerserPlugin.esbuildMinify,
        exclude: [/\/node_modules/, /\.min\.js$/],
        parallel: 2,
        cache: true,
        sourceMap: false,
      }),
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.HashedModuleIdsPlugin(),
    new webpack.NamedChunksPlugin((chunk) => {
      if (chunk.name) {
        return chunk.name;
      }
      const modules = Array.from(chunk.modulesIterable);
      if (modules.length >= 1) {
        const hash = require('hash-sum');
        const joinedHash = hash(modules.map((m) => m.id).join('_'));
        let len = nameLength;
        while (chunkSet.has(joinedHash.substr(0, len))) {
          len++;
        }
        chunkSet.add(joinedHash.substr(0, len));
        return `chunk_${joinedHash.substr(0, len)}`;
      }
      return modules[0].id;
    }),
    new AutoDllPlugin({
      inject: true,
      filename: '[name].dll.[hash].js',
      path: './dll',
      context: __dirname,
      entry: {
        vendor: [
          'axios',
          'vue/dist/vue.runtime.min.js',
          'vue-router',
          'vuex',
          // 'view-design',
          '@tencent/beacon-web-sdk',
          // './src/lib/module/d3-vue.umd.min.js',
        ],
        vendor_lib: ['view-design'],
      },
    }),
    // 静态资源离线缓存
    new GenerateSW({
      swDest: 'sw.js',
      exclude: [/.(?:png|jpg|jpeg|webp|map|txt|woff|woff2|svg|ttf|eot|html)$/],
      additionalManifestEntries: manifestEntries,
      cleanupOutdatedCaches: true,
      skipWaiting: true,
      clientsClaim: true,
      // include: [/vendor\.dll\..+\.js$/],
      inlineWorkboxRuntime: true,
      maximumFileSizeToCacheInBytes: 5000000,
      importScripts: ['https://cos.ola.qq.com/swHandler-e2760975.js'],
      // chunks: ['dll/vendor.dll'],
      // runtimeCaching: [
      //   {
      //     urlPattern: /.(?:png|jpg|jpeg|webp|woff|woff2|svg|ttf|eot)$/,
      //     // Apply a cache-first strategy.
      //     handler: 'CacheFirst',

      //     options: {
      //       expiration: {
      //         maxAgeSeconds: 60 * 60 * 24 * 14,
      //         // maxEntries: 50
      //       },
      //     },
      //   },
      // ],
      // globPatterns: '**/*.{js,css}',
    }),
    // 包大小分析
    // new BundleAnalyzerPlugin(),
    // pre-render
    // new PrerenderSPAPlugin({
    //   staticDir: path.join(__dirname, '../dist'),
    //   routes: ['/#/portal/home'],

    //   renderer: new Renderer({
    //     inject: {
    //       foo: 'bar',
    //     },
    //     headless: true,
    //     // 差不多是首页网络报错信息的时间
    //     renderAfterTime: 3000,
    //     args: ['--user-agent=prerender'],
    //   }),
    // }),
  ],
};
module.exports = merge(baseConfig, proConf);
