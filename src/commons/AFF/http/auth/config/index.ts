import { getEnvData } from "@/utils/util";

export default {
  appid: getEnvData("APP_ID"),
  url: `${getEnvData("HOST")}${getEnvData("AUTH_LOGIN_API")}`,
  env: "weapp",
  appKey: getEnvData("API_APP_KEY"), // 生成签名用的app_key
  appCode: getEnvData("API_APP_CODE"), // 生成签名用的app_secret
};
