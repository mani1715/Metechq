const path = require("path");
require("dotenv").config();

/**
 * Environment flags
 */
const config = {
  disableHotReload: process.env.DISABLE_HOT_RELOAD === "true",
  isProduction: process.env.NODE_ENV === "production",
};

/**
 * CRACO configuration
 */
const cracoConfig = {
  reactScriptsVersion: "react-scripts",

  webpack: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },

    configure: (webpackConfig) => {
      if (!config.isProduction) {
        if (config.disableHotReload) {
          webpackConfig.plugins = webpackConfig.plugins.filter(
            (plugin) =>
              plugin.constructor.name !== "HotModuleReplacementPlugin"
          );

          webpackConfig.watch = false;
          webpackConfig.watchOptions = { ignored: /.*/ };
        } else {
          webpackConfig.watchOptions = {
            ...webpackConfig.watchOptions,
            ignored: [
              "**/node_modules/**",
              "**/.git/**",
              "**/build/**",
              "**/dist/**",
              "**/coverage/**",
              "**/public/**",
            ],
          };
        }
      }

      return webpackConfig;
    },
  },
};

/**
 * DevServer configuration (DEV ONLY)
 */
cracoConfig.devServer = (devServerConfig) => {
  if (config.isProduction) {
    return devServerConfig;
  }

  devServerConfig.historyApiFallback = true;

  const useProxy = process.env.USE_WEBPACK_PROXY === "true";

  if (useProxy) {
    const backendProtocol = process.env.BACKEND_PROTOCOL || "http:";
    const backendHost = process.env.BACKEND_HOST || "localhost:8001";
    const backendTarget = `${backendProtocol}//${backendHost}`;

    devServerConfig.proxy = {
      "/api": {
        target: backendTarget,
        changeOrigin: true,
        secure: false,
        ws: true,
        logLevel: "debug",
      },
    };

    console.log(`[Proxy] /api → ${backendTarget}`);
  }

  return devServerConfig;
};

module.exports = cracoConfig;
