import path from "path";
import webpack from "webpack";
import writeStats from "./utils/write-stats";
import ExtractTextPlugin from "extract-text-webpack-plugin";
import strip from "strip-loader";
import shared from "./shared";

const assetsPath = path.join(__dirname, "../public/assets");

const commonLoaders = [
  {
    ...shared.loaders.js,
    loaders: [
      "babel?optional[]=runtime&stage=0"
    ]
  },
  shared.loaders.image,
  shared.loaders.json,
];

import fs from "fs";
const externals =
  fs.readdirSync("node_modules")
    .filter(x => ([".bin"].indexOf(x) === -1))
    .reduce((mods, mod) => {
      mods[mod] = "commonjs " + mod;
      return mods;
    }, {});

export default [
  {
    name: "browser prod",
    // devtool: "source-map",
    entry: {
      "main": "./src/client/index.js"
    },
    output: {
      path: assetsPath,
      filename: "[name]-[chunkhash].js",
      chunkFilename: "[name]-[chunkhash].js",
      publicPath: "/assets/",
      libraryTarget: "commonjs2",
    },
    module: {
      loaders: [
        {
          ...shared.loaders.js,
          loaders: [
            strip.loader("debug"),
            ...shared.loaders.js.loaders
          ]
        },
        {
          loader: ExtractTextPlugin.extract(
            "style",
          )
        },
        {
          loader: ExtractTextPlugin.extract(
            "style",
          )
        },
        shared.loaders.image,
        shared.loaders.woff,
        shared.loaders.otherfont,
        shared.loaders.html,
        shared.loaders.markdown,
        shared.loaders.json,
      ],
    },
    progress: true,
    resolve: shared.resolve,
    externals: externals,
    plugins: [
      new webpack.IgnorePlugin(/\.\/dev/, /\/config$/),
      new webpack.DefinePlugin({
        "process.env": {
          // Mainly used to require CSS files with webpack, which can happen only on browser
          // Used as `if (process.env.BROWSER)...`
          BROWSER: JSON.stringify(true),
          // Useful to reduce the size of client-side libraries, e.g. react
          NODE_ENV: JSON.stringify("production"),
          __CLIENT__: true,
          __SERVER__: false,
        }
      }),

      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.OccurenceOrderPlugin(),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        }
      }),

      function() { this.plugin("done", writeStats); }
    ]
  },
  {
    name: "server-side rendering prod",
    entry: "./src/server/render.js",
    target: "node",
    output: {
      path: assetsPath,
      filename: "../../../src/server/render.generated.js",
      publicPath: "/assets/",
      libraryTarget: "commonjs2",
    },
    externals: externals,
    module: {
      loaders: [
        ...commonLoaders,
        {
          loaders: [
            "autoprefixer?browsers=last 2 version",
          ]
        },
        {
          loaders: [
            "autoprefixer?browsers=last 2 version",
          ]
        }
      ]
    }
  }
];
