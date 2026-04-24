// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import * as espree from 'espree';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const loadTestsJsConfig = {
  ...tseslint.configs.disableTypeChecked,
  files: ['load-tests/**/*.js'],
  languageOptions: {
    ecmaVersion: 'latest',
    globals: {
      ...globals.node,
      __ENV: true,
      __VU: true,
      __ITER: true,
    },
    parser: espree,
    sourceType: 'module',
  },
};

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'commonjs',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      '@typescript-eslint/no-unsafe-member-access': 'warn',
      '@typescript-eslint/no-unsafe-assignment': 'warn',
      '@typescript-eslint/no-unsafe-call': 'warn',
      '@typescript-eslint/no-unsafe-return': 'warn',
      'prettier/prettier': ['error', { endOfLine: 'auto' }],
    },
  },
  loadTestsJsConfig,
);
