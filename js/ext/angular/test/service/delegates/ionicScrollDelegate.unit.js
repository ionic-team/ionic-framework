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

  it('Should get scroll view', function() {
    var scope = rootScope.$new();
    var el = compile('<ion-content></ion-content>')(scope);
    var sv = del.getScrollView(scope);
    expect(sv).not.toBe(undefined);
  });

  it('should resize', function() {
    var scope = rootScope.$new();
    var el = compile('<ion-content></ion-content>')(scope);

    var sv = del.getScrollView(scope);
    spyOn(sv, 'resize');
    spyOn(sv, 'scrollTo');

    del.resize();
    timeout.flush();
    expect(sv.resize).toHaveBeenCalled();
  });

  testWithAnimate(true);
  testWithAnimate(false);
  function testWithAnimate(animate) {
    describe('with animate='+animate, function() {

      it('should tapScrollToTop', function() {
        var scope = rootScope.$new();
        var el = angular.element('<div>' +
                                 '<div class="not-button"></div>' +
                                 '<div class="button"></div>' +
                                 '</div>');
        //ionic.trigger() REALLY doesnt want to work with tap,
        //so we just mock on to catch the callback and use that...
        var callback;
        spyOn(ionic, 'on').andCallFake(function(eventName, cb) {
          callback = cb;
        });
        del.tapScrollToTop(el, animate);

        spyOn(del, 'scrollTop');
        //Don't test the rectContains part, too much to mock
        spyOn(ionic.DomUtil, 'rectContains').andCallFake(function() {
          return true;
        });
        callback({
          target: el[0].querySelector('.not-button'),
          gesture:{ touches:[{}] }
        });
        expect(del.scrollTop).toHaveBeenCalledWith(animate);

        del.scrollTop.reset();
        callback({
          target: el[0].querySelector('.button')
        });
        expect(del.scrollTop).not.toHaveBeenCalled();
      });
      it('should resize & scroll top', function() {
        var scope = rootScope.$new();
        var el = compile('<ion-content start-y="100"></ion-content>')(scope);

        var sv = del.getScrollView(scope);
        spyOn(sv, 'resize');
        spyOn(sv, 'scrollTo');
        del.scrollTop(animate);

        timeout.flush();
        expect(sv.resize).toHaveBeenCalled();
        expect(sv.scrollTo.mostRecentCall.args).toEqual([0, 0, animate]);
      });

      it('should resize & scroll bottom', function() {
        var scope = rootScope.$new();
        var el = compile('<ion-content start-y="100"><br/><br/></ion-content>')(scope);

        var sv = del.getScrollView(scope);
        spyOn(sv, 'getScrollMax').andCallFake(function() {
          return { left: 10, top: 11 };
        });
        spyOn(sv, 'resize');
        spyOn(sv, 'scrollTo');
        var max = sv.getScrollMax();
        del.scrollBottom(animate);

        timeout.flush();
        expect(sv.resize).toHaveBeenCalled();
        expect(sv.scrollTo.mostRecentCall.args).toEqual([max.left, max.top, animate]);
      });

      it('should resize & scrollTo', function() {
        var scope = rootScope.$new();
        var el = compile('<ion-content start-y="100"><br/><br/></ion-content>')(scope);

        var sv = del.getScrollView(scope);
        spyOn(sv, 'scrollTo');
        spyOn(sv, 'resize');
        del.scrollTo(2, 3, animate);

        timeout.flush();
        expect(sv.resize).toHaveBeenCalled();
        expect(sv.scrollTo.mostRecentCall.args).toEqual([2, 3, animate]);
      });
    });
  }

  it('should finish refreshing', function() {
    var scope = rootScope.$new();
    var el = compile('<ion-content start-y="100"></ion-content>')(scope);

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
        contentEl = $compile('<ion-content></ion-content>')(scope);

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

