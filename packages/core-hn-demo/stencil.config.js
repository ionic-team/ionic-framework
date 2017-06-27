exports.config = {
  src: 'src',
  dest: 'dist',
  bundles: [
    { components: ['news-list', 'news-container', 'comments-page', 'comments-list'] }
  ],
  collections: [
    '@ionic/core'
  ]
};
