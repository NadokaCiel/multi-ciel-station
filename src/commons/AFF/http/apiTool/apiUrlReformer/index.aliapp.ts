export function getPlatformPath(url) {
  let path = url;
  if (path.includes("/wechat")) {
    path = path.replace(/^\/wechat/, "/alipay");
  }
  return path;
}
