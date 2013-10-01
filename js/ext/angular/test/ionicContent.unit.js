describe('Ionic Content directive', function() {
  var compile, element, scope;
  
  beforeEach(module('ionic.ui.content'));

  beforeEach(inject(function($compile, $rootScope) {
    compile = $compile;
    scope = $rootScope;
  }));
  
  it('Has content class', function() {
    element = compile('<content></content>')(scope);
    expect(element.hasClass('content')).toBe(true);
  });
});
