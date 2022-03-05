const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: true,
  pluginOptions: {
    electronBuilder: {
      mainProcessFile: "src/main/background.js",
      rendererProcessFile: "src/renderer/main.js",
      externals: ["sequelize", "sqlite3"],
    },
  },
});
