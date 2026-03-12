module.exports = {
  env: {
    node: true,
    es2021: true,
    jest: true,
  },
  extends: 'eslint:recommended',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js'],
        paths: ['src'],
      },
    },
  },
  rules: {
    'no-console': 'off',
    'no-unused-vars': ['error', {
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_'
    }],
    'semi': ['error', 'never'], // было 'always', стало 'never'
    'quotes': ['error', 'single'],
    'indent': ['error', 2],
    'comma-dangle': ['error', 'always-multiline'],
    'object-curly-spacing': ['error', 'always'],
    'array-bracket-spacing': ['error', 'never'],
    'no-var': 'error',
    'prefer-const': 'error',
    'eqeqeq': ['error', 'always'],
    'import/no-unresolved': 'off',
  },
}