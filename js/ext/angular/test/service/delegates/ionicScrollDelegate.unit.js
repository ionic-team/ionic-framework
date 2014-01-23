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

  it('Should scroll top', function() {
    spyOn(del, 'register');

    var scope = rootScope.$new();
    var el = compile('<content start-y="100"></content>')(scope);

    var sv = del.getScrollView(scope);

    var v = sv.getValues();

    expect(v.top).toBe(100);

    del.scrollTop();

    expect(v.top).toBe(100);
  });

  xit('Should scroll bottom', function() {
    spyOn(del, 'register');

    var scope = rootScope.$new();
    var el = compile('<content start-y="100"><div style="height:1000px; width:100px;"></div></content>')(scope);

    var sv = del.getScrollView(scope);
    timeout.flush();
    sv.resize();

    var v = sv.getValues();


    expect(v.top).toBe(100);


    console.log(sv.getScrollMax());
    del.scrollBottom();

    expect(v.top).toBe(100);
  });
});
    
