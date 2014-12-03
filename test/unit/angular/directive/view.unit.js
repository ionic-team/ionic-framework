describe('ionView directive', function() {
  var beforeEnterData;

  beforeEach(module('ionic'));

  function setup(attrs, scopeProps, content) {
    var el;
    inject(function($compile, $rootScope) {
      var scope = angular.extend($rootScope.$new(), scopeProps || {});

      el = angular.element('<ion-view '+(attrs||'')+'>');
      el.data('$ionNavViewController', {
        beforeEnter: function(d) { beforeEnterData = d; },
        title: jasmine.createSpy('title'),
        showBar: jasmine.createSpy('showBar'),
        enableBackButton: jasmine.createSpy('enableBackButton'),
        showBackButton: jasmine.createSpy('showBackButton')
      });
      content && el.html(content);

      el = $compile(el)(scope);
      $rootScope.$apply();
    });
    return el;
  }

  it('should add pane', inject(function($compile, $rootScope) {
    var el = $compile('<ion-view>')($rootScope.$new());
    $rootScope.$apply();
    expect(el.hasClass('pane')).toBe(true);
  }));

  it('should remove title attribute', inject(function($compile, $rootScope) {
    var el = $compile('<ion-view title="view title">')($rootScope.$new());
    $rootScope.$apply();
    expect(el[0].getAttribute('title')).toBe(null);
  }));

  it('should remove title attribute from view in modal',inject(function($compile, $rootScope) {
    var el = $compile('<ion-modal><ion-view title="1"></ion-modal>')($rootScope.$new());
    var view = jqLite(el[0].querySelector('.pane'));
    $rootScope.$apply();
    expect(view[0].getAttribute('title')).toBe(null);
  }));

  it('should have content inside', function() {
    var el = setup(null, null, '<b>some</b> html');
    expect(el.html()).toBe('<b>some</b> html');
  });

  it('should call ionNavViewController.beforeEnter with showNavBar=false w/ hide-nav-bar="true" attr', inject(function($rootScope) {
    var el = setup('hide-nav-bar="true"');
    $rootScope.$broadcast('$ionicView.beforeEnter', {});
    expect( beforeEnterData.showNavBar ).toBe(false);
  }));

  it('should call ionNavViewController.beforeEnter with showNavBar=true and hide-nav-bar="false" attr', inject(function($rootScope) {
    var el = setup('hide-nav-bar="false"');
    $rootScope.$broadcast('$ionicView.beforeEnter', {});
    expect( beforeEnterData.showNavBar ).toBe(true);
  }));

  it('should call ionNavViewController.beforeEnter with title attr', inject(function($rootScope) {
    var el = setup('title="my title"');
    $rootScope.$broadcast('$ionicView.beforeEnter', {
      direction: 'forward'
    });
    expect( beforeEnterData.title ).toBe('my title');
    expect( beforeEnterData.direction ).toBe('forward');
    expect( beforeEnterData.hasHeaderBar ).toBe(false);
    expect( beforeEnterData.navBarDelegate ).toBe(null);
    expect( beforeEnterData.showNavBar ).toBe(true);
  }));

  it('should call ionNavViewController.beforeEnter with view-title attr', inject(function($rootScope) {
    var el = setup('view-title="my title"');
    $rootScope.$broadcast('$ionicView.beforeEnter', {});
    expect( beforeEnterData.title ).toBe('my title');
  }));

  it('should not enableBack with hide-back-button attr', inject(function($rootScope) {
    var el = setup('hide-back-button="true"');
    $rootScope.$broadcast('$ionicView.beforeEnter', {
      enableBack: true
    });
    expect( beforeEnterData.showBack ).toBe(false);

    $rootScope.shouldShowBack = false;
    var el = setup('hide-back-button="shouldShowBack"');
    $rootScope.$broadcast('$ionicView.beforeEnter', {
      enableBack: true
    });
    expect( beforeEnterData.showBack ).toBe(false);
  }));

  it('should enableBack without hide-back-button but no enableBack from transition', inject(function($rootScope) {
    var el = setup();
    $rootScope.$broadcast('$ionicView.beforeEnter', {
      enableBack: false
    });
    expect( beforeEnterData.enableBack ).toBe(false);
  }));

  it('should be receive delegateHandle from child ionNavBar', inject(function($rootScope) {
    var el = setup(null, null, '<ion-nav-bar delegate-handle="myViewNavBar">');
    $rootScope.$broadcast('$ionicView.beforeEnter', {});
    expect( beforeEnterData.navBarDelegate ).toBe('myViewNavBar');
  }));

  it('should only observe view-title attr after afterEnter and before beforeLeave', inject(function($rootScope) {
    var el = setup('view-title="{{ myTitle }}"', {myTitle: 'My Title'});
    $rootScope.$broadcast('$ionicView.beforeEnter', {});
    var spy = el.data('$ionNavViewController').title;
    expect(spy).not.toHaveBeenCalled();
    spy.reset();

    $rootScope.$broadcast('$ionicView.afterEnter', {});
    expect(spy).not.toHaveBeenCalled();
    spy.reset();

    el.scope().myTitle = 'My New Title';
    $rootScope.$digest();
    expect(spy).toHaveBeenCalledWith('My New Title');
    spy.reset();

    $rootScope.$broadcast('$ionicView.beforeLeave', {});
    el.scope().myTitle = 'My Other New Title';
    $rootScope.$digest();
    expect(spy).not.toHaveBeenCalled();
    spy.reset();
  }));

  it('should only observe title attr after afterEnter and before beforeLeave', inject(function($rootScope) {
    var el = setup('title="{{ myTitle }}"', {myTitle: 'My Title'});
    $rootScope.$broadcast('$ionicView.beforeEnter', {});
    var spy = el.data('$ionNavViewController').title;
    expect(spy).not.toHaveBeenCalled();
    spy.reset();

    $rootScope.$broadcast('$ionicView.afterEnter', {});
    expect(spy).not.toHaveBeenCalled();
    spy.reset();

    el.scope().myTitle = 'My New Title';
    $rootScope.$digest();
    expect(spy).toHaveBeenCalledWith('My New Title');
    spy.reset();

    $rootScope.$broadcast('$ionicView.beforeLeave', {});
    el.scope().myTitle = 'My Other New Title';
    $rootScope.$digest();
    expect(spy).not.toHaveBeenCalled();
    spy.reset();
  }));

  it('should only observe hideNavBar attr after afterEnter and before beforeLeave', inject(function($rootScope) {
    var el = setup('hide-nav-bar="hide"', {hide: false});
    $rootScope.$broadcast('$ionicView.beforeEnter', {});
    var spy = el.data('$ionNavViewController').showBar;
    expect(spy).not.toHaveBeenCalled();
    spy.reset();

    $rootScope.$broadcast('$ionicView.afterEnter', {});
    expect(spy).not.toHaveBeenCalled();
    spy.reset();

    el.scope().hide = true;
    $rootScope.$digest();
    expect(spy).toHaveBeenCalledWith(false);
    spy.reset();

    $rootScope.$broadcast('$ionicView.beforeLeave', {});
    el.scope().hide = false;
    $rootScope.$digest();
    expect(spy).not.toHaveBeenCalled();
    spy.reset();
  }));

  it('should only observe hideBackButton attr after afterEnter and before beforeLeave', inject(function($rootScope) {
    var el = setup('hide-back-button="hide"', {hide: false});
    $rootScope.$broadcast('$ionicView.beforeEnter', {});
    var spy = el.data('$ionNavViewController').showBackButton;
    expect(spy).not.toHaveBeenCalled();
    spy.reset();

    $rootScope.$broadcast('$ionicView.afterEnter', {});
    expect(spy).not.toHaveBeenCalled();
    spy.reset();

    el.scope().hide = true;
    $rootScope.$digest();
    expect(spy).toHaveBeenCalledWith(false);
    spy.reset();

    $rootScope.$broadcast('$ionicView.beforeLeave', {});
    el.scope().hide = false;
    $rootScope.$digest();
    expect(spy).not.toHaveBeenCalled();
    spy.reset();
  }));

});
