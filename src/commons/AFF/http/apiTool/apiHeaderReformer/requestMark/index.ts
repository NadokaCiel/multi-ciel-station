/**
 * 在header头增加请求凭证，可以品牌名-平台-时间戳+随机字串的形式生成
 * @param config api配置
 * @returns
 */
export function requestMark(config) {
  config.headers["C-Request-Id"] = `Ciel-Lab-WeApp-${
    +new Date() + Math.random().toString(16).slice(2)
  }`;
  config.headers["channel"] = "WeApp";
  return config;
}
