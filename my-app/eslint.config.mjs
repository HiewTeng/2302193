import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";
import pluginSecurity from "eslint-plugin-security";
import pluginSecurityNode from "eslint-plugin-security-node";
import pluginNoUnsanitized from "eslint-plugin-no-unsanitized";

/** @type {import("eslint").Linter.FlatConfig[]} */
export default [
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: globals.browser,
    },
    plugins: {
      react: pluginReact,
      security: pluginSecurity,
      "security-node": pluginSecurityNode,
      "no-unsanitized": pluginNoUnsanitized,
    },
    rules: {
      // Base ESLint + React rules
      ...pluginJs.configs.recommended.rules,
      ...pluginReact.configs.flat.recommended.rules,

      // Enable specific rules
      "security/detect-eval-with-expression": "error",

      
      // Add recommended rules from security-node
      ...pluginSecurityNode.configs.recommended.rules,

      // Add recommended rules from no-unsanitized
      ...pluginNoUnsanitized.configs.recommended.rules,
    },
  },
];
