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
  plugins: ['import', '@stylistic'],
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js'],
        paths: ['src'],
      },
    },
  },
  rules: {
    'import/no-unresolved': 'off',
    'import/no-extraneous-dependencies': ['error', {
      devDependencies: [
        '**/__tests__/**/*.js',
        '**/*.test.js',
        '**/jest.config.js',
        '**/debug-test.js',
        '**/bin/**/*.js',
      ],
    }],
    'semi': ['error', 'never'],
    'quotes': ['error', 'single'],
    'indent': ['error', 2, {
      SwitchCase: 1,
    }],
    'comma-dangle': ['error', 'always-multiline'],
    'object-curly-spacing': ['error', 'always'],
    'array-bracket-spacing': ['error', 'never'],
    'no-unused-vars': ['error', {
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_'
    }],
    'no-console': 'off',
    'no-var': 'error',
    'prefer-const': 'error',
    'eqeqeq': ['error', 'always'],

    '@stylistic/arrow-parens': ['error', 'always'],
    '@stylistic/brace-style': ['error', '1tbs'],
    '@stylistic/space-in-parens': ['error', 'never'],
    '@stylistic/eol-last': ['error', 'always'],
  },
}
