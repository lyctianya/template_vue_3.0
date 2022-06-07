const { defineConfig } = require("@vue/cli-service");
const TerserPlugin = require("terser-webpack-plugin");
const Path = require("path");
module.exports = defineConfig({
  publicPath: "./",
  outputDir: "dist",
  assetsDir: "static",
  pages: {
    index: {
      entry: "src/main.ts",
      template: "./public/index.html",
      filename: "index.html",
    },
  },
  productionSourceMap: false,
  transpileDependencies: true,
  chainWebpack: (config) => {
    config.plugin("define").tap((args) => {
      // args[0]['process.env'].API_CONFIG = JSON.stringify(envConfig)
      return args;
    });
    config.module
      .rule("images")
      .use("url-loader")
      .loader("url-loader")
      .tap((options) => Object.assign(options, { limit: 1 }));

    config.module
      .rule("svg")
      .exclude.add(Path.join(__dirname, "src/icons"))
      .end();

    config.module
      .rule("icons")
      .test(/\.svg$/)
      .include.add(Path.join(__dirname, "src/icons"))
      .end()
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({ symbolId: "yxt-ulcd-[name]" })
      .end();

    config.module
      .rule("i18n")
      .resourceQuery(/blockType=i18n/)
      .type("javascript/auto")
      .use("i18n")
      .loader("@kazupon/vue-i18n-loader");
    config.plugin("html-index").tap((args) => {
      // 注入编译时配置
      args[0].feConfig = {};
      //html里使用是否引号
      args[0].minify.removeAttributeQuotes = false;
      // 开启html注释
      args[0].minify.removeComments = false;
      return args;
    });

    config.resolve.symlinks(true);
    config.resolve.alias.set("@", Path.join(__dirname, "src"));
  },
  css: {
    extract: false,
    sourceMap: false,
    modules: false,
  },
  // 在多核机器下会默认开启
  parallel: require("os").cpus().length > 1,
  devServer: {
    host: "0.0.0.0",
    port: 8080,
    https: false,
    hot: true,
    open: true,
    disableHostCheck: true,
  },
  pluginOptions: {
    i18n: {
      locale: "ch",
      fallbackLocale: "ch",
      localeDir: "language",
      enableInSFC: false,
    },
  },
  configureWebpack: (config) => {
    config["externals"] = {
      vue: "Vue",
      vuex: "Vuex",
      "vue-router": "VueRouter",
      axios: "axios",
      "vue-i18n": "VueI18n",
      "yxt-pc": "YXTPC",
      "yxt-biz-pc": "YXTBIZ",
      "sa-sdk-javascript": "sensorsDataAnalytic201505",
    };
    config.optimization = {
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            compress: {
              warnings: false,
              drop_console: process.env.VUE_APP_APIENV !== "dev",
              drop_debugger: true,
            },
          },
        }),
      ],
    };
  },
});
