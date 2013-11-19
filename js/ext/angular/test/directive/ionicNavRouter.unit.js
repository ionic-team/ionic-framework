describe('Angular Ionic Nav Router', function() {
  var modal, q;

  beforeEach(module('ngRoute'));
  beforeEach(module('ionic.ui.navRouter'));

  beforeEach(inject(function($compile, $rootScope, $controller) {
    compile = $compile;
    scope = $rootScope;
  }));

  it('Should init', function() {
    element = compile('<pane nav-router>' +
      '<nav-bar></nav-bar>' +
      '<ng-view></ng-view>' +
    '</pane>')(scope);

  });
});
