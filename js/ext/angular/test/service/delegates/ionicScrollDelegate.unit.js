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

  testWithAnimate(true);
  testWithAnimate(false);

  function testWithAnimate(animate) {
    describe('with animate=' + animate, function() {
      var contentEl, scope, del, timeout;
      beforeEach(inject(function($rootScope, $compile, $timeout, $document, $ionicScrollDelegate) {
        scope = $rootScope.$new();
        contentEl = $compile('<content></content>')(scope);

        document.body.appendChild(contentEl[0]);
        del = $ionicScrollDelegate;
        timeout = $timeout;
      }));

      it('should anchorScroll to an element with id', function() {
        var anchorMe = angular.element('<div id="anchorMe">');
        var sv = del.getScrollView(scope);
        spyOn(sv, 'scrollTo');
        spyOn(ionic.DomUtil, 'getPositionInParent').andCallFake(function() {
          return { left: 2, top: 1 };
        });

        setLocationHash('anchorMe');
        contentEl.append(anchorMe);

        del.anchorScroll(animate);
        timeout.flush();
        expect(sv.scrollTo).toHaveBeenCalledWith(2, 1, animate);
      });

      it('should anchorScroll to top if !$location.hash()', function() {
        var sv = del.getScrollView(scope);
        spyOn(sv, 'scrollTo');
        spyOn(ionic.DomUtil, 'getPositionInParent');
        del.anchorScroll(animate);
        timeout.flush();

        expect(sv.scrollTo).toHaveBeenCalledWith(0, 0, animate);
        expect(ionic.DomUtil.getPositionInParent).not.toHaveBeenCalled();
      });

      it('should anchorScroll to top if element with hash id doesnt exist', function() {
        var sv = del.getScrollView(scope);
        spyOn(sv, 'scrollTo');
        spyOn(ionic.DomUtil, 'getPositionInParent');

        setLocationHash('doesnotexist');
        del.anchorScroll(animate);
        timeout.flush();

        expect(sv.scrollTo).toHaveBeenCalledWith(0, 0, animate);
        expect(ionic.DomUtil.getPositionInParent).not.toHaveBeenCalled();
      });
    });
  }

});

