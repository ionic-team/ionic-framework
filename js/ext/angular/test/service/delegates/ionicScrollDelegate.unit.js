describe('Ionic ScrollDelegate Service', function() {
  var del, rootScope, compile, timeout, document;

  beforeEach(module('ionic'));

  beforeEach(inject(function($ionicScrollDelegate, $rootScope, $timeout, $compile, $document) {
    del = $ionicScrollDelegate;
    document = $document;
    rootScope = $rootScope;
    timeout = $timeout;
    compile = $compile;
  }));

  it('Should register', function() {
    spyOn(del, 'register');

    var scope = rootScope.$new();
    var el = compile('<content></content>')(scope);

    expect(del.register).toHaveBeenCalled();
  });

  it('Should get scroll view', function() {
    var scope = rootScope.$new();
    var el = compile('<content></content>')(scope);
    var sv = del.getScrollView(scope);
    expect(sv).not.toBe(undefined);
  });

  it('should resize', function() {
    var scope = rootScope.$new();
    var el = compile('<content></content>')(scope);

    var sv = del.getScrollView(scope);
    spyOn(sv, 'resize');

    del.resize();
    timeout.flush();
    expect(sv.resize).toHaveBeenCalled();
  });

  it('Should resize & scroll top', function() {
    var scope = rootScope.$new();
    var el = compile('<content start-y="100"></content>')(scope);

    var sv = del.getScrollView(scope);
    spyOn(sv, 'resize');

    expect(sv.getValues().top).toBe(100);

    del.scrollTop(false);
    timeout.flush();
    expect(sv.resize).toHaveBeenCalled();

    expect(sv.getValues().top).toBe(0);
  });

  it('Should resize & scroll bottom', function() {
    var scope = rootScope.$new();
    var el = compile('<content start-y="100"></content>')(scope);

    var sv = del.getScrollView(scope);
    spyOn(sv, 'resize');

    expect(sv.getValues().top).toBe(100);

    del.scrollBottom(false);
    timeout.flush();
    expect(sv.resize).toHaveBeenCalled();

    expect(sv.getValues().top).toBe(sv.getScrollMax().top);
  });

  it('should finish refreshing', function() {
    var scope = rootScope.$new();
    var el = compile('<content start-y="100"></content>')(scope);

    var sv = del.getScrollView(scope);
    spyOn(sv, 'finishPullToRefresh');

    del.finishRefreshing(scope);
    expect(sv.finishPullToRefresh).toHaveBeenCalled();
 });
});

describe('anchorScroll', function() {
  function setLocationHash(hash) {
    inject(function($location) {
      $location.hash = function() { return hash; };
    });
  }

  beforeEach(module('ionic'));

  var contentEl, scope, del;
  beforeEach(inject(function($rootScope, $compile, $timeout, $document, $ionicScrollDelegate) {
    scope = $rootScope.$new();
    contentEl = $compile('<content></content>')(scope);

    mockBody = angular.element('<div>').append(contentEl);
    $document.body = mockBody[0];
    del = $ionicScrollDelegate
  }));

  it('should anchorScroll to an element with id', function() {
    var anchorMe = angular.element('<div id="anchorMe">');
    var sv = del.getScrollView(scope);
    spyOn(sv, 'scrollTo');

    setLocationHash('anchorMe');
    contentEl.append(anchorMe);

    var pos = ionic.DomUtil.getPositionInParent(anchorMe[0], contentEl[0]);
    del.anchorScroll();
    expect(sv.scrollTo).toHaveBeenCalledWith(pos.left, pos.top);
  });

  it('should anchorScroll to top if !$location.hash()', function() {
    var sv = del.getScrollView(scope);
    spyOn(sv, 'scrollTo');
    del.anchorScroll();
    expect(sv.scrollTo).toHaveBeenCalledWith(0, 0);
  });

  it('should anchorScroll to top if element with hash id doesnt exist', function() {
    var sv = del.getScrollView(scope);
    spyOn(sv, 'scrollTo');

    setLocationHash('doesnotexist');
    del.anchorScroll();

    expect(sv.scrollTo).toHaveBeenCalledWith(0, 0);
  });

  it('should anchorScroll to first element with id if multiple exist', function() {
    var foo1 = angular.element('<div id="foo">hello</div>');
    var foo2 = angular.element('<div id="foo">hola</div>');
    var sv = del.getScrollView(scope);

    contentEl.append(foo1).append(foo2);

    //Fake the top/left because dom doesn't have time to load in a test
    spyOn(ionic.DomUtil, 'getPositionInParent').andCallFake(function(el) {
      return el === foo1[0] ? {left: 20, top: 40} : {left: 30, top: 50};
    });
    var pos1 = ionic.DomUtil.getPositionInParent(foo1[0], contentEl[0]);
    var pos2 = ionic.DomUtil.getPositionInParent(foo2[0], contentEl[0]);

    spyOn(sv, 'scrollTo');
    setLocationHash('foo');
    del.anchorScroll();
    expect(sv.scrollTo.callCount).toBe(1);
    expect(sv.scrollTo).toHaveBeenCalledWith(pos1.left, pos1.top);
    expect(sv.scrollTo).not.toHaveBeenCalledWith(pos2.left, pos2.top);
  });

});

