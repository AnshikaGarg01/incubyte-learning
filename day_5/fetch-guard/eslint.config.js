const noUnhandledFetch = require('./dist/eslint-rule').default;
const tsParser = require('@typescript-eslint/parser');

module.exports = [
  {
    files: ['**/*.ts', '**/*.js'],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2020,
      sourceType: 'module',
    },
    plugins: {
      'fetch-guard': {
        rules: {
          'no-unhandled-fetch': noUnhandledFetch,
        },
      },
    },
    rules: {
      'fetch-guard/no-unhandled-fetch': 'error',
    },
  },
];
