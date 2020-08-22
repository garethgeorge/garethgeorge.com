const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: { index: path.resolve(__dirname, "src/js", "index.js") },
  output: {
    path: path.resolve(__dirname, "dist") 
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "src/html", "index.html")
    })
  ],
  optimization: {
    minimize: false,
    usedExports: true,
  }
};