module.exports = {
  devServer: {
    proxy: {
      "^/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        logLevel: "debug",
        pathRewrite: { "^/api": "/" },
      },
      "^/api2": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
        logLevel: "debug",
        pathRewrite: { "^/api2": "/" },
      },
    },
  },
  transpileDependencies: ["vuetify"],
  configureWebpack: {
    devtool: "source-map",
  },
};
