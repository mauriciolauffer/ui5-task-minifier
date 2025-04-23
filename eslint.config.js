import globals from "globals";
import { defineConfig } from "eslint/config";
import nodeConfig from "eslint-config-mlauffer-nodejs";
import { configs as wdioConfigs } from "eslint-plugin-wdio";

export default defineConfig([
  {
    name: "local-ignores",
    ignores: [
      "**/coverage/",
      "**/dist/",
      "**/gen/",
      "**/resources/",
      "**/thirdparty/"
    ],
  },
  {
    files: ["lib/**/*.js", "test/**/*.js"],
    extends: [nodeConfig],
  },
  {
    files: ["test/**/*.js"],
    extends: [wdioConfigs["flat/recommended"]],
    languageOptions: {
      globals: {
        ...globals.qunit,
        ...globals.mocha,
      },
    },
    rules: {
      "jsdoc/require-jsdoc": "off",
      "jsdoc/require-param": "off",
      "jsdoc/require-returns": "off",
    },
  },
]);
