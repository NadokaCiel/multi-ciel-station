import addRequestChannelId from "./addRequestChannelId/index";
import { requestMark } from "./requestMark/index";

export function headerReformer(http) {
  http.addRequestInterceptor(requestMark);
  http.addRequestInterceptor(addRequestChannelId);
  return http;
}
