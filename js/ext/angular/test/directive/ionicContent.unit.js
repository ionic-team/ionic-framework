describe('Ionic Content directive', function() {
  var compile, element, scope;
  
  beforeEach(module('ionic'));

  beforeEach(inject(function($compile, $rootScope, $timeout, $window) {
    compile = $compile;
    scope = $rootScope;
    timeout = $timeout;
    window = $window;
  }));
  
  it('Has content class', function() {
    element = compile('<content></content>')(scope);
    expect(element.hasClass('scroll-content')).toBe(true);
  });

  it('Has header', function() {
    element = compile('<content has-header="true"></content>')(scope);
    expect(element.hasClass('has-header')).toEqual(true);
  });

  it('should add padding classname', function() {
    element = compile('<content padding="true"></content>')(scope);
    expect(element.hasClass('scroll-content')).toEqual(true);
    expect(element.hasClass('padding')).toEqual(false);
    var scrollElement = element.find('.scroll');
    expect(scrollElement.hasClass('padding')).toEqual(true);
  });

  /**
   * Not currently possible to mock this AFAIK
   */
  xit('Disables bouncing by default on Android', function() {
    window.navigator.userAgent = 'Mozilla/5.0 (Linux; U; Android 4.0.3; ko-kr; LG-L160L Build/IML74K) AppleWebkit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30';
    element = compile('<content has-header="true"></content>')(scope);
    timeout.flush();
    var newScope = element.isolateScope();
    var scrollView = scope.scrollView;
    expect(scrollView.options.bouncing).toBe(false);
  });

  it('Should set start x and y', function() {
    element = compile('<content start-x="100" start-y="300" has-header="true"></content>')(scope);
    timeout.flush();
    var newScope = element.isolateScope();
    var scrollView = scope.scrollView;
    var vals = scrollView.getValues();
    expect(vals.left).toBe(100);
    expect(vals.top).toBe(300);
  });
});
