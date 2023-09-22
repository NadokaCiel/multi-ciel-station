import ApiHttp from "applets-request-mode-list";
import { getAuthData } from "./auth";
import { headerReformer } from "./apiTool/apiHeaderReformer";
import getConfig from "./config";
import { signInterceptor } from "./apiTool/apiInterceptor/sign";
import {
  getTokenRequestInterceptor,
  refreshTokenResponseInterceptor,
} from "./apiTool/apiInterceptor/token";
import {
  responseFormatter,
  responseErrorFormatter,
} from "./apiTool/apiInterceptor/response";

const httpConfig = getConfig();

export function getHttpIns(
  apiList: Record<string, any>,
  baseURL = httpConfig.host,
) {
  const api = new ApiHttp(
    {
      baseURL,
      apiList,
    },
    {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    },
  );

  api.appletsRequest.defaults.timeout = 10000;

  // 添加请求时间
  api.addRequestInterceptor((config) => {
    try {
      if (!config.headers) {
        config.headers = Object.create(null);
      }
      config.headers.requestTime = String(Date.now());
    } catch (e) {
      console.error(e);
    }
    return config;
  });

  // 添加签名拦截器
  api.addRequestInterceptor((config) => {
    if (config.apiConfig.skipSign === true) {
      return config;
    }
    const interceptor = signInterceptor(httpConfig.appKey, httpConfig.appCode);
    return interceptor(config);
  });

  // 添加获取token拦截器
  api.addRequestInterceptor(async(config) => {
    console.log("添加获取token拦截器: ", config);
    if (config.apiConfig.requireToken === false) {
      return config;
    }
    const interceptor = getTokenRequestInterceptor(getAuthData);
    // 执行 interceptor(config) 后，会在 config.tokenInterceptData 中增加 getToken 获取到的原始数据
    // 按需使用tokenInterceptData中的数据
    const intercept = await interceptor(config);
    return intercept;
  });

  // 添加响应时间
  api.addResponseInterceptor(
    (res) => {
      try {
        if (!res.headers) {
          res.headers = Object.create(null);
        }
        res.headers.responseTime = String(Date.now());
        res.headers.timeConsuming =
          Date.now() - Number(res.config.headers?.requestTime || Date.now());
      } catch (e) {
        console.error(e);
      }
      return res;
    },
    (err) => {
      try {
        if (!err.headers) {
          err.headers = Object.create(null);
        }
        err.headers.responseTime = String(Date.now());
        err.headers.timeConsuming =
          Date.now() - Number(err.config.headers?.requestTime || Date.now());
      } catch (e) {
        console.error(e);
      }
      return Promise.reject(err);
    },
  );

  // 添加更新token拦截器
  api.addResponseInterceptor((res) => {
    const isRetry = httpConfig?.tokenErrorCode?.includes(res?.data?.code);
    if (typeof isRetry !== "boolean" || !isRetry) {
      return res;
    }

    const interceptor = refreshTokenResponseInterceptor(
      // 需要更新token的错误码
      isRetry,
      getAuthData,
    );

    return interceptor(res);
  });

  // 格式化输出请求返回数据
  api.addResponseInterceptor(responseFormatter);

  /**
   * 格式化错误信息
   */
  api.addResponseInterceptor((res) => res, responseErrorFormatter);

  /**
   * 对api配置细项做通用封装，如：header头的渠道/请求id
   */
  return headerReformer(api);
}
