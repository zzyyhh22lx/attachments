const webpack = require('webpack');
const { merge } = require('webpack-merge');
const baseConfig = require('./webpack.base.conf');
const HttpProxyAgent = require('http-proxy-agent');

// 生成代理配置对象
const proxy = [
  '/ola/asset/api',
  '/ola/asset/metadata',
  '/ola/asset/middle',
  '/ola/asset/dam',
  '/ola/asset',
  '/ola/api',
  '/portal',
  '/common',
  '/admin',
  '/v1',
  '/monitor',
  '/metamart',
]; // 代理
const proxyTarget = 'https://d.ola.woa.com';

// const proxyTarget = '10.69.109.40:19200'
// const apiCloudOrigin = 'http://9.218.48.169:8080/test'; // 后台本地开发环境
// const apiCloudOrigin = 'http://9.218.40.140:8081' // 后台测试环境
const apiCloudOrigin = 'http://api-cloud.ola.oa.com/test';
const apiMicroProfile = 'http://data.ola.woa.com/test';
// const indicatorOrigin = '10.69.109.40:19200'
// const middleOrigin = 'http://tn.ola.oa.com';
// const middleOrigin = 'http://127.0.0.1:9050';
const customTarget = {
  '/ola/asset/api': apiCloudOrigin,
  '/ola/asset/dam': apiCloudOrigin,
  '/ola/asset/metadata': apiCloudOrigin,
  '/ola/asset/resource': apiCloudOrigin,
  // '/ola/asset/middle': middleOrigin,
  // '/ht-175-8980': 'http://11.185.144.175:8080',
  // '/ht-asset/ht-175-8980': 'http://11.185.144.175:8080',
  // '/ht-asset/ht-175-81': 'http://11.185.144.175:8081',
  // '/ht-175-81': 'http://11.185.144.175:8081',
  '/trpc': apiMicroProfile,
};
// 要被置空的路由前缀，如'/prefix' => ''
const pathClear = [];
const proxyObj = {};
proxy.forEach((value) => {
  proxyObj[value] = {
    target: customTarget[value] || proxyTarget, // 测试环境
    changeOrigin: true,
    secure: false,
    agent: new HttpProxyAgent('http://127.0.0.1:12639'),

    onProxyRes: (proxyRes) => {
      const cookies = proxyRes.headers['set-cookie'];
      const cookieRegex = /Path=\/XXX\//i;
      if (cookies) {
        const newCookie = cookies.map(function(cookie) {
          if (cookieRegex.test(cookie)) {
            return cookie.replace(cookieRegex, 'Path=/');
          }
          return cookie;
        });
        delete proxyRes.headers['set-cookie'];
        proxyRes.headers['set-cookie'] = newCookie;
      }
    },
    pathRewrite: {
      [`^${value}`]: pathClear.includes(value) ? '' : value,
    },
    logLevel: 'debug',
  };
});

const devConf = {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map', // cheap-module-eval-source-map
  optimization: {},
  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
  ],
  devServer: {
    host: '127.0.0.1',
    // host: '10.45.51.89',
    // host: devConfig.host,
    // port: devConfig.port,
    hot: true,
    hotOnly: false,
    proxy: {
      ...proxyObj,
      '/ht-asset/ht-175-80': {
        target: 'http://11.185.144.175:8080/', // 测试环境
        changeOrigin: true,
        // secure: false,
        pathRewrite: (path) => path.replace(/^\/ht-asset\/ht-175-80/, ''),
        // agent: new HttpProxyAgent('http://127.0.0.1:12639'),
      },
    },
    disableHostCheck: true,
    open: true, //  启动浏览器
    // 隐藏控制台打印
    clientLogLevel: 'none',
    // https: true
  },
};

module.exports = merge(baseConfig, devConf);
