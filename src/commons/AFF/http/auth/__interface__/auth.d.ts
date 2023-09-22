export declare namespace IAuth {
  /**
   * getToken方法使用
   *
   * login返回的字段类型声明
   */
  interface IAuthOriginData {
    token: string;
    unionid?: string;
    openid?: string;
    cu_id?: string;
  }

  interface IAuthData {
    token: string;
    openId: string;
    unionId?: string;
  }
}
