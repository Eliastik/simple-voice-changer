const path = require("path");

const config = {
  entry: "./src/index.js",
  mode: "development",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "SimpleVoiceChanger.js",
    library: "SimpleVoiceChanger",
    libraryTarget: "umd",
    globalObject: "typeof self !== \"undefined\" ? self : this"
  },
  externals: {
    "jquery": "jQuery"
  },
  devtool: "inline-source-map",
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules)|\.worklet\.js/,
        use: { loader: "babel-loader" }
      },
      {
        test: /\-worklet\.js$/,
        use: [
          {
            loader: "worklet-loader",
            options: {
              inline: false,
              publicPath: "dist/"
            }
          }
        ]
      },
      {
        test: /\.(png|jpg|gif|wav|mp3)$/i,
        use: [
          {
            loader: "url-loader"
          },
        ],
      }
    ]
  }
};

module.exports = config;