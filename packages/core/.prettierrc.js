module.exports = {
  ...require('@ionic/prettier-config'),
  overrides: [
    {
      files: ['**/*.scss'],
      options: {
        singleQuote: false,
      },
    },
  ],
};
