import js from '@eslint/js';
import { configs } from 'typescript-eslint';
import * as pluginImportX from 'eslint-plugin-import-x';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
/**
 * @type {import('eslint').Linter.Config}
 */
const config = [
  {
    files: ['**/*.ts'],
  },
  {
    ignores: ['lib/**', 'node_modules/**'],
  },
  {
    rules: {},
  },
  js.configs.recommended,
  ...configs.recommended,
  pluginImportX.flatConfigs.recommended,
  pluginImportX.flatConfigs.typescript,
  eslintPluginPrettierRecommended,
];

export default config;
