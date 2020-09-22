const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const fs = require("fs");
const loader = require("sass-loader");

function generateHtmlPlugins(templateDir) {
  const templateFiles = fs.readdirSync(path.resolve(__dirname, templateDir));
  return templateFiles.map((item) => {
    const parts = item.split(".");
    const name = parts[0];
    const extension = parts[1];
    return new HtmlWebpackPlugin({
      filename: `${name}.html`,
      template: path.resolve(__dirname, `${templateDir}/${name}.${extension}`),
      inject: false,
    });
  });
}

const htmlPlugins = generateHtmlPlugins("./src/html/views");

module.exports = {
  entry: ["./src/js/index.js", "./src/scss/style.scss"],
  output: {
    filename: "./js/bundle.js",
  },
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve(__dirname, "src/js"),
        use: {
          loader: "babel-loader",
          options: {
            presets: "env",
          },
        },
      },
      {
        test: /\.(sass|scss)$/,
        include: path.resolve(__dirname, "src/scss"),
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              sourceMap: true,
              url: false,
              reloadAll: true,
            },
          },
          "css-loader",
          "sass-loader",
        ],
      },
      {
        test: /\.html$/,
        include: path.resolve(__dirname, "src/html/includes"),
        use: ["raw-loader"],
      },
      {
        test: /\.(jpe?g|png|gif|woff|woff2|eot|ttf|svg)(\?[a-z0-9=.]+)?$/,
        loader: "url-loader?limit=100000",
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "./css/style.bundle.css",
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "./src/fonts",
          to: "./fonts",
        },
        {
          from: "./src/img",
          to: "./img",
        },
      ],
    }),
  ].concat(htmlPlugins),
};
