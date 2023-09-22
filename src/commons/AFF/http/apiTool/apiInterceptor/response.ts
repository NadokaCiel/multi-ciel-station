export function responseFormatter(res: any) {
  const data = res && res.data ? res.data : {};
  const code = data.code;
  data.status = res.status;

  if (code !== 200) {
    return Promise.reject(data);
  }
  return data;
}

/**
 * 格式化错误信息
 * @param error
 * @returns
 */
export function responseErrorFormatter(error: any) {
  if (!error) {
    return Promise.reject({
      status: -1,
      code: null,
      msg: "网络异常，请稍后重试。",
      data: null,
      extra: { errMsg: "error参数不存在" },
    });
  }
  const apiLibError = ["NETWORK_ERROR", "TIMEOUT", "SCRIPT_ERROR"];

  if (apiLibError.includes(error.status) || Number(error.status) !== 200) {
    return Promise.reject({
      status: error.status,
      code: null,
      msg: "网络异常，请稍后重试。",
      data: null,
      extra: error.extra,
    });
  }

  return Promise.reject(error);
}
