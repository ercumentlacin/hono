module.exports = {
  extends: ["airbnb-base", "airbnb-typescript/base", "prettier"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    sourceType: "module",
    tsconfigRootDir: __dirname,
    project: "./tsconfig.eslint.json",
  },
  rules: {
    "import/prefer-default-export": "off",
    "no-console": "off",
    "import/no-extraneous-dependencies": "off",
    "no-underscore-dangle": "off",
  },
};
