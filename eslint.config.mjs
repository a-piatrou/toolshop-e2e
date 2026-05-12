import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import playwright from 'eslint-plugin-playwright';
import prettier from 'eslint-config-prettier';

export default tseslint.config(
  {
    ignores: ['node_modules', 'test-results', 'playwright-report', 'blob-report'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['tests/**/*.ts'],
    ...playwright.configs['flat/recommended'],
    rules: {
      ...playwright.configs['flat/recommended'].rules,
      // Assertions often live in page-object helpers rather than the spec body.
      'playwright/expect-expect': [
        'warn',
        { assertFunctionNames: ['expectError', 'expectCartCount'] },
      ],
    },
  },
  {
    rules: {
      'no-empty-pattern': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/consistent-type-imports': 'error',
    },
  },
  prettier,
);
