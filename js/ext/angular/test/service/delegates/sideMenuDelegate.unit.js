describe('Ionic SideMenuDelegate Service', function() {
  var del, rootScope, compile, timeout, document;

  beforeEach(module('ionic'));

  beforeEach(inject(function($ionicSideMenuDelegate, $rootScope, $timeout, $compile, $document) {
    del = $ionicSideMenuDelegate;
    document = $document;
    rootScope = $rootScope;
    timeout = $timeout;
    compile = $compile;
  }));

  it('Should get from scope', function() {
    var scope = rootScope.$new();
    var el = compile('<ion-side-menus></ion-side-menus>')(scope);
    var sc = del.getSideMenuController(scope);

    expect(sc).not.toBe(undefined);
  });

});
