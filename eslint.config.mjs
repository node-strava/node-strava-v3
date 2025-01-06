import js from '@eslint/js';
import promisePlugin from 'eslint-plugin-promise';
import globals from 'globals';

export default [
  js.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.mocha,
      },
    },
    plugins: {
      promise: promisePlugin,
    },
    rules: {
      'promise/prefer-await-to-then': 'error',
    },
  },
];
