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

  it('Should resize & scroll top', function() {
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

