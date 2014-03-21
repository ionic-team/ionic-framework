'use strict';

describe('ionView directive', function() {
  beforeEach(module('ionic.ui.viewState'));

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

  it('should changeTitle with a navDirection', function() {
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

  it('should showBar depending on what is given', function() {
    var el = setup('hide-nav-bar="shouldHide"');
    expect(el.controller('ionNavBar').showBar).toHaveBeenCalledWith(true);
    el.scope().$apply('shouldHide = true');
    expect(el.controller('ionNavBar').showBar).toHaveBeenCalledWith(false);
    el.scope().$apply('shouldHide = false');
    expect(el.controller('ionNavBar').showBar).toHaveBeenCalledWith(true);
  });

  it('should setTitle on change', function() {
    var el = setup('title="{{something}}1"');
    el.scope().$apply('something = "bar"');
    expect(el.controller('ionNavBar').setTitle).toHaveBeenCalledWith('bar1');
  });
});
