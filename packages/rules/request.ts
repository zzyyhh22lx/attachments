import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { MessagePlugin } from 'tdesign-vue-next';
import qs from 'qs';
// import { setCookie } from '@/service/cookie';
// import { storeToRefs } from 'pinia';
import { tokenStore } from '@/store/modules/token';
import { camelToSnake } from './util';
import { GLOB_CONFIG } from '@/glob';
// import { GLOB_CONFIG } from '@/glob';
const excludeKeys = ['message', 'code', 'traceId', 'data'];
const tokenInfo  = tokenStore();
// const { PORTAL_TOKEN } =  storeToRefs(tokenInfo);
// eslint-disable-next-line
const pending = new Map();
// 添加请求
const addPending = (config: AxiosRequestConfig) => {
  const url = [
    config.method,
    config.url,
    qs.stringify(config.params),
    qs.stringify(config.data),
  ].filter((d => d)).join('&');
  // setCookie('RIO_TCOA_TICKET', ticket);
  // if(config.headers)
  // console.log('__ENV__', __ENV__);
  // const useRtxName =  !!(__ENV__ === 'test' || !__ENV__);
  // if (useRtxName) {
  //   config.headers = {
  //     ...config.headers,
  //     rtxName: GLOB_CONFIG.USERNAME !== '' ? GLOB_CONFIG.USERNAME : 'junepan',
  //   };
  // }
  // config.headers = {
  //   ...config.headers,
  //   // PORTAL_TOKEN,
  //   RIO_TCOA_TICKET: ticket,
  // };
  if (config.data) {
    config.data = {
      ...config.data,
      userName: config.data.userName || GLOB_CONFIG.USERNAME,
      // userName: 'joyredzou',
    };
  }

  config.cancelToken = config.cancelToken || new axios.CancelToken((cancel) => {
    if (!pending.has(url)) { // 如果 pending 中不存在当前请求，则添加进去
      pending.set(url, cancel);
    }
  });
};

// 移除请求
const removePending = (config: AxiosRequestConfig) => {
  const url = [
    config.method,
    config.url,
    qs.stringify(config.params),
    qs.stringify(config.data),
  ].join('&');
  if (pending.has(url)) { // 如果在 pending 中存在当前请求标识，需要取消当前请求，并且移除
    const cancel = pending.get(url);
    cancel(url);
    pending.delete(url);
  }
};

// 清空pending中的请求 (路由跳转时、清空请求)

export const clearPending = () => {
  for (const [url, cancel] of pending) {
    cancel(url);
  }
  pending.clear();
};

const showErrStatus = (status: number) => {
  let message = '';
  switch (status) {
    case 400:
      message = '请求错误(400)';
      break;
    case 401:
      message = '未授权，请重新登录(401)';
      break;
    case 403:
      message = '拒绝访问(403)';
      break;
    case 404:
      message = '请求出错(404)';
      break;
    case 408:
      message = '请求超时(408)';
      break;
    case 500:
      message = '服务器错误(500)';
      break;
    case 501:
      message = '服务未实现(501)';
      break;
    case 502:
      message = '网络错误(502)';
      break;
    case 503:
      message = '服务不可用(503)';
      break;
    case 504:
      message = '网络超时(504)';
      break;
    case 505:
      message = 'HTTP版本不受支持(505)';
      break;
    default:
      message = `连接出错(${status})!`;
  }
  return `${message}，请检查网络！`;
};

const inject = (service: any) => {
  // request拦截器
  // 请求拦截器
  service.interceptors.request.use((config: AxiosRequestConfig) => {
    removePending(config); // 在请求开始前，对之前的请求做检查取消操作
    addPending(config); // 将当前请求添加到 pending 中
    // 在这里做数据校验
    // 例如token
    // 在这里把驼峰全部转换成下划线
    // if (config.params) {
    //   config.params = snakeToCamel(config.params);
    // }
    // if (config.data) {
    //   config.data = snakeToCamel(config.data);
    // }
    // console.log('【请求拦截】：', config);
    // console.log('PORTAL_TOKEN', tokenInfo.PORTAL_TOKEN);
    config.headers = {
      ...config.headers,
      Authorization: tokenInfo.PORTAL_TOKEN,
    };
    return config;
  }, (error: any) => {
    // 错误抛到业务代码
    error.data = {};
    error.data.msg = '服务器异常！';
    return Promise.resolve(error);
  });

  // 响应拦截器
  service.interceptors.response.use((response: AxiosResponse<any, any>) => {
    // console.log('【响应拦截器】:', response);
    removePending(response); // 在请求结束后，移除本次请求
    const { status } = response;
    let msg = '';
    // if (status === 302) {
    //   window.location.href = `https://passport.woa.com/modules/passport/signin.ashx?url=${window.location.href}`; // 接口302重定向登录
    //   return;
    // }
    if (status < 200 || status >= 300) {
      // 处理http错误，抛到业务代码
      msg = showErrStatus(status);
      if (typeof response.data === 'string') {
        response.data = { msg };
      } else {
        response.data.msg = msg;
      }
    }
    if (response.data?.code === 1) {
      MessagePlugin.warning(response.data.msg);
    }
    if (response.data?.code && response.data?.code !== 1) {
      MessagePlugin.error(response.data.msg);
      throw response.data;
    }
    if (!Array.isArray(response.data.data)) {
      const keys = Object.keys(response.data).filter(d => !excludeKeys.includes(d));
      const tmp: Record<string, any> = {};
      keys.forEach((key) => {
        tmp[key] = response.data[key];
      });
      response.data.data = {
        ...response.data.data,
        ...tmp,
      };
    }
    const baseUrl = ['browseData', 'getDetail']; // 包含在baseUrl内的不会被转成驼峰
    const  isHump = !baseUrl.includes(response.config.url ? response.config.url.split('/')[response.config.url.split('/').length - 1] : '');
    if (isHump) {
      // return出来的response的data一定是驼峰的
      return camelToSnake(response.data.data);
    }
    // 非驼峰展示
    return response.data.data;
  }, (error: any) => {
    if (axios.isCancel(error)) {
      console.log(`repeated request: ${error.msg}`);
    } else {
      // handle error code
      // 错误抛到业务代码
      error.data = {};
      error.data.msg = error.response.data.msg ? error.response.data.msg : '请求超时或服务器异常，请检查网络！';
      MessagePlugin.error(error.data.msg);
    }
    return Promise.reject(error);
  });
};


const service = axios.create({
  /** 本地调试时，需要打开baseURL */
  // baseURL: 'http://127.0.0.1:30031/mock',
  // baseURL: GLOB_CONFIG.SERVICE_HOST,
  // baseURL: __ENV__ === 'dev' ? '/micro' : getPrefix(),
  timeout: 60000 * 10, // 请求超时事件 （10分钟）
  // withCredentials: true, // 允许携带cookie,要求后台设置cors
  // transformRequest: [(data) => {
  //     data = JSON.stringify(data)
  //     return data
  // }],
});

inject(service);

export default service;
