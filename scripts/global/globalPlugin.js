const { resolve, join } = require("path");
const { ProvidePlugin } = require("webpack");

module.exports = function autoImportGlobalLib(env = "weapp") {
  return {
    plugins: [
      new ProvidePlugin({
        mini: resolve(join(__dirname, `./libs/${env}.js`)),
      }),
    ],
  };
};
