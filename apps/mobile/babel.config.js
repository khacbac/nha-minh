module.exports = (api) => {
  api.cache(true);
  return {
    presets: [["babel-preset-expo", { jsxImportSource: "nativewind" }]],
    plugins: [
      [
        "module-resolver",
        {
          root: ["."],
          alias: {
            "@": "./src",
          },
          extensions: [".ios.js", ".android.js", ".js", ".jsx", ".json", ".tsx", ".ts"],
        },
      ],
      // Reanimated 4 moved its Babel plugin into the worklets package.
      "react-native-worklets/plugin",
    ],
  };
};
