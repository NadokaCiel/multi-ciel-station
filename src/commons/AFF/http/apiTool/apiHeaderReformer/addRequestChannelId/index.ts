export default function addRequestChannelId(config) {
  config.headers["X-Channel-Id"] = "1";
  // for validation
  config.headers["X-Author"] = "Ciel";
  return config;
}
