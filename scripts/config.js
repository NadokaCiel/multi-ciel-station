const { join } = require("path");
const jsonfile = require("jsonfile");
const projectConfig = require("./project.config");
const envData = require("./getEnvData");
const autoImportGlobalLib = require("./global/globalPlugin");
const { getSuffixConfig, getEntry, isMockEnv } = require("ziu-server/lib/configUtils");

const root = "src";
const suffixConfig = getSuffixConfig();
const platform = process.env.ZIU_BUILD_PLATFORM;

module.exports = {
  title: jsonParse(envData).APP_TITLE || "",
  root,
  mode: process.env.PRJ_ENV,
  id: jsonParse(envData).APP_ID || "",
  entry: getEntry(),
  entrySuffix: {
    ...suffixConfig.entrySuffix,
  },
  compiledSuffix: {
    ...suffixConfig.compiledSuffix,
  },
  script: {
    useBabelInTS: true,
    babelPresetsModules: "commonjs",
    useLogBeautify: true,
    babelPlugins: isMockEnv() ? ["babel-plugin-aff-mock"] : [],
  },
  alias: {},
  dist: getDist(),
  globalObject: suffixConfig.global,
  commonsDir: "build~commons",
  useSourceMap: true,
  useCache: process.env.PRJ_ENV === "development" ? true : false,

  envData,

  mergeProjectConfig: true,
  projectConfigName: platform === "aliapp" ? "mini.project.json" : "project.config.json",
  projectConfigPath: join(getDist(), platform === "aliapp" ? "mini.project.json" : "project.config.json"),
  otherConfig: [{
    from: join(getDist(), "project.private.config.json"),
    to: join(sourceRoot(root), "project.private.config.json"),
  },
  {
    from: join(getDist(), "sitemap.json"),
    to: join(sourceRoot(root), "sitemap.json"),
  }],
  /**
   * 小程序项目配置文件
   */
  projectConfig,

  envList: {
    development: true,
    testing: true,
    staging: true,
    production: true,
  },

  /**
   * 是否使用默认的process polyfill
   */
  process: true,

  polyfill: {
    node: true,
  },

  fallback: {},

  plugins: [miniProgramSourceMap, ...autoImportGlobalLib(process.env.ZIU_BUILD_PLATFORM).plugins],
  ignoreEntry: ["^plugin://", "^antd-mini-rpx"],
  subPackagesName: "subPackages",
};

function getDist() {

  const distList = {
    development: `dist/dev/${process.env.ZIU_BUILD_PLATFORM}`,
    testing: `dist/testing/${process.env.ZIU_BUILD_PLATFORM}`,
    staging: `dist/staging/${process.env.ZIU_BUILD_PLATFORM}`,
    production: `dist/release/${process.env.ZIU_BUILD_PLATFORM}`,
  };

  return join(process.cwd(), distList[process.env.PRJ_ENV]);
}

function sourceRoot(name = "src") {
  return join(process.cwd(), name);
}

function jsonParse(jsonStr) {
  try {
    return JSON.parse(jsonStr);
  } catch (e) {
    return {};
  }
}

function miniProgramSourceMap(compiler) {
  compiler.hooks.assetEmitted.tap(
    "MiniProgramSourceMap",
    (file, { content, targetPath }) => {
      if (/\.(map)$/i.test(String(targetPath))) {
        const json = JSON.parse(content);

        json.sources.forEach((item, i) => {
          if (/style(\/|\\|\\\\)index.(js|ts)/.test(item)) {
            json.sourcesContent[i] = json.sourcesContent[i - 1 < 0 ? 0 : i - 1];
          }
        });
        jsonfile.writeFileSync(targetPath, json, { spaces: 2 });
      }
    },
  );
}
