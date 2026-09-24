module.exports = [
  {
    files: ['server/**/*.js', 'models/**/*.js', 'db/**/*.js', 'test/**/*.js', 'knexfile.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'commonjs',
      globals: {
        require: 'readonly',
        module: 'readonly',
        process: 'readonly',
        __dirname: 'readonly',
        console: 'readonly',
      },
    },
    rules: {
      'no-unused-vars': ['error', { argsIgnorePattern: '^next|^_' }],
      'no-console': 'off',
    },
  },
];
