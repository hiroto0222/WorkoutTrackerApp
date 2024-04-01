module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module:react-native-dotenv",
        {
          moduleName: "@env",
          path: ".env",
        },
      ],
      [
        "module-resolver",
        {
          root: ["./src/"],
          extensions: [".ts", ".tsx", ".mjs", ".js", ".jsx"],
        },
      ],
      "react-native-reanimated/plugin",
    ],
  };
};
