const js = require('@eslint/js');
const typescriptEslintParser = require('@typescript-eslint/parser');
const typescriptEslintPlugin = require('@typescript-eslint/eslint-plugin');
const importPlugin = require('eslint-plugin-import');
const prettierConfig = require('eslint-config-prettier');
const prettierPlugin = require('eslint-plugin-prettier');

/**
 * @type {import('eslint').Linter.Config}
 */
const config = [
  {
    ignores: ['lib/**', 'node_modules/**', 'example/**'],
  },
  js.configs.recommended,
  importPlugin.flatConfigs.recommended,
  prettierConfig,
  {
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'module',
      globals: {
        ...require('globals').node,
      },
      parser: typescriptEslintParser,
    },
    plugins: {
      typescript: typescriptEslintPlugin,
      prettier: prettierPlugin,
    },
    // rules: {
    //   'import/no-unresolved': 0,
    //   'import/export': 0,
    //   '@typescript-eslint/no-var-requires': 0,
    //   '@typescript-eslint/no-empty-function': 0,
    //   '@typescript-eslint/no-unused-vars': 0,
    //   '@typescript-eslint/no-explicit-any': 0,
    //   '@typescript-eslint/no-non-null-assertion': 0,
    // },
  },
];
module.exports = config;
