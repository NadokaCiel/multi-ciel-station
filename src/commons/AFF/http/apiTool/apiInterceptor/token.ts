export function getTokenRequestInterceptor(
  getToken,
  options?: Record<string, any>,
) {
  return async function getTokenInterceptor(config: any) {
    try {
      const { data } = await getToken(options || {});
      if (data.token === null || typeof data.token === "undefined") {
        throw new TypeError("获取token失败");
      }
      config.headers["Authorization-Token"] = data.token;
      config.tokenInterceptData = data;
      return config;
    } catch (err) {
      let errMsg = err.errMsg;
      let status = err.status;
      if (err instanceof TypeError) {
        errMsg = err.toString();
        status = "SCRIPT_ERROR";
      }

      return Promise.reject({
        status,
        errMsg,
        config,
        headers: err.headers || {},
        data: {
          retcode: err.retcode,
          data: err.data,
          msg: err.msg,
        },
        response: null,
        extra: null,
      });
    }
  };
}

export function refreshTokenResponseInterceptor(isRefresh: boolean, getToken) {
  return async function refreshTokenInterceptor(res: any) {
    if (isRefresh) {
      try {
        const { data } = await getToken({
          isRefresh: true,
        });
        return Promise.reject({
          errCode: "RETRY_ERROR",
          /**
           * 需要合并到request中的数据
           */
          retryOptions: {
            headers: {
              "Authorization-Token": data.token,
            },
          },
          /**
           * 原始错误对象
           */
          ...(res || {}),
        });
      } catch (err) {
        return Promise.reject({
          status: err.status,
          errMsg: err.errMsg,
          config: null,
          headers: err.headers || {},
          data: {
            retcode: err.retcode,
            data: err.data,
            msg: err.msg,
          },
          response: res,
          extra: null,
        });
      }
    }
    return res;
  };
}
