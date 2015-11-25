export default {
  loaders: {
    js: {
      test: /\.js$/,
      exclude: /node_modules/,
      loaders: [
        "babel?optional[]=runtime&stage=0"
      ]
    },
    image: {
      test: /\.(jpe?g|png|gif|svg|ico)($|\?)/,
      loaders: ["url?limit=10000"],
    },
    woff: {
      test: /\.woff2?($|\?)/,
      loaders: ["url?limit=100000"],
    },
    otherfont: {
      test: /\.(ttf|eot)($|\?)/,
      loaders: ["file"],
    },
    html: {
      test: /\.html$/,
      loaders: ["html"],
    },
    markdown: {
      test: /\.(md|markdown)$/,
      loaders: ["html", "markdown"],
    },
    json: {
      test: /\.json$/,
      loaders: ["json"]
    }
  },

  resolve: {
    // Only allow ".js" to be appended automatically when resolving (e.g.
    // `import foo from "./bar"` will find `./bar.js`), everything else must
    // be specified with the full extension, e.g. `import styles from
    // "./bar.sass"`
    extensions: ["", ".js"],

    // When resolving module paths (i.e. non-absolute and non-relative, e.g.
    // `import foo from "blah/foo"`), webpack will look in these dirs and any
    // parent dirs above it with the same names (e.g. `./blah`, `../blah`,
    // `../../blah`, etc).
    modulesDirectories: ["src", "node_modules"],
  },
};
