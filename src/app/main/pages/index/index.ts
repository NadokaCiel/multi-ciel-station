import "./style";
import { PageBase } from "mini-program-base";
import { IData } from "./__interface__/vo";
import { getCommonHttp } from "@/commons/AFF/api/Common/Http";

export default class IndexView extends PageBase<IData> {
  data: IData = {
    welcomeStr: "Index Page",
  };

  onLoad(): void {
    console.log("onLoad: ", this);
    getCommonHttp().queryUserInfo();
  }
}

PageBase.render(new IndexView());
