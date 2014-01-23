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
    var el = compile('<side-menus></side-menus>')(scope);
    var sc = del.getSideMenuController(scope);

    expect(sc).not.toBe(undefined);
  });

  xit('Should open and close', function() {
    var scope = rootScope.$new();
    var el = compile('<side-menus><div side-menu-content></div><side-menu side="left"></side-menu><side-menu side="right"></side-menu></side-menus>')(scope);
    var sc = del.getSideMenuController(scope);

    window.rAF = function( callback ){
      window.setTimeout(callback, 1);
    };

    del.openLeft(scope);
    timeout.flush();
    expect(sc.isOpen()).toBe(true);
    expect(sc.getOpenAmount()).toBe(100);

    del.close(scope);
    expect(sc.isOpen()).toBe(false);
    expect(sc.getOpenAmount()).toBe(0);

    del.openRight(scope);
    expect(sc.isOpen()).toBe(true);
    expect(sc.getOpenAmount()).toBe(-100);

    del.close(scope);
    expect(sc.isOpen()).toBe(false);
    expect(sc.getOpenAmount()).toBe(0);
  });
});
