// import js from '@eslint/js'
// import globals from 'globals'
// import reactHooks from 'eslint-plugin-react-hooks'
// import reactRefresh from 'eslint-plugin-react-refresh'
// import tseslint from 'typescript-eslint'
// import { globalIgnores } from 'eslint/config'

// export default tseslint.config([
//   globalIgnores(['dist']),
//   {
//     files: ['**/*.{ts,tsx}'],
//     extends: [
//       js.configs.recommended,
//       tseslint.configs.recommended,
//       reactHooks.configs['recommended-latest'],
//       reactRefresh.configs.vite,
//     ],
//     languageOptions: {
//       ecmaVersion: 2020,
//       globals: globals.browser,
//     },
//   },
// ])

import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import { globalIgnores } from "eslint/config";

// Flat config with typescript-eslint as entry point
export default tseslint.config([
  globalIgnores(["dist"]),

  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    languageOptions: {
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true },
      },
      globals: globals.browser,
    },
    plugins: {
      js,
      react: pluginReact,
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    // Extend Airbnb, Prettier, React, TypeScript, Hooks, Refresh
    extends: [
      "airbnb",
      "airbnb/hooks",
      "plugin:react/recommended",
      "plugin:react/jsx-runtime",
      "plugin:@typescript-eslint/recommended",
      "prettier",
    ],
    rules: {
      // Project-specific rules:
      "react/react-in-jsx-scope": "off", // Not needed in React 17+ or Vite
      "react/jsx-filename-extension": [1, { extensions: [".tsx", ".jsx"] }],
      "import/extensions": [
        "error",
        "ignorePackages",
        {
          ts: "never",
          tsx: "never",
          js: "never",
          jsx: "never",
        },
      ],
    },
  },

  // Additional override for React-specific tooling
  {
    files: ["**/*.{ts,tsx,jsx,js}"],
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      // React Hooks rules:
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      // React Refresh rules (to catch stale closures in Vite during dev)
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
    },
  },
]);
