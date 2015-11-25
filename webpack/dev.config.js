import path from "path";
import webpack from "webpack";
import writeStats from "./utils/write-stats";
import notifyStats from "./utils/notify-stats";
import shared from "./shared";

const assetsPath = path.resolve(__dirname, "../public/assets");
const WEBPACK_HOST = "localhost";
const WEBPACK_PORT = parseInt(process.env.PORT, 10) + 1 || 3001;

const config = {
  name: "browser",
  devtool: "cheap-module-eval-source-map",
  entry: {
    "main": [
      "webpack-dev-server/client?http://" + WEBPACK_HOST + ":" + WEBPACK_PORT,
      "webpack/hot/only-dev-server",
      "./src/client/index.js"
    ]
  },
  output: {
    path: assetsPath,
    filename: "[name].js",
    chunkFilename: "[name].js",
    publicPath: "http://" + WEBPACK_HOST + ":" + WEBPACK_PORT + "/assets/",
  },
  module: {
    loaders: [
      {
        ...shared.loaders.js,
        loaders: [
          "babel?optional[]=runtime&stage=0&cacheDirectory"
        ]
      },
      {
        loaders: [
          "style",
        ]
      },
      {
        loaders: [
          "style",
        ]
      },
      shared.loaders.image,
      shared.loaders.woff,
      shared.loaders.otherfont,
      shared.loaders.html,
      shared.loaders.markdown,
      shared.loaders.json,
    ]
  },
  progress: true,
  resolve: shared.resolve,
  externals: shared.externals,
  plugins: [

    // hot reload
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),

    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("development"),

        // Mainly used to require CSS files with webpack, which can happen only on browser
        // Used as `if (process.env.BROWSER)...`
        BROWSER: JSON.stringify(true),
        __CLIENT__: true,
        __SERVER__: false,
      }
    }),

    // stats
    function () {
      this.plugin("done", notifyStats);
    },
    function () {
      this.plugin("done", writeStats);
    },

    // print a webpack progress
    new webpack.ProgressPlugin((percentage, message) => {
      var MOVE_LEFT = new Buffer("1b5b3130303044", "hex").toString();
      var CLEAR_LINE = new Buffer("1b5b304b", "hex").toString();
      process.stdout.write(CLEAR_LINE + Math.round(percentage * 100) + "% :" + message + MOVE_LEFT);
    })

  ]
};

// console.log("dev webpack config");
// console.dir(config);

export default config;
