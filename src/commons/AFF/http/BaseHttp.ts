import DataModel from "data-model-service";
import ReturnData from "return-data";

type IHttpConfig = Pick<IAppletsApi.IApiItem, "interval" | "retryTimes">;

const DEFAULT_ERR_MSG = "系统请求异常，请稍后再试";

function awaitWrap<T, U = any>(
  promise: Promise<T>,
): Promise<[U | null, T | null]> {
  return promise
    .then<[null, T]>((data: T) => [null, data])
    .catch<[U, any]>((err) => [err, { data: null }]);
}

function isInvalidData(data: any) {
  if (typeof data === "undefined" || data === null) {
    return true;
  }

  return false;
}

function isFunction(func) {
  return typeof func === "function";
}

function filterData<IReturn = any, IOptions = Record<string, any>>(
  data: IOptions,
): IReturn {
  if (isInvalidData(data)) {
    return Object.create(null);
  }

  try {
    return Object.keys(data)?.reduce((pre, property) => {
      if (isInvalidData(data[property])) {
        return pre;
      }
      pre[property] = data[property];
      return pre;
    }, {}) as unknown as IReturn;
  } catch (e) {
    console.error(e);
    return Object.create(null);
  }
}

/**
 * 用作api请求的post装饰器
 * @param url api路由
 * @param apiConfig 额外的api配置, 可传入schema
 * @param options 可传入schema和返回类型1
 * @returns
 */
export function post(
  url: string,
  apiConfig?: Optional<IHttpConfig> & { schema?: any; [key: string]: any },
) {
  return function postDec(
    target: any,
    propertyName: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalFn = descriptor.value;

    descriptor.value = async function newFn(...opts: any[]) {
      let onUrl = null;
      let requestData: any = Object.create(null);
      let onResponse = null;
      let onData = null;
      let onReturn = null;
      await originalFn?.apply?.(
        Object.assign(this, {
          onUrl(callback: (url: string) => string) {
            onUrl = callback;
          },
          putData(params: any) {
            requestData = params;
          },
          setReqData(params: any) {
            requestData = params;
          },
          onResponse(
            callback: <IResData = any>(
              data: IResData,
            ) => [ReturnData, typeof ReturnData],
          ) {
            onResponse = callback;
          },
          onData(callback: (data: any) => any) {
            onData = callback;
          },
          onReturn(callback: (data: any) => any) {
            onReturn = callback;
          },
        }),
        opts,
      );

      /**
       * 如需要对url进行修饰，通过onUrl进行处理
       */
      let newUrl = url;
      if (isFunction(onUrl)) {
        newUrl = onUrl(url);
      }

      /**
       * 仅在接口调用时，再临时组装http实例挂载apiList，节省内存，提升性能
       */
      const https = (this as any).getHttpIns({
        apiRequestName: propertyName,
        apiUrl: newUrl,
        method: "post",
        ...(apiConfig || {}),
        schema: null,
      });

      console.log("apiConfig", apiConfig);
      console.log("https", https);

      const [err, result]: any[] = await awaitWrap(
        /* aff-mock-request */
        https[propertyName]({
          data: filterData(requestData),
        }),
      );

      if (isFunction(onResponse)) {
        return onResponse([err, result]);
      }

      let resData = result?.data ?? err?.data ?? Object.create(null);

      // 处理schema
      const resSchema = apiConfig?.schema;
      if (isFunction(onData) && !resSchema) {
        resData = onData(resData);
      }

      if (resSchema) {
        const schema = isFunction(resSchema) ? (resSchema as any)() : resSchema;
        resData = new DataModel(schema).parse(resData);
      }

      // 获取ReturnDataType
      const IReturnDataType = ReturnData;

      if (IReturnDataType.isNetWorkError(err)) {
        return [
          IReturnDataType.networkError(err?.msg || DEFAULT_ERR_MSG),
          IReturnDataType,
        ];
      }

      if (err) {
        const returnData = IReturnDataType.exception(
          new IReturnDataType(
            ReturnData.fail().getStatus(),
            resData,
            err?.msg || DEFAULT_ERR_MSG,
          ),
        );
        returnData.setExtraData({
          code: err?.code,
        });

        if (isFunction(onReturn)) {
          return onReturn([returnData, IReturnDataType]);
        }
        return [returnData, IReturnDataType];
      }

      if (isFunction(onReturn)) {
        return onReturn([IReturnDataType.success(resData), IReturnDataType]);
      }
      return [IReturnDataType.success(resData), IReturnDataType];
    };
  };
}

export default class BaseHttp {
  private requestData: any = null;

  /**
   * 拦截url的设置，在设置接口路由之前提供方法进行修饰，入参为原先声明的url
   * @param callback
   */
  protected onUrl(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    callback: (url: string) => string,
  ) {
    //
  }

  /**
   * 设置请求参数
   * @param data
   */
  protected putData<IPutData = any>(data: IPutData) {
    this.requestData = data;
  }

  /**
   * 设置请求参数
   * @param data
   */
  protected setReqData<IPutData = any>(data: IPutData) {
    this.requestData = data;
  }

  /**
   * 处理返回数据，可通过onData方法对源数据进行整理，也可提供options.schema由内部处理
   * @param schema
   * @param callback
   */
  protected onData<ISchemaData = any, IResData = any>(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    callback: (data: IResData) => ISchemaData,
  ) {
    //
  }

  /**
   * 拦截响应处理，在http请求执行后若有定义onResponse方法，则直接返回
   * @param schema
   * @param callback
   */
  protected onResponse<ISchemaData = any, IResData = any>(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    callback: (data: IResData) => [ReturnData<ISchemaData>, typeof ReturnData],
  ) {
    //
  }

  /**
   * 拦截返回
   * @param schema
   * @param callback
   */
  protected onReturn<IResData = any>(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    callback: (
      params: [ReturnData<IResData>, typeof ReturnData],
    ) => [ReturnData<IResData>, typeof ReturnData],
  ) {
    //
  }

  /**
   * 获取接口请求实例，需在具体的[模块]Http Class中指定基础http实例的构造方式
   * @param apiConfig
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected getHttpIns(apiConfig) {
    throw new Error(
      "未在子类中实现 getHttpIns 方法【not implement getHttpIns】",
    );
  }
}
