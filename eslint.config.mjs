import coreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import tailwindcss from 'eslint-plugin-tailwindcss';
import unusedImports from 'eslint-plugin-unused-imports';

const eslintConfig = [
  {
    ignores: [
      '**/node_modules/**',
      '**/*.d.ts',
      'app/components/ui/**',
      'app/hooks/use-mobile.tsx',
      'app/hooks/use-toast.ts',
      'app/lib/utils.ts',
      'app/(modules)/dashboard/(modules)/calculators/helpers/**',
    ],
  },
  ...coreWebVitals,
  ...nextTypescript,
  ...[tailwindcss.configs['flat/recommended']].flat(),
  prettierRecommended,
  {
    plugins: {
      'unused-imports': unusedImports,
    },
    languageOptions: {
      parserOptions: {
        sourceType: 'module',
        ecmaVersion: 'latest',
      },
    },
    rules: {
      'sort-imports': ['error'],

      'no-unused-vars': 'off',
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
      'no-console': ['warn', { allow: ['warn', 'error'] }],

      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'default',
          format: ['camelCase'],
          leadingUnderscore: 'allow',
        },
        {
          selector: 'variable',
          format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
        },
        {
          selector: 'function',
          format: ['camelCase', 'PascalCase'],
        },
        {
          selector: 'interface',
          format: ['PascalCase'],
          custom: {
            regex: '^I[A-Z]',
            match: true,
          },
        },
        {
          selector: 'enum',
          format: ['PascalCase'],
          custom: {
            regex: '^E[A-Z]',
            match: true,
          },
        },
        {
          selector: 'enumMember',
          format: ['UPPER_CASE'],
        },
        {
          selector: 'typeAlias',
          format: ['PascalCase'],
          custom: {
            regex: '^T[A-Z]',
            match: true,
          },
        },
        {
          selector: 'typeParameter',
          format: ['PascalCase'],
        },
        {
          selector: 'import',
          format: null,
        },
        {
          selector: 'objectLiteralProperty',
          format: null,
        },
      ],

      'tailwindcss/no-unnecessary-arbitrary-value': 'error',
      'tailwindcss/enforces-shorthand': 'error',
      'tailwindcss/classnames-order': 'error',
      'tailwindcss/no-custom-classname': ['off'],

      'no-magic-numbers': [
        'warn',
        {
          ignoreArrayIndexes: true,
        },
      ],
      'react/display-name': 'off',
      'react/no-unescaped-entities': 'off',
    },
  },
];

export default eslintConfig;
