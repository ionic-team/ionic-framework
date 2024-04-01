module.exports = {
  ...require('@ionic/prettier-config'),
  overrides: [
    {
      files: ['**/*.scss'],
      options: {
        singleQuote: false,
      },
    },
    {
      files: ['**/*.ts{,x}'],
      options: {
        printWidth: 40
      }
    }
  ],
};
