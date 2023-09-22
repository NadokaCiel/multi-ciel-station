import { sha256 } from "hash.js";

export function signInterceptor(appKey: string, appCode: string) {
  return function interceptor(config: any): any {
    const signData: any = {};
    Object.keys(config.data || {}).forEach((item) => {
      const val = config.data[item];
      if (val !== null && typeof val !== "undefined") {
        signData[item] = val;
      }
    });

    config.headers["Authorization-AppKey"] = appKey;
    config.headers["Authorization-Sign"] = sha256()
      .update(
        `${appKey}${JSON.stringify(signData)}${
          config.headers["Authorization-Token"] || ""
        }${appCode}`,
      )
      .digest("hex");
    if (config.data === null || typeof config.data === "undefined") {
      config.data = {};
    }
    return config;
  };
}
