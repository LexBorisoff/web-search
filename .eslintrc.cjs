module.exports = {
  extends: [
    'prettier',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
  ],
  plugins: ['prettier', 'import', '@typescript-eslint'],
  parser: '@typescript-eslint/parser',
  rules: {
    eqeqeq: ['error', 'smart'],
    'prefer-const': 'warn',
    'no-use-before-define': 'error',
    'object-shorthand': 'error',
    'consistent-return': 'error',
    'no-else-return': [
      'error',
      {
        allowElseIf: false,
      },
    ],
    'no-console': 'warn',

    // typescript
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': 'error',
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'variable',
        format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
        leadingUnderscore: 'allowSingleOrDouble',
        trailingUnderscore: 'forbid',
      },
      {
        selector: 'enumMember',
        format: ['PascalCase'],
      },
    ],
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        destructuredArrayIgnorePattern: '^_',
        ignoreRestSiblings: true,
      },
    ],

    // import
    'import/no-unresolved': 'error',
    'import/no-cycle': 'error',
    'import/no-duplicates': 'error',
    'import/first': 'error',
    'import/newline-after-import': 'error',
    'padding-line-between-statements': [
      'error',
      {
        blankLine: 'always',
        prev: '*',
        next: 'export',
      },
      {
        blankLine: 'always',
        prev: 'export',
        next: '*',
      },
      {
        blankLine: 'any',
        prev: 'export',
        next: 'export',
      },
    ],
    'import/order': [
      'error',
      {
        groups: [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index',
        ],
      },
    ],
  },
  settings: {
    'import/resolver': {
      typescript: {},
    },
  },
};
