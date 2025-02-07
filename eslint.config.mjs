import {FlatCompat} from '@eslint/eslintrc';

const compat = new FlatCompat({
    baseDirectory: import.meta.dirname,
});

const eslintConfig = [
    ...compat.config({
        extends: ['next', 'next/core-web-vitals', 'next/typescript'],
        rules: {
            '@next/next/no-html-link-for-pages': 'off',
            '@typescript-eslint/no-unused-vars': 'off',
            '@react-hooks/exhaustive-deps': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-unused-expressions': 'off'
        }
    }),
];

export default eslintConfig;