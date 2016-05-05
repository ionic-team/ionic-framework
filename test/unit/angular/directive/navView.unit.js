
var lifeCycleDataStore;
var _rootScope;

describe('Ionic nav-view', function() {



  var lcStartingPage, lcPage1, lcPage2, lcPage3, lcPage4;
  var lcApp, lcApp2, lcAppPage2, lcAppPage3, lcApp2Page2, lcApp2Page3,lcAppTab1, lcAppTab2;
  var lcTabsPage, lcTabs2Page, lcTab1Page1, lcTab1Page2, lcTab2Page1, lcTab2Page2, lcTab3Page1, lcTab3Page2;
  var lcApp2Tabs1Page, lcApp2Tabs1Tab1Page1, lcApp2Tabs1Tab1Page2, lcApp2Tabs1Tab2Page1, lcApp2Tabs1Tab2Page2, lcApp2Tabs1Tab3Page1, lcApp2Tabs1Tab3Page2;
  var lcApp2Tabs2Page, lcApp2Tabs2Tab1Page1, lcApp2Tabs2Tab1Page2, lcApp2Tabs2Tab2Page1, lcApp2Tabs2Tab2Page2, lcApp2Tabs2Tab3Page1, lcApp2Tabs2Tab3Page2;

  var _stateProvider;


  beforeEach(module('ionic'));

  lifeCycleDataStore = {};
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
    template: '<ion-view state="page1State">page1</ion-view>'
  },
  page2State = {
    template: '<ion-view state="page2State">page2</ion-view>'
  },
  page3State = {
    template: '<ion-view state="page3State">page3</ion-view>'
  },
  page4State = {
    template: '<ion-view state="page4State">page4</ion-view>'
  },
  page5State = {
    template: '<ion-view state="page5State">page5</ion-view>'
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
        template: '<ion-view>tab1page1</ion-view>'
      }
    }
  },
  tab1page2State = {
    views: {
      'tab1': {
        template: '<ion-view>tab1page2</ion-view>'
      }
    }
  },
  tab2page1State = {
    views: {
      'tab2': {
        template: '<ion-view>tab2page1</ion-view>'
      }
    }
  },
  tab3page1State = {
    views: {
      'tab3': {
        template: '<ion-view>tab3page1</ion-view>'
      }
    }
  },
  tab3page2NoCacheState = {
    cache: false,
    views: {
      'tab3': {
        template: '<ion-view>tab3page2NoCache</ion-view>'
      }
    }
  };

  lcStartingPage = {
    template: '<ion-view><h1>Starting Page</h1></ion-view>'
  };

  lcPage1 = {
    template: '<ion-view><h1>Page One</h1></ion-view>'
  };

  lcPage2 = {
    template: '<ion-view><h1>Page Two</h1></ion-view>'
  };

  lcPage3 = {
    template: '<ion-view><h1>Page Three</h1></ion-view>'
  };

  lcPage4 = {
    template: '<ion-view><h1>Page Four</h1></ion-view>'
  };

  lcApp = {
    abstract: true,
    template: '<ion-side-menus>' +
      '<ion-side-menu-content>' +
        '<ion-nav-bar class="bar-energized">' +
          '<ion-nav-buttons side="left">' +
           '<button menu-toggle="left" class="button button-icon icon ion-navicon"></button>' +
        '</ion-nav-bar>' +
        '<ion-nav-view name="menuContent" animation="slide-in-left"></ion-nav-view>' +
      '</ion-side-menu-content>' +
      '<ion-side-menu side="left">' +
        '<ion-header-bar class="bar-positive" align-title="left">' +
          '<h1 class="title">Menu</h1>' +
        '</ion-header-bar>' +
        '<ion-content>' +
          '<ul class="list list-dark">' +
              '<li>' +

              '</li>' +
            '</ul>' +
        '</ion-content>' +
      '</ion-side-menu>' +
    '</ion-side-menus>'
  };

  lcApp2 = {
    abstract: true,
    template: '<ion-side-menus>' +
      '<ion-side-menu-content>' +
        '<ion-nav-bar class="bar-energized">' +
          '<ion-nav-buttons side="left">' +
           '<button menu-toggle="left" class="button button-icon icon ion-navicon"></button>' +
        '</ion-nav-bar>' +
        '<ion-nav-view name="menuContent2" animation="slide-in-left"></ion-nav-view>' +
      '</ion-side-menu-content>' +
      '<ion-side-menu side="left">' +
        '<ion-header-bar class="bar-positive" align-title="left">' +
          '<h1 class="title">Menu</h1>' +
        '</ion-header-bar>' +
        '<ion-content>' +
          '<ul class="list list-dark">' +
              '<li>' +

              '</li>' +
            '</ul>' +
        '</ion-content>' +
      '</ion-side-menu>' +
    '</ion-side-menus>'
  };

  lcAppPage2 = {
    views: {
      "menuContent": {
        template: "<ion-view><h1>Menu Page Two</h1></ion-view>"
      }
    }
  }

  lcApp2Page2 = {
    views: {
      "menuContent2": {
        template: "<ion-view><h1>Menu 2 Page Two</h1></ion-view>"
      }
    }
  }

  lcAppPage3 = {
    views: {
      "menuContent": {
        template: "<ion-view><h1>Menu Page Three</h1></ion-view>"
      }
    }
  }

  lcApp2Page3 = {
    views: {
      "menuContent2": {
        template: "<ion-view><h1>Menu 2 Page Three</h1></ion-view>"
      }
    }
  }

  lcAppTab1 = {
    abstract: true,
    views: {
      "menuContent": {
        template: '<ion-tabs class="tabs-icon-top tabs-color-active-positive">' +
          '<ion-tab title="Tabs 1 Tab 1">' +
            '<ion-nav-view name="tab-one"></ion-nav-view>' +
          '</ion-tab>' +
          '<ion-tab title="Tabs 1 Tab 2" icon-off="ion-ios-chatboxes-outline" icon-on="ion-ios-chatboxes">' +
            '<ion-nav-view name="tab-two"></ion-nav-view>' +
          '</ion-tab>' +
          '<ion-tab title="Tabs 1 Tab 3" icon-off="ion-ios-gear-outline" icon-on="ion-ios-gear">' +
            '<ion-nav-view name="tab-three"></ion-nav-view>' +
          '</ion-tab>' +
        '</ion-tabs>'
      }
    }
  };

  lcAppTab2 = {
    abstract: true,
    views: {
      "menuContent": {
        template: '<ion-tabs class="tabs-icon-top tabs-color-active-positive">' +
          '<ion-tab title="Tabs 2 Tab 1">' +
            '<ion-nav-view name="tab-one"></ion-nav-view>' +
          '</ion-tab>' +
          '<ion-tab title="Tabs 2 Tab 2" icon-off="ion-ios-chatboxes-outline" icon-on="ion-ios-chatboxes">' +
            '<ion-nav-view name="tab-two"></ion-nav-view>' +
          '</ion-tab>' +
          '<ion-tab title="Tabs 2 Tab 3" icon-off="ion-ios-gear-outline" icon-on="ion-ios-gear">' +
            '<ion-nav-view name="tab-three"></ion-nav-view>' +
          '</ion-tab>' +
        '</ion-tabs>'
      }
    }
  };

  lcTabsPage = {
    abstract: true,
    template: '<ion-tabs class="tabs-icon-top tabs-color-active-positive">' +
      '<ion-tab title="Tab 1" href="#/tab/tab1page1">' +
        '<ion-nav-view name="tab-one"></ion-nav-view>' +
      '</ion-tab>' +
      '<ion-tab title="Tab 2" icon-off="ion-ios-chatboxes-outline" icon-on="ion-ios-chatboxes" href="#/tab/tab2page1">' +
        '<ion-nav-view name="tab-two"></ion-nav-view>' +
      '</ion-tab>' +
      '<ion-tab title="Tab 3" icon-off="ion-ios-gear-outline" icon-on="ion-ios-gear" href="#/tab/tab3page1">' +
        '<ion-nav-view name="tab-three"></ion-nav-view>' +
      '</ion-tab>' +
    '</ion-tabs>'
  };

  lcTab1Page1 = {
    views: {
      'tab-one' : {
        template: '<ion-view view-title="Tab One Page One"><h1>Tab One Page One</h1></ion-view>'
      }
    }
  };

  lcTab1Page2 = {
    views: {
      'tab-one' : {
        template: '<ion-view view-title="Tab One Page Two"><h1>Tab One Page Two</h1></ion-view>'
      }
    }
  };

  lcTab2Page1 = {
    views: {
      'tab-two' : {
        template: '<ion-view view-title="Tab Two Page One"><h1>Tab Two Page One</h1></ion-view>'
      }
    }
  };

  lcTab2Page2 = {
    views: {
      'tab-two' : {
        template: '<ion-view view-title="Tab Two Page Two"><h1>Tab Two Page Two</h1></ion-view>'
      }
    }
  };

  lcTab3Page1 = {
    views: {
      'tab-three' : {
        template: '<ion-view view-title="Tab Three Page One"><h1>Tab Three Page One</h1></ion-view>'
      }
    }
  };

  lcTab3Page2 = {
    views: {
      'tab-three' : {
        template: '<ion-view view-title="Tab Three Page Two"><h1>Tab Three Page Two</h1></ion-view>'
      }
    }
  };

  lcTabs2Page = {
    abstract: true,
    template: '<ion-tabs class="tabs-icon-top tabs-color-active-positive">' +
      '<ion-tab title="Tab 1" href="#/tab2/tab1page1">' +
        '<ion-nav-view name="tab-one"></ion-nav-view>' +
      '</ion-tab>' +
      '<ion-tab title="Tab 2" icon-off="ion-ios-chatboxes-outline" icon-on="ion-ios-chatboxes" href="#/tab2/tab2page1">' +
        '<ion-nav-view name="tab-two"></ion-nav-view>' +
      '</ion-tab>' +
      '<ion-tab title="Tab 3" icon-off="ion-ios-gear-outline" icon-on="ion-ios-gear" href="#/tab2/tab3page1">' +
        '<ion-nav-view name="tab-three"></ion-nav-view>' +
      '</ion-tab>' +
    '</ion-tabs>'
  };

  var lcTabs2Tab1Page1 = {
    views: {
      'tab-one' : {
        template: '<ion-view view-title="Tab One Page One"><h1>Tab One Page One</h1></ion-view>'
      }
    }
  };

  var lcTabs2Tab1Page2 = {
    views: {
      'tab-one' : {
        template: '<ion-view view-title="Tab One Page Two"><h1>Tab One Page Two</h1></ion-view>'
      }
    }
  };

  var lcTabs2Tab2Page1 = {
    views: {
      'tab-two' : {
        template: '<ion-view view-title="Tab Two Page One"><h1>Tab Two Page One</h1></ion-view>'
      }
    }
  };

  var lcTabs2Tab2Page2 = {
    views: {
      'tab-two' : {
        template: '<ion-view view-title="Tab Two Page Two"><h1>Tab Two Page Two</h1></ion-view>'
      }
    }
  };

  var lcTabs2Tab3Page1 = {
    views: {
      'tab-three' : {
        template: '<ion-view view-title="Tab Three Page One"><h1>Tab Three Page One</h1></ion-view>'
      }
    }
  };

  var lcTabs2Tab3Page2 = {
    views: {
      'tab-three' : {
        template: '<ion-view view-title="Tab Three Page Two"><h1>Tab Three Page Two</h1></ion-view>'
      }
    }
  };

  lcApp2Tabs1Page = {
    abstract: true,
    views: {
      "menuContent2": {
        template: '<ion-tabs class="tabs-icon-top tabs-color-active-positive">' +
          '<ion-tab title="Menu 2 Tabs 1 Tab 1">' +
            '<ion-nav-view name="tab-one"></ion-nav-view>' +
          '</ion-tab>' +
          '<ion-tab title="Menu 2 Tabs 1 Tab 2" icon-off="ion-ios-chatboxes-outline" icon-on="ion-ios-chatboxes">' +
            '<ion-nav-view name="tab-two"></ion-nav-view>' +
          '</ion-tab>' +
          '<ion-tab title="Menu 2 Tabs 1 Tab 3" icon-off="ion-ios-gear-outline" icon-on="ion-ios-gear">' +
            '<ion-nav-view name="tab-three"></ion-nav-view>' +
          '</ion-tab>' +
        '</ion-tabs>'
      }
    }
  }

  lcApp2Tabs2Page = {
    abstract: true,
    views: {
      "menuContent2": {
        template: '<ion-tabs class="tabs-icon-top tabs-color-active-positive">' +
          '<ion-tab title="Menu 2 Tabs 2 Tab 1">' +
            '<ion-nav-view name="tab-one"></ion-nav-view>' +
          '</ion-tab>' +
          '<ion-tab title="Menu 2 Tabs 2 Tab 2" icon-off="ion-ios-chatboxes-outline" icon-on="ion-ios-chatboxes">' +
            '<ion-nav-view name="tab-two"></ion-nav-view>' +
          '</ion-tab>' +
          '<ion-tab title="Menu 2 Tabs 2 Tab 3" icon-off="ion-ios-gear-outline" icon-on="ion-ios-gear">' +
            '<ion-nav-view name="tab-three"></ion-nav-view>' +
          '</ion-tab>' +
        '</ion-tabs>'
      }
    }
  }

  lcApp2Tabs1Tab1Page1 = {
    views: {
      'tab-one' : {
        template: '<ion-view view-title="Tab One Page One"><h1>Tab One Page One</h1></ion-view>'
      }
    }
  }

  lcApp2Tabs1Tab1Page2 = {
    views: {
      'tab-one' : {
        template: '<ion-view view-title="Tab One Page Two"><h1>Tab One Page Two</h1></ion-view>'
      }
    }
  }

  lcApp2Tabs1Tab2Page1 = {
    views: {
      'tab-two' : {
        template: '<ion-view view-title="Tab Two Page One"><h1>Tab Two Page One</h1></ion-view>'
      }
    }
  }

  lcApp2Tabs1Tab2Page2 = {
    views: {
      'tab-two' : {
        template: '<ion-view view-title="Tab Two Page Two"><h1>Tab Two Page Two</h1></ion-view>'
      }
    }
  }

  lcApp2Tabs1Tab3Page1 = {
    views: {
      'tab-three' : {
        template: '<ion-view view-title="Tab Three Page One"><h1>Tab Three Page One</h1></ion-view>'
      }
    }
  }

  lcApp2Tabs1Tab3Page2 = {
    views: {
      'tab-three' : {
        template: '<ion-view view-title="Tab Three Page Two"><h1>Tab Three Page Two</h1></ion-view>'
      }
    }
  }

  lcApp2Tabs2Tab1Page1 = {
    views: {
      'tab-one' : {
        template: '<ion-view view-title="Tab One Page One"><h1>Tab One Page One</h1></ion-view>'
      }
    }
  }

  lcApp2Tabs2Tab1Page2 = {
    views: {
      'tab-one' : {
        template: '<ion-view view-title="Tab One Page Two"><h1>Tab One Page Two</h1></ion-view>'
      }
    }
  }

  lcApp2Tabs2Tab2Page1 = {
    views: {
      'tab-two' : {
        template: '<ion-view view-title="Tab Two Page One"><h1>Tab Two Page One</h1></ion-view>'
      }
    }
  }

  lcApp2Tabs2Tab2Page2 = {
    views: {
      'tab-two' : {
        template: '<ion-view view-title="Tab Two Page Two"><h1>Tab Two Page Two</h1></ion-view>'
      }
    }
  }

  lcApp2Tabs2Tab3Page1 = {
    views: {
      'tab-three' : {
        template: '<ion-view view-title="Tab Three Page One"><h1>Tab Three Page One</h1></ion-view>'
      }
    }
  }

  lcApp2Tabs2Tab3Page2 = {
    views: {
      'tab-three' : {
        template: '<ion-view view-title="Tab Three Page Two"><h1>Tab Three Page Two</h1></ion-view>'
      }
    }
  }

  beforeEach(module(function ($stateProvider) {
    _stateProvider = $stateProvider;
    lifeCycleDataStore = {};
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
      .state('tabAbstract.tab1page2', tab1page2State)
      .state('tabAbstract.tab2page1', tab2page1State)
      .state('tabAbstract.tab3page1', tab3page1State)
      .state('tabAbstract.tab3page2', tab3page2NoCacheState)
      .state('rootView1', rootView1State)
      .state('rootView2', rootView2State)
      .state('rootView1NoCache', rootView1NoCacheState);
  }));

  beforeEach(inject(function(_$compile_, $ionicConfig, $rootScope) {
    $compile = _$compile_;
    _rootScope = $rootScope;
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
    var navViews = elem.find('ion-nav-view');
    var ionViews = navViews.find('ion-view');
    expect(ionViews.length).toBe(1);
    var navViewAttribute = ionViews.eq(0).attr('nav-view');
    expect(navViewAttribute).toBe('active');
    var textAttribute = ionViews.eq(0).text();
    expect(textAttribute).toBe('page1');

    $state.go(page2State);
    $q.flush();
    $timeout.flush();
    ionViews = elem.find('ion-nav-view').find('ion-view');
    expect(ionViews.length).toBe(2);

    expect(ionViews.eq(0).attr('nav-view')).toBe('cached');
    expect(ionViews.eq(0).text()).toBe('page1');

    expect(ionViews.eq(1).attr('nav-view')).toBe('active');
    expect(ionViews.eq(1).text()).toBe('page2');

    $state.go(page3State);
    $q.flush();
    $timeout.flush();
    ionViews = elem.find('ion-nav-view').find('ion-view');
    expect(ionViews.length).toBe(3);

    expect(ionViews.eq(0).attr('nav-view')).toBe('cached');
    expect(ionViews.eq(0).text()).toBe('page1');

    expect(ionViews.eq(1).attr('nav-view')).toBe('cached');
    expect(ionViews.eq(1).text()).toBe('page2');

    expect(ionViews.eq(2).attr('nav-view')).toBe('active');
    expect(ionViews.eq(2).text()).toBe('page3');

    $state.go(page4State);
    $q.flush();
    $timeout.flush();
    ionViews = elem.find('ion-nav-view').find('ion-view');
    expect(ionViews.length).toBe(4);

    expect(ionViews.eq(0).attr('nav-view')).toBe('cached');
    expect(ionViews.eq(0).text()).toBe('page1');

    expect(ionViews.eq(1).attr('nav-view')).toBe('cached');
    expect(ionViews.eq(1).text()).toBe('page2');

    expect(ionViews.eq(2).attr('nav-view')).toBe('cached');
    expect(ionViews.eq(2).text()).toBe('page3');

    expect(ionViews.eq(3).attr('nav-view')).toBe('active');
    expect(ionViews.eq(3).text()).toBe('page4');
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

    var ionViews = elem.find('ion-nav-view').find('ion-view');
    expect(ionViews.length).toBe(4);
    expect(ionViews.eq(0).attr('nav-view')).toBe('cached');
    expect(ionViews.eq(1).attr('nav-view')).toBe('cached');
    expect(ionViews.eq(2).attr('nav-view')).toBe('cached');
    expect(ionViews.eq(3).attr('nav-view')).toBe('active');

    $state.go(page3State);
    $q.flush();
    $timeout.flush();
    ionViews = elem.find('ion-nav-view').find('ion-view');
    expect(ionViews.length).toBe(3);
    expect(ionViews.eq(0).attr('nav-view')).toBe('cached');
    expect(ionViews.eq(1).attr('nav-view')).toBe('cached');
    expect(ionViews.eq(2).attr('nav-view')).toBe('active');

    $state.go(page2State);
    $q.flush();
    $timeout.flush();
    ionViews = elem.find('ion-nav-view').find('ion-view');
    expect(ionViews.length).toBe(2);
    expect(ionViews.eq(0).attr('nav-view')).toBe('cached');
    expect(ionViews.eq(1).attr('nav-view')).toBe('active');

    $state.go(page1State);
    $q.flush();
    $timeout.flush();
    ionViews = elem.find('ion-nav-view').find('ion-view');
    expect(ionViews.length).toBe(1);
    expect(ionViews.eq(0).attr('nav-view')).toBe('active');
  }));

  it('should disconnect and reconnect view scopes', inject(function ($state, $q, $timeout, $compile) {
    elem.append($compile('<div><ion-nav-view></ion-nav-view></div>')(scope));

    $state.go(page1State);
    $q.flush();
    $timeout.flush();

    var ionViews = elem.find('ion-nav-view').find('ion-view');
    expect(ionViews.eq(0).scope().$$disconnected).toBeUndefined();

    $state.go(page2State);
    $q.flush();
    $timeout.flush();

    ionViews = elem.find('ion-nav-view').find('ion-view');
    expect(ionViews.eq(0).scope().$$disconnected).toBe(true);
    expect(ionViews.eq(1).scope().$$disconnected).toBeUndefined();

    $state.go(page1State);
    $q.flush();
    $timeout.flush();
    ionViews = elem.find('ion-nav-view').find('ion-view');
    expect(ionViews.eq(0).scope().$$disconnected).toBe(false);
  }));

  it('should have connected scopes at the time of lifecycle events', inject(function ($state, $q, $timeout, $compile) {
    elem.append($compile('<div><ion-nav-view></ion-nav-view></div>')(scope));

    $state.go(page1State);
    $q.flush();
    $timeout.flush();

    var beforeEnterDisconnected, afterEnterDisconnected, beforeLeaveDisconnected, afterLeaveDisconnected;
    scope.$on('$ionicView.beforeEnter', function(ev, d){
      beforeEnterDisconnected = elem.find('ion-nav-view').find('ion-view').eq(1).scope().$$disconnected;
    });
    scope.$on('$ionicView.afterEnter', function(ev, d){
      afterEnterDisconnected = elem.find('ion-nav-view').find('ion-view').eq(1).scope().$$disconnected;
    });
    scope.$on('$ionicView.beforeLeave', function(ev, d){
      beforeLeaveDisconnected = elem.find('ion-nav-view').find('ion-view').eq(0).scope().$$disconnected;
    });
    scope.$on('$ionicView.afterLeave', function(ev, d){
      afterLeaveDisconnected = elem.find('ion-nav-view').find('ion-view').eq(0).scope().$$disconnected;
    });

    $state.go(page2State);
    $q.flush();
    $timeout.flush();

    expect(beforeEnterDisconnected).toBeUndefined();
    expect(afterEnterDisconnected).toBeUndefined();
    expect(beforeLeaveDisconnected).toBeUndefined();
    expect(afterLeaveDisconnected).toBeUndefined();

    expect(elem.find('ion-nav-view').find('ion-view').eq(0).scope().$$disconnected).toBe(true);
    expect(elem.find('ion-nav-view').find('ion-view').eq(1).scope().$$disconnected).toBeUndefined();
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
    expect(elem.find('ion-nav-view').find('ion-view').length).toBe(1);

    $state.go(page2State);
    $q.flush();
    $timeout.flush();
    expect(elem.find('ion-nav-view').find('ion-view').length).toBe(2);

    $state.go(page3State);
    $q.flush();
    $timeout.flush();
    expect(elem.find('ion-nav-view').find('ion-view').length).toBe(3);
    expect(unloaded).toBeUndefined();

    $state.go(page4State);
    $q.flush();
    $timeout.flush();
    expect(elem.find('ion-nav-view').find('ion-view').length).toBe(3);
    expect(unloaded.historyId).toBe('root');
    expect(unloaded.stateName).toBe('page1');

    $state.go(page3State);
    $q.flush();
    $timeout.flush();
    expect(elem.find('ion-nav-view').find('ion-view').length).toBe(2);
    expect(unloaded.stateName).toBe('page4');

    $state.go(page2State);
    $q.flush();
    $timeout.flush();
    expect(elem.find('ion-nav-view').find('ion-view').length).toBe(1);
    expect(unloaded.stateName).toBe('page3');

    $state.go(page1State);
    $q.flush();
    $timeout.flush();
    expect(elem.find('ion-nav-view').find('ion-view').length).toBe(1);
    expect(unloaded.stateName).toBe('page2');
  }));

  it('should cache ion-nav-views that were forward when moving back with $ionicConfig.cacheForwardViews=true', inject(function ($state, $q, $timeout, $compile, $ionicConfig) {
    elem.append($compile('<div><ion-nav-view></ion-nav-view></div>')(scope));

    $ionicConfig.views.forwardCache(true);

    $state.go(page1State);
    $q.flush();
    $timeout.flush();
    expect(elem.find('ion-nav-view').find('ion-view').length).toBe(1);

    $state.go(page2State);
    $q.flush();
    $timeout.flush();
    expect(elem.find('ion-nav-view').find('ion-view').length).toBe(2);

    $state.go(page3State);
    $q.flush();
    $timeout.flush();
    expect(elem.find('ion-nav-view').find('ion-view').length).toBe(3);

    $state.go(page4State);
    $q.flush();
    $timeout.flush();
    expect(elem.find('ion-nav-view').find('ion-view').length).toBe(4);

    $state.go(page3State);
    $q.flush();
    $timeout.flush();
    expect(elem.find('ion-nav-view').find('ion-view').length).toBe(4);

    $state.go(page2State);
    $q.flush();
    $timeout.flush();
    expect(elem.find('ion-nav-view').find('ion-view').length).toBe(4);

    $state.go(page1State);
    $q.flush();
    $timeout.flush();
    expect(elem.find('ion-nav-view').find('ion-view').length).toBe(4);
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
    var ionViews = elem.find('ion-nav-view').find('ion-view');
    expect(ionViews.length).toBe(1);
    expect(ionViews.eq(0).text()).toBe('page1');

    $state.go(page2State);
    $q.flush();
    $timeout.flush();
    ionViews = elem.find('ion-nav-view').find('ion-view');
    expect(ionViews.length).toBe(2);
    expect(ionViews.eq(1).text()).toBe('page2');

    $state.go(page3State);
    $q.flush();
    $timeout.flush();
    ionViews = elem.find('ion-nav-view').find('ion-view');
    expect(ionViews.length).toBe(3);
    expect(ionViews.eq(2).text()).toBe('page3');

    $state.go(page4State);
    $q.flush();
    $timeout.flush();
    ionViews = elem.find('ion-nav-view').find('ion-view');
    expect(ionViews.length).toBe(4);

    $state.go(page1State);
    $q.flush();
    $timeout.flush();
    ionViews = elem.find('ion-nav-view').find('ion-view');
    expect(ionViews.length).toBe(4);

    $state.go(page5State);
    $q.flush();
    $timeout.flush();
    ionViews = elem.find('ion-nav-view').find('ion-view');
    expect(ionViews.length).toBe(4);
    expect(ionViews.eq(0).text()).toBe('page1');
    expect(ionViews.eq(1).text()).toBe('page3');
    expect(ionViews.eq(2).text()).toBe('page4');
    expect(ionViews.eq(3).text()).toBe('page5');
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

  it('should emit tab leaving events', inject(function ($state, $q, $timeout, $compile, $ionicConfig) {
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

    elem.append($compile('<ion-nav-view name="root"></ion-nav-view>')(scope));

    $state.go(tab1page1State);
    $q.flush();
    $timeout.flush();

    $state.go(tab1page2State);
    $q.flush();
    $timeout.flush();

    expect(beforeLeave.stateName).toEqual('tabAbstract.tab1page1');
    expect(afterLeave.stateName).toEqual('tabAbstract.tab1page1');
    expect(leave.stateName).toEqual('tabAbstract.tab1page1');

    $state.go(tab2page1State);
    $q.flush();
    $timeout.flush();

    expect(beforeLeave.stateName).toEqual('tabAbstract.tab1page2');
    expect(afterLeave.stateName).toEqual('tabAbstract.tab1page2');
    expect(leave.stateName).toEqual('tabAbstract.tab1page2');

    $state.go(tab3page1State);
    $q.flush();
    $timeout.flush();

    expect(beforeLeave.stateName).toEqual('tabAbstract.tab2page1');
    expect(afterLeave.stateName).toEqual('tabAbstract.tab2page1');
    expect(leave.stateName).toEqual('tabAbstract.tab2page1');

    $state.go(tab1page1State);
    $q.flush();
    $timeout.flush();

    expect(beforeLeave.stateName).toEqual('tabAbstract.tab3page1');
    expect(afterLeave.stateName).toEqual('tabAbstract.tab3page1');
    expect(leave.stateName).toEqual('tabAbstract.tab3page1');
  }));

  it('should emit tab $ionicView.unloaded event', inject(function ($state, $q, $timeout, $compile, $ionicConfig) {
    $ionicConfig.views.maxCache(0);

    var unloadedEvent;
    scope.$on('$ionicView.unloaded', function(ev, d){
      unloadedEvent = d;
    });

    elem.append($compile('<ion-nav-view name="root"></ion-nav-view>')(scope));

    $state.go(tab1page1State);
    $q.flush();
    $timeout.flush();

    $state.go(tab1page2State);
    $q.flush();
    $timeout.flush();

    expect(unloadedEvent.stateName).toEqual('tabAbstract.tab1page1');

    $state.go(tab2page1State);
    $q.flush();
    $timeout.flush();

    expect(unloadedEvent.stateName).toEqual('tabAbstract.tab1page2');

    $state.go(tab3page1State);
    $q.flush();
    $timeout.flush();

    expect(unloadedEvent.stateName).toEqual('tabAbstract.tab2page1');

    $state.go(tab1page1State);
    $q.flush();
    $timeout.flush();

    expect(unloadedEvent.stateName).toEqual('tabAbstract.tab3page1');
  }));

  it('should emit $ionicView events in correct order', inject(function ($state, $q, $timeout, $compile, $ionicConfig) {
    $ionicConfig.views.maxCache(0);

    var order = [];
    scope.$on('$ionicView.loaded', function(ev, d){
      order.push('$ionicView.loaded');
    });
    scope.$on('$ionicView.beforeEnter', function(ev, d){
      order.push('$ionicView.beforeEnter');
    });
    scope.$on('$ionicView.enter', function(ev, d){
      order.push('$ionicView.enter');
    });
    scope.$on('$ionicView.afterEnter', function(ev, d){
      order.push('$ionicView.afterEnter');
    });
    scope.$on('$ionicView.beforeLeave', function(ev, d){
      order.push('$ionicView.beforeLeave');
    });
    scope.$on('$ionicView.leave', function(ev, d){
      order.push('$ionicView.leave');
    });
    scope.$on('$ionicView.afterLeave', function(ev, d){
      order.push('$ionicView.afterLeave');
    });
    scope.$on('$ionicView.unloaded', function(ev, d){
      order.push('$ionicView.unloaded');
    });

    elem.append($compile('<div><ion-nav-view></ion-nav-view></div>')(scope));

    $state.go(page1State);
    $q.flush();
    $timeout.flush();

    $state.go(page2State);
    $q.flush();
    $timeout.flush();

    expect(order[0]).toEqual('$ionicView.loaded');
    expect(order[1]).toEqual('$ionicView.beforeEnter');
    expect(order[2]).toEqual('$ionicView.enter');
    expect(order[3]).toEqual('$ionicView.afterEnter');
    expect(order[4]).toEqual('$ionicView.loaded');
    expect(order[5]).toEqual('$ionicView.beforeEnter');
    expect(order[6]).toEqual('$ionicView.beforeLeave');
    expect(order[7]).toEqual('$ionicView.enter');
    expect(order[8]).toEqual('$ionicView.leave');
    expect(order[9]).toEqual('$ionicView.afterEnter');
    expect(order[10]).toEqual('$ionicView.afterLeave');
    expect(order[11]).toEqual('$ionicView.unloaded');
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

    var divs = elem.find('ion-nav-view').find('ion-view');
    expect(divs.length).toBe(3);

    expect(divs.eq(0).attr('nav-view')).toBe('cached');
    expect(divs.eq(0).text()).toBe('page1');

    expect(divs.eq(1).attr('nav-view')).toBe('cached');
    expect(divs.eq(1).text()).toBe('page2');

    expect(divs.eq(2).attr('nav-view')).toBe('active');
    expect(divs.eq(2).text()).toBe('page3');

    expect(clearCacheCollection.length).toBe(0);
    $ionicHistory.clearCache();
    $timeout.flush();

    expect(clearCacheCollection.length).toBe(2);
    expect(clearCacheCollection[0].stateName).toBe('page1');
    expect(clearCacheCollection[1].stateName).toBe('page2');
    clearCacheCollection = [];

    var divs = elem.find('ion-nav-view').find('ion-view');
    expect(divs.length).toBe(1);

    expect(divs.eq(0).attr('nav-view')).toBe('active');
    expect(divs.eq(0).text()).toBe('page3');

    $ionicHistory.clearCache();
    $timeout.flush();
    expect(clearCacheCollection.length).toBe(0);

    var divs = elem.find('ion-nav-view').find('ion-view');
    expect(divs.length).toBe(1);

    expect(divs.eq(0).attr('nav-view')).toBe('active');
    expect(divs.eq(0).text()).toBe('page3');

    $state.go(page2State);
    $q.flush();
    $timeout.flush();

    var divs = elem.find('ion-nav-view').find('ion-view');
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

  it('should clear cached tab and reload on return to tab', inject(function ($state, $q, $timeout, $compile, $ionicHistory) {
    elem.append($compile('<ion-nav-view name="root"></ion-nav-view>')(scope));

    $state.go(tab1page1State);
    $q.flush();
    $timeout.flush();

    var tab1Ele = elem[0].querySelector('ion-nav-view[name="tab1"]');
    expect(tab1Ele.getAttribute('nav-view')).toBe('active');
    expect(tab1Ele.childElementCount).toBe(1);

    $state.go(tab1page2State);
    $q.flush();
    $timeout.flush();

    tab1Ele = elem[0].querySelector('ion-nav-view[name="tab1"]');
    expect(tab1Ele.getAttribute('nav-view')).toBe('active');
    expect(tab1Ele.childElementCount).toBe(2);

    $state.go(tab2page1State);
    $q.flush();
    $timeout.flush();

    var tab2Ele = elem[0].querySelector('ion-nav-view[name="tab2"]');
    expect(tab1Ele.getAttribute('nav-view')).toBe('cached');
    expect(tab1Ele.childElementCount).toBe(2);
    expect(tab2Ele.getAttribute('nav-view')).toBe('active');
    expect(tab2Ele.childElementCount).toBe(1);

    $ionicHistory.clearCache();
    $timeout.flush();

    tab1Ele = elem[0].querySelector('ion-nav-view[name="tab1"]');
    expect(tab1Ele).toEqual(null);

    tab2Ele = elem[0].querySelector('ion-nav-view[name="tab2"]');
    expect(tab2Ele.getAttribute('nav-view')).toBe('active');
    expect(tab2Ele.childElementCount).toBe(1);

    $state.go(tab1page1State);
    $q.flush();
    $timeout.flush();

    tab1Ele = elem[0].querySelector('ion-nav-view[name="tab1"]');
    expect(tab1Ele.getAttribute('nav-view')).toBe('active');
    expect(tab1Ele.childElementCount).toBe(1);
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

  it('should go to each state and receive correct life cycle events (test one)', inject(function ($state, $q, $timeout, $compile) {

    /*
      Order:
      Page 1
      Page 2
      Page 3
      Page 4
    */

    _stateProvider
    .state('lcStartingPage', lcStartingPage)
    .state('lcPage1', lcPage1)
    .state('lcPage2', lcPage2)
    .state('lcPage3', lcPage3)
    .state('lcPage4', lcPage4);

    // arrange
    elem.append($compile('<div><ion-nav-view></ion-nav-view></div>')(scope));

    var states = ["lcPage1", "lcPage2", "lcPage3", "lcPage4", "lcStartingPage"];
    var scopes = setUpStatesAndStoreScope($state, $q, $timeout, elem[0], states);

    for ( var i = 0; i < states.length; i++ ){
      initializeHandlers(scopes[states[i]], states[i]);
    }

    // act
    goToState($state, $q, $timeout, "lcPage1");
    goToState($state, $q, $timeout, "lcPage2");
    goToState($state, $q, $timeout, "lcPage3");
    goToState($state, $q, $timeout, "lcPage4");
    // go to done page
    goToState($state, $q, $timeout, "lcStartingPage");

    // assert
    doAssertionsForState("lcPage1", 1);

    doAssertionsForState("lcPage2", 1);

    doAssertionsForState("lcPage3", 1);

    doAssertionsForState("lcPage4", 1);

  }));

  it('should go to each state and receive correct life cycle events (test two)', inject(function ($state, $q, $timeout, $compile, $ionicConfig) {

    /*
      Order:
      Page 1
      Page 2
      Page 3
      Page 4
      Page 3
      Page 2
      Page 1
    */

    _stateProvider
    .state('lcStartingPage', lcStartingPage)
    .state('lcPage1', lcPage1)
    .state('lcPage2', lcPage2)
    .state('lcPage3', lcPage3)
    .state('lcPage4', lcPage4);

    // arrange
    elem.append($compile('<div><ion-nav-view></ion-nav-view></div>')(scope));

    var states = ["lcPage1", "lcPage2", "lcPage3", "lcPage4", "lcStartingPage"];
    var scopes = setUpStatesAndStoreScope($state, $q, $timeout, elem[0], states);

    for ( var i = 0; i < states.length; i++ ){
      initializeHandlers(scopes[states[i]], states[i]);
    }

    // act
    goToState($state, $q, $timeout, "lcPage1");
    goToState($state, $q, $timeout, "lcPage2");
    goToState($state, $q, $timeout, "lcPage3");
    goToState($state, $q, $timeout, "lcPage4");
    goToState($state, $q, $timeout, "lcPage3");
    goToState($state, $q, $timeout, "lcPage2");
    goToState($state, $q, $timeout, "lcPage1");
    // go to done page
    goToState($state, $q, $timeout, "lcStartingPage");

    // assert
    doAssertionsForState("lcPage1", 2);

    doAssertionsForState("lcPage2", 2);

    doAssertionsForState("lcPage3", 2);

    doAssertionsForState("lcPage4", 1);

  }));

  it('should go to each state and receive correct life cycle events (test three)', inject(function ($state, $q, $timeout, $compile, $ionicConfig, $ionicHistory) {

    /*
      Order:
      Page 1
      (Menu) Page 2
      Page 3
      (Menu) Page 2
      Page 1
    */

    _stateProvider
    .state('lcStartingPage', lcStartingPage)
    .state('lcPage1', lcPage1)
    .state('lcApp', lcApp)
    .state('lcApp.lcPage2', lcAppPage2)
    .state('lcPage3', lcPage3);

    // arrange
    elem.append($compile('<div><ion-nav-view></ion-nav-view></div>')(scope));

    var states = ["lcPage1", "lcApp.lcPage2", "lcPage3",  "lcStartingPage"];
    var scopes = setUpStatesAndStoreScope($state, $q, $timeout, elem[0], states);

    for ( var i = 0; i < states.length; i++ ){
      initializeHandlers(scopes[states[i]], states[i]);
    }

    $ionicHistory.clearHistory();

    // act
    goToState($state, $q, $timeout, "lcPage1");
    goToState($state, $q, $timeout, "lcApp.lcPage2");
    goToState($state, $q, $timeout, "lcPage3");
    goToState($state, $q, $timeout, "lcApp.lcPage2");
    goToState($state, $q, $timeout, "lcPage1");
    // go to done page
    goToState($state, $q, $timeout, "lcStartingPage");

    // assert
    doAssertionsForState("lcPage1", 2);

    doAssertionsForState("lcApp.lcPage2", 2);

    doAssertionsForState("lcPage3", 1);
  }));

  it('should go to each state and receive correct life cycle events (test four)', inject(function ($state, $q, $timeout, $compile, $ionicConfig, $ionicHistory) {

    /*
      Order:
      Tab 1, Page 1
      Tab 1, Page 2
      Tab 2, Page 1
      Tab 1, Page 2
      Tab 1, Page 1
      Tab 2, Page 1
      Tab 2, Page 2
      Tab 2, Page 1
      Tab 3, Page 1
      Tab 3, Page 2
      Tab 3, Page 1
    */

    _stateProvider
    .state('lcTabsPage', lcTabsPage)
    .state('lcTabsPage.lcTab1Page1', lcTab1Page1)
    .state('lcTabsPage.lcTab1Page2', lcTab1Page2)
    .state('lcTabsPage.lcTab2Page1', lcTab2Page1)
    .state('lcTabsPage.lcTab2Page2', lcTab2Page2)
    .state('lcTabsPage.lcTab3Page1', lcTab3Page1)
    .state('lcTabsPage.lcTab3Page2', lcTab3Page2)
    .state('lcStartingPage', lcStartingPage);

    // arrange
    elem.append($compile('<div><ion-nav-view></ion-nav-view></div>')(scope));

    var states = ["lcTabsPage.lcTab1Page1", "lcTabsPage.lcTab1Page2", "lcTabsPage.lcTab2Page1", "lcTabsPage.lcTab2Page2",
      "lcTabsPage.lcTab3Page1", "lcTabsPage.lcTab3Page2", "lcStartingPage"];
    var scopes = setUpStatesAndStoreScope($state, $q, $timeout, elem[0], states);

    for ( var i = 0; i < states.length; i++ ){
      initializeHandlers(scopes[states[i]], states[i]);
    }

    $ionicHistory.clearHistory();

    // act
    goToState($state, $q, $timeout, "lcTabsPage.lcTab1Page1");
    goToState($state, $q, $timeout, "lcTabsPage.lcTab1Page2");
    goToState($state, $q, $timeout, "lcTabsPage.lcTab2Page1");
    goToState($state, $q, $timeout, "lcTabsPage.lcTab1Page2");
    goToState($state, $q, $timeout, "lcTabsPage.lcTab1Page1");
    goToState($state, $q, $timeout, "lcTabsPage.lcTab2Page1");
    goToState($state, $q, $timeout, "lcTabsPage.lcTab2Page2");
    goToState($state, $q, $timeout, "lcTabsPage.lcTab2Page1");
    goToState($state, $q, $timeout, "lcTabsPage.lcTab3Page1");
    goToState($state, $q, $timeout, "lcTabsPage.lcTab3Page2");
    goToState($state, $q, $timeout, "lcTabsPage.lcTab3Page1");
    // go to done page
    goToState($state, $q, $timeout, "lcStartingPage");

    // assert
    doAssertionsForState("lcTabsPage.lcTab1Page1", 2);

    doAssertionsForState("lcTabsPage.lcTab1Page2", 2);

    doAssertionsForState("lcTabsPage.lcTab2Page1", 3);

    doAssertionsForState("lcTabsPage.lcTab2Page2", 1);

    doAssertionsForState("lcTabsPage.lcTab3Page1", 2);

    doAssertionsForState("lcTabsPage.lcTab3Page2", 1);
  }));

  it('should go to each state and receive correct life cycle events (test five)', inject(function ($state, $q, $timeout, $compile, $ionicConfig, $ionicHistory) {

    /*
      Order:
      Page 1
      Page 2
      Tab 1, Page 1
      Tab 1, Page 2
      Page 2
      Tab 2, Page 1,
      Tab 2, Page 2,
      Page 3
      Tab 1, Page 2
      Page 1
      Tab 3, Page 1
    */

    _stateProvider
    .state('lcPage1', lcPage1)
    .state('lcPage2', lcPage2)
    .state('lcPage3', lcPage3)
    .state('lcTabsPage', lcTabsPage)
    .state('lcTabsPage.lcTab1Page1', lcTab1Page1)
    .state('lcTabsPage.lcTab1Page2', lcTab1Page2)
    .state('lcTabsPage.lcTab2Page1', lcTab2Page1)
    .state('lcTabsPage.lcTab2Page2', lcTab2Page2)
    .state('lcTabsPage.lcTab3Page1', lcTab3Page1)
    .state('lcTabsPage.lcTab3Page2', lcTab3Page2)
    .state('lcStartingPage', lcStartingPage);

    // arrange
    elem.append($compile('<div><ion-nav-view></ion-nav-view></div>')(scope));

    var states = ["lcPage1", "lcPage2", "lcPage3", "lcTabsPage.lcTab1Page1", "lcTabsPage.lcTab1Page2", "lcTabsPage.lcTab2Page1", "lcTabsPage.lcTab2Page2",
      "lcTabsPage.lcTab3Page1", "lcTabsPage.lcTab3Page2", "lcStartingPage"];
    var scopes = setUpStatesAndStoreScope($state, $q, $timeout, elem[0], states);

    for ( var i = 0; i < states.length; i++ ){
      initializeHandlers(scopes[states[i]], states[i]);
    }

    $ionicHistory.clearHistory();

    // act
    goToState($state, $q, $timeout, "lcPage1");
    goToState($state, $q, $timeout, "lcPage2");
    goToState($state, $q, $timeout, "lcTabsPage.lcTab1Page1");
    goToState($state, $q, $timeout, "lcTabsPage.lcTab1Page2");
    goToState($state, $q, $timeout, "lcPage2");
    goToState($state, $q, $timeout, "lcTabsPage.lcTab2Page1");
    goToState($state, $q, $timeout, "lcTabsPage.lcTab2Page2");
    goToState($state, $q, $timeout, "lcPage3");
    goToState($state, $q, $timeout, "lcTabsPage.lcTab1Page2");
    goToState($state, $q, $timeout, "lcPage1");
    goToState($state, $q, $timeout, "lcTabsPage.lcTab3Page1");
    // go to done page
    goToState($state, $q, $timeout, "lcStartingPage");

    // assert

    doAssertionsForState("lcPage1", 2);

    doAssertionsForState("lcPage2", 2);

    doAssertionsForState("lcPage3", 1);

    doAssertionsForState("lcTabsPage.lcTab1Page1", 1);

    doAssertionsForState("lcTabsPage.lcTab1Page2", 2);

    doAssertionsForState("lcTabsPage.lcTab2Page1", 1);

    doAssertionsForState("lcTabsPage.lcTab2Page2", 1);

    doAssertionsForState("lcTabsPage.lcTab3Page1", 1);

    doAssertionsForState("lcTabsPage.lcTab3Page2", 0);

  }));

  it('should go to each state and receive correct life cycle events (test six)', inject(function ($state, $q, $timeout, $compile, $ionicConfig, $ionicHistory) {

    /*
      Order:
      Page 1
      Page 2
      Tab 1, Page 1
      Tab 1, Page 2
      Page 2
      Tab 2, Page 1
      Page 3
      Tab 1, Page 2
      Page 1
      Tab 1, Page 1
      Page 3
      Tab 2, Page 2
      Tab 3, Page 2
      Tab 1, Page 2
      Page 1
      Tab 2, Page 2
      Tab 3, Page 1
      Page 3
      Tab 3, Page 2
      Tab 3, Page 1
    */

    _stateProvider
    .state('lcPage1', lcPage1)
    .state('lcPage2', lcPage2)
    .state('lcPage3', lcPage3)
    .state('lcTabsPage', lcTabsPage)
    .state('lcTabsPage.lcTab1Page1', lcTab1Page1)
    .state('lcTabsPage.lcTab1Page2', lcTab1Page2)
    .state('lcTabsPage.lcTab2Page1', lcTab2Page1)
    .state('lcTabsPage.lcTab2Page2', lcTab2Page2)
    .state('lcTabsPage.lcTab3Page1', lcTab3Page1)
    .state('lcTabsPage.lcTab3Page2', lcTab3Page2)
    .state('lcStartingPage', lcStartingPage);

    // arrange
    elem.append($compile('<div><ion-nav-view></ion-nav-view></div>')(scope));

    var states = ["lcPage1", "lcPage2", "lcPage3", "lcTabsPage.lcTab1Page1", "lcTabsPage.lcTab1Page2", "lcTabsPage.lcTab2Page1", "lcTabsPage.lcTab2Page2",
      "lcTabsPage.lcTab3Page1", "lcTabsPage.lcTab3Page2", "lcStartingPage"];
    var scopes = setUpStatesAndStoreScope($state, $q, $timeout, elem[0], states);

    for ( var i = 0; i < states.length; i++ ){
      initializeHandlers(scopes[states[i]], states[i]);
    }

    $ionicHistory.clearHistory();

    // act
    goToState($state, $q, $timeout, "lcPage1");
    goToState($state, $q, $timeout, "lcPage2");
    goToState($state, $q, $timeout, "lcTabsPage.lcTab1Page1");
    goToState($state, $q, $timeout, "lcTabsPage.lcTab1Page2");
    goToState($state, $q, $timeout, "lcPage2");
    goToState($state, $q, $timeout, "lcTabsPage.lcTab2Page1");
    goToState($state, $q, $timeout, "lcPage3");
    goToState($state, $q, $timeout, "lcTabsPage.lcTab1Page2");
    goToState($state, $q, $timeout, "lcPage1");
    goToState($state, $q, $timeout, "lcTabsPage.lcTab1Page1");
    goToState($state, $q, $timeout, "lcPage3");
    goToState($state, $q, $timeout, "lcTabsPage.lcTab2Page2");
    goToState($state, $q, $timeout, "lcTabsPage.lcTab3Page2");
    goToState($state, $q, $timeout, "lcTabsPage.lcTab1Page2");
    goToState($state, $q, $timeout, "lcPage1");
    goToState($state, $q, $timeout, "lcTabsPage.lcTab2Page2");
    goToState($state, $q, $timeout, "lcTabsPage.lcTab3Page1");
    goToState($state, $q, $timeout, "lcPage3");
    goToState($state, $q, $timeout, "lcTabsPage.lcTab3Page2");
    goToState($state, $q, $timeout, "lcTabsPage.lcTab3Page1");

    // go to done page
    goToState($state, $q, $timeout, "lcStartingPage");

    // assert
    doAssertionsForState("lcPage1", 3);

    doAssertionsForState("lcPage2", 2);

    doAssertionsForState("lcPage3", 3);

    doAssertionsForState("lcTabsPage.lcTab1Page1", 2);

    doAssertionsForState("lcTabsPage.lcTab1Page2", 3);

    doAssertionsForState("lcTabsPage.lcTab2Page1", 1);

    doAssertionsForState("lcTabsPage.lcTab2Page2", 2);

    doAssertionsForState("lcTabsPage.lcTab3Page1", 2);

    doAssertionsForState("lcTabsPage.lcTab3Page2", 2);

  }));

  it('should go to each state and receive correct life cycle events (test seven)', inject(function ($state, $q, $timeout, $compile, $ionicConfig, $ionicHistory) {

    /*
      Order:
      Tab 1, Page 2
      Page 2
      Tab 2, Page 1
      Page 3
    */

    _stateProvider
    .state('lcPage1', lcPage1)
    .state('lcPage2', lcPage2)
    .state('lcPage3', lcPage3)
    .state('lcTabsPage', lcTabsPage)
    .state('lcTabsPage.lcTab1Page1', lcTab1Page1)
    .state('lcTabsPage.lcTab1Page2', lcTab1Page2)
    .state('lcTabsPage.lcTab2Page1', lcTab2Page1)
    .state('lcTabsPage.lcTab2Page2', lcTab2Page2)
    .state('lcTabsPage.lcTab3Page1', lcTab3Page1)
    .state('lcTabsPage.lcTab3Page2', lcTab3Page2)
    .state('lcStartingPage', lcStartingPage);

    // arrange
    elem.append($compile('<div><ion-nav-view></ion-nav-view></div>')(scope));

    var states = ["lcPage1", "lcPage2", "lcPage3", "lcTabsPage.lcTab1Page1", "lcTabsPage.lcTab1Page2", "lcTabsPage.lcTab2Page1", "lcTabsPage.lcTab2Page2",
      "lcTabsPage.lcTab3Page1", "lcTabsPage.lcTab3Page2", "lcStartingPage"];
    var scopes = setUpStatesAndStoreScope($state, $q, $timeout, elem[0], states);

    for ( var i = 0; i < states.length; i++ ){
      initializeHandlers(scopes[states[i]], states[i]);
    }

    $ionicHistory.clearHistory();

    // act
    goToState($state, $q, $timeout, "lcTabsPage.lcTab1Page2");
    goToState($state, $q, $timeout, "lcPage2");
    goToState($state, $q, $timeout, "lcTabsPage.lcTab2Page1");
    goToState($state, $q, $timeout, "lcPage3");

    // go to done page
    goToState($state, $q, $timeout, "lcStartingPage");

    // assert
    doAssertionsForState("lcPage1", 0);

    doAssertionsForState("lcPage2", 1);

    doAssertionsForState("lcPage3", 1);

    doAssertionsForState("lcTabsPage.lcTab1Page1", 0);

    doAssertionsForState("lcTabsPage.lcTab1Page2", 1);

    doAssertionsForState("lcTabsPage.lcTab2Page1", 1);

    doAssertionsForState("lcTabsPage.lcTab2Page2", 0);

    doAssertionsForState("lcTabsPage.lcTab3Page1", 0);

    doAssertionsForState("lcTabsPage.lcTab3Page2", 0);

  }));

  it('should go to each state and receive correct life cycle events (test eight)', inject(function ($state, $q, $timeout, $compile, $ionicConfig, $ionicHistory) {

    /*
      Order:
      Tab 2, Page 2
      Tab 3, Page 2
      Tab 1, Page 2
      Page 1
      Tab 2, Page 2
      Tab 2, Page 1
      Tab 3, Page 1
      Page 3
      Tab 3, Page 2
      Tab 3, Page 1
    */

    _stateProvider
    .state('lcPage1', lcPage1)
    .state('lcPage2', lcPage2)
    .state('lcPage3', lcPage3)
    .state('lcTabsPage', lcTabsPage)
    .state('lcTabsPage.lcTab1Page1', lcTab1Page1)
    .state('lcTabsPage.lcTab1Page2', lcTab1Page2)
    .state('lcTabsPage.lcTab2Page1', lcTab2Page1)
    .state('lcTabsPage.lcTab2Page2', lcTab2Page2)
    .state('lcTabsPage.lcTab3Page1', lcTab3Page1)
    .state('lcTabsPage.lcTab3Page2', lcTab3Page2)
    .state('lcStartingPage', lcStartingPage);

    // arrange
    elem.append($compile('<div><ion-nav-view></ion-nav-view></div>')(scope));

    var states = ["lcPage1", "lcPage2", "lcPage3", "lcTabsPage.lcTab1Page1", "lcTabsPage.lcTab1Page2", "lcTabsPage.lcTab2Page1", "lcTabsPage.lcTab2Page2",
      "lcTabsPage.lcTab3Page1", "lcTabsPage.lcTab3Page2", "lcStartingPage"];
    var scopes = setUpStatesAndStoreScope($state, $q, $timeout, elem[0], states);

    for ( var i = 0; i < states.length; i++ ){
      initializeHandlers(scopes[states[i]], states[i]);
    }

    $ionicHistory.clearHistory();

    // act
    goToState($state, $q, $timeout, "lcTabsPage.lcTab2Page2");
    goToState($state, $q, $timeout, "lcTabsPage.lcTab3Page2");
    goToState($state, $q, $timeout, "lcTabsPage.lcTab1Page2");
    goToState($state, $q, $timeout, "lcPage1");
    goToState($state, $q, $timeout, "lcTabsPage.lcTab2Page2");
    goToState($state, $q, $timeout, "lcTabsPage.lcTab2Page1");
    goToState($state, $q, $timeout, "lcTabsPage.lcTab3Page1");
    goToState($state, $q, $timeout, "lcPage3");
    goToState($state, $q, $timeout, "lcTabsPage.lcTab3Page2");
    goToState($state, $q, $timeout, "lcTabsPage.lcTab3Page1");
    // go to done page
    goToState($state, $q, $timeout, "lcStartingPage");

    // assert
    doAssertionsForState("lcPage1", 1);

    doAssertionsForState("lcPage2", 0);

    doAssertionsForState("lcPage3", 1);

    doAssertionsForState("lcTabsPage.lcTab1Page1", 0);

    doAssertionsForState("lcTabsPage.lcTab1Page2", 1);

    doAssertionsForState("lcTabsPage.lcTab2Page1", 1);

    doAssertionsForState("lcTabsPage.lcTab2Page2", 2);

    doAssertionsForState("lcTabsPage.lcTab3Page1", 2);

    doAssertionsForState("lcTabsPage.lcTab3Page2", 2);

  }));

  it('should go to each state and receive correct life cycle events (test nine)', inject(function ($state, $q, $timeout, $compile, $ionicConfig, $ionicHistory) {

    /*
      Order:
      Page 1
      (Menu) Page 2
      (Menu) Page 3
      Page 3
      Page 1
    */

    _stateProvider
    .state('lcStartingPage', lcStartingPage)
    .state('lcPage1', lcPage1)
    .state('lcApp', lcApp)
    .state('lcApp.lcPage2', lcAppPage2)
    .state('lcApp.lcPage3', lcAppPage3)
    .state('lcPage3', lcPage3);

    // arrange
    elem.append($compile('<div><ion-nav-view></ion-nav-view></div>')(scope));

    var states = ["lcPage1", "lcApp.lcPage2", "lcApp.lcPage3", "lcPage3",  "lcStartingPage"];
    var scopes = setUpStatesAndStoreScope($state, $q, $timeout, elem[0], states);

    for ( var i = 0; i < states.length; i++ ){
      initializeHandlers(scopes[states[i]], states[i]);
    }

    $ionicHistory.clearHistory();

    // act
    goToState($state, $q, $timeout, "lcPage1");
    goToState($state, $q, $timeout, "lcApp.lcPage2");
    goToState($state, $q, $timeout, "lcApp.lcPage3");
    goToState($state, $q, $timeout, "lcPage3");
    goToState($state, $q, $timeout, "lcPage1");
    // go to done page
    goToState($state, $q, $timeout, "lcStartingPage");

    // assert

    doAssertionsForState("lcPage1", 2);

    doAssertionsForState("lcApp.lcPage2", 1);

    doAssertionsForState("lcApp.lcPage3", 1);

    doAssertionsForState("lcPage3", 1);
  }));

  it('should go to each state and receive correct life cycle events (test ten)', inject(function ($state, $q, $timeout, $compile, $ionicConfig, $ionicHistory) {

    /*
      Order:
      Page 1
      Tabs 1 Tab 2, Page 2
      Tabs 1 Tab 3, Page 2
      Tabs 2 Tab 1, Page 2
      Page 3
      Tabs 1 Tab 2, Page 2
      Tabs 2 Tab 2, Page 1
      Tabs 1 Tab 3, Page 1
      Page 2
      Tabs 1 Tab 3, Page 2
      Tabs 2 Tab 3, Page 1
    */

    _stateProvider
    .state('lcPage1', lcPage1)
    .state('lcPage2', lcPage2)
    .state('lcPage3', lcPage3)
    .state('lcTabsPage', lcTabsPage)
    .state('lcTabsPage.lcTab1Page1', lcTab1Page1)
    .state('lcTabsPage.lcTab1Page2', lcTab1Page2)
    .state('lcTabsPage.lcTab2Page1', lcTab2Page1)
    .state('lcTabsPage.lcTab2Page2', lcTab2Page2)
    .state('lcTabsPage.lcTab3Page1', lcTab3Page1)
    .state('lcTabsPage.lcTab3Page2', lcTab3Page2)
    .state('lcTabs2Page', lcTabs2Page)
    .state('lcTabs2Page.lcTab1Page1', lcTabs2Tab1Page1)
    .state('lcTabs2Page.lcTab1Page2', lcTabs2Tab1Page2)
    .state('lcTabs2Page.lcTab2Page1', lcTabs2Tab2Page1)
    .state('lcTabs2Page.lcTab2Page2', lcTabs2Tab2Page2)
    .state('lcTabs2Page.lcTab3Page1', lcTabs2Tab3Page1)
    .state('lcTabs2Page.lcTab3Page2', lcTabs2Tab3Page2)
    .state('lcStartingPage', lcStartingPage);

    // arrange
    elem.append($compile('<div><ion-nav-view></ion-nav-view></div>')(scope));

    var states = ["lcPage1", "lcPage2", "lcPage3", "lcTabsPage.lcTab1Page1", "lcTabsPage.lcTab1Page2", "lcTabsPage.lcTab2Page1", "lcTabsPage.lcTab2Page2",
      "lcTabsPage.lcTab3Page1", "lcTabsPage.lcTab3Page2",
    "lcTabs2Page.lcTab1Page1", "lcTabs2Page.lcTab1Page2", "lcTabs2Page.lcTab2Page1", "lcTabs2Page.lcTab2Page2",
    "lcTabs2Page.lcTab3Page1", "lcTabs2Page.lcTab3Page2", "lcStartingPage"];
    var scopes = setUpStatesAndStoreScope($state, $q, $timeout, elem[0], states);

    for ( var i = 0; i < states.length; i++ ){
      initializeHandlers(scopes[states[i]], states[i]);
    }

    $ionicHistory.clearHistory();

    // act
    goToState($state, $q, $timeout, "lcPage1");
    goToState($state, $q, $timeout, "lcTabsPage.lcTab2Page2");
    goToState($state, $q, $timeout, "lcTabsPage.lcTab3Page2");
    goToState($state, $q, $timeout, "lcTabs2Page.lcTab1Page2");
    goToState($state, $q, $timeout, "lcPage3");
    goToState($state, $q, $timeout, "lcTabsPage.lcTab2Page2");
    goToState($state, $q, $timeout, "lcTabs2Page.lcTab2Page1");
    goToState($state, $q, $timeout, "lcTabsPage.lcTab3Page1");
    goToState($state, $q, $timeout, "lcPage2");
    goToState($state, $q, $timeout, "lcTabsPage.lcTab3Page2");
    goToState($state, $q, $timeout, "lcTabs2Page.lcTab3Page1");
    // go to done page
    goToState($state, $q, $timeout, "lcStartingPage");

    // assert
    doAssertionsForState("lcPage1", 1);

    doAssertionsForState("lcPage1", 1);

    doAssertionsForState("lcPage3", 1);

    doAssertionsForState("lcTabsPage.lcTab1Page1", 0);

    doAssertionsForState("lcTabsPage.lcTab1Page2", 0);

    doAssertionsForState("lcTabsPage.lcTab2Page1", 0);

    doAssertionsForState("lcTabsPage.lcTab2Page2", 2);

    doAssertionsForState("lcTabsPage.lcTab3Page1", 1);

    doAssertionsForState("lcTabsPage.lcTab3Page2", 2);

    doAssertionsForState("lcTabs2Page.lcTab1Page1", 0);

    doAssertionsForState("lcTabs2Page.lcTab1Page2", 1);

    doAssertionsForState("lcTabs2Page.lcTab2Page1", 1);

    doAssertionsForState("lcTabs2Page.lcTab2Page2", 0);

    doAssertionsForState("lcTabs2Page.lcTab3Page1", 1);

    doAssertionsForState("lcTabs2Page.lcTab3Page2", 0);
  }));

  it('should go to each state and receive correct life cycle events (test eleven)', inject(function ($state, $q, $timeout, $compile, $ionicConfig, $ionicHistory) {

    /*
      Order:
      Page 1
      Page 2
      (Menu) Tab 1, Page 1
      (Menu) Tab 1, Page 2
      Page 2
      (Menu) Tab 2, Page 1
      Page 3
      (Menu) Tab 1, Page 2
      Page 1
      (Menu) Tab 1, Page 1
      Page 3
      (Menu) Tab 2, Page 2
      (Menu) Tab 3, Page 2
      (Menu) Tab 1, Page 2
      Page 1
      (Menu) Tab 2, Page 2
      (Menu) Tab 3, Page 1
      Page 3
      (Menu) Tab 3, Page 2
      (Menu) Tab 3, Page 1
    */

    _stateProvider
    .state('lcStartingPage', lcStartingPage)
    .state('lcPage1', lcPage1)
    .state('lcPage2', lcPage2)
    .state('lcPage3', lcPage3)
    .state('lcApp', lcApp)
    .state('lcApp.tabs1', lcAppTab1)
    .state('lcApp.tabs2', lcAppTab2)
    .state('lcApp.tabs1.tab1Page1', lcTab1Page1)
    .state('lcApp.tabs1.tab1Page2', lcTab1Page2)
    .state('lcApp.tabs1.tab2Page1', lcTab2Page1)
    .state('lcApp.tabs1.tab2Page2', lcTab2Page2)
    .state('lcApp.tabs1.tab3Page1', lcTab3Page1)
    .state('lcApp.tabs1.tab3Page2', lcTab3Page2)

    .state('lcApp.tabs2.tab1Page1', lcTabs2Tab1Page1)
    .state('lcApp.tabs2.tab1Page2', lcTabs2Tab1Page2)
    .state('lcApp.tabs2.tab2Page1', lcTabs2Tab2Page1)
    .state('lcApp.tabs2.tab2Page2', lcTabs2Tab2Page2)
    .state('lcApp.tabs2.tab3Page1', lcTabs2Tab3Page1)
    .state('lcApp.tabs2.tab3Page2', lcTabs2Tab3Page2)

    // arrange
    elem.append($compile('<div><ion-nav-view></ion-nav-view></div>')(scope));

    var states = ["lcPage1", "lcPage2", "lcPage3",
    "lcApp.tabs1.tab1Page1", "lcApp.tabs1.tab1Page2", "lcApp.tabs1.tab2Page1",
    "lcApp.tabs1.tab2Page2", "lcApp.tabs1.tab3Page1", "lcApp.tabs1.tab3Page2",
    "lcApp.tabs2.tab1Page1", "lcApp.tabs2.tab1Page2", "lcApp.tabs2.tab2Page1",
    "lcApp.tabs2.tab2Page2", "lcApp.tabs2.tab3Page1", "lcApp.tabs2.tab3Page2",
    "lcStartingPage"];
    var scopes = setUpStatesAndStoreScope($state, $q, $timeout, elem[0], states);

    for ( var i = 0; i < states.length; i++ ){
      initializeHandlers(scopes[states[i]], states[i]);
    }

    $ionicHistory.clearHistory();

    // act
    goToState($state, $q, $timeout, "lcPage1");
    goToState($state, $q, $timeout, "lcPage2");
    goToState($state, $q, $timeout, "lcApp.tabs1.tab1Page1");
    goToState($state, $q, $timeout, "lcApp.tabs1.tab1Page2");
    goToState($state, $q, $timeout, "lcPage2");
    goToState($state, $q, $timeout, "lcApp.tabs1.tab2Page1");
    goToState($state, $q, $timeout, "lcPage3");
    goToState($state, $q, $timeout, "lcApp.tabs1.tab1Page2");
    goToState($state, $q, $timeout, "lcPage1");
    goToState($state, $q, $timeout, "lcApp.tabs1.tab1Page1");
    goToState($state, $q, $timeout, "lcPage3");
    goToState($state, $q, $timeout, "lcApp.tabs1.tab2Page2");
    goToState($state, $q, $timeout, "lcApp.tabs1.tab3Page2");
    goToState($state, $q, $timeout, "lcApp.tabs1.tab1Page2");
    goToState($state, $q, $timeout, "lcPage1");
    goToState($state, $q, $timeout, "lcApp.tabs1.tab2Page2");
    goToState($state, $q, $timeout, "lcApp.tabs1.tab3Page1");
    goToState($state, $q, $timeout, "lcPage3");
    goToState($state, $q, $timeout, "lcApp.tabs1.tab3Page2");
    goToState($state, $q, $timeout, "lcApp.tabs1.tab3Page1");
    // go to done page
    goToState($state, $q, $timeout, "lcStartingPage");

    // assert
    doAssertionsForState("lcPage1", 3);

    doAssertionsForState("lcPage2", 2);

    doAssertionsForState("lcPage3", 3);

    doAssertionsForState("lcApp.tabs1.tab1Page1", 2);

    doAssertionsForState("lcApp.tabs1.tab1Page2", 3);

    doAssertionsForState("lcApp.tabs1.tab2Page1", 1);

    doAssertionsForState("lcApp.tabs1.tab2Page2", 2);

    doAssertionsForState("lcApp.tabs1.tab3Page1", 2);

    doAssertionsForState("lcApp.tabs1.tab3Page2", 2);
  }));

  it('should go to each state and receive correct life cycle events (test twelve)', inject(function ($state, $q, $timeout, $compile, $ionicConfig, $ionicHistory) {

    /*
      Order:
      Page 1
      Page 2
      (Menu) Tabs 1, Tab 1, Page 1
      (Menu) Tabs 2, Tab 1, Page 2
      Page 2
      (Menu) Tabs 2, Tab 2, Page 1
      Page 3
      (Menu) Tabs1, Tab 1, Page 2
      Page 1
      (Menu) Tabs 1, Tab 1, Page 1
      Page 3
      (Menu) Tabs 1, Tab 2, Page 2
      (Menu) Tabs 2, Tab 3, Page 2
      (Menu) Tabs 1, Tab 1, Page 2
      Page 1
      (Menu) Tabs 1, Tab 2, Page 2
      (Menu) Tabs 2, Tab 3, Page 1
      Page 3
      (Menu) Tabs 2, Tab 3, Page 2
      (Menu) Tabs 1, Tab 3, Page 1
    */

    _stateProvider
    .state('lcStartingPage', lcStartingPage)
    .state('lcPage1', lcPage1)
    .state('lcPage2', lcPage2)
    .state('lcPage3', lcPage3)
    .state('lcApp', lcApp)
    .state('lcApp.tabs1', lcAppTab1)
    .state('lcApp.tabs2', lcAppTab2)
    .state('lcApp.tabs1.tab1Page1', lcTab1Page1)
    .state('lcApp.tabs1.tab1Page2', lcTab1Page2)
    .state('lcApp.tabs1.tab2Page1', lcTab2Page1)
    .state('lcApp.tabs1.tab2Page2', lcTab2Page2)
    .state('lcApp.tabs1.tab3Page1', lcTab3Page1)
    .state('lcApp.tabs1.tab3Page2', lcTab3Page2)

    .state('lcApp.tabs2.tab1Page1', lcTabs2Tab1Page1)
    .state('lcApp.tabs2.tab1Page2', lcTabs2Tab1Page2)
    .state('lcApp.tabs2.tab2Page1', lcTabs2Tab2Page1)
    .state('lcApp.tabs2.tab2Page2', lcTabs2Tab2Page2)
    .state('lcApp.tabs2.tab3Page1', lcTabs2Tab3Page1)
    .state('lcApp.tabs2.tab3Page2', lcTabs2Tab3Page2)

    // arrange
    elem.append($compile('<div><ion-nav-view></ion-nav-view></div>')(scope));

    var states = ["lcPage1", "lcPage2", "lcPage3",
    "lcApp.tabs1.tab1Page1", "lcApp.tabs1.tab1Page2", "lcApp.tabs1.tab2Page1",
    "lcApp.tabs1.tab2Page2", "lcApp.tabs1.tab3Page1", "lcApp.tabs1.tab3Page2",
    "lcApp.tabs2.tab1Page1", "lcApp.tabs2.tab1Page2", "lcApp.tabs2.tab2Page1",
    "lcApp.tabs2.tab2Page2", "lcApp.tabs2.tab3Page1", "lcApp.tabs2.tab3Page2",
    "lcStartingPage"];
    var scopes = setUpStatesAndStoreScope($state, $q, $timeout, elem[0], states);

    for ( var i = 0; i < states.length; i++ ){
      initializeHandlers(scopes[states[i]], states[i]);
    }

    $ionicHistory.clearHistory();

    // act
    goToState($state, $q, $timeout, "lcPage1");
    goToState($state, $q, $timeout, "lcPage2");
    goToState($state, $q, $timeout, "lcApp.tabs1.tab1Page1");
    goToState($state, $q, $timeout, "lcApp.tabs2.tab1Page2");
    goToState($state, $q, $timeout, "lcPage2");
    goToState($state, $q, $timeout, "lcApp.tabs2.tab2Page1");
    goToState($state, $q, $timeout, "lcPage3");
    goToState($state, $q, $timeout, "lcApp.tabs1.tab1Page2");
    goToState($state, $q, $timeout, "lcPage1");
    goToState($state, $q, $timeout, "lcApp.tabs1.tab1Page1");
    goToState($state, $q, $timeout, "lcPage3");
    goToState($state, $q, $timeout, "lcApp.tabs1.tab2Page2");
    goToState($state, $q, $timeout, "lcApp.tabs2.tab3Page2");
    goToState($state, $q, $timeout, "lcApp.tabs1.tab1Page2");
    goToState($state, $q, $timeout, "lcPage1");
    goToState($state, $q, $timeout, "lcApp.tabs1.tab2Page2");
    goToState($state, $q, $timeout, "lcApp.tabs2.tab3Page1");
    goToState($state, $q, $timeout, "lcPage3");
    goToState($state, $q, $timeout, "lcApp.tabs2.tab3Page2");
    goToState($state, $q, $timeout, "lcApp.tabs1.tab3Page1");
    // go to done page
    goToState($state, $q, $timeout, "lcStartingPage");

    // assert

    doAssertionsForState("lcPage1", 3);

    doAssertionsForState("lcPage2", 2);

    doAssertionsForState("lcPage3", 3);

    doAssertionsForState("lcApp.tabs1.tab1Page1", 2);

    doAssertionsForState("lcApp.tabs1.tab1Page2", 2);

    doAssertionsForState("lcApp.tabs1.tab2Page1", 0);

    doAssertionsForState("lcApp.tabs1.tab2Page2", 2);

    doAssertionsForState("lcApp.tabs1.tab3Page1", 1);

    doAssertionsForState("lcApp.tabs1.tab3Page2", 0);

    doAssertionsForState("lcApp.tabs2.tab1Page1", 0);

    doAssertionsForState("lcApp.tabs2.tab1Page2", 1);

    doAssertionsForState("lcApp.tabs2.tab2Page1", 1);

    doAssertionsForState("lcApp.tabs2.tab2Page2", 0);

    doAssertionsForState("lcApp.tabs2.tab3Page1", 1);

    doAssertionsForState("lcApp.tabs2.tab3Page2", 2);
  }));

  it('should go to each state and receive correct life cycle events (test thirteen)', inject(function ($state, $q, $timeout, $compile, $ionicConfig, $ionicHistory) {

    /*
      Order:
      Page 1
      Menu 1 Page 2
      Menu 1 Page 3
      Page 3
      Menu 2 Page 2
      Menu 2 Page 3
      Menu 1 Page 2
      Menu 2 Page 3
      Menu 1 Page 3
      Page 1
    */

    _stateProvider
    .state('lcStartingPage', lcStartingPage)
    .state('lcPage1', lcPage1)
    .state('lcApp', lcApp)
    .state('lcApp2', lcApp2)
    .state('lcApp.lcPage2', lcAppPage2)
    .state('lcApp.lcPage3', lcAppPage3)
    .state('lcApp2.lcPage2', lcApp2Page2)
    .state('lcApp2.lcPage3', lcApp2Page3)
    .state('lcPage3', lcPage3);


    // arrange
    elem.append($compile('<div><ion-nav-view></ion-nav-view></div>')(scope));

    var states = ["lcPage1", "lcApp.lcPage2", "lcApp.lcPage3", "lcApp2.lcPage2", "lcApp2.lcPage3", "lcPage3",  "lcStartingPage"];
    var scopes = setUpStatesAndStoreScope($state, $q, $timeout, elem[0], states);

    for ( var i = 0; i < states.length; i++ ){
      initializeHandlers(scopes[states[i]], states[i]);
    }

    $ionicHistory.clearHistory();

    // act
    goToState($state, $q, $timeout, "lcPage1");
    goToState($state, $q, $timeout, "lcApp.lcPage2");
    goToState($state, $q, $timeout, "lcApp.lcPage3");
    goToState($state, $q, $timeout, "lcPage3");
    goToState($state, $q, $timeout, "lcApp2.lcPage2");
    goToState($state, $q, $timeout, "lcApp2.lcPage3");
    goToState($state, $q, $timeout, "lcApp.lcPage2");
    goToState($state, $q, $timeout, "lcApp2.lcPage3");
    goToState($state, $q, $timeout, "lcApp.lcPage3");
    goToState($state, $q, $timeout, "lcPage1");
    // go to done page
    goToState($state, $q, $timeout, "lcStartingPage");


    // assert
    doAssertionsForState("lcPage1", 2);

    doAssertionsForState("lcApp.lcPage2", 2);

    doAssertionsForState("lcApp.lcPage3", 2);

    doAssertionsForState("lcApp2.lcPage2", 1);

    doAssertionsForState("lcApp2.lcPage3", 2);

    doAssertionsForState("lcPage3", 1);
  }));

  it('should go to each state and receive correct life cycle events (test fourteen)', inject(function ($state, $q, $timeout, $compile, $ionicConfig, $ionicHistory) {

    /*
      Order:
      Page 1
      Menu 1 Page 2
      Menu 1 Tabs 1 Tab 1 Page 1
      Menu 1 Tabs 1 Tab 1 Page 2
      Menu 1 Page 3
      Menu 1 Tabs 1 Tab 2 Page 2
      Page 4
      Menu 2 Tabs 1 Tab 2 Page 2
      Menu 2 Page 3
      Menu 2 Tabs 1 Tab 2 Page 2
      Menu 1 Tabs 1 Tab 1 Page 2
      Menu 2 Tabs 1 Tab 1 Page 1
      Menu 2 Tabs 1 Tab 1 Page 2
      Menu 1 Tabs 1 Tab 2 Page 1
      Menu 2 Tabs 1 Tab 2 Page 1
      Menu 1 Page 2
      Menu 2 Page 3
      Menu 2 Page 2
      Menu 1 Page 3
      Page 1
    */

    /* visit counts

    Page 1 - 2
    Page 2 - 0
    Page 4 - 1

    Menu 1 Page 2 - 2
    Menu 1 Page 3 - 3
    Menu 1 Tabs 1 Tab 1 Page 1 - 1
    Menu 1 Tabs 1 Tab 1 Page 2 - 2
    Menu 1 Tabs 1 Tab 2 Page 1 - 1
    Menu 1 Tabs 1 Tab 2 Page 2 - 1
    Menu 1 Tabs 1 Tab 3 Page 1 - 0
    Menu 1 Tabs 1 Tab 3 Page 2 - 0

    Menu 2 Page 2 - 1
    Menu 2 Page 3 - 2
    Menu 2 Tabs 1 Tab 1 Page 1 - 1
    Menu 2 Tabs 1 Tab 1 Page 2 - 1
    Menu 2 Tabs 1 Tab 2 Page 1 - 1
    Menu 2 Tabs 1 Tab 2 Page 2 - 2
    Menu 2 Tabs 1 Tab 3 Page 1 - 0
    Menu 2 Tabs 1 Tab 3 Page 2 - 0
    */

    _stateProvider
    .state('lcStartingPage', lcStartingPage)
    .state('lcPage1', {
      template: '<ion-view><h1>Page One</h1></ion-view>'
    })
    .state('lcPage4', {
      template: '<ion-view><h1>Page Four</h1></ion-view>'
    })
    .state('lcApp', lcApp)
    .state('lcApp.lcPage2', lcAppPage2)
    .state('lcApp.lcPage3', lcAppPage3)
    .state('lcApp.tabs1', lcAppTab1)
    .state('lcApp.tabs2', lcAppTab2)
    .state('lcApp.tabs1.tab1Page1', lcTab1Page1)
    .state('lcApp.tabs1.tab1Page2', lcTab1Page2)
    .state('lcApp.tabs1.tab2Page1', lcTab2Page1)
    .state('lcApp.tabs1.tab2Page2', lcTab2Page2)
    .state('lcApp.tabs1.tab3Page1', lcTab3Page1)
    .state('lcApp.tabs1.tab3Page2', lcTab3Page2)

    .state('lcApp.tabs2.tab1Page1', lcTabs2Tab1Page1)
    .state('lcApp.tabs2.tab1Page2', lcTabs2Tab1Page2)
    .state('lcApp.tabs2.tab2Page1', lcTabs2Tab2Page1)
    .state('lcApp.tabs2.tab2Page2', lcTabs2Tab2Page2)
    .state('lcApp.tabs2.tab3Page1', lcTabs2Tab3Page1)
    .state('lcApp.tabs2.tab3Page2', lcTabs2Tab3Page2)

    .state('lcApp2', lcApp2)
    .state('lcApp2.lcPage2', lcApp2Page2)
    .state('lcApp2.lcPage3', lcApp2Page3)
    .state('lcApp2.tabs1', lcApp2Tabs1Page)
    .state('lcApp2.tabs2', lcApp2Tabs2Page)
    .state('lcApp2.tabs1.tab1Page1', lcApp2Tabs1Tab1Page1)
    .state('lcApp2.tabs1.tab1Page2', lcApp2Tabs1Tab1Page2)
    .state('lcApp2.tabs1.tab2Page1', lcApp2Tabs1Tab2Page1)
    .state('lcApp2.tabs1.tab2Page2', lcApp2Tabs1Tab2Page2)
    .state('lcApp2.tabs1.tab3Page1', lcApp2Tabs1Tab3Page1)
    .state('lcApp2.tabs1.tab3Page2', lcApp2Tabs1Tab3Page2)
    .state('lcApp2.tabs2.tab1Page1', lcApp2Tabs2Tab1Page1)
    .state('lcApp2.tabs2.tab1Page2', lcApp2Tabs2Tab1Page2)
    .state('lcApp2.tabs2.tab2Page1', lcApp2Tabs2Tab2Page1)
    .state('lcApp2.tabs2.tab2Page2', lcApp2Tabs2Tab2Page2)
    .state('lcApp2.tabs2.tab3Page1', lcApp2Tabs2Tab3Page1)
    .state('lcApp2.tabs2.tab3Page2', lcApp2Tabs2Tab3Page2)


    // arrange
    elem.append($compile('<div><ion-nav-view></ion-nav-view></div>')(scope));

    var states = [
      "lcPage1", "lcPage4",
      "lcApp.lcPage2", "lcApp.lcPage3",
      "lcApp.tabs1.tab1Page1", "lcApp.tabs1.tab1Page2",
      "lcApp.tabs1.tab2Page1", "lcApp.tabs1.tab2Page2",
      "lcApp.tabs1.tab3Page1", "lcApp.tabs1.tab3Page2",
      "lcApp.tabs2.tab1Page1", "lcApp.tabs2.tab1Page2",
      "lcApp.tabs2.tab2Page1", "lcApp.tabs2.tab2Page2",
      "lcApp.tabs2.tab3Page1", "lcApp.tabs2.tab3Page2",
      "lcApp2.lcPage2", "lcApp2.lcPage3",
      "lcApp2.tabs1.tab1Page1", "lcApp2.tabs1.tab1Page2",
      "lcApp2.tabs1.tab2Page1", "lcApp2.tabs1.tab2Page2",
      "lcApp2.tabs1.tab3Page1", "lcApp2.tabs1.tab3Page2",
      "lcApp2.tabs2.tab1Page1", "lcApp2.tabs2.tab1Page2",
      "lcApp2.tabs2.tab2Page1", "lcApp2.tabs2.tab2Page2",
      "lcApp2.tabs2.tab3Page1", "lcApp2.tabs2.tab3Page2",
      "lcStartingPage"];

    var scopes = setUpStatesAndStoreScope($state, $q, $timeout, elem[0], states);

    for ( var i = 0; i < states.length; i++ ){
      initializeHandlers(scopes[states[i]], states[i]);
    }

    $ionicHistory.clearHistory();

    // act
    goToState($state, $q, $timeout, "lcPage1");
    goToState($state, $q, $timeout, "lcApp.lcPage2");
    goToState($state, $q, $timeout, "lcApp.tabs1.tab1Page1");
    goToState($state, $q, $timeout, "lcApp.tabs1.tab1Page2");
    goToState($state, $q, $timeout, "lcApp.lcPage3");
    goToState($state, $q, $timeout, "lcApp.tabs1.tab2Page2");
    goToState($state, $q, $timeout, "lcPage4");
    goToState($state, $q, $timeout, "lcApp2.tabs1.tab2Page2");
    goToState($state, $q, $timeout, "lcApp2.lcPage3");
    goToState($state, $q, $timeout, "lcApp2.tabs1.tab2Page2");
    goToState($state, $q, $timeout, "lcApp.tabs1.tab1Page2");
    goToState($state, $q, $timeout, "lcApp2.tabs1.tab1Page1");
    goToState($state, $q, $timeout, "lcApp2.tabs1.tab1Page2");
    goToState($state, $q, $timeout, "lcApp.tabs1.tab2Page1");
    goToState($state, $q, $timeout, "lcApp2.tabs1.tab2Page1");
    goToState($state, $q, $timeout, "lcApp.lcPage2");
    goToState($state, $q, $timeout, "lcApp2.lcPage3");
    goToState($state, $q, $timeout, "lcApp2.lcPage2");
    goToState($state, $q, $timeout, "lcApp.lcPage3");
    goToState($state, $q, $timeout, "lcPage1");
    // go to done page
    goToState($state, $q, $timeout, "lcStartingPage");

    // assert
    doAssertionsForState("lcPage1", 2);

    doAssertionsForState("lcPage4", 1);

    doAssertionsForState("lcApp.lcPage2", 2);

    doAssertionsForState("lcApp.lcPage3", 2);

    doAssertionsForState("lcApp.tabs1.tab1Page1", 1);

    doAssertionsForState("lcApp.tabs1.tab1Page2", 2);

    doAssertionsForState("lcApp.tabs1.tab2Page1", 1);

    doAssertionsForState("lcApp.tabs1.tab2Page2", 1);

    doAssertionsForState("lcApp2.lcPage2", 1);

    doAssertionsForState("lcApp2.lcPage3", 2);

    doAssertionsForState("lcApp2.tabs1.tab1Page1", 1);

    doAssertionsForState("lcApp2.tabs1.tab1Page2", 1);

    doAssertionsForState("lcApp2.tabs1.tab2Page1", 1);

    doAssertionsForState("lcApp2.tabs1.tab2Page2", 2);

  }));

  it('should go to each state and receive correct life cycle events (test fifteen)', inject(function ($state, $q, $timeout, $compile, $ionicConfig, $ionicHistory) {

    /*
      Order:
      Page 1
      Menu 1 Page 2
      Menu 1 Tabs 1 Tab 1 Page 1
      Menu 2 Tabs 1 Tab 2 Page 1
      Menu 1 Tabs 1 Tab 1 Page 2
      Menu 2 Tabs 2 Tab 2 Page 2
      Menu 1 Tabs 2 Tab 1 Page 2
      Menu 2 Tabs 2 Tab 1 Page 2
      Menu 1 Page 2
      Menu 2 Page 3
      Menu 1 Page 3
      Menu 1 Tabs 2 Tab 1 Page 2
      Menu 2 Page 2
      Menu 2 Tabs 2 Tab 1 Page 1
      Page 4
      Menu 2 Tabs 1 Tab 1 Page 1
      Menu 1 Tabs 2 Tab 1 Page 1
      Page 1
      Menu 2 Tabs 2 Tab 1 Page 2
      Menu 1 Tabs 2 Tab 2 Page 2
      Menu 1 Tabs 2 Tab 2 Page 1
      Menu 1 Tabs 2 Tab 1 Page 1
      Menu 2 Tabs 1 Tab 1 Page 1
      Menu 1 Tabs 1 Tab 2 Page 2
      Menu 2 Page 3
      Menu 1 Page 3
      Menu 1 Tabs 1 Tab 2 Page 2
      Menu 2 Tabs 1 Tab 2 Page 2
      Menu 2 Page 3
      Page 1
      Menu 1 Tabs 1 Tab 2 Page 1
      Menu 2 Page 2
      Page 1
      Menu 2 Tabs 2 Tab  Page 2
      Page 4
      Menu 2 Tabs 1 Tab 2 Page 2
      Menu 2 Tabs 2 Tab 2 Page 1
      Menu 1 Tabs 2 Tab 1 Page 1
      Menu 2 Tabs 1 Tab 1 Page 1
      Menu 2 Page 3
      Menu 1 Tabs 1 Tab 2 Page 2
      Menu 1 Tabs 1 Tab 2 Page 1
      Menu 1 Page 2
      Menu 2 Tabs 1 Tab 1 Page 1
      Menu 1 Tabs 2 Tab 2 Page 1
      Menu 2 Tabs 1 Tab 2 Page 1
      Menu 1 Tabs 1 Tab 1 Page 1
      Menu 2 Page 3
      Menu 1 Tabs 2 Tab 1 Page 1
      Menu 2 Tabs 1 Tab 2 Page 2
      Menu 1 Tabs 2 Tab 1 Page 2
      Menu 2 Tabs 2 Tab 2 Page 2
      Menu 1 Tabs 2 Tab 2 Page 2
      Page 4
      Menu 1 Tabs 2 Tab 2 Page 1
      Menu 1 Tabs 2 Tab 1 Page 2
      Menu 1 Tabs 1 Tab 2 Page 2
      Menu 1 Tabs 1 Tab 1 Page 2
      Menu 2 Tabs 2 Tab 1 Page 1
      Menu 2 Tabs 1 Tab 1 Page 2
      Page 1
      Menu 2 Tabs 1 Tab 1 Page 2
      Page 4
      Menu 2 Page 2
      Menu 1 Page 3
      Menu 1 Tabs 2 Tab 2 Page 1
      Page 1
      Menu 2 Tabs 2 Tab 2 Page 1
      Menu 2 Tabs 1 Tab 2 Page 1
      Menu 1 Page 2
      Menu 2 Page 3
      Menu 2 Page 2
      Menu 1 Page 3
      Page 1
    */

    /* visit counts

    Page 1 - 7
    Page 4 - 4

    Menu 1 Page 2 - 4
    Menu 1 Page 3 - 4

    Menu 1 Tabs 1 Tab 1 Page 1 - 2
    Menu 1 Tabs 1 Tab 1 Page 2 - 2
    Menu 1 Tabs 1 Tab 2 Page 1 - 2
    Menu 1 Tabs 1 Tab 2 Page 2 - 4

    Menu 1 Tabs 2 Tab 1 Page 1 - 4
    Menu 1 Tabs 2 Tab 1 Page 2 - 4
    Menu 1 Tabs 2 Tab 2 Page 1 - 4
    Menu 1 Tabs 2 Tab 2 Page 2 - 2

    Menu 2 Page 2 - 4
    Menu 2 Page 3 - 6

    Menu 2 Tabs 1 Tab 1 Page 1 - 4
    Menu 2 Tabs 1 Tab 1 Page 2 - 2
    Menu 2 Tabs 1 Tab 2 Page 1 - 3
    Menu 2 Tabs 1 Tab 2 Page 2 - 3

    Menu 2 Tabs 2 Tab 1 Page 1 - 2
    Menu 2 Tabs 2 Tab 1 Page 2 - 2
    Menu 2 Tabs 2 Tab 2 Page 1 - 2
    Menu 2 Tabs 2 Tab 2 Page 2 - 2
    */

    _stateProvider
    .state('lcStartingPage', lcStartingPage)
    .state('lcPage1', {
      template: '<ion-view><h1>Page One</h1></ion-view>'
    })
    .state('lcPage4', {
      template: '<ion-view><h1>Page Four</h1></ion-view>'
    })
    .state('lcApp', lcApp)
    .state('lcApp.lcPage2', lcAppPage2)
    .state('lcApp.lcPage3', lcAppPage3)
    .state('lcApp.tabs1', lcAppTab1)
    .state('lcApp.tabs2', lcAppTab2)
    .state('lcApp.tabs1.tab1Page1', lcTab1Page1)
    .state('lcApp.tabs1.tab1Page2', lcTab1Page2)
    .state('lcApp.tabs1.tab2Page1', lcTab2Page1)
    .state('lcApp.tabs1.tab2Page2', lcTab2Page2)
    .state('lcApp.tabs1.tab3Page1', lcTab3Page1)
    .state('lcApp.tabs1.tab3Page2', lcTab3Page2)

    .state('lcApp.tabs2.tab1Page1', lcTabs2Tab1Page1)
    .state('lcApp.tabs2.tab1Page2', lcTabs2Tab1Page2)
    .state('lcApp.tabs2.tab2Page1', lcTabs2Tab2Page1)
    .state('lcApp.tabs2.tab2Page2', lcTabs2Tab2Page2)
    .state('lcApp.tabs2.tab3Page1', lcTabs2Tab3Page1)
    .state('lcApp.tabs2.tab3Page2', lcTabs2Tab3Page2)

    .state('lcApp2', lcApp2)
    .state('lcApp2.lcPage2', lcApp2Page2)
    .state('lcApp2.lcPage3', lcApp2Page3)
    .state('lcApp2.tabs1', lcApp2Tabs1Page)
    .state('lcApp2.tabs2', lcApp2Tabs2Page)
    .state('lcApp2.tabs1.tab1Page1', lcApp2Tabs1Tab1Page1)
    .state('lcApp2.tabs1.tab1Page2', lcApp2Tabs1Tab1Page2)
    .state('lcApp2.tabs1.tab2Page1', lcApp2Tabs1Tab2Page1)
    .state('lcApp2.tabs1.tab2Page2', lcApp2Tabs1Tab2Page2)
    .state('lcApp2.tabs1.tab3Page1', lcApp2Tabs1Tab3Page1)
    .state('lcApp2.tabs1.tab3Page2', lcApp2Tabs1Tab3Page2)
    .state('lcApp2.tabs2.tab1Page1', lcApp2Tabs2Tab1Page1)
    .state('lcApp2.tabs2.tab1Page2', lcApp2Tabs2Tab1Page2)
    .state('lcApp2.tabs2.tab2Page1', lcApp2Tabs2Tab2Page1)
    .state('lcApp2.tabs2.tab2Page2', lcApp2Tabs2Tab2Page2)
    .state('lcApp2.tabs2.tab3Page1', lcApp2Tabs2Tab3Page1)
    .state('lcApp2.tabs2.tab3Page2', lcApp2Tabs2Tab3Page2)


    // arrange
    elem.append($compile('<div><ion-nav-view></ion-nav-view></div>')(scope));

    var states = [
      "lcPage1", "lcPage4",
      "lcApp.lcPage2", "lcApp.lcPage3",
      "lcApp.tabs1.tab1Page1", "lcApp.tabs1.tab1Page2",
      "lcApp.tabs1.tab2Page1", "lcApp.tabs1.tab2Page2",
      "lcApp.tabs1.tab3Page1", "lcApp.tabs1.tab3Page2",
      "lcApp.tabs2.tab1Page1", "lcApp.tabs2.tab1Page2",
      "lcApp.tabs2.tab2Page1", "lcApp.tabs2.tab2Page2",
      "lcApp.tabs2.tab3Page1", "lcApp.tabs2.tab3Page2",
      "lcApp2.lcPage2", "lcApp2.lcPage3",
      "lcApp2.tabs1.tab1Page1", "lcApp2.tabs1.tab1Page2",
      "lcApp2.tabs1.tab2Page1", "lcApp2.tabs1.tab2Page2",
      "lcApp2.tabs1.tab3Page1", "lcApp2.tabs1.tab3Page2",
      "lcApp2.tabs2.tab1Page1", "lcApp2.tabs2.tab1Page2",
      "lcApp2.tabs2.tab2Page1", "lcApp2.tabs2.tab2Page2",
      "lcApp2.tabs2.tab3Page1", "lcApp2.tabs2.tab3Page2",
      "lcStartingPage"];

    var scopes = setUpStatesAndStoreScope($state, $q, $timeout, elem[0], states);

    for ( var i = 0; i < states.length; i++ ){
      initializeHandlers(scopes[states[i]], states[i]);
    }

    $ionicHistory.clearHistory();

    // act
    goToState($state, $q, $timeout, "lcPage1");
    goToState($state, $q, $timeout, "lcApp.lcPage2");
    goToState($state, $q, $timeout, "lcApp.tabs1.tab1Page1");
    goToState($state, $q, $timeout, "lcApp2.tabs1.tab2Page1");
    goToState($state, $q, $timeout, "lcApp.tabs1.tab1Page2");
    goToState($state, $q, $timeout, "lcApp2.tabs2.tab2Page2");
    goToState($state, $q, $timeout, "lcApp.tabs2.tab1Page2");
    goToState($state, $q, $timeout, "lcApp2.tabs2.tab1Page2");
    goToState($state, $q, $timeout, "lcApp.lcPage2");
    goToState($state, $q, $timeout, "lcApp2.lcPage3");
    goToState($state, $q, $timeout, "lcApp.lcPage3");
    goToState($state, $q, $timeout, "lcApp.tabs2.tab1Page2");
    goToState($state, $q, $timeout, "lcApp2.lcPage2");
    goToState($state, $q, $timeout, "lcApp2.tabs2.tab1Page1");
    goToState($state, $q, $timeout, "lcPage4");
    goToState($state, $q, $timeout, "lcApp2.tabs1.tab1Page1");
    goToState($state, $q, $timeout, "lcApp.tabs2.tab1Page1");
    goToState($state, $q, $timeout, "lcPage1");
    goToState($state, $q, $timeout, "lcApp2.tabs2.tab1Page2");
    goToState($state, $q, $timeout, "lcApp.tabs2.tab2Page2");
    goToState($state, $q, $timeout, "lcApp.tabs2.tab2Page1");
    goToState($state, $q, $timeout, "lcApp.tabs2.tab1Page1");
    goToState($state, $q, $timeout, "lcApp2.tabs1.tab1Page1");
    goToState($state, $q, $timeout, "lcApp.tabs1.tab2Page2");
    goToState($state, $q, $timeout, "lcApp2.lcPage3");
    goToState($state, $q, $timeout, "lcApp.lcPage3");
    goToState($state, $q, $timeout, "lcApp.tabs1.tab2Page2");
    goToState($state, $q, $timeout, "lcApp2.tabs1.tab2Page2");
    goToState($state, $q, $timeout, "lcApp2.lcPage3");
    goToState($state, $q, $timeout, "lcPage1");
    goToState($state, $q, $timeout, "lcApp.tabs1.tab2Page1");
    goToState($state, $q, $timeout, "lcApp2.lcPage2");
    goToState($state, $q, $timeout, "lcPage1");
    goToState($state, $q, $timeout, "lcApp2.tabs2.tab2Page2");
    goToState($state, $q, $timeout, "lcPage4");
    goToState($state, $q, $timeout, "lcApp2.tabs1.tab2Page2");
    goToState($state, $q, $timeout, "lcApp2.tabs2.tab2Page1");
    goToState($state, $q, $timeout, "lcApp.tabs2.tab1Page1");
    goToState($state, $q, $timeout, "lcApp2.tabs1.tab1Page1");
    goToState($state, $q, $timeout, "lcApp2.lcPage3");
    goToState($state, $q, $timeout, "lcApp.tabs1.tab2Page2");
    goToState($state, $q, $timeout, "lcApp.tabs1.tab2Page1");
    goToState($state, $q, $timeout, "lcApp.lcPage2");
    goToState($state, $q, $timeout, "lcApp2.tabs1.tab1Page1");
    goToState($state, $q, $timeout, "lcApp.tabs2.tab2Page1");
    goToState($state, $q, $timeout, "lcApp2.tabs1.tab2Page1");
    goToState($state, $q, $timeout, "lcApp.tabs1.tab1Page1");
    goToState($state, $q, $timeout, "lcApp2.lcPage3");
    goToState($state, $q, $timeout, "lcApp.tabs2.tab1Page1");
    goToState($state, $q, $timeout, "lcApp2.tabs1.tab2Page2");
    goToState($state, $q, $timeout, "lcApp.tabs2.tab1Page2");
    goToState($state, $q, $timeout, "lcApp2.tabs2.tab2Page2");
    goToState($state, $q, $timeout, "lcApp.tabs2.tab2Page2");
    goToState($state, $q, $timeout, "lcPage4");
    goToState($state, $q, $timeout, "lcApp.tabs2.tab2Page1");
    goToState($state, $q, $timeout, "lcApp.tabs2.tab1Page2");
    goToState($state, $q, $timeout, "lcApp.tabs1.tab2Page2");
    goToState($state, $q, $timeout, "lcApp.tabs1.tab1Page2");
    goToState($state, $q, $timeout, "lcApp2.tabs2.tab1Page1");
    goToState($state, $q, $timeout, "lcApp2.tabs1.tab1Page2");
    goToState($state, $q, $timeout, "lcPage1");
    goToState($state, $q, $timeout, "lcApp2.tabs1.tab1Page2");
    goToState($state, $q, $timeout, "lcPage4");
    goToState($state, $q, $timeout, "lcApp2.lcPage2");
    goToState($state, $q, $timeout, "lcApp.lcPage3");
    goToState($state, $q, $timeout, "lcApp.tabs2.tab2Page1");
    goToState($state, $q, $timeout, "lcPage1");
    goToState($state, $q, $timeout, "lcApp2.tabs2.tab2Page1");
    goToState($state, $q, $timeout, "lcApp2.tabs1.tab2Page1");
    goToState($state, $q, $timeout, "lcApp.lcPage2");
    goToState($state, $q, $timeout, "lcApp2.lcPage3");
    goToState($state, $q, $timeout, "lcApp2.lcPage2");
    goToState($state, $q, $timeout, "lcApp.lcPage3");
    goToState($state, $q, $timeout, "lcPage1");
    // go to done page
    goToState($state, $q, $timeout, "lcStartingPage");

    // assert
    doAssertionsForState("lcPage1", 7);

    doAssertionsForState("lcPage4", 4);

    doAssertionsForState("lcApp.lcPage2", 4);

    doAssertionsForState("lcApp.lcPage3", 4);

    doAssertionsForState("lcApp.tabs1.tab1Page1", 2);

    doAssertionsForState("lcApp.tabs1.tab1Page2", 2);

    doAssertionsForState("lcApp.tabs1.tab2Page1", 2);

    doAssertionsForState("lcApp.tabs1.tab2Page2", 4);

    doAssertionsForState("lcApp.tabs2.tab1Page1", 4);

    doAssertionsForState("lcApp.tabs2.tab1Page2", 4);

    doAssertionsForState("lcApp.tabs2.tab2Page1", 4);

    doAssertionsForState("lcApp.tabs2.tab2Page2", 2);

    doAssertionsForState("lcApp2.lcPage2", 4);

    doAssertionsForState("lcApp2.lcPage3", 6);

    doAssertionsForState("lcApp2.tabs1.tab1Page1", 4);

    doAssertionsForState("lcApp2.tabs1.tab1Page2", 2);

    doAssertionsForState("lcApp2.tabs1.tab2Page1", 3);

    doAssertionsForState("lcApp2.tabs1.tab2Page2", 3);

    doAssertionsForState("lcApp2.tabs2.tab1Page1", 2);

    doAssertionsForState("lcApp2.tabs2.tab1Page2", 2);

    doAssertionsForState("lcApp2.tabs2.tab2Page1", 2);

    doAssertionsForState("lcApp2.tabs2.tab2Page2", 3);
  }));
});

function doAssertionsForState(stateName, callCount){
  expect(getEventCallCount(stateName, "$ionicView.beforeEnter")).toEqual(callCount);
  expect(getEventCallCount(stateName, "$ionicView.enter")).toEqual(callCount);
  expect(getEventCallCount(stateName, "$ionicView.afterEnter")).toEqual(callCount);
  expect(getEventCallCount(stateName, "$ionicView.beforeLeave")).toEqual(callCount);
  expect(getEventCallCount(stateName, "$ionicView.leave")).toEqual(callCount);
  expect(getEventCallCount(stateName, "$ionicView.afterLeave")).toEqual(callCount);

  expect(getEventCallCount(stateName, "$ionicParentView.beforeEnter")).toEqual(callCount);
  expect(getEventCallCount(stateName, "$ionicParentView.enter")).toEqual(callCount);
  expect(getEventCallCount(stateName, "$ionicParentView.afterEnter")).toEqual(callCount);
  expect(getEventCallCount(stateName, "$ionicParentView.beforeLeave")).toEqual(callCount);
  expect(getEventCallCount(stateName, "$ionicParentView.leave")).toEqual(callCount);
  expect(getEventCallCount(stateName, "$ionicParentView.afterLeave")).toEqual(callCount);
}

function initializeHandlers(scope, viewName){
  scope.$on("$ionicView.beforeEnter", function(){
    addEventForView(viewName, "$ionicView.beforeEnter");
  });

  scope.$on("$ionicView.enter", function(){
    addEventForView(viewName, "$ionicView.enter");
  });

  scope.$on("$ionicView.afterEnter", function(){
    addEventForView(viewName, "$ionicView.afterEnter");
  });

  scope.$on("$ionicView.beforeLeave", function(){
    addEventForView(viewName, "$ionicView.beforeLeave");
  });

  scope.$on("$ionicView.leave", function(){
    addEventForView(viewName, "$ionicView.leave");
  });

  scope.$on("$ionicView.afterLeave", function(){
    addEventForView(viewName, "$ionicView.afterLeave");
  });

  scope.$on("$ionicParentView.beforeEnter", function(event){
    event.preventDefault();
    addEventForView(viewName, "$ionicParentView.beforeEnter");
  });

  scope.$on("$ionicParentView.enter", function(event){
    event.preventDefault();
    addEventForView(viewName, "$ionicParentView.enter");
  });

  scope.$on("$ionicParentView.afterEnter", function(event){
    event.preventDefault();
    addEventForView(viewName, "$ionicParentView.afterEnter");
  });

  scope.$on("$ionicParentView.beforeLeave", function(event){
    event.preventDefault();
    addEventForView(viewName, "$ionicParentView.beforeLeave");
  });

  scope.$on("$ionicParentView.leave", function(event){
    event.preventDefault();
    addEventForView(viewName, "$ionicParentView.leave");
  });

  scope.$on("$ionicParentView.afterLeave", function(event){
    event.preventDefault();
    addEventForView(viewName, "$ionicParentView.afterLeave");
  });
}

function goToState($state, $q, $timeout, state){
  $state.go(state);
  $q.flush();
  $timeout.flush();
  _rootScope.$apply();
}

function setUpStatesAndStoreScope($state, $q, $timeout, element, statesToInitialize){
  var scopes = {};
  for ( var i = 0; i < statesToInitialize.length; i++ ){
    var state = statesToInitialize[i];
    goToState($state, $q, $timeout, state);
    //console.debug(element.innerHTML);
    var ionViews = angular.element(element).find("ion-view");
    for ( var j = 0; j < ionViews.length; j++){
      if ( angular.element(ionViews[j]).attr("state") === state ){
        scopes[state] = angular.element(ionViews[j]).scope();
        break;
      }
    }
  }
  return scopes;
}

function addEventForView(viewName, eventName){
  var viewData = lifeCycleDataStore[viewName] || {};
  var numCalls = viewData[eventName] || 0;
  viewData[eventName] = ++numCalls;
  lifeCycleDataStore[viewName] = viewData;
}

function getEventCallCount(viewName, eventName){
  var viewData = lifeCycleDataStore[viewName] || {};
  var numCalls = viewData[eventName] || 0;
  return numCalls;
}

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
