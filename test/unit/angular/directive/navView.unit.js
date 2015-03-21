
describe('Ionic nav-view', function() {
  beforeEach(module('ionic'));

  var compile, $rootScope, elem;

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
  },
  rootView1State = {
    views: {
      'root': {
        template: '<ion-view>rootView1State</ion-view>'
      }
    }
  },
  rootView2State = {
    views: {
      'root': {
        template: '<ion-view>rootView2State</ion-view>'
      }
    }
  },
  rootView1NoCacheState = {
    cache: 'false',
    views: {
      'root': {
        template: '<ion-view>rootView1NoCacheState</ion-view>'
      }
    }
  },
  tabAbstractState = {
    abstract: true,
    views: {
      'root': {
        template: '<ion-tabs>' +
                    '<ion-tab><ion-nav-view name="tab1"></ion-nav-view></ion-tab>' +
                    '<ion-tab><ion-nav-view name="tab2"></ion-nav-view></ion-tab>' +
                    '<ion-tab><ion-nav-view name="tab3"></ion-nav-view></ion-tab>' +
                    '<ion-tab><ion-view><h2>Inline Tab</h2></ion-view></ion-tab>' +
                   '</ion-tabs>'
      }
    }
  },
  tab1page1State = {
    views: {
      'tab1': {
        template: 'tab1page1'
      }
    }
  },
  tab2page1State = {
    views: {
      'tab2': {
        template: 'tab2page1'
      }
    }
  },
  tab3page1State = {
    views: {
      'tab3': {
        template: 'tab3page1'
      }
    }
  },
  tab3page2NoCacheState = {
    cache: false,
    views: {
      'tab3': {
        template: 'tab3page2NoCache'
      }
    }
  }
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
      .state('ionViewCacheFalseProperty', ionViewCacheFalsePropertyState)
      .state('tabAbstract', tabAbstractState)
      .state('tabAbstract.tab1page1', tab1page1State)
      .state('tabAbstract.tab2page1', tab2page1State)
      .state('tabAbstract.tab3page1', tab3page1State)
      .state('tabAbstract.tab3page2', tab3page2NoCacheState)
      .state('rootView1', rootView1State)
      .state('rootView2', rootView2State)
      .state('rootView1NoCache', rootView1NoCacheState);
  }));

  beforeEach(inject(function(_$compile_, $ionicConfig, $rootScope) {
    $compile = _$compile_;
    scope = $rootScope.$new();
    elem = angular.element('<div>');

    ionic.Platform.setPlatform('ios');
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

    // verify if ng-repeat has been compiled
    expect(elem.find('li').length).toBe(scope.items.length);

    // transition to another state that replace the initial content
    $state.go(jState);
    $q.flush();
    $timeout.flush();

    expect(elem[0].querySelector('[nav-view="active"]').innerText).toBe(jState.template);

    // transition back to the state with empty subview and the initial view
    $state.go(iState);
    $q.flush();
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
    var divs = elem.find('ion-nav-view').find('div');
    expect(divs.length).toBe(1);
    expect(divs.eq(0).attr('nav-view')).toBe('active');
    expect(divs.eq(0).text()).toBe('page1');

    $state.go(page2State);
    $q.flush();
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

    $state.go(page2State);
    $q.flush();
    $timeout.flush();

    $state.go(page3State);
    $q.flush();
    $timeout.flush();

    $state.go(page4State);
    $q.flush();
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
    divs = elem.find('ion-nav-view').find('div');
    expect(divs.length).toBe(3);
    expect(divs.eq(0).attr('nav-view')).toBe('cached');
    expect(divs.eq(1).attr('nav-view')).toBe('cached');
    expect(divs.eq(2).attr('nav-view')).toBe('active');

    $state.go(page2State);
    $q.flush();
    $timeout.flush();
    divs = elem.find('ion-nav-view').find('div');
    expect(divs.length).toBe(2);
    expect(divs.eq(0).attr('nav-view')).toBe('cached');
    expect(divs.eq(1).attr('nav-view')).toBe('active');

    $state.go(page1State);
    $q.flush();
    $timeout.flush();
    divs = elem.find('ion-nav-view').find('div');
    expect(divs.length).toBe(1);
    expect(divs.eq(0).attr('nav-view')).toBe('active');
  }));

  it('should disconnect and reconnect view scopes', inject(function ($state, $q, $timeout, $compile) {
    elem.append($compile('<div><ion-nav-view></ion-nav-view></div>')(scope));

    $state.go(page1State);
    $q.flush();
    $timeout.flush();

    var divs = elem.find('ion-nav-view').find('div');
    expect(divs.eq(0).scope().$$disconnected).toBeUndefined();

    $state.go(page2State);
    $q.flush();
    $timeout.flush();

    divs = elem.find('ion-nav-view').find('div');
    expect(divs.eq(0).scope().$$disconnected).toBe(true);
    expect(divs.eq(1).scope().$$disconnected).toBeUndefined();

    $state.go(page1State);
    $q.flush();
    $timeout.flush();
    divs = elem.find('ion-nav-view').find('div');
    expect(divs.eq(0).scope().$$disconnected).toBe(false);
  }));

  it('should not cache ion-nav-views that were forward when moving back', inject(function ($state, $q, $timeout, $compile, $ionicConfig) {
    elem.append($compile('<div><ion-nav-view></ion-nav-view></div>')(scope));

    var unloaded;
    scope.$on('$ionicView.unloaded', function(ev, d){
      unloaded = d;
    });

    $ionicConfig.views.maxCache(2);

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
    expect(unloaded).toBeUndefined();

    $state.go(page4State);
    $q.flush();
    $timeout.flush();
    expect(elem.find('ion-nav-view').find('div').length).toBe(3);
    expect(unloaded.historyId).toBe('root');
    expect(unloaded.stateName).toBe('page1');

    $state.go(page3State);
    $q.flush();
    $timeout.flush();
    expect(elem.find('ion-nav-view').find('div').length).toBe(2);
    expect(unloaded.stateName).toBe('page4');

    $state.go(page2State);
    $q.flush();
    $timeout.flush();
    expect(elem.find('ion-nav-view').find('div').length).toBe(1);
    expect(unloaded.stateName).toBe('page3');

    $state.go(page1State);
    $q.flush();
    $timeout.flush();
    expect(elem.find('ion-nav-view').find('div').length).toBe(1);
    expect(unloaded.stateName).toBe('page2');
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
    expect(elem.find('ion-nav-view').find('ion-view').length).toBe(1);
    expect(elem.find('ion-nav-view').find('ion-view').eq(0).text()).toBe('ionView1');

    $state.go(ionViewCacheFalseAttrState);
    $q.flush();
    $timeout.flush();
    expect(elem.find('ion-nav-view').find('ion-view').length).toBe(2);
    expect(elem.find('ion-nav-view').find('ion-view').eq(0).text()).toBe('ionView1');
    expect(elem.find('ion-nav-view').find('ion-view').eq(1).text()).toBe('ionViewCacheFalseAttr');

    $state.go(ionView2State);
    $q.flush();
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
    expect(elem.find('ion-nav-view').find('ion-view').length).toBe(1);
    expect(elem.find('ion-nav-view').find('ion-view').eq(0).text()).toBe('ionView1');

    $state.go(ionViewCacheFalsePropertyState);
    $q.flush();
    $timeout.flush();
    expect(elem.find('ion-nav-view').find('ion-view').length).toBe(2);
    expect(elem.find('ion-nav-view').find('ion-view').eq(0).text()).toBe('ionView1');
    expect(elem.find('ion-nav-view').find('ion-view').eq(1).text()).toBe('ionViewCacheFalsePropertyState');

    $state.go(ionView2State);
    $q.flush();
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
    var divs = elem.find('ion-nav-view').find('div');
    expect(divs.length).toBe(1);
    expect(divs.eq(0).text()).toBe('page1');

    $state.go(page2State);
    $q.flush();
    $timeout.flush();
    divs = elem.find('ion-nav-view').find('div');
    expect(divs.length).toBe(2);
    expect(divs.eq(1).text()).toBe('page2');

    $state.go(page3State);
    $q.flush();
    $timeout.flush();
    divs = elem.find('ion-nav-view').find('div');
    expect(divs.length).toBe(3);
    expect(divs.eq(2).text()).toBe('page3');

    $state.go(page4State);
    $q.flush();
    $timeout.flush();
    divs = elem.find('ion-nav-view').find('div');
    expect(divs.length).toBe(4);

    $state.go(page1State);
    $q.flush();
    $timeout.flush();
    divs = elem.find('ion-nav-view').find('div');
    expect(divs.length).toBe(4);

    $state.go(page5State);
    $q.flush();
    $timeout.flush();
    divs = elem.find('ion-nav-view').find('div');
    expect(divs.length).toBe(4);
    expect(divs.eq(0).text()).toBe('page1');
    expect(divs.eq(1).text()).toBe('page3');
    expect(divs.eq(2).text()).toBe('page4');
    expect(divs.eq(3).text()).toBe('page5');
  }));

  it('should emit $ionicView loaded event only once if cached', inject(function ($state, $q, $timeout, $compile) {
    var loaded;
    scope.$on('$ionicView.loaded', function(ev, d){
      loaded = d;
    });

    elem.append($compile('<div><ion-nav-view></ion-nav-view></div>')(scope));

    $state.go(page1State);
    $q.flush();
    $timeout.flush();

    expect(loaded.stateName).toEqual('page1');
    loaded = null;

    $state.go(page2State);
    $q.flush();
    $timeout.flush();
    expect(loaded.stateName).toEqual('page2');
    loaded = null;

    $state.go(page1State);
    $q.flush();
    $timeout.flush();

    expect(loaded).toEqual(null);

    $state.go(page2State);
    $q.flush();
    $timeout.flush();

    expect(loaded.stateName).toEqual('page2');
    loaded = null;
  }));

  it('should emit $ionicView enter events', inject(function ($state, $q, $timeout, $compile) {
    var beforeEnter, afterEnter, enter;
    scope.$on('$ionicView.beforeEnter', function(ev, d){
      beforeEnter = d;
    });
    scope.$on('$ionicView.afterEnter', function(ev, d){
      afterEnter = d;
    });
    scope.$on('$ionicView.enter', function(ev, d){
      enter = d;
    });

    elem.append($compile('<div><ion-nav-view></ion-nav-view></div>')(scope));

    $state.go(page1State);
    $q.flush();
    $timeout.flush();

    expect(beforeEnter.stateName).toEqual('page1');
    expect(afterEnter.stateName).toEqual('page1');
    expect(enter.stateName).toEqual('page1');
    expect(enter.fromCache).toEqual(false);
    expect(enter.transitionId).toEqual(1);

    $state.go(page2State);
    $q.flush();
    $timeout.flush();

    expect(beforeEnter.stateName).toEqual('page2');
    expect(afterEnter.stateName).toEqual('page2');
    expect(enter.stateName).toEqual('page2');
    expect(enter.fromCache).toEqual(false);
    expect(enter.transitionId).toEqual(2);

    $state.go(page1State);
    $q.flush();
    $timeout.flush();

    expect(beforeEnter.stateName).toEqual('page1');
    expect(afterEnter.stateName).toEqual('page1');
    expect(enter.stateName).toEqual('page1');
    expect(enter.fromCache).toEqual(true);
    expect(enter.transitionId).toEqual(3);
  }));

  it('should emit $ionicView leave events', inject(function ($state, $q, $timeout, $compile) {
    var beforeLeave, afterLeave, leave;
    scope.$on('$ionicView.beforeLeave', function(ev, d){
      beforeLeave = d;
    });
    scope.$on('$ionicView.afterLeave', function(ev, d){
      afterLeave = d;
    });
    scope.$on('$ionicView.leave', function(ev, d){
      leave = d;
    });

    elem.append($compile('<div><ion-nav-view></ion-nav-view></div>')(scope));

    $state.go(page1State);
    $q.flush();
    $timeout.flush();

    $state.go(page2State);
    $q.flush();
    $timeout.flush();

    expect(beforeLeave.stateName).toEqual('page1');
    expect(afterLeave.stateName).toEqual('page1');
    expect(leave.stateName).toEqual('page1');
    expect(leave.transitionId).toEqual(2);

    $state.go(page1State);
    $q.flush();
    $timeout.flush();

    expect(beforeLeave.stateName).toEqual('page2');
    expect(afterLeave.stateName).toEqual('page2');
    expect(leave.stateName).toEqual('page2');
    expect(leave.transitionId).toEqual(3);

    $state.go(page2State);
    $q.flush();
    $timeout.flush();

    expect(beforeLeave.stateName).toEqual('page1');
    expect(afterLeave.stateName).toEqual('page1');
    expect(leave.stateName).toEqual('page1');
    expect(leave.transitionId).toEqual(4);
  }));

  it('should clear ion-nav-view cache', inject(function ($state, $q, $timeout, $compile, $ionicHistory) {
    elem.append($compile('<div><ion-nav-view></ion-nav-view></div>')(scope));

    var clearCacheCollection = [];
    scope.$on('$ionicView.unloaded', function(ev, d){
      clearCacheCollection.push(d);
    });

    $state.go(page1State);
    $q.flush();
    $timeout.flush();

    $state.go(page2State);
    $q.flush();
    $timeout.flush();

    $state.go(page3State);
    $q.flush();
    $timeout.flush();

    var divs = elem.find('ion-nav-view').find('div');
    expect(divs.length).toBe(3);

    expect(divs.eq(0).attr('nav-view')).toBe('cached');
    expect(divs.eq(0).text()).toBe('page1');

    expect(divs.eq(1).attr('nav-view')).toBe('cached');
    expect(divs.eq(1).text()).toBe('page2');

    expect(divs.eq(2).attr('nav-view')).toBe('active');
    expect(divs.eq(2).text()).toBe('page3');

    expect(clearCacheCollection.length).toBe(0);
    $ionicHistory.clearCache();

    expect(clearCacheCollection.length).toBe(2);
    expect(clearCacheCollection[0].stateName).toBe('page1');
    expect(clearCacheCollection[1].stateName).toBe('page2');
    clearCacheCollection = [];

    var divs = elem.find('ion-nav-view').find('div');
    expect(divs.length).toBe(1);

    expect(divs.eq(0).attr('nav-view')).toBe('active');
    expect(divs.eq(0).text()).toBe('page3');

    $ionicHistory.clearCache();
    expect(clearCacheCollection.length).toBe(0);

    var divs = elem.find('ion-nav-view').find('div');
    expect(divs.length).toBe(1);

    expect(divs.eq(0).attr('nav-view')).toBe('active');
    expect(divs.eq(0).text()).toBe('page3');

    $state.go(page2State);
    $q.flush();
    $timeout.flush();

    var divs = elem.find('ion-nav-view').find('div');
    expect(divs.length).toBe(1);

    expect(divs.eq(0).attr('nav-view')).toBe('active');
    expect(divs.eq(0).text()).toBe('page2');
    expect(clearCacheCollection[0].stateName).toBe('page3');
  }));

  it('should create and cache tabs', inject(function ($state, $q, $timeout, $compile, $ionicConfig) {
    elem.append($compile('<ion-nav-view name="root"></ion-nav-view>')(scope));

    $state.go(tab1page1State);
    $q.flush();
    $timeout.flush();

    var tab1Ele = elem[0].querySelector('ion-nav-view[name="tab1"]');
    expect(tab1Ele.getAttribute('nav-view')).toBe('active');

    $state.go(tab2page1State);
    $q.flush();
    $timeout.flush();

    var tab2Ele = elem[0].querySelector('ion-nav-view[name="tab2"]');
    expect(tab1Ele.getAttribute('nav-view')).toBe('cached');
    expect(tab2Ele.getAttribute('nav-view')).toBe('active');

    $state.go(tab3page1State);
    $q.flush();
    $timeout.flush();

    var tab3Ele = elem[0].querySelector('ion-nav-view[name="tab3"]');
    expect(tab1Ele.getAttribute('nav-view')).toBe('cached');
    expect(tab2Ele.getAttribute('nav-view')).toBe('cached');
    expect(tab3Ele.getAttribute('nav-view')).toBe('active');

    $state.go(tab1page1State);
    $q.flush();
    $timeout.flush();

    expect(tab1Ele.getAttribute('nav-view')).toBe('active');
    expect(tab2Ele.getAttribute('nav-view')).toBe('cached');
    expect(tab3Ele.getAttribute('nav-view')).toBe('cached');
  }));

  it('should not cache ion-views when going between history and its the first load, stateParam cache=false', inject(function ($state, $q, $timeout, $compile, $ionicConfig) {
    elem.append($compile('<ion-nav-view name="root"></ion-nav-view>')(scope));

    $state.go(rootView1NoCacheState);
    $q.flush();
    $timeout.flush();
    expect(elem.find('ion-nav-view').find('ion-view').length).toBe(1);
    expect(elem.find('ion-nav-view').find('ion-view').eq(0).text()).toBe('rootView1NoCacheState');

    $state.go(tab1page1State);
    $q.flush();
    $timeout.flush();

    var tab1Ele = elem[0].querySelector('ion-nav-view[name="tab1"]');
    expect(tab1Ele.getAttribute('nav-view')).toBe('active');

    expect(elem[0].querySelector('ion-nav-view[name="root"]').children.length).toBe(1);

    $state.go(tab2page1State);
    $q.flush();
    $timeout.flush();

    var tab2Ele = elem[0].querySelector('ion-nav-view[name="tab2"]');
    expect(tab2Ele.getAttribute('nav-view')).toBe('active');

    tab1Ele = elem[0].querySelector('ion-nav-view[name="tab1"]');
    expect(tab1Ele.getAttribute('nav-view')).toBe('cached');
  }));

  it('should not cache ion-views when going between history and its the first load, maxCache(0)', inject(function ($state, $q, $timeout, $compile, $ionicConfig) {
    elem.append($compile('<ion-nav-view name="root"></ion-nav-view>')(scope));

    $ionicConfig.views.maxCache(0);

    $state.go(rootView1State);
    $q.flush();
    $timeout.flush();
    expect(elem.find('ion-nav-view').find('ion-view').length).toBe(1);
    expect(elem.find('ion-nav-view').find('ion-view').eq(0).text()).toBe('rootView1State');

    $state.go(tab1page1State);
    $q.flush();
    $timeout.flush();

    var tab1Ele = elem[0].querySelector('ion-nav-view[name="tab1"]');
    expect(tab1Ele.getAttribute('nav-view')).toBe('active');
    expect(elem[0].querySelector('ion-nav-view[name="root"]').children.length).toBe(1);

    $state.go(tab2page1State);
    $q.flush();
    $timeout.flush();

    var tab2Ele = elem[0].querySelector('ion-nav-view[name="tab2"]');
    expect(tab2Ele.getAttribute('nav-view')).toBe('active');

    tab1Ele = elem[0].querySelector('ion-nav-view[name="tab1"]');
    expect(tab1Ele).toBe(null);
  }));

  it('should not cache any views when going root1 to tabs to root 2', inject(function ($state, $q, $timeout, $compile, $ionicConfig) {
    elem.append($compile('<ion-nav-view name="root"></ion-nav-view>')(scope));

    $ionicConfig.views.maxCache(0);

    $state.go(rootView1State);
    $q.flush();
    $timeout.flush();
    expect(elem[0].querySelector('ion-nav-view[name="root"]').children.length).toBe(1);

    $state.go(tab1page1State);
    $q.flush();
    $timeout.flush();
    expect(elem[0].querySelector('ion-nav-view[name="root"]').children.length).toBe(1);

    $state.go(rootView2State);
    $q.flush();
    $timeout.flush();
    expect(elem[0].querySelector('ion-nav-view[name="root"]').children.length).toBe(1);

    $state.go(rootView1State);
    $q.flush();
    $timeout.flush();
    expect(elem[0].querySelector('ion-nav-view[name="root"]').children.length).toBe(1);

    $state.go(tab1page1State);
    $q.flush();
    $timeout.flush();
    expect(elem[0].querySelector('ion-nav-view[name="root"]').children.length).toBe(1);

    $state.go(rootView2State);
    $q.flush();
    $timeout.flush();
    expect(elem[0].querySelector('ion-nav-view[name="root"]').children.length).toBe(1);
  }));

  it('should not cache a tab with cache false state property', inject(function ($state, $q, $timeout, $compile, $ionicConfig) {
    elem.append($compile('<ion-nav-view name="root"></ion-nav-view>')(scope));

    $state.go(tab3page2NoCacheState);
    $q.flush();
    $timeout.flush();

    var tab3NoCacheEle = elem[0].querySelector('ion-nav-view[name="tab3"]');
    expect(tab3NoCacheEle.getAttribute('nav-view')).toBe('active');

    var tab3InnerEle = tab3NoCacheEle.querySelector('[nav-view="active"]');
    expect(tab3InnerEle.innerText).toEqual('tab3page2NoCache');

    $state.go(tab1page1State);
    $q.flush();
    $timeout.flush();

    var tab1Ele = elem[0].querySelector('ion-nav-view[name="tab1"]');
    expect(tab3NoCacheEle.getAttribute('nav-view')).toBe('cached');
    expect(tab1Ele.getAttribute('nav-view')).toBe('active');
    expect(tab1Ele.innerText).toEqual('tab1page1');

    tab3InnerEle = tab3NoCacheEle.querySelector('[nav-view="active"]');
    expect(tab3InnerEle).toBe(null);
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
