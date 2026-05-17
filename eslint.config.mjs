import reactNativeConfig from '@react-native/eslint-config/flat';
import importX from 'eslint-plugin-import-x';
import prettier from 'eslint-plugin-prettier';
import sonarjs from 'eslint-plugin-sonarjs';
import unicorn from 'eslint-plugin-unicorn';
import unusedImports from 'eslint-plugin-unused-imports';
import { defineConfig } from 'eslint/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SOURCE_FILES = ['src/**/*.{js,ts,tsx}', 'example/**/*.{js,ts,tsx}'];
const TS_FILES = ['src/**/*.{ts,tsx}', 'example/**/*.{ts,tsx}'];

export default defineConfig([
  {
    ignores: [
      'node_modules/**',
      'lib/**',
      'example/.expo/**',
      'example/node_modules/**',
    ],
  },
  ...reactNativeConfig
    .filter((config) => !config.plugins?.['ft-flow'])
    .map((config) => ({ ...config, files: SOURCE_FILES })),

  // Prettier
  {
    files: SOURCE_FILES,
    plugins: { prettier },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'prettier/prettier': 'error',

      // Harden rules that @react-native ships as warn
      'no-cond-assign': 'error',
      'eqeqeq': ['error', 'allow-null'],
      'react/no-unstable-nested-components': 'error',
      'react-native/no-inline-styles': 'error',
      'jest/no-focused-tests': 'error',
    },
  },
  {
    files: TS_FILES,
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
      '@typescript-eslint/no-shadow': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': 'error',
      '@typescript-eslint/await-thenable': 'error',
      '@typescript-eslint/no-unsafe-assignment': 'error',
      '@typescript-eslint/no-unsafe-return': 'error',
      '@typescript-eslint/no-unsafe-call': 'error',
      '@typescript-eslint/no-unsafe-member-access': 'error',
    },
  },
  {
    files: SOURCE_FILES,
    plugins: { 'unused-imports': unusedImports },
    rules: {
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'error',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],
    },
  },
  {
    files: SOURCE_FILES,
    plugins: { 'import-x': importX },
    rules: {
      'import-x/no-cycle': ['error', { ignoreExternal: true }],
      'import-x/no-duplicates': 'error',
      'import-x/no-self-import': 'error',
      'import-x/no-useless-path-segments': 'error',
    },
  },
  {
    files: SOURCE_FILES,
    plugins: { sonarjs },
    rules: {
      ...sonarjs.configs.recommended.rules,
      'sonarjs/cognitive-complexity': ['error', 15],
      'sonarjs/no-duplicate-string': ['error', { threshold: 3 }],
    },
  },
  {
    files: SOURCE_FILES,
    plugins: { unicorn },
    rules: {
      ...unicorn.configs.recommended.rules,
      'unicorn/prevent-abbreviations': 'off',
      'unicorn/no-null': 'off',
      'unicorn/filename-case': 'off',
      'unicorn/no-array-sort': 'off',
    },
  },
]);
