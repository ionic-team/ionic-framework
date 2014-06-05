describe('css snapshot', function() {

  [
    'bars-clear',
    'buttons',
    'cards-header-footer',
    'cards-item-avatar',
    'cards-item-body',
    'cards-item-icon',
    'cards-item-thumbnail',
    'cards-text',
    'colors',
    'footers',
    'grid',
    'headers',
    'input-checkbox',
    'input-radio',
    'input-range',
    'input-select',
    'input-text',
    'input-textarea',
    'input-toogle',
    'list',
    'modals',
  ].forEach(function(testId) {
    describe(testId, function() {
      it('init', function() {
        browser.get('http://localhost:8876/test/css/' + testId + '.html');
      });
    });
  });

});
