import { defineConfig } from 'eslint-define-config';

export default defineConfig({
  extends: ['next/core-web-vitals', 'next/typescript'],
  rules: {
    '@next/next/no-html-link-for-pages': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    '@react-hooks/exhaustive-deps': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-expressions': 'off',
  },
});
