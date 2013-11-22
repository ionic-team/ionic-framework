describe('Ionic List', function() {
  var compile, scope;

  beforeEach(module('ionic.ui.list'));

  beforeEach(inject(function($compile, $rootScope, $controller) {
    compile = $compile;
    scope = $rootScope;
  }));

  it('Should init', function() {
    element = compile('<list>' +
      '<list-item></list-item>' + 
      '<list-item></list-item>' + 
      '</list>')(scope);

    expect(element.children().length).toBe(2);
  });
});
