import ReturnData from "return-data";
import CrossHttp from "../../http";
import { post } from "../../http/BaseHttp";
import getQueryUserInfoSchema, {
  IQueryUserInfoDO,
} from "./schema/queryUserInfo/getQueryUserInfoSchema";

class CommonHttp extends CrossHttp {
  @post("/wechat/miniapp/v1/userInfo", {
    schema: getQueryUserInfoSchema,
    skipSign: false,
    requireToken: false,
  })
  async queryUserInfo(): Promise<
    [ReturnData<IQueryUserInfoDO>, typeof ReturnData]
    > {
    return [ReturnData.success(null), ReturnData];
  }
}

export function getCommonHttp() {
  return new CommonHttp();
}
