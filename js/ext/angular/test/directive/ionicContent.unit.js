describe('Ionic Content directive', function() {
  var compile, element, scope, platform = 'Android';
  
  //beforeEach(module('ionic'));

  beforeEach(module('ionic', function ($provide) {
      $provide.value('$ionicPlatform', {
        is: function(type) {
          return type === platform;
        }
      });
    }));

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

  it('Enables bouncing by default', function() {
    platform = 'iPhone';
    element = compile('<content has-header="true"></content>')(scope);
    timeout.flush();
    var newScope = element.isolateScope();
    var scrollView = scope.scrollView;
    expect(scrollView.options.bouncing).toBe(true);
  });

  it('Disables bouncing when has-bouncing = false', function() {
    platform = 'iPhone';
    element = compile('<content has-header="true" has-bouncing="false"></content>')(scope);
    timeout.flush();
    var newScope = element.isolateScope();
    var scrollView = scope.scrollView;
    expect(scrollView.options.bouncing).toBe(false);
  });

  it('Disables bouncing by default on Android', function() {
    platform = 'Android';
    element = compile('<content has-header="true"></content>')(scope);
    timeout.flush();
    var newScope = element.isolateScope();
    var scrollView = scope.scrollView;
    expect(scrollView.options.bouncing).toBe(false);
  });

  it('Disables bouncing by default on Android unless has-bouncing = true', function() {
    platform = 'Android';
    element = compile('<content has-header="true" has-bouncing="true"></content>')(scope);
    timeout.flush();
    var newScope = element.isolateScope();
    var scrollView = scope.scrollView;
    expect(scrollView.options.bouncing).toBe(true);
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
