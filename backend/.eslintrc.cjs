module.exports = {
  extends: ['airbnb-base', 'airbnb-typescript/base'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
    tsconfigRootDir: __dirname,
    project: './tsconfig.eslint.json',
  },
  rules: {
    'import/prefer-default-export': 'off',
  },
};
