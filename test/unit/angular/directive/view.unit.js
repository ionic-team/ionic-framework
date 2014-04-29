describe('ionView directive', function() {
  beforeEach(module('ionic'));

  function setup(attrs, scopeProps, content) {
    var el;
    inject(function($compile, $rootScope) {
      var scope = angular.extend($rootScope.$new(), scopeProps || {});

      el = angular.element('<ion-view '+(attrs||'')+'>');
      el.data('$ionNavBarController', {
        changeTitle: jasmine.createSpy('changeTitle'),
        setTitle: jasmine.createSpy('setTitle'),
        showBackButton: jasmine.createSpy('showBackButton'),
        showBar: jasmine.createSpy('showBar')
      });
      content && el.html(content);

      el = $compile(el)(scope);
      $rootScope.$apply();
    });
    return el;
  }

  it('should remove title & add pane, even with no navbar', inject(function($compile, $rootScope) {
    var el = $compile('<ion-view title="1">')($rootScope.$new());
    $rootScope.$apply();
    expect(el.hasClass('pane')).toBe(true);
    expect(el[0].getAttribute('title')).toBe(null);
  }));

  it('should have content inside', function() {
    var el = setup(null, null, '<b>some</b> html');
    expect(el.html()).toBe('<b>some</b> html');
  });

  it('should not changeTitle with undefined title attr', function() {
    var el = setup();
    expect(el.controller('ionNavBar').changeTitle).not.toHaveBeenCalled();
  });

  it('should changeTitle with blank if title attr is blank', function() {
    var el = setup('title=""', {$navDirection: 'someDirection'});
    expect(el.controller('ionNavBar').changeTitle).toHaveBeenCalledWith('', 'someDirection');
  });

  it('should changeTitle with a navDirection if title set', function() {
    var el = setup('title="Hi, {{1}}!"', {$navDirection: 'foo'});
    expect(el.controller('ionNavBar').changeTitle).toHaveBeenCalledWith('Hi, 1!', 'foo');
  });

  it('should showBackButton depending on what is given', function() {
    var el = setup('hide-back-button="shouldHideBack"');
    expect(el.controller('ionNavBar').showBackButton).toHaveBeenCalledWith(true);
    el.scope().$apply('shouldHideBack = true');
    expect(el.controller('ionNavBar').showBackButton).toHaveBeenCalledWith(false);
    el.scope().$apply('shouldHideBack = false');
    expect(el.controller('ionNavBar').showBackButton).toHaveBeenCalledWith(true);
  });

  it('should show back button by default', function() {
    var el = setup();
    expect(el.controller('ionNavBar').showBackButton).toHaveBeenCalledWith(true);
  });

  it('should showBar depending on what is given', function() {
    var el = setup('hide-nav-bar="shouldHide"');
    expect(el.controller('ionNavBar').showBar).toHaveBeenCalledWith(true);
    el.scope().$apply('shouldHide = true');
    expect(el.controller('ionNavBar').showBar).toHaveBeenCalledWith(false);
    el.scope().$apply('shouldHide = false');
    expect(el.controller('ionNavBar').showBar).toHaveBeenCalledWith(true);
  });

  it('should showBar by default', function() {
    var el = setup();
    expect(el.controller('ionNavBar').showBar).toHaveBeenCalledWith(true);
  });

  it('should setTitle on change, but not with initial value', function() {
    var el = setup('title="{{something}}-1"');
    //Should not setTitle with initial value
    expect(el.controller('ionNavBar').setTitle).not.toHaveBeenCalled();
    el.scope().$apply('something = 2');
    expect(el.controller('ionNavBar').setTitle).toHaveBeenCalledWith('2-1');
  });
});
