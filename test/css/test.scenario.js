describe('css snapshot', function() {

  var tests = [
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
  ];

  for(var x=0; x<tests.length; x++) {
    (function(){
      var testId = tests[x];
      it(testId, function() {
        browser.get('http://localhost:8876/test/css/' + testId + '.html');
      });
    })();
  }

});
