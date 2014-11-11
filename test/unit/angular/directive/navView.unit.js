
describe('Ionic nav-view', function() {
  beforeEach(module('ionic'));

  var compile, viewService, $rootScope, elem;

  var aState = {
    template: 'aState template'
  },
  bState = {
    template: 'bState template'
  },
  cState = {
    views: {
      'cview': {
        template: 'cState cview template'
      }
    }
  },
  dState = {
    views: {
      'dview1': {
        template: 'dState dview1 template'
      },
      'dview2': {
        template: 'dState dview2 template'
      }
    }
  },
  eUiViewState = {
    template: '<div ui-view="eview" class="eview"></div>'
  },
  eNavViewState = {
    template: '<ion-nav-view name="eview" class="eview"></ion-nav-view>'
  },
  fUiViewState = {
    views: {
      'eview': {
        template: 'fState eview template'
      }
    }
  },
  fNavViewState = {
    views: {
      'eview': {
        template: 'fState eview template'
      }
    }
  },
  gUiViewState = {
    template: '<div ui-view="inner"><span>{{content}}</span></div>'
  },
  hUiViewState = {
    views: {
      'inner': {
        template: 'hUiViewState inner template'
      }
    }
  },
  gNavViewState = {
    template: '<ion-nav-view name="inner"><span>{{content}}</span></ion-nav-view>'
  },
  hNavViewState = {
    views: {
      'inner': {
        template: 'hNavViewState inner template'
      }
    }
  },
  iState = {
    template: '<ion-nav-view>'+
        '<ul><li ng-repeat="item in items">{{item}}</li></ul>'+
      '</ion-nav-view>'
  },
  jState = {
    template: 'jState'
  },
  page1State = {
    template: 'page1'
  },
  page2State = {
    template: 'page2'
  },
  page3State = {
    template: 'page3'
  },
  page4State = {
    template: 'page4'
  },
  page5State = {
    template: 'page5'
  },
  ionView1State = {
    template: '<ion-view>ionView1</ion-view>'
  },
  ionView2State = {
    template: '<ion-view>ionView2</ion-view>'
  },
  ionViewCacheFalseAttrState = {
    template: '<ion-view cache-view="false">ionViewCacheFalseAttr</ion-view>'
  },
  ionViewCacheFalsePropertyState = {
    template: '<ion-view>ionViewCacheFalsePropertyState</ion-view>',
    cache: false
  };

  beforeEach(module(function ($stateProvider) {
    $stateProvider
      .state('a', aState)
      .state('b', bState)
      .state('c', cState)
      .state('d', dState)
      .state('eUiView', eUiViewState)
      .state('eNavView', eNavViewState)
      .state('eUiView.f', fUiViewState)
      .state('eNavView.f', fNavViewState)
      .state('gUiView', gUiViewState)
      .state('gUiView.hUiView', hUiViewState)
      .state('gNavView', gNavViewState)
      .state('gNavView.hNavView', hNavViewState)
      .state('i', iState)
      .state('j', jState)
      .state('page1', page1State)
      .state('page2', page2State)
      .state('page3', page3State)
      .state('page4', page4State)
      .state('page5', page5State)
      .state('ionView1', ionView1State)
      .state('ionView2', ionView2State)
      .state('ionViewCacheFalseAttr', ionViewCacheFalseAttrState)
      .state('ionViewCacheFalseProperty', ionViewCacheFalsePropertyState);
  }));

  beforeEach(inject(function(_$compile_, $ionicHistory, $ionicConfig, $rootScope) {
    viewService = $ionicHistory;
    $compile = _$compile_;
    scope = $rootScope.$new();
    elem = angular.element('<div>');

    ionic.Platform.setPlatform('ios');
    $ionicConfig.views.transition('none');
    $ionicConfig.views.maxCache(30);
    $ionicConfig.views.forwardCache(false);
    ionic.requestAnimationFrame = function(cb){cb()};
  }));

  it('should publish a controller', function() {
    var view = angular.element('<ion-nav-view></ion-nav-view>');
    $compile(view)(scope);
    scope.$apply();
    expect(view.controller('ionNavView')).toBeTruthy();
  });

  it('anonymous ui-view should be replaced with the template of the current $state', inject(function ($state, $q) {
    elem.append($compile('<div><ui-view>ui view</ui-view></div>')(scope));
    expect(elem.find('ui-view').text()).toBe('ui view');

    $state.go(aState);

    $q.flush();

    expect(elem.find('ui-view').text()).toBe(aState.template);
  }));

  it('anonymous ion-nav-view should be replaced with the template of the current $state', inject(function ($state, $q) {
    elem.append($compile('<div><ion-nav-view>nav view--</ion-nav-view></div>')(scope));
    expect(elem.find('ion-nav-view').text()).toBe('nav view--');

    $state.go(aState);

    $q.flush();

    expect(elem.find('ion-nav-view').text()).toBe('nav view--' + aState.template);
  }));

  it('named ion-nav-view should be replaced with the template of the current $state', inject(function ($state, $q) {
    elem.append($compile('<div><ion-nav-view name="cview"></ion-nav-view</div>')(scope));

    $state.go(cState);

    $q.flush();

    expect(elem.find('ion-nav-view').text()).toBe(cState.views.cview.template);
  }));

  it('ion-nav-view should be updated after transition to another state', inject(function ($state, $q) {
    elem.append($compile('<div><ion-nav-view></ion-nav-view></div>')(scope));
    expect(elem.find('ion-nav-view').text()).toBe('');

    $state.go(aState);
    $q.flush();

    expect(elem.find('ion-nav-view').text()).toBe(aState.template);

    $state.go(bState);
    $q.flush();

    expect(elem.find('ion-nav-view').text()).toBe(aState.template + bState.template);

  }));

  it('should handle NOT nested ion-nav-view', inject(function ($state, $q, $timeout) {
    elem.append($compile('<div><ion-nav-view name="dview1" class="dview1"></ion-nav-view><ion-nav-view name="dview2" class="dview2"></ion-nav-view></div>')(scope));
    expect(elem.find('ion-nav-view').eq(0).text()).toBe('');
    expect(elem.find('ion-nav-view').eq(1).text()).toBe('');

    $state.go(dState);
    $q.flush();
    $timeout.flush();

    expect(elem.find('ion-nav-view').eq(0).text()).toBe(dState.views.dview1.template);
    expect(elem.find('ion-nav-view').eq(1).text()).toBe(dState.views.dview2.template);
  }));

  it('should handle nested ui-views (testing two levels deep)', inject(function ($state, $q, $timeout) {
    $compile(elem.append('<div><ui-view></ui-view></div>'))(scope);
    expect(elem.find('ui-view').text()).toBe('');

    $state.go(fUiViewState);
    $q.flush();

    expect(elem.find('ui-view').text()).toBe(fUiViewState.views.eview.template);
  }));

  it('should handle nested ion-nav-view (testing two levels deep)', inject(function ($state, $q, $timeout) {
    $compile(elem.append('<div><ion-nav-view></ion-nav-view></div>'))(scope);
    expect(elem.find('ion-nav-view').text()).toBe('');

    $state.go(fNavViewState);
    $q.flush();
    $timeout.flush();

    expect(elem.find('ion-nav-view').text()).toBe(fNavViewState.views.eview.template + fNavViewState.views.eview.template);
  }));

  it('initial view should be compiled if the view is empty', inject(function ($state, $q, $timeout) {
    var content = 'inner content';
    scope.content = content;
    elem.append($compile('<div><ion-nav-view></ion-nav-view></div>')(scope));

    $state.go(gNavViewState);
    $q.flush();
    $timeout.flush();

    expect(elem.eq(0).find('ion-nav-view').find('ion-nav-view').text()).toBe(content);
  }));

  it('initial view should be put back after removal of the view', inject(function ($state, $q) {
    var content = 'inner content';
    scope.content = content;
    elem.append($compile('<div><ui-view></ui-view></div>')(scope));

    $state.go(hUiViewState);
    $q.flush();

    expect(elem.find('ui-view').text()).toBe(hUiViewState.views.inner.template);

    // going to the parent state which makes the inner view empty
    $state.go(gUiViewState);
    $q.flush();

    expect(elem.find('ui-view').text()).toBe(content);
  }));

  // ION-NAV-VIEW CANNOT DO THIS!!!!!!
  // it('initial view should be put back after removal of the view', inject(function ($state, $q) {
  //   var content = 'inner content';
  //   scope.content = content;
  //   elem.append($compile('<div><ion-nav-view></ion-nav-view></div>')(scope));

  //   $state.go(hNavViewState);
  //   $q.flush();

  //   var orgElement = elem.find('div').find('ion-nav-view').find('ion-nav-view').find('span');

  //   expect(orgElement.text()).toBe(content);
  //   expect(orgElement.hasClass('nav-view-cache')).toBe(true);

  //   var newElement = elem.find('div').find('ion-nav-view').find('ion-nav-view').find('div');
  //   expect(newElement.text()).toBe(hNavViewState.views.inner.template);
  //   expect(newElement.hasClass('nav-view-cache')).toBe(false);

  //   // going to the parent state which makes the inner view empty
  //   $state.go(gNavViewState);
  //   $q.flush();

  //   expect(elem.find('ion-nav-view').text()).toBe(content);
  // }));

  it('initial view should be transcluded once to prevent breaking other directives', inject(function ($rootScope, $state, $q, $timeout) {
    scope.items = ["list", "of", "items"];

    elem.append($compile('<div><ion-nav-view></ion-nav-view></div>')(scope));

    // transition to state that has an initial view
    $state.go(iState);
    $q.flush();
    $timeout.flush();
    $timeout.flush();

    // verify if ng-repeat has been compiled
    expect(elem.find('li').length).toBe(scope.items.length);

    // transition to another state that replace the initial content
    $state.go(jState);
    $q.flush();
    $timeout.flush();
    $timeout.flush();

    expect(elem[0].querySelector('[nav-view="active"]').innerText).toBe(jState.template);

    // transition back to the state with empty subview and the initial view
    $state.go(iState);
    $q.flush();
    $timeout.flush();
    $timeout.flush();

    // verify if the initial view is correct
    expect(elem[0].querySelectorAll('[nav-view="active"] li').length).toBe(scope.items.length);

    expect(elem.find('li').length).toBe(scope.items.length);

    // change scope properties
    scope.$apply(function () {
      scope.items.push(".", "Working?");
    });

    // verify if the initial view has been updated
    expect(elem.find('li').length).toBe(scope.items.length);
  }));

  it('should handle ion-nav-view inside ng-if', inject(function ($state, $q, $compile) {
    scope.someBoolean = false;
    elem.append($compile('<div ng-if="someBoolean"><ion-nav-view></ion-nav-view></div>')(scope));

    $state.go(aState);
    $q.flush();

    // Verify there is no ion-nav-view in the DOM
    expect(elem.find('ion-nav-view').length).toBe(0);

    // Turn on the div that holds the ui-view
    scope.someBoolean = true;
    scope.$digest();

    // Verify that the ion-nav-view is there and it has the correct content
    expect(elem.find('ion-nav-view').text()).toBe(aState.template);

    // Turn off the ui-view
    scope.someBoolean = false;
    scope.$digest();

    // Verify there is ion-nav ion-nav-view in the DOM
    expect(elem.find('ion-nav-view').length).toBe(0);

    // Turn on the div that holds the ion-nav-view once again
    scope.someBoolean = true;
    scope.$digest();

    // Verify that the ui-view is there and it has the correct content
    expect(elem.find('ion-nav-view').text()).toBe(aState.template);
  }));

  it('should add multiple ion-nav-view', inject(function ($state, $q, $timeout, $compile) {
    elem.append($compile('<div><ion-nav-view></ion-nav-view></div>')(scope));

    expect(elem.find('ion-nav-view').find('div').length).toBe(0);

    $state.go(page1State);
    $q.flush();
    $timeout.flush();
    $timeout.flush();
    var divs = elem.find('ion-nav-view').find('div');
    expect(divs.length).toBe(1);
    expect(divs.eq(0).attr('nav-view')).toBe('active');
    expect(divs.eq(0).text()).toBe('page1');

    $state.go(page2State);
    $q.flush();
    $timeout.flush();
    $timeout.flush();
    divs = elem.find('ion-nav-view').find('div');
    expect(divs.length).toBe(2);

    expect(divs.eq(0).attr('nav-view')).toBe('cached');
    expect(divs.eq(0).text()).toBe('page1');

    expect(divs.eq(1).attr('nav-view')).toBe('active');
    expect(divs.eq(1).text()).toBe('page2');

    $state.go(page3State);
    $q.flush();
    $timeout.flush();
    $timeout.flush();
    divs = elem.find('ion-nav-view').find('div');
    expect(divs.length).toBe(3);

    expect(divs.eq(0).attr('nav-view')).toBe('cached');
    expect(divs.eq(0).text()).toBe('page1');

    expect(divs.eq(1).attr('nav-view')).toBe('cached');
    expect(divs.eq(1).text()).toBe('page2');

    expect(divs.eq(2).attr('nav-view')).toBe('active');
    expect(divs.eq(2).text()).toBe('page3');

    $state.go(page4State);
    $q.flush();
    $timeout.flush();
    $timeout.flush();
    divs = elem.find('ion-nav-view').find('div');
    expect(divs.length).toBe(4);

    expect(divs.eq(0).attr('nav-view')).toBe('cached');
    expect(divs.eq(0).text()).toBe('page1');

    expect(divs.eq(1).attr('nav-view')).toBe('cached');
    expect(divs.eq(1).text()).toBe('page2');

    expect(divs.eq(2).attr('nav-view')).toBe('cached');
    expect(divs.eq(2).text()).toBe('page3');

    expect(divs.eq(3).attr('nav-view')).toBe('active');
    expect(divs.eq(3).text()).toBe('page4');
  }));

  it('should remove ion-nav-views when going back', inject(function ($state, $q, $timeout, $compile) {
    elem.append($compile('<div><ion-nav-view></ion-nav-view></div>')(scope));

    $state.go(page1State);
    $q.flush();
    $timeout.flush();
    $timeout.flush();

    $state.go(page2State);
    $q.flush();
    $timeout.flush();
    $timeout.flush();

    $state.go(page3State);
    $q.flush();
    $timeout.flush();
    $timeout.flush();

    $state.go(page4State);
    $q.flush();
    $timeout.flush();
    $timeout.flush();

    var divs = elem.find('ion-nav-view').find('div');
    expect(divs.length).toBe(4);
    expect(divs.eq(0).attr('nav-view')).toBe('cached');
    expect(divs.eq(1).attr('nav-view')).toBe('cached');
    expect(divs.eq(2).attr('nav-view')).toBe('cached');
    expect(divs.eq(3).attr('nav-view')).toBe('active');

    $state.go(page3State);
    $q.flush();
    $timeout.flush();
    $timeout.flush();
    divs = elem.find('ion-nav-view').find('div');
    expect(divs.length).toBe(3);
    expect(divs.eq(0).attr('nav-view')).toBe('cached');
    expect(divs.eq(1).attr('nav-view')).toBe('cached');
    expect(divs.eq(2).attr('nav-view')).toBe('active');

    $state.go(page2State);
    $q.flush();
    $timeout.flush();
    $timeout.flush();
    divs = elem.find('ion-nav-view').find('div');
    expect(divs.length).toBe(2);
    expect(divs.eq(0).attr('nav-view')).toBe('cached');
    expect(divs.eq(1).attr('nav-view')).toBe('active');

    $state.go(page1State);
    $q.flush();
    $timeout.flush();
    $timeout.flush();
    divs = elem.find('ion-nav-view').find('div');
    expect(divs.length).toBe(1);
    expect(divs.eq(0).attr('nav-view')).toBe('active');
  }));

  it('should not cache ion-nav-views that were forward when moving back', inject(function ($state, $q, $timeout, $compile, $ionicConfig) {
    elem.append($compile('<div><ion-nav-view></ion-nav-view></div>')(scope));

    $ionicConfig.views.maxCache(2);

    $state.go(page1State);
    $q.flush();
    $timeout.flush();
    $timeout.flush();
    expect(elem.find('ion-nav-view').find('div').length).toBe(1);

    $state.go(page2State);
    $q.flush();
    $timeout.flush();
    $timeout.flush();
    expect(elem.find('ion-nav-view').find('div').length).toBe(2);

    $state.go(page3State);
    $q.flush();
    $timeout.flush();
    $timeout.flush();
    expect(elem.find('ion-nav-view').find('div').length).toBe(3);

    $state.go(page4State);
    $q.flush();
    $timeout.flush();
    $timeout.flush();
    expect(elem.find('ion-nav-view').find('div').length).toBe(3);

    $state.go(page3State);
    $q.flush();
    $timeout.flush();
    $timeout.flush();
    expect(elem.find('ion-nav-view').find('div').length).toBe(2);

    $state.go(page2State);
    $q.flush();
    $timeout.flush();
    $timeout.flush();
    expect(elem.find('ion-nav-view').find('div').length).toBe(1);

    $state.go(page1State);
    $q.flush();
    $timeout.flush();
    $timeout.flush();
    expect(elem.find('ion-nav-view').find('div').length).toBe(1);
  }));

  it('should cache ion-nav-views that were forward when moving back with $ionicConfig.cacheForwardViews=true', inject(function ($state, $q, $timeout, $compile, $ionicConfig) {
    elem.append($compile('<div><ion-nav-view></ion-nav-view></div>')(scope));

    $ionicConfig.views.forwardCache(true);

    $state.go(page1State);
    $q.flush();
    $timeout.flush();
    expect(elem.find('ion-nav-view').find('div').length).toBe(1);

    $state.go(page2State);
    $q.flush();
    $timeout.flush();
    expect(elem.find('ion-nav-view').find('div').length).toBe(2);

    $state.go(page3State);
    $q.flush();
    $timeout.flush();
    expect(elem.find('ion-nav-view').find('div').length).toBe(3);

    $state.go(page4State);
    $q.flush();
    $timeout.flush();
    expect(elem.find('ion-nav-view').find('div').length).toBe(4);

    $state.go(page3State);
    $q.flush();
    $timeout.flush();
    expect(elem.find('ion-nav-view').find('div').length).toBe(4);

    $state.go(page2State);
    $q.flush();
    $timeout.flush();
    expect(elem.find('ion-nav-view').find('div').length).toBe(4);

    $state.go(page1State);
    $q.flush();
    $timeout.flush();
    expect(elem.find('ion-nav-view').find('div').length).toBe(4);
  }));

  it('should not cache ion-views with the cache-view="true" attribute', inject(function ($state, $q, $timeout, $compile, $ionicConfig) {
    elem.append($compile('<div><ion-nav-view></ion-nav-view></div>')(scope));

    $state.go(ionView1State);
    $q.flush();
    $timeout.flush();
    $timeout.flush();
    expect(elem.find('ion-nav-view').find('ion-view').length).toBe(1);
    expect(elem.find('ion-nav-view').find('ion-view').eq(0).text()).toBe('ionView1');

    $state.go(ionViewCacheFalseAttrState);
    $q.flush();
    $timeout.flush();
    $timeout.flush();
    expect(elem.find('ion-nav-view').find('ion-view').length).toBe(2);
    expect(elem.find('ion-nav-view').find('ion-view').eq(0).text()).toBe('ionView1');
    expect(elem.find('ion-nav-view').find('ion-view').eq(1).text()).toBe('ionViewCacheFalseAttr');

    $state.go(ionView2State);
    $q.flush();
    $timeout.flush();
    $timeout.flush();
    expect(elem.find('ion-nav-view').find('ion-view').length).toBe(2);
    expect(elem.find('ion-nav-view').find('ion-view').eq(0).text()).toBe('ionView1');
    expect(elem.find('ion-nav-view').find('ion-view').eq(1).text()).toBe('ionView2');
  }));

  it('should not cache ion-views with the cache=false state property', inject(function ($state, $q, $timeout, $compile, $ionicConfig) {
    elem.append($compile('<div><ion-nav-view></ion-nav-view></div>')(scope));

    $state.go(ionView1State);
    $q.flush();
    $timeout.flush();
    $timeout.flush();
    expect(elem.find('ion-nav-view').find('ion-view').length).toBe(1);
    expect(elem.find('ion-nav-view').find('ion-view').eq(0).text()).toBe('ionView1');

    $state.go(ionViewCacheFalsePropertyState);
    $q.flush();
    $timeout.flush();
    $timeout.flush();
    expect(elem.find('ion-nav-view').find('ion-view').length).toBe(2);
    expect(elem.find('ion-nav-view').find('ion-view').eq(0).text()).toBe('ionView1');
    expect(elem.find('ion-nav-view').find('ion-view').eq(1).text()).toBe('ionViewCacheFalsePropertyState');

    $state.go(ionView2State);
    $q.flush();
    $timeout.flush();
    $timeout.flush();
    expect(elem.find('ion-nav-view').find('ion-view').length).toBe(2);
    expect(elem.find('ion-nav-view').find('ion-view').eq(0).text()).toBe('ionView1');
    expect(elem.find('ion-nav-view').find('ion-view').eq(1).text()).toBe('ionView2');
  }));

  it('should remove the oldest accessed view (not the oldest, but oldest accessed)', inject(function ($state, $q, $timeout, $compile, $ionicConfig) {
    elem.append($compile('<div><ion-nav-view></ion-nav-view></div>')(scope));

    $ionicConfig.views.maxCache(3);

    $state.go(page1State);
    $q.flush();
    $timeout.flush();
    $timeout.flush();
    var divs = elem.find('ion-nav-view').find('div');
    expect(divs.length).toBe(1);
    expect(divs.eq(0).text()).toBe('page1');

    $state.go(page2State);
    $q.flush();
    $timeout.flush();
    $timeout.flush();
    divs = elem.find('ion-nav-view').find('div');
    expect(divs.length).toBe(2);
    expect(divs.eq(1).text()).toBe('page2');

    $state.go(page3State);
    $q.flush();
    $timeout.flush();
    $timeout.flush();
    divs = elem.find('ion-nav-view').find('div');
    expect(divs.length).toBe(3);
    expect(divs.eq(2).text()).toBe('page3');

    $state.go(page4State);
    $q.flush();
    $timeout.flush();
    $timeout.flush();
    divs = elem.find('ion-nav-view').find('div');
    expect(divs.length).toBe(4);

    $state.go(page1State);
    $q.flush();
    $timeout.flush();
    $timeout.flush();
    divs = elem.find('ion-nav-view').find('div');
    expect(divs.length).toBe(4);

    $state.go(page5State);
    $q.flush();
    $timeout.flush();
    $timeout.flush();
    divs = elem.find('ion-nav-view').find('div');
    expect(divs.length).toBe(4);
    expect(divs.eq(0).text()).toBe('page1');
    expect(divs.eq(1).text()).toBe('page3');
    expect(divs.eq(2).text()).toBe('page4');
    expect(divs.eq(3).text()).toBe('page5');
  }));

});

angular.module('ngMock').config(function ($provide) {
  $provide.decorator('$q', function ($delegate, $rootScope) {
    $delegate.flush = function() {
      $rootScope.$digest();
    };

    // Add callbacks to the promise that expose the resolved value/error
    function expose(promise) {
      // Don't add hooks to the same promise twice (shouldn't happen anyway)
      if (!promise.hasOwnProperty('$$resolved')) {
        promise.$$resolved = false;
        promise.then(function (value) {
          promise.$$resolved = { success: true, value: value };
        }, function (error) {
          promise.$$resolved = { success: false, error: error };
        });

        // We need to expose() any then()ed promises recursively
        var qThen = promise.then;
        promise.then = function () {
          return expose(qThen.apply(this, arguments));
        };
      }
      return promise;
    }

    // Wrap functions that return a promise
    angular.forEach([ 'when', 'all', 'reject'], function (name) {
      var qFunc = $delegate[name];
      $delegate[name] = function () {
        return expose(qFunc.apply(this, arguments));
      };
    });

    // Wrap defer()
    var qDefer = $delegate.defer;
    $delegate.defer = function () {
      var deferred = qDefer();
      expose(deferred.promise);
      return deferred;
    };

    return $delegate;
  });
});
