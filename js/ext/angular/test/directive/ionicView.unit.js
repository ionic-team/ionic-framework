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

  it('should showBackButten depending on what is given', function() {
    var el = setup();
    expect(el.controller('ionNavBar').showBackButton).toHaveBeenCalledWith(true);
    el = setup('hide-back-button="true"');
    expect(el.controller('ionNavBar').showBackButton).toHaveBeenCalledWith(false);
  });

  it('should showBar depending on what is given', function() {
    var el = setup();
    expect(el.controller('ionNavBar').showBar).toHaveBeenCalledWith(true);
    var el = setup('hide-nav-bar="true"');
    expect(el.controller('ionNavBar').showBar).toHaveBeenCalledWith(false);
  });

  it('should setTitle on change', function() {
    var el = setup('', {title: 'foo'});
    expect(el.controller('ionNavBar').setTitle).not.toHaveBeenCalled();
    el.isolateScope().$apply('title = "bar"');
    expect(el.controller('ionNavBar').setTitle).toHaveBeenCalledWith('bar');
  });
});
