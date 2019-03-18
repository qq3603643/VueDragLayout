const { resolve } = require("path");
const dev = Boolean(process.env.WEBPACK_DEV);

module.exports = {
  mode: dev ? "development" : "production",
  devtool: dev ? "cheap-module-eval-source-map" : "hidden-source-map",
  entry: "./src/index.js",
  output: {
    path: resolve(__dirname, "dist"),
    filename: "index.js",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ["babel-loader"]
      }
    ]
  }
};