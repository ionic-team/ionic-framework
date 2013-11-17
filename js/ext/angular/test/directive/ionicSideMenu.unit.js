/**
 * Test the side menu directive. For more test coverage of the side menu,
 * see the core Ionic sideMenu controller tests.
 */
describe('Ionic Angular Side Menu', function() {
  var el;

  beforeEach(module('ionic.ui.sideMenu'));

  beforeEach(inject(function($compile, $rootScope) {
    el = $compile('<side-menus></side-menus>')($rootScope);
  }));

  it('Should init', function() {
    var scope = el.scope();
    expect(scope.sideMenuController).not.toBe(undefined);
  });
});
