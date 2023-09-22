import BaseHttp from "./BaseHttp";
import { getPlatformPath } from "./apiTool/apiUrlReformer";
import { getHttpIns } from "./http";

/**
 * 提供多平台路由的统一处理
 */
export default class CrossHttp extends BaseHttp {
  protected getHttpIns(apiConfig) {
    return getHttpIns({
      [apiConfig?.apiRequestName]: {
        ...apiConfig,
        apiUrl: getPlatformPath(apiConfig?.apiUrl),
      },
    }).apis;
  }
}
