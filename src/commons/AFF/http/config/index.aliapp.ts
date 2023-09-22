import { getEnvData } from "@/utils/util";

/**
 * 与接口请求相关的配置，从yml中整合存放
 */
export default function getConfig() {
  return {
    appid: getEnvData("ALIAPP_APP_ID"),
    host: `${getEnvData("HOST")}`,
    tokenErrorCode: getEnvData("TOKEN_ERROR_CODE"),
    appKey: getEnvData("ALIAPP_API_APP_KEY"), // 生成签名用的app_key
    appCode: getEnvData("ALIAPP_API_APP_CODE"), // 生成签名用的app_secret
  };
}
