// Import the contents from .eslintrc.cjs for compatibility with ESLint v9
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const eslintrc = require('./.eslintrc.cjs');

export default [
  {
    // Use the existing configuration from .eslintrc.cjs
    ...eslintrc,
    // Add any additional ESLint v9 specific configuration here
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: '@typescript-eslint/parser',
      parserOptions: eslintrc.parserOptions,
      globals: {
        ...eslintrc.env
      }
    }
  }
];