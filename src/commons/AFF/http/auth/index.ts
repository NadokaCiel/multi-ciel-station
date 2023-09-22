import { creatMiniAuth, getToken } from "mini-auth-v1";
import config from "./config";
import { IAuth } from "./__interface__/auth";

const auth = creatMiniAuth<IAuth.IAuthOriginData>({
  appid: config.appid,
  url: config.url, // 此处为服务端获取ticket的接口url
  appKey: config.appKey, // 生成签名用的app_key
  appCode: config.appCode, // 生成签名用的app_secret
  env: config.env as Parameters<typeof creatMiniAuth>[0]["env"], // 目前支持微信小程序(weapp)、支付宝小程序(aliapp);
});

auth.setTokenExpires(3200 * 1000);

export default auth;

/**
 * 获取token数据
 */
export async function getAuthData(
  opts?: IMiniAuthGetTokenOptions,
): Promise<IGetTokenReturn<IAuth.IAuthData>> {
  const result = await getToken<IAuth.IAuthOriginData>(opts);
  return {
    expires: result.expires,
    expirationTime: result.expirationTime,
    data: {
      token: result?.data?.token ?? "",
      openId: result?.data?.openid ?? result?.data?.cu_id ?? "",
      unionId: result?.data?.unionid ?? result?.data?.cu_id ?? "",
    },
  };
}
