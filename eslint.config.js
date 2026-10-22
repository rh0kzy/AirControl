import js from "@eslint/js";
import prettierConfig from "eslint-config-prettier";

export default [
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/out/**",
      "**/release/**",
      "**/coverage/**",
      "**/*.d.ts",
      "**/*.ts",
      "**/*.tsx",
    ],
  },
  js.configs.recommended,
  prettierConfig,
];
