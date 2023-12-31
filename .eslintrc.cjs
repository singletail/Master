module.exports = {
  root: true,
  extends: ['eslint:recommended'],
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2021,
  },
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  rules: {
    'array-bracket-spacing': ['error', 'never'],
    'arrow-parens': ['error', 'always'],
    'arrow-spacing': ['error', { before: true, after: true }],
    'brace-style': ['error', '1tbs'],
    'block-scoped-var': 'error',
    'block-spacing': ['error', 'always'],
    camelcase: ['error', { properties: 'always' }],
    'comma-dangle': ['error', 'always-multiline'],
    'comma-spacing': ['error', { before: false, after: true }],
    //curly: ['error', 'all'],
    'dot-notation': ['error', { allowKeywords: true }],
    eqeqeq: ['error', 'always', { null: 'ignore' }],
    'getter-return': 'error',
    'no-async-promise-executor': 'warn',
    'no-await-in-loop': 'warn',
    'no-confusing-arrow': ['error', { allowParens: true }],
    'no-extra-parens': ['error', 'all'],
    'no-extra-semi': 'error',
    'no-irregular-whitespace': 'error',
    'no-misleading-character-class': 'error',
    'no-promise-executor-return': 'warn',
    'no-const-assign': 'error',
    'no-var': 'error',
    'prefer-const': 'error',
    'prefer-arrow-callback': 'warn',
    quotes: ['error', 'single'],
    'require-await': ['error'],
    'require-yield': 'error',
    semi: ['error', 'never'],
    'space-in-parens': ['error', 'never'],
    'object-curly-spacing': ['error', 'always'],
  },
}
