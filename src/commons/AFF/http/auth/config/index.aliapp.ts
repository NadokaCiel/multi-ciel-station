import { getEnvData } from "@/utils/util";

export default {
  appid: getEnvData("ALIAPP_APP_ID"),
  url: `${getEnvData("HOST")}${getEnvData("ALIAPP_AUTH_LOGIN_API")}`,
  env: "aliapp",
  appKey: getEnvData("ALIAPP_API_APP_KEY"),
  appCode: getEnvData("ALIAPP_API_APP_CODE"),
};
