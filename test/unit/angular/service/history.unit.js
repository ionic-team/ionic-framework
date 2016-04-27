describe('Ionic History', function() {
  var ionicHistory, rootScope, stateProvider, window;

  beforeEach(module('ionic', function ($stateProvider, $provide) {
    stateProvider = $stateProvider;

    $stateProvider
      .state('home', { url: '/' })
      .state('home.item', { url: 'front/:id' })

      .state('about', { url: '/about' })
      .state('about.person', { url: '/person' })
      .state('about.person.item', { url: '/id' })

      .state('about.sidebar', {})
      .state('about.sidebar.item', {})

      .state('contact', { url: '/contact' })

      .state('info', { url: '/info' })

      .state('tabs', { abstract: true })
      .state('tabs.tab1view1', {})
      .state('tabs.tab1view2', {})
      .state('tabs.tab1view3', {})

      .state('tabs.tab2view1', {})
      .state('tabs.tab2view2', {})
      .state('tabs.tab2view3', {})

      .state('tabs.tab3view1', {})
      .state('tabs.tab3view2', {})
      .state('tabs.tab3view3', {});

  }));

  beforeEach(inject(function($ionicHistory, $rootScope, $window) {
    ionicHistory = $ionicHistory;
    rootScope = $rootScope;
    window = $window;
    window.history.go = function(val) { return val; };
  }));

  it('should create a new view', inject(function($location, $state) {
    $location.url('/home');
    var view1Scope = {};
    var rsp = ionicHistory.register(view1Scope, false);
    expect(rsp.action).toEqual('initialView');
    expect(rsp.historyId).toEqual('root');

    var currentView = ionicHistory.currentView();
    expect(currentView.viewId).toBeDefined();
    expect(currentView.index).toEqual(0);
    expect(currentView.historyId).toBeDefined();
    expect(currentView.backViewId).toEqual(null);
    expect(currentView.forwardViewId).toEqual(null);
    expect(currentView.url).toEqual('/home');

    var hist = ionicHistory.viewHistory().histories.root;
    expect(hist.cursor).toEqual(0);
    expect(hist.stack.length).toEqual(1);
  }));

  it('should register two sequential views', inject(function($state) {
    $state.go('home');
    rootScope.$apply();
    expect(ionicHistory.currentStateName()).toEqual('home');
    var view1Scope = {};
    var rsp = ionicHistory.register(view1Scope, false);
    expect(ionicHistory.viewHistory().currentView.stateName).toEqual('home');

    expect(rsp.viewId).not.toBeUndefined();
    expect(ionicHistory.viewHistory().views[rsp.viewId].viewId).toEqual(rsp.viewId);
    expect(ionicHistory.backView()).toEqual(null);
    expect(ionicHistory.forwardView()).toEqual(null);

    expect(ionicHistory.viewHistory().currentView.stateName).toEqual('home');
    var currentView = ionicHistory.currentView();
    expect(currentView.index).toEqual(0);

    $state.go('about');
    rootScope.$apply();
    expect(ionicHistory.currentStateName()).toEqual('about');
    rsp = ionicHistory.register({}, false);
    expect(rsp.action).toEqual('newView');
    expect(ionicHistory.currentView().stateName).toEqual('about');
    expect(ionicHistory.backView().stateName).toEqual('home');
    expect(ionicHistory.forwardView()).toEqual(null);

    var hist = ionicHistory.viewHistory().histories.root;
    expect(hist.cursor).toEqual(1);
    expect(hist.stack.length).toEqual(2);
  }));

  it('should register views and go back to start', inject(function($state) {
    $state.go('home');
    rootScope.$apply();
    var registerData = ionicHistory.register({}, false);
    expect(ionicHistory.currentView().stateName).toEqual('home');
    expect(ionicHistory.backView()).toEqual(null);
    expect(ionicHistory.forwardView()).toEqual(null);
    expect(registerData.direction).toEqual('none');
    expect(registerData.action).toEqual('initialView');
    var currentView = ionicHistory.currentView();

    $state.go('about');
    rootScope.$apply();
    registerData = ionicHistory.register({}, false);
    currentView = ionicHistory.currentView();
    var backView = ionicHistory.backView();
    var forwardView = ionicHistory.forwardView();
    expect(currentView.stateName).toEqual('about');
    expect(currentView.backViewId).toEqual(backView.viewId);
    expect(backView.stateName).toEqual('home');
    expect(forwardView).toEqual(null);
    expect(registerData.direction).toEqual('forward');
    expect(registerData.action).toEqual('newView');

    expect(ionicHistory.viewHistory().histories.root.cursor).toEqual(1);
    expect(ionicHistory.viewHistory().histories.root.stack.length).toEqual(2);

    $state.go('contact');
    rootScope.$apply();
    registerData = ionicHistory.register({}, false);
    currentView = ionicHistory.currentView();
    //Set test value for remembered scroll
    backView = ionicHistory.backView();
    forwardView = ionicHistory.forwardView();
    expect(backView.stateName).toEqual('about');
    expect(currentView.backViewId).toEqual(backView.viewId);
    expect(ionicHistory.forwardView()).toEqual(null);
    expect(registerData.direction).toEqual('forward');
    expect(registerData.action).toEqual('newView');

    expect(ionicHistory.viewHistory().histories.root.cursor).toEqual(2);
    expect(ionicHistory.viewHistory().histories.root.stack.length).toEqual(3);

    $state.go('about');
    rootScope.$apply();
    registerData = ionicHistory.register({}, false);
    currentView = ionicHistory.currentView();
    backView = ionicHistory.backView();
    forwardView = ionicHistory.forwardView();
    expect(currentView.backViewId).toEqual(backView.viewId);
    expect(currentView.forwardViewId).toEqual(forwardView.viewId);
    expect(backView.stateName).toEqual('home');
    expect(forwardView.stateName).toEqual('contact');
    expect(registerData.direction).toEqual('back');
    expect(registerData.action).toEqual('moveBack');

    expect(ionicHistory.viewHistory().histories.root.cursor).toEqual(1);
    expect(ionicHistory.viewHistory().histories.root.stack.length).toEqual(3);

    $state.go('home');
    rootScope.$apply();
    registerData = ionicHistory.register({}, false);
    currentView = ionicHistory.currentView();
    backView = ionicHistory.backView();
    forwardView = ionicHistory.forwardView();
    expect(currentView.stateName).toEqual('home');
    expect(currentView.forwardViewId).toEqual(forwardView.viewId);
    expect(backView).toEqual(null);
    expect(forwardView.stateName).toEqual('about');
    expect(registerData.direction).toEqual('back');
    expect(registerData.action).toEqual('moveBack');

    expect(ionicHistory.viewHistory().histories.root.cursor).toEqual(0);
    expect(ionicHistory.viewHistory().histories.root.stack.length).toEqual(3);
  }));

  it('should register four views, and not go back to the first', inject(function($state) {
    var homeViewScope = {};
    $state.go('home');
    rootScope.$apply();
    var homeReg = ionicHistory.register(homeViewScope, false);
    expect(homeReg.action).toEqual('initialView');
    expect(ionicHistory.currentStateName()).toEqual('home');
    expect(ionicHistory.currentView().stateName).toEqual('home');
    expect(ionicHistory.backView()).toEqual(null);
    expect(ionicHistory.forwardView()).toEqual(null);
    expect(ionicHistory.viewHistory().histories.root.cursor).toEqual(0);
    expect(ionicHistory.viewHistory().histories.root.stack.length).toEqual(1);

    var aboutViewScope = {};
    $state.go('about');
    rootScope.$apply();
    var aboutReg = ionicHistory.register(aboutViewScope, false);
    var currentView = ionicHistory.currentView();
    var backView = ionicHistory.backView();
    var forwardView = ionicHistory.forwardView();
    expect(aboutReg.action).toEqual('newView');
    expect(currentView.viewId).toEqual(aboutReg.viewId);
    expect(currentView.backViewId).toEqual(homeReg.viewId);
    expect(currentView.forwardViewId).toEqual(null);
    expect(backView.viewId).toEqual(homeReg.viewId);
    expect(backView.forwardViewId).toEqual(currentView.viewId);
    expect(ionicHistory.viewHistory().histories.root.cursor).toEqual(1);
    expect(ionicHistory.viewHistory().histories.root.stack.length).toEqual(2);

    var tab1Scope = {};
    ionicHistory.registerHistory(tab1Scope);
    var tab1view1Scope = { $parent: tab1Scope };

    $state.go('tabs.tab1view1');
    rootScope.$apply();
    var tab1view1Reg = ionicHistory.register(tab1view1Scope, false);
    expect(tab1view1Reg.action).toEqual('newView');

    expect(ionicHistory.viewHistory().histories[tab1Scope.$historyId].historyId).toEqual(tab1Scope.$historyId);
    expect(ionicHistory.viewHistory().histories[tab1Scope.$historyId].stack[0].viewId).toEqual(tab1view1Reg.viewId);
    expect(ionicHistory.viewHistory().histories[tab1Scope.$historyId].cursor).toEqual(0);
    expect(ionicHistory.viewHistory().histories[tab1Scope.$historyId].stack.length).toEqual(1);
    expect(ionicHistory.viewHistory().histories.root.cursor).toEqual(1);
    expect(ionicHistory.viewHistory().histories.root.stack.length).toEqual(2);

    currentView = ionicHistory.currentView();
    backView = ionicHistory.backView();
    forwardView = ionicHistory.forwardView();
    expect(currentView.viewId).toEqual(tab1view1Reg.viewId);
    expect(currentView.historyId).toEqual(tab1Scope.$historyId);
    expect(currentView.historyId).toEqual(tab1view1Reg.historyId);
    expect(currentView.backViewId).toEqual(aboutReg.viewId);
    expect(currentView.forwardViewId).toEqual(null);
    expect(backView.viewId).toEqual(aboutReg.viewId);
    expect(backView.forwardViewId).toEqual(currentView.viewId);

    $state.go('home');
    rootScope.$apply();
    var home2reg = ionicHistory.register({}, false);
    expect(home2reg.action).toEqual('newView');
    currentView = ionicHistory.currentView();
    backView = ionicHistory.backView();
    forwardView = ionicHistory.forwardView();
    expect(currentView.backViewId).toEqual(tab1view1Reg.viewId);
    expect(currentView.forwardViewId).toEqual(null);
    expect(backView.viewId).toEqual(tab1view1Reg.viewId);
    expect(backView.forwardViewId).toEqual(currentView.viewId);

    expect(ionicHistory.viewHistory().histories.root.cursor).toEqual(2);
    expect(ionicHistory.viewHistory().histories.root.stack.length).toEqual(3);
    expect(ionicHistory.viewHistory().histories[tab1Scope.$historyId].cursor).toEqual(0);
    expect(ionicHistory.viewHistory().histories[tab1Scope.$historyId].stack.length).toEqual(1);
  }));

  it('should register views in the same history, go back, then overwrite the forward views', inject(function($state) {
    var homeViewScope = {};
    $state.go('home');
    rootScope.$apply();
    var homeReg = ionicHistory.register(homeViewScope, false);
    currentView = ionicHistory.currentView();
    backView = ionicHistory.backView();
    forwardView = ionicHistory.forwardView();
    expect(currentView.viewId).toEqual(homeReg.viewId);
    expect(currentView.backViewId).toEqual(null);
    expect(currentView.forwardViewId).toEqual(null);
    expect(ionicHistory.viewHistory().histories.root.cursor).toEqual(0);
    expect(ionicHistory.viewHistory().histories.root.stack.length).toEqual(1);
    expect(homeReg.action).toEqual('initialView');
    expect(homeReg.direction).toEqual('none');

    var aboutScope = {};
    $state.go('about');
    rootScope.$apply();
    var aboutReg = ionicHistory.register(aboutScope, false);
    currentView = ionicHistory.currentView();
    backView = ionicHistory.backView();
    forwardView = ionicHistory.forwardView();
    expect(currentView.viewId).toEqual(aboutReg.viewId);
    expect(currentView.backViewId).toEqual(homeReg.viewId);
    expect(currentView.forwardViewId).toEqual(null);
    expect(backView.viewId).toEqual(homeReg.viewId);
    expect(backView.forwardViewId).toEqual(currentView.viewId);
    expect(ionicHistory.viewHistory().histories.root.cursor).toEqual(1);
    expect(ionicHistory.viewHistory().histories.root.stack.length).toEqual(2);
    expect(aboutReg.action).toEqual('newView');
    expect(aboutReg.direction).toEqual('forward');

    homeViewScope = {};
    $state.go('home');
    rootScope.$apply();
    var homeReg2 = ionicHistory.register(homeViewScope, false);
    currentView = ionicHistory.currentView();
    backView = ionicHistory.backView();
    forwardView = ionicHistory.forwardView();
    expect(currentView.viewId).toEqual(homeReg.viewId);
    expect(currentView.backViewId).toEqual(null);
    expect(currentView.forwardViewId).toEqual(aboutReg.viewId);
    expect(forwardView.viewId).toEqual(aboutReg.viewId);
    expect(forwardView.backViewId).toEqual(currentView.viewId);
    expect(ionicHistory.viewHistory().histories.root.cursor).toEqual(0);
    expect(ionicHistory.viewHistory().histories.root.stack.length).toEqual(2);
    expect(homeReg2.action).toEqual('moveBack');
    expect(homeReg2.direction).toEqual('back');

    // this should overwrite that we went to the 'about' view
    contactScope = {};
    $state.go('contact');
    rootScope.$apply();
    var contactReg = ionicHistory.register(contactScope, false);
    currentView = ionicHistory.currentView();
    backView = ionicHistory.backView();
    forwardView = ionicHistory.forwardView();
    expect(currentView.backViewId).toEqual(homeReg.viewId);
    expect(currentView.forwardViewId).toEqual(null);
    expect(forwardView).toEqual(null);
    expect(backView.viewId).toEqual(homeReg.viewId);
    expect(backView.forwardViewId).toEqual(currentView.viewId);
    expect(ionicHistory.viewHistory().histories.root.cursor).toEqual(1);
    expect(ionicHistory.viewHistory().histories.root.stack.length).toEqual(2);
    expect(contactReg.action).toEqual('newView');
    expect(contactReg.direction).toEqual('forward');
  }));

  it('should start at root, go in to tabs, come out to root, go in to tabs, come out, and history should be at the root', inject(function($state) {
    var rootViewContainer = {};
    $state.go('home');
    rootScope.$apply();
    var registerData = ionicHistory.register(rootViewContainer, false);
    expect(registerData.action).toEqual('initialView');
    expect(registerData.direction).toEqual('none');
    expect(registerData.historyId).toEqual('root');

    // register the tabs container
    var tabsContainer = { $parent: tabsContainer };
    ionicHistory.registerHistory(tabsContainer);
    var tabsHistoryId = tabsContainer.$historyId;

    // put a view inside of the tabs container
    var tabView1 = { $parent: tabsContainer };

    // nav to the tab view
    $state.go('tabs.tab1view1');
    rootScope.$apply();
    registerData = ionicHistory.register(tabView1, false);
    var currentView = ionicHistory.currentView();
    expect(registerData.action).toEqual('newView');
    expect(registerData.direction).toEqual('enter');
    expect(currentView.historyId).toEqual(tabsHistoryId);

    // nav back to the root
    $state.go('home');
    rootScope.$apply();
    registerData = ionicHistory.register(rootViewContainer, false);
    currentView = ionicHistory.currentView();
    expect(registerData.action).toEqual('moveBack');
    expect(registerData.direction).toEqual('exit');
    expect(currentView.historyId).toEqual('root');

    // nav back to the tabs
    $state.go('tabs.tab1view1');
    rootScope.$apply();
    registerData = ionicHistory.register(tabView1, false);
    currentView = ionicHistory.currentView();
    expect(registerData.action).toEqual('moveForward');
    expect(registerData.direction).toEqual('enter');
    expect(currentView.historyId).toEqual(tabsHistoryId);

    // nav back to the root
    $state.go('home');
    rootScope.$apply();
    registerData = ionicHistory.register(rootViewContainer, false);
    currentView = ionicHistory.currentView();
    expect(registerData.action).toEqual('moveBack');
    expect(registerData.direction).toEqual('exit');
    expect(currentView.historyId).toEqual('root');
  }));

  it('should go to a new history, come back out, go to same history and come back out', inject(function($state) {
    var rootViewContainer = {};
    $state.go('home');
    rootScope.$apply();
    var homeReg = ionicHistory.register(rootViewContainer, false);
    var currentView = ionicHistory.currentView();
    expect(currentView.historyId).toEqual('root');
    expect(ionicHistory.viewHistory().histories.root.cursor).toEqual(0);
    expect(homeReg.action).toEqual('initialView');
    expect(homeReg.historyId).toEqual('root');

    // each tab gets its own history in the tabs directive
    // create a new tab and its history
    var tabs1Container = { $parent: rootViewContainer };
    ionicHistory.registerHistory(tabs1Container);
    expect(tabs1Container.$historyId).toBeDefined();
    expect(rootViewContainer.$historyId).not.toEqual(tabs1Container.$historyId);
    var originalTab1ViewId = tabs1Container.$historyId;

    // the actual view within the tab renders
    // nav to tab1 which has its own history
    var tab1View = { $parent: tabs1Container };
    $state.go('tabs.tab1view1');
    rootScope.$apply();
    var tab1view1Reg = ionicHistory.register(tab1View, false);
    currentView = ionicHistory.currentView();
    expect(currentView.historyId).toEqual(tabs1Container.$historyId);
    expect(ionicHistory.viewHistory().histories[tabs1Container.$historyId].parentHistoryId).toEqual('root');
    expect(ionicHistory.viewHistory().histories[tabs1Container.$historyId].cursor).toEqual(0);
    expect(ionicHistory.viewHistory().histories[tabs1Container.$historyId].stack.length).toEqual(1);
    expect(tab1view1Reg.historyId).not.toEqual(homeReg.historyId);
    expect(tab1view1Reg.action).toEqual('newView');
    expect(tab1view1Reg.direction).toEqual('enter');

    currentView = ionicHistory.currentView();
    backView = ionicHistory.backView();
    forwardView = ionicHistory.forwardView();

    expect(currentView.stateName).toEqual('tabs.tab1view1');
    expect(currentView.viewId).toEqual(tab1view1Reg.viewId);
    expect(currentView.backViewId).toEqual(homeReg.viewId);
    expect(currentView.forwardViewId).toEqual(null);

    expect(backView.stateName).toEqual('home');
    expect(backView.backViewId).toEqual(null);
    expect(backView.forwardViewId).toEqual(currentView.viewId);

    expect(forwardView).toEqual(null);

    // nav back to the home in the root history
    homeViewScope = {};
    $state.go('home');
    rootScope.$apply();
    homeReg = ionicHistory.register(homeViewScope, false);
    expect(ionicHistory.viewHistory().histories.root.cursor).toEqual(0);
    expect(ionicHistory.viewHistory().histories.root.stack.length).toEqual(1);
    expect(homeReg.historyId).toEqual('root');
    expect(homeReg.action).toEqual('moveBack');
    expect(homeReg.direction).toEqual('exit');

    currentView = ionicHistory.currentView();
    backView = ionicHistory.backView();
    forwardView = ionicHistory.forwardView();

    expect(currentView.stateName).toEqual('home');
    expect(currentView.backViewId).toEqual(null);
    expect(currentView.forwardViewId).toEqual(tab1view1Reg.viewId);

    expect(forwardView.stateName).toEqual('tabs.tab1view1');
    expect(forwardView.viewId).toEqual(tab1view1Reg.viewId);
    expect(forwardView.backViewId).toEqual(currentView.viewId);
    expect(forwardView.forwardViewId).toEqual(null);
    expect(ionicHistory.viewHistory().histories.root.cursor).toEqual(0);
    expect(ionicHistory.viewHistory().histories.root.stack.length).toEqual(1);

    // create a new tab and its history
    tabs1Container = { $parent: rootViewContainer };
    ionicHistory.registerHistory(tabs1Container);
    expect(originalTab1ViewId).not.toEqual(tabs1Container.$historyId);

    tab1View = { $parent: tabs1Container };
    $state.go('tabs.tab1view1');
    rootScope.$apply();
    tab1view1Reg = ionicHistory.register(tab1View);
    expect(tab1view1Reg.action).toEqual('moveForward');
    expect(tab1view1Reg.direction).toEqual('enter');
    expect(tab1view1Reg.historyId).toEqual(originalTab1ViewId);
    expect(originalTab1ViewId).toEqual(tabs1Container.$historyId);
    expect(tab1view1Reg.historyId).not.toEqual('root');
    expect(ionicHistory.viewHistory().histories[tab1view1Reg.historyId].cursor).toEqual(0);
    expect(ionicHistory.viewHistory().histories[tab1view1Reg.historyId].stack.length).toEqual(1);

    currentView = ionicHistory.currentView();
    expect(currentView.historyId).toEqual(tabs1Container.$historyId);
    expect(ionicHistory.viewHistory().histories[tabs1Container.$historyId].cursor).toEqual(0);

    currentView = ionicHistory.currentView();
    backView = ionicHistory.backView();
    forwardView = ionicHistory.forwardView();

    expect(currentView.stateName).toEqual('tabs.tab1view1');
    expect(currentView.viewId).toEqual(tab1view1Reg.viewId);
    expect(currentView.backViewId).toEqual(homeReg.viewId);
    expect(currentView.forwardViewId).toEqual(null);

    expect(backView.viewId).toEqual(homeReg.viewId);
    expect(backView.stateName).toEqual('home');
    expect(backView.backViewId).toEqual(null);
    expect(backView.forwardViewId).toEqual(currentView.viewId);

    expect(forwardView).toEqual(null);
    expect(ionicHistory.viewHistory().histories.root.cursor).toEqual(0);
  }));

  it('should nav to a history, move around in it, and come back', inject(function($state) {
    // go to the first page
    $state.go('home');
    rootScope.$apply();
    var homeReg = ionicHistory.register({}, false);

    // each tab gets its own history in the tabs directive
    var tab1Scope = { };
    var tab2Scope = { };
    var tab3Scope = { };
    ionicHistory.registerHistory(tab1Scope);
    ionicHistory.registerHistory(tab2Scope);
    ionicHistory.registerHistory(tab3Scope);

    // the actual view renders
    var tab1view1Scope = { $parent: tab1Scope };
    $state.go('tabs.tab1view1');
    rootScope.$apply();
    var tab1view1ScopeReg = ionicHistory.register(tab1view1Scope, false);
    expect(ionicHistory.currentStateName()).toEqual('tabs.tab1view1');
    expect(ionicHistory.backView().stateName).toEqual('home');
    expect(ionicHistory.forwardView()).toEqual(null);
    var lastView = ionicHistory.currentView();
    expect(lastView.index).toEqual(0);
    expect(tab1view1ScopeReg.viewId).toEqual(lastView.viewId);
    expect(tab1view1ScopeReg.action).toEqual('newView');
    expect(tab1view1ScopeReg.direction).toEqual('enter');
    expect(ionicHistory.viewHistory().histories[tab1view1ScopeReg.historyId].cursor).toEqual(0);
    expect(ionicHistory.viewHistory().histories[tab1view1ScopeReg.historyId].stack.length).toEqual(1);

    // inside first tab, go to another list inside the same tab
    var tab1view2Scope = { $parent: tab1Scope };
    $state.go('tabs.tab1view2');
    rootScope.$apply();
    var tab1view2ScopeReg = ionicHistory.register(tab1view2Scope, false);
    expect(ionicHistory.currentStateName()).toEqual('tabs.tab1view2');
    expect(ionicHistory.backView().stateName).toEqual('tabs.tab1view1');
    expect(ionicHistory.forwardView()).toEqual(null);
    lastView = ionicHistory.currentView();
    expect(lastView.index).toEqual(1);
    expect(tab1view2ScopeReg.viewId).toEqual(lastView.viewId);
    expect(tab1view2ScopeReg.action).toEqual('newView');
    expect(tab1view2ScopeReg.direction).toEqual('forward');
    expect(ionicHistory.viewHistory().histories[tab1view2ScopeReg.historyId].cursor).toEqual(1);
    expect(ionicHistory.viewHistory().histories[tab1view2ScopeReg.historyId].stack.length).toEqual(2);

    // go back one within the tab
    $state.go('tabs.tab1view1');
    rootScope.$apply();
    var tab1view1Scope2Reg = ionicHistory.register(tab1view1Scope, false);
    expect(ionicHistory.currentStateName()).toEqual('tabs.tab1view1');
    expect(ionicHistory.backView().stateName).toEqual('home');
    expect(ionicHistory.forwardView().stateName).toEqual('tabs.tab1view2');
    lastView = ionicHistory.currentView();
    expect(lastView.index).toEqual(0);
    expect(tab1view1Scope2Reg.action).toEqual('moveBack');
    expect(tab1view1Scope2Reg.direction).toEqual('back');
    expect(ionicHistory.viewHistory().histories[tab1view1Scope2Reg.historyId].cursor).toEqual(0);
    expect(ionicHistory.viewHistory().histories[tab1view1Scope2Reg.historyId].stack.length).toEqual(2);

    // go back again, and should break out of the tab's history
    $state.go('home');
    rootScope.$apply();
    var homeReg2 = ionicHistory.register({}, false);
    expect(ionicHistory.currentStateName()).toEqual('home');
    expect(homeReg2.historyId).toEqual('root');
    expect(homeReg2.action).toEqual('moveBack');
    expect(homeReg2.direction).toEqual('exit');
    expect(ionicHistory.viewHistory().histories[homeReg2.historyId].cursor).toEqual(0);
    expect(ionicHistory.viewHistory().histories[homeReg2.historyId].stack.length).toEqual(1);

    $state.go('about');
    rootScope.$apply();
    var aboutReg = ionicHistory.register({}, false);
    expect(ionicHistory.currentStateName()).toEqual('about');
    expect(aboutReg.historyId).toEqual('root');
    expect(aboutReg.action).toEqual('newView');
    expect(aboutReg.direction).toEqual('forward');
    expect(ionicHistory.viewHistory().histories[aboutReg.historyId].cursor).toEqual(1);
    expect(ionicHistory.viewHistory().histories[aboutReg.historyId].stack.length).toEqual(2);
  }));

  it('should init a view that has tabs in it, two registers, but one page load', inject(function($state) {
    $state.go('tabs.tab1view1');
    rootScope.$apply();

    var rootViewScope = {};
    var rootReg = ionicHistory.register(rootViewScope, false);
    expect(rootReg.action).toEqual('initialView');
    expect(rootReg.direction).toEqual('none');

    var tab1Scope = {};
    ionicHistory.registerHistory(tab1Scope);
    var tab1view1Scope = { $parent: tab1Scope };

    var registerData = ionicHistory.register(tab1view1Scope, false);
    expect(registerData.action).toEqual('newView');
    expect(registerData.direction).toEqual('none');
  }));

  it('should change to history that already exists, and go to its last current view', inject(function($state) {
    // register tabs
    var tab1Scope = {};
    var tab2Scope = {};
    ionicHistory.registerHistory(tab1Scope);
    ionicHistory.registerHistory(tab2Scope);
    var orgTab1HistoryId = tab1Scope.$historyId;

    // render first view in tab1
    var tab1view1Scope = { $parent: tab1Scope };
    $state.go('tabs.tab1view1');
    rootScope.$apply();
    var registerData = ionicHistory.register(tab1view1Scope, false);
    expect(ionicHistory.currentStateName()).toEqual('tabs.tab1view1');
    expect(ionicHistory.viewHistory().histories[tab1Scope.$historyId].cursor).toEqual(0);
    expect(ionicHistory.viewHistory().histories[tab1Scope.$historyId].stack.length).toEqual(1);
    expect(registerData.action).toEqual('initialView');
    expect(registerData.direction).toEqual('none');

    // render second view in tab1
    var tab1view2Scope = { $parent: tab1Scope };
    $state.go('tabs.tab1view2');
    rootScope.$apply();
    registerData = ionicHistory.register(tab1view2Scope, false);
    expect(ionicHistory.currentStateName()).toEqual('tabs.tab1view2');
    expect(ionicHistory.viewHistory().histories[tab1Scope.$historyId].cursor).toEqual(1);
    expect(ionicHistory.viewHistory().histories[tab1Scope.$historyId].stack.length).toEqual(2);
    expect(registerData.action).toEqual('newView');
    expect(registerData.direction).toEqual('forward');
    currentView = ionicHistory.currentView();
    expect(currentView.viewId).toEqual(registerData.viewId);

    // go back to the first view again in tab 1
    tab1view1Scope = { $parent: tab1Scope };
    $state.go('tabs.tab1view1');
    rootScope.$apply();
    registerData = ionicHistory.register(tab1view1Scope, false);
    expect(ionicHistory.currentStateName()).toEqual('tabs.tab1view1');
    currentView = ionicHistory.currentView();
    expect(currentView.viewId).toEqual(registerData.viewId);
    forwardView = ionicHistory.forwardView();
    expect(currentView.forwardViewId).toEqual(ionicHistory.viewHistory().histories[tab1Scope.$historyId].stack[1].viewId);
    expect(forwardView.backViewId).toEqual(currentView.viewId);
    expect(ionicHistory.viewHistory().histories[tab1Scope.$historyId].cursor).toEqual(0);
    expect(ionicHistory.viewHistory().histories[tab1Scope.$historyId].stack.length).toEqual(2);
    expect(registerData.action).toEqual('moveBack');
    expect(registerData.direction).toEqual('back');

    // render first view in tab2
    var tab2view1Scope = { $parent: tab2Scope };
    $state.go('tabs.tab2view1');
    rootScope.$apply();
    registerData = ionicHistory.register(tab2view1Scope, false);
    expect(ionicHistory.currentStateName()).toEqual('tabs.tab2view1');
    expect(ionicHistory.viewHistory().histories[tab2Scope.$historyId].cursor).toEqual(0);
    expect(ionicHistory.viewHistory().histories[tab2Scope.$historyId].stack.length).toEqual(1);
    expect(registerData.action).toEqual('newView');
    expect(registerData.direction).toEqual('swap');
    var tab2view1ViewId = registerData.viewId;

    // tab1's forward history should be destroyed
    expect(ionicHistory.viewHistory().histories[tab1Scope.$historyId].stack.length).toEqual(1);
    expect(ionicHistory.viewHistory().histories[tab1Scope.$historyId].stack[0].forwardViewId).toEqual(registerData.viewId);

    // go back to tab1, and it should load the first view of tab1
    expect(tab1Scope.$historyId).toEqual(orgTab1HistoryId);
    rootScope.$broadcast('$ionicHistory.change', { historyId: tab1Scope.$historyId, enableUrlChange: false });
    rootScope.$apply();
    expect(ionicHistory.currentStateName()).toEqual('tabs.tab1view1');
    registerData = ionicHistory.register(tab1view1Scope, false);
    var tab1view1ViewId = registerData.viewId;
    expect(registerData.action).toEqual('moveBack');
    expect(registerData.direction).toEqual('swap');

    currentView = ionicHistory.currentView();
    expect(currentView.viewId).toEqual(registerData.viewId);
    expect(currentView.historyId).toEqual(orgTab1HistoryId);
    expect(currentView.forwardViewId).toEqual(tab2view1ViewId);

    expect(ionicHistory.viewHistory().histories[tab1Scope.$historyId].cursor).toEqual(0);
    expect(ionicHistory.viewHistory().histories[tab1Scope.$historyId].stack.length).toEqual(1);

    currentView = ionicHistory.currentView();
    expect(currentView.stateName).toEqual('tabs.tab1view1');
    expect(currentView.historyId).toEqual(tab1Scope.$historyId);

    // go to view 2 in tab 1
    tab1view2Scope = { $parent: tab1Scope };
    $state.go('tabs.tab1view2');
    rootScope.$apply();
    registerData = ionicHistory.register(tab1view2Scope, false);
    expect(registerData.historyId).toEqual(orgTab1HistoryId);
    var tab1view2ViewId = registerData.viewId;
    expect(ionicHistory.currentStateName()).toEqual('tabs.tab1view2');
    expect(ionicHistory.viewHistory().histories[tab1Scope.$historyId].stack.length).toEqual(2);
    expect(ionicHistory.viewHistory().histories[tab1Scope.$historyId].cursor).toEqual(1);
    expect(registerData.action).toEqual('newView');
    expect(registerData.direction).toEqual('forward');
    expect(ionicHistory.viewHistory().views[tab1view2ViewId].backViewId).toEqual(tab1view1ViewId);

    // go to view 1 in tab 2
    tab2view1Scope = { $parent: tab2Scope };
    $state.go('tabs.tab2view1');
    rootScope.$apply();
    registerData = ionicHistory.register(tab2view1Scope, false);
    expect(ionicHistory.currentStateName()).toEqual('tabs.tab2view1');
    expect(ionicHistory.viewHistory().histories[tab2Scope.$historyId].cursor).toEqual(0);
    expect(registerData.action).toEqual('moveBack');
    expect(registerData.direction).toEqual('swap');
    currentView = ionicHistory.currentView();
    expect(currentView.backViewId).toEqual(tab1view2ViewId);
    expect(currentView.forwardViewId).toEqual(null);

    // should be remembered at the tab 1 view 2
    rootScope.$broadcast('$ionicHistory.change', { historyId: tab1Scope.$historyId });
    rootScope.$apply();
    expect(ionicHistory.currentStateName()).toEqual('tabs.tab1view2');
    expect(ionicHistory.viewHistory().histories[tab1Scope.$historyId].cursor).toEqual(1);
  }));

  it('should go one level in tab1, vist tab2 and tab3, come back to tab1 and still be at spot', inject(function($state) {
    var tab1Container = {};
    var tab2Container = {};
    var tab3Container = {};
    ionicHistory.registerHistory(tab1Container);
    ionicHistory.registerHistory(tab2Container);
    ionicHistory.registerHistory(tab3Container);

    // register tab1, view1
    $state.go('tabs.tab1view1');
    rootScope.$apply();
    var tab1view1Reg = ionicHistory.register(tab1Container, false);
    expect(ionicHistory.viewHistory().histories[tab1Container.$historyId].cursor).toEqual(0);

    // register tab1, view2
    $state.go('tabs.tab1view2');
    rootScope.$apply();
    var tab1view2Reg = ionicHistory.register(tab1Container, false);
    expect(ionicHistory.viewHistory().histories[tab1Container.$historyId].cursor).toEqual(1);
    currentView = ionicHistory.currentView();
    expect(currentView.backViewId).toEqual(tab1view1Reg.viewId);

    // register tab2, view1
    $state.go('tabs.tab2view1');
    rootScope.$apply();
    var tab2view1Reg = ionicHistory.register(tab2Container, false);

    // register tab3, view1
    $state.go('tabs.tab3view1');
    rootScope.$apply();
    var tab3view1Reg = ionicHistory.register(tab3Container, false);

    // register tab 1, view 2 again
    $state.go('tabs.tab1view2');
    rootScope.$apply();
    var tab1view2Reg2 = ionicHistory.register(tab1Container, false);
    expect(tab1view2Reg2.action).toEqual('moveBack');
    expect(tab1view2Reg2.viewId).toEqual(tab1view2Reg.viewId);


    var currentViewId = tab1view2Reg.viewId;
    expect(ionicHistory.viewHistory().histories[tab1view2Reg.historyId].stack.length).toEqual(2);
    backView = ionicHistory.backView();
    expect(backView).toBeDefined();
    expect( Object.keys(ionicHistory.viewHistory().views).length ).toEqual(4);
    ionicHistory.clearHistory();
    expect( Object.keys(ionicHistory.viewHistory().views).length ).toEqual(1);
    expect(ionicHistory.viewHistory().histories[tab1view2Reg.historyId].stack.length).toEqual(1);
    backView = ionicHistory.backView();
    expect(backView).toEqual(null);
    currentView = ionicHistory.currentView();
    expect(currentView.viewId).toEqual(currentViewId);
  }));

  it('should go one level in tab1, visit tab2, go to tab2 page2, visit, tab1, tab3, history still page 2 tab2', inject(function($state) {
    var tab1Container = {};
    var tab2Container = {};
    var tab3Container = {};
    ionicHistory.registerHistory(tab1Container);
    ionicHistory.registerHistory(tab2Container);
    ionicHistory.registerHistory(tab3Container);

    // register tab1, view1
    $state.go('tabs.tab1view1');
    rootScope.$apply();
    var tab1view1Reg = ionicHistory.register(tab1Container, false);
    expect(tab1view1Reg.action).toEqual('initialView');
    expect(tab1view1Reg.direction).toEqual('none');
    expect(ionicHistory.viewHistory().histories[tab1Container.$historyId].cursor).toEqual(0);

    // register tab2, view1
    $state.go('tabs.tab2view1');
    rootScope.$apply();
    var tab2view1Reg = ionicHistory.register(tab2Container, false);
    expect(tab2view1Reg.action).toEqual('newView');
    expect(tab2view1Reg.direction).toEqual('swap');
    expect(ionicHistory.viewHistory().histories[tab1Container.$historyId].stack[0].forwardViewId).toEqual(tab2view1Reg.viewId);
    expect(ionicHistory.viewHistory().histories[tab2Container.$historyId].cursor).toEqual(0);

    // register tab2, view2
    $state.go('tabs.tab2view2');
    rootScope.$apply();
    var tab2view2Reg = ionicHistory.register(tab2Container, false);
    expect(tab2view2Reg.action).toEqual('newView');
    expect(tab2view2Reg.direction).toEqual('forward');
    expect(ionicHistory.viewHistory().histories[tab2Container.$historyId].cursor).toEqual(1);
    expect(ionicHistory.viewHistory().histories[tab2Container.$historyId].stack.length).toEqual(2);

    // register tab1, view1
    $state.go('tabs.tab1view1');
    rootScope.$apply();
    tab1view1Reg = ionicHistory.register(tab1Container, false);
    expect(tab1view1Reg.action).toEqual('moveBack');
    expect(tab1view1Reg.direction).toEqual('swap');
    expect(ionicHistory.viewHistory().histories[tab2Container.$historyId].cursor).toEqual(1);
    expect(ionicHistory.viewHistory().histories[tab2Container.$historyId].stack.length).toEqual(2);

    // register tab3, view1
    $state.go('tabs.tab3view1');
    rootScope.$apply();
    var tab3view1Reg = ionicHistory.register(tab3Container, false);
    expect(tab3view1Reg.action).toEqual('newView');
    expect(tab3view1Reg.direction).toEqual('swap');

    var tab2Hist = ionicHistory.viewHistory().histories[ tab2Container.$historyId ];
    currentView = ionicHistory.currentView();
    expect(currentView).toBeDefined();
    expect(currentView.historyId).not.toEqual(tab2Hist.historyId);
    expect(tab2Hist.cursor).toEqual(1);
    expect(tab2Hist.stack.length).toEqual(2);
    expect(tab2Hist.cursor).toBeLessThan(tab2Hist.stack.length);

    // register tab2, view2
    $state.go('tabs.tab2view2');
    rootScope.$apply();
    var tab2view2RegAgain = ionicHistory.register(tab2Container, false);
    expect(tab2view2RegAgain.historyId).toEqual(tab2view2Reg.historyId);
    expect(ionicHistory.viewHistory().histories[tab2Container.$historyId].cursor).toEqual(1);
    expect(ionicHistory.viewHistory().histories[tab2Container.$historyId].stack.length).toEqual(2);
  }));

  it('should go in and out of tabs and root with correct directions', inject(function($state) {
    var tab1Container = {};
    ionicHistory.registerHistory(tab1Container);

    // register tab1, view1
    $state.go('tabs.tab1view1');
    rootScope.$apply();
    var tab1view1Reg = ionicHistory.register(tab1Container, false);
    expect(tab1view1Reg.action).toEqual('initialView');
    expect(tab1view1Reg.direction).toEqual('none');

    $state.go('home');
    rootScope.$apply();
    var homeReg = ionicHistory.register({}, false);
    expect(homeReg.action).toEqual('newView');
    expect(homeReg.direction).toEqual('exit');

    $state.go('tabs.tab1view1');
    rootScope.$apply();
    var tab1view1Reg = ionicHistory.register(tab1Container, false);
    expect(tab1view1Reg.action).toEqual('moveBack');
    expect(tab1view1Reg.direction).toEqual('enter');

    $state.go('home');
    rootScope.$apply();
    var homeReg = ionicHistory.register({}, false);
    expect(homeReg.action).toEqual('moveForward');
    expect(homeReg.direction).toEqual('exit');
  }));

  it('should start in home, go to tabs, exit back to home', inject(function($state) {
    var homeViewScope = {};
    $state.go('home');
    rootScope.$apply();
    var homeReg = ionicHistory.register(homeViewScope, false);
    expect(homeReg.action).toEqual('initialView');
    expect(homeReg.direction).toEqual('none');

    var tab1Container = {};
    ionicHistory.registerHistory(tab1Container);

    $state.go('tabs.tab1view1');
    rootScope.$apply();

    var tab1view1Reg = ionicHistory.register(tab1Container, false);
    expect(tab1view1Reg.action).toEqual('newView');
    expect(tab1view1Reg.direction).toEqual('enter');

    $state.go('home');
    rootScope.$apply();
    homeReg = ionicHistory.register(homeViewScope, false);
    expect(homeReg.action).toEqual('moveBack');
    expect(homeReg.direction).toEqual('exit');
  }));

  it('should start in tabs1, switch to tabs2, exit to home, enter to tabs1', inject(function($state) {
    var homeViewScope = {};
    var tab1Container = {};
    var tab2Container = {};
    ionicHistory.registerHistory(tab1Container);
    ionicHistory.registerHistory(tab2Container);

    $state.go('tabs.tab1view1');
    rootScope.$apply();
    var tab1view1Reg = ionicHistory.register(tab1Container, false);
    expect(tab1view1Reg.action).toEqual('initialView');
    expect(tab1view1Reg.direction).toEqual('none');

    $state.go('tabs.tab2view1');
    rootScope.$apply();
    var tab2view1Reg = ionicHistory.register(tab2Container, false);
    expect(tab2view1Reg.action).toEqual('newView');
    expect(tab2view1Reg.direction).toEqual('swap');

    $state.go('home');
    rootScope.$apply();
    homeReg = ionicHistory.register(homeViewScope, false);
    expect(homeReg.action).toEqual('newView');
    expect(homeReg.direction).toEqual('exit');

    $state.go('tabs.tab1view1');
    rootScope.$apply();
    tab1view1Reg = ionicHistory.register(tab1Container, false);
    expect(tab1view1Reg.action).toEqual('moveBack');
    expect(tab1view1Reg.direction).toEqual('enter');
  }));

  it('should start in tabs1, exit to home, move forward to info, enter to tabs1', inject(function($state) {
    var homeViewScope = {};
    var infoViewScope = {};
    var tab1Container = {};
    ionicHistory.registerHistory(tab1Container);

    $state.go('tabs.tab1view1');
    rootScope.$apply();
    var tab1view1Reg = ionicHistory.register(tab1Container, false);
    expect(tab1view1Reg.action).toEqual('initialView');
    expect(tab1view1Reg.direction).toEqual('none');

    $state.go('home');
    rootScope.$apply();
    var homeReg = ionicHistory.register(homeViewScope, false);
    expect(homeReg.action).toEqual('newView');
    expect(homeReg.direction).toEqual('exit');

    $state.go('info');
    rootScope.$apply();
    var infoReg = ionicHistory.register(infoViewScope, false);
    expect(infoReg.action).toEqual('newView');
    expect(infoReg.direction).toEqual('forward');

    $state.go('tabs.tab1view1');
    rootScope.$apply();
    tab1view1Reg = ionicHistory.register(tab1Container, false);
    expect(tab1view1Reg.action).toEqual('moveBack');
    expect(tab1view1Reg.direction).toEqual('enter');
  }));

  it('should start in home, go to tabs, switch to another tab, exit back to home', inject(function($state) {
    var homeViewScope = {};
    $state.go('home');
    rootScope.$apply();
    var homeReg = ionicHistory.register(homeViewScope, false);
    expect(homeReg.action).toEqual('initialView');
    expect(homeReg.direction).toEqual('none');

    var tab1Container = {};
    var tab2Container = {};
    ionicHistory.registerHistory(tab1Container);
    ionicHistory.registerHistory(tab2Container);

    $state.go('tabs.tab1view1');
    rootScope.$apply();
    var tab1view1Reg = ionicHistory.register(tab1Container, false);
    expect(tab1view1Reg.action).toEqual('newView');
    expect(tab1view1Reg.direction).toEqual('enter');

    $state.go('tabs.tab2view1');
    rootScope.$apply();

    var tab2view1Reg = ionicHistory.register(tab2Container, false);
    expect(tab2view1Reg.action).toEqual('newView');
    expect(tab2view1Reg.direction).toEqual('swap');

    $state.go('home');
    rootScope.$apply();
    homeReg = ionicHistory.register(homeViewScope, false);
    expect(homeReg.action).toEqual('moveBack');
    expect(homeReg.direction).toEqual('exit');
  }));

  it('should goToHistoryRoot', inject(function($state) {
    var tab1Container = {};
    ionicHistory.registerHistory(tab1Container);

    $state.go('tabs.tab1view1');
    var tab1view1 = ionicHistory.register(tab1Container, false);
    rootScope.$apply();

    $state.go('tabs.tab1view2');
    var tab1view2 = ionicHistory.register(tab1Container, false);
    rootScope.$apply();

    ionicHistory.goToHistoryRoot(tab1Container.$historyId);
    var tab1view1Tap = ionicHistory.register(tab1Container, false);
    rootScope.$apply();

    expect(ionicHistory.viewHistory().currentView.viewId).toBe(tab1view1.viewId);
    expect(tab1view1Tap.viewId).toBe(tab1view1.viewId);
    expect(tab1view1Tap.action).toBe('moveBack');
    expect(tab1view1Tap.direction).toBe('back');
  }));

  it('should set nextViewOptions disableAnimate', inject(function($state) {
    $state.go('home');
    rootScope.$apply();
    var homeReg = ionicHistory.register({}, false);
    expect(homeReg.direction).toEqual('none');

    ionicHistory.nextViewOptions({ disableAnimate: true });

    $state.go('info');
    rootScope.$apply();
    var infoReg = ionicHistory.register({}, false);
    expect(infoReg.direction).toEqual('none');
    expect(infoReg.enableBack).toEqual(true);
    expect(ionicHistory.viewHistory().histories[infoReg.historyId].stack.length).toEqual(2);
    expect(ionicHistory.viewHistory().backView.viewId).toBe(homeReg.viewId);
  }));

  it('should set nextViewOptions disableBack', inject(function($state) {
    $state.go('home');
    rootScope.$apply();
    var homeReg = ionicHistory.register({}, false);
    expect(homeReg.direction).toEqual('none');

    ionicHistory.nextViewOptions({ disableBack: true });

    $state.go('info');
    rootScope.$apply();
    var infoReg = ionicHistory.register({}, false);
    expect(infoReg.enableBack).toEqual(false);
    expect(infoReg.direction).toEqual('forward');
    expect(ionicHistory.viewHistory().histories[infoReg.historyId].stack.length).toEqual(2);
    expect(ionicHistory.viewHistory().backView).toBe(null);
  }));

  it('should set nextViewOptions historyRoot', inject(function($state) {
    $state.go('home');
    rootScope.$apply();
    var homeReg = ionicHistory.register({}, false);
    expect(homeReg.direction).toEqual('none');

    ionicHistory.nextViewOptions({ historyRoot: true });

    $state.go('info');
    rootScope.$apply();
    var infoReg = ionicHistory.register({}, false);
    expect(infoReg.enableBack).toEqual(false);
    expect(infoReg.direction).toEqual('forward');
    expect(ionicHistory.viewHistory().histories[infoReg.historyId].stack.length).toEqual(1);
    expect(ionicHistory.viewHistory().backView).toBe(null);
  }));

  it('should set and overwrite nextViewOptions', inject(function($state) {
    expect( ionicHistory.nextViewOptions() ).toBeUndefined();
    expect( ionicHistory.nextViewOptions({}) ).toEqual({});
    ionicHistory.nextViewOptions(null);
    expect( ionicHistory.nextViewOptions({ historyRoot: true }) ).toEqual({ historyRoot: true });
    expect( ionicHistory.nextViewOptions({ disableBack: true }) ).toEqual({ historyRoot: true, disableBack: true });
    expect( ionicHistory.nextViewOptions({ historyRoot: false }) ).toEqual({ historyRoot: false, disableBack: true });
    ionicHistory.nextViewOptions(null);
    expect( ionicHistory.nextViewOptions({}) ).toEqual({});
  }));

  it('should should find ion-tabs as an abstract element', inject(function($ionicHistory, $document) {
    var ele = angular.element('<ion-tabs>');
    expect($ionicHistory.isAbstractEle(ele)).toBe(true);

    ele = angular.element('<ion-tab>');
    expect($ionicHistory.isAbstractEle(ele)).toBe(false);
  }));

  it('should should find ion-side-menus as an abstract element', inject(function($ionicHistory, $document) {
    var ele = angular.element('<ion-side-menus>');
    expect($ionicHistory.isAbstractEle(ele)).toBe(true);

    ele = angular.element('<ion-side-menu>');
    expect($ionicHistory.isAbstractEle(ele)).toBe(false);
  }));

  it('should should find first child thats an ion-tabs as an abstract element', inject(function($ionicHistory, $document) {
    var div = angular.element('<div>');
    var ionTabs = angular.element('<ion-tabs>');
    div.append(ionTabs);
    expect($ionicHistory.isAbstractEle(div)).toBe(true);
  }));

  it('should should be an abstract element from the viewLocals', inject(function($ionicHistory, $document) {
    var div = angular.element('<div>');
    var viewLocals = {
      $$state: {
        self: {
          abstract: true
        }
      }
    };
    expect($ionicHistory.isAbstractEle(div, viewLocals)).toBe(true);

    var viewLocals = {
      $$state: {
        self: {}
      }
    };
    expect($ionicHistory.isAbstractEle(div, viewLocals)).toBe(false);
  }));

  it('should be an abstract view', inject(function($document) {
    var reg = ionicHistory.register({}, {
      $template: '<ion-tabs></ion-tabs>'
    });
    expect(reg.action).toEqual('abstractView');
  }));

  it('should init root viewHistory data', inject(function() {
    expect(ionicHistory.viewHistory().backView).toEqual(null);
    expect(ionicHistory.viewHistory().currentView).toEqual(null);
    expect(ionicHistory.viewHistory().forwardView).toEqual(null);
    expect(ionicHistory.viewHistory().histories).toEqual({
        root: { historyId: 'root', parentHistoryId: null, stack: [], cursor: -1 }
    });
  }));

  it('should not error when clearing empty history', function() {
    expect(function() {
      ionicHistory.clearHistory();
    }).not.toThrow();
  });

  it('should create a ionicHistory view', inject(function($location) {
    var newView = ionicHistory.createView();
    expect(newView).toEqual(null);

    newView = ionicHistory.createView({ stateName: 'about', url: '/url'  });
    expect(newView.stateName).toEqual('about');
  }));

  it('should not be active when scope null', function() {
    expect(ionicHistory.isActiveScope(null)).toEqual(false);
    expect(ionicHistory.isActiveScope(undefined)).toEqual(false);
    expect(ionicHistory.isActiveScope()).toEqual(false);
  });

  it('should not be active when scope disconnected', function() {
    var scope = {
      $$disconnected: true
    };
    expect(ionicHistory.isActiveScope(scope)).toEqual(false);
  });

  it('should not be active when parent scope is disconnected', function() {
    var scope = {
      $parent: {
        $parent: {
          $$disconnected: true
        }
      }
    };
    expect(ionicHistory.isActiveScope(scope)).toEqual(false);
  });

  it('should be active w/ scope but no current history id', function() {
    ionicHistory.registerHistory('1234');
    expect(ionicHistory.isActiveScope(scope)).toEqual(true);
  });

  it('should be active w/ scope same history id as current view', function() {
    ionicHistory.currentView({
      historyId: '123'
    });

    var scope = {
      $historyId: '123'
    }
    expect(ionicHistory.isActiveScope(scope)).toEqual(true);
  });

  it('should be active w/ scopes parent the same history id as current view', function() {
    ionicHistory.currentView({
      historyId: '123'
    });

    var scope = {
      $parent: {
        $historyId: '123'
      }
    }
    expect(ionicHistory.isActiveScope(scope)).toEqual(true);
  });

  it('should be active when one of the parent scopes is the same history id as current view', function() {
    ionicHistory.currentView({
      historyId: '123'
    });

    var scope = {
      $parent: {
        $historyId: 'abc',
        $parent: {
          $historyId: 'xyz',
          $parent: {
            $historyId: '123'
          }
        }
      }
    };
    expect(ionicHistory.isActiveScope(scope)).toEqual(true);
  });

  it('should be active when activeHistoryId found before historyId, for tabs controller', function() {
    ionicHistory.currentView({
      historyId: '123'
    });

    var scope = {
      $parent: {
        $parent: {
          $activeHistoryId: '123',
          $parent: {
            $historyId: 'xyz'
          }
        }
      }
    };
    expect(ionicHistory.isActiveScope(scope)).toEqual(true);
  });

  it('should be active when historyId found before activeHistoryId', function() {
    ionicHistory.currentView({
      historyId: '123'
    });

    var scope = {
      $parent: {
        $parent: {
          $activeHistoryId: 'xyz',
          $parent: {
            $historyId: '123'
          }
        }
      }
    };
    expect(ionicHistory.isActiveScope(scope)).toEqual(true);
  });

  it('should be not active w/ scope different history id as current view', function() {
    ionicHistory.currentView({
      historyId: '123'
    });

    var scope = {
      $historyId: 'abc'
    }
    expect(ionicHistory.isActiveScope(scope)).toEqual(false);
  });

  it('should be active when scope w/ unknown history and current view root history id', function() {
    ionicHistory.currentView({
      historyId: 'root'
    });

    expect(ionicHistory.isActiveScope({})).toEqual(true);
  });

  it('should not be active when scope w/ unknown history and current view not root history id', function() {
    ionicHistory.currentView({
      historyId: '123'
    });

    expect(ionicHistory.isActiveScope({})).toEqual(false);
  });

  it('should go() to a view', inject(function($location) {
    var newView = ionicHistory.createView({ stateName: 'about' });
    newView.go();
    rootScope.$apply();
    expect($location.url()).toEqual('/about');

    $location.url('/nochange');
    newView = ionicHistory.createView({ url: '/nochange' });
    var result = newView.go();
    expect(result).toEqual(null);

    $location.url('/nochange');
    newView = ionicHistory.createView({ url: '/nochange' });
    result = newView.go();
    expect(result).toEqual(null);

    newView = ionicHistory.viewHistory().backView = ionicHistory.createView({ url: '/url' });
    result = newView.go();
    expect(result).toEqual(-1);

    newView = ionicHistory.viewHistory().forwardView = ionicHistory.createView({ url: '/url' });
    result = newView.go();
    expect(result).toEqual(1);

    newView = ionicHistory.createView({ url: '/url' });
    newView.go();
    expect($location.url()).toEqual('/url');
  }));

  it('should change history on event changeHistory', inject(function($location, $state) {
    $location.url('/original');

    rootScope.$broadcast('$ionicHistory.change');
    expect($location.url()).toEqual('/original');

    rootScope.$broadcast('$ionicHistory.change', { uiSref: 'about' });
    expect($location.url()).toEqual('/about');

    rootScope.$broadcast('$ionicHistory.change', { url: '/url' });
    expect($location.url()).toEqual('/url');

    ionicHistory.viewHistory().histories.h123 = { stack: [], cursor: -1 };
    rootScope.$broadcast('$ionicHistory.change', { historyId: 'h123' });
    expect($location.url()).toEqual('/url');

    var newView = ionicHistory.createView({ stateName: 'about' });
    ionicHistory.viewHistory().histories.h123.stack.push(newView);
    ionicHistory.viewHistory().histories.h123.cursor++;
    rootScope.$broadcast('$ionicHistory.change', { historyId: 'h123' });
    rootScope.$apply();
    expect($state.current.name).toEqual('about');
  }));

  it('should update document title', inject(function($document) {
    $document[0].title = 'Original Title';

    rootScope.$broadcast('$ionicView.afterEnter');
    expect($document[0].title).toEqual('Original Title');

    rootScope.$broadcast('$ionicView.afterEnter', {});
    expect($document[0].title).toEqual('Original Title');

    rootScope.$broadcast('$ionicView.afterEnter', { title: 'New Title' });
    expect($document[0].title).toEqual('New Title');
  }));

  it('should remove the previous view completely', inject(function($state) {
    $state.go('home');
    rootScope.$apply();
    var view1Scope = {};
    var rsp = ionicHistory.register(view1Scope, false);

    $state.go('about');
    rootScope.$apply();
    rsp = ionicHistory.register({}, false);

    $state.go('contact');
    rootScope.$apply();
    rsp = ionicHistory.register({}, false);

    var currentView = ionicHistory.currentView();
    var backView = ionicHistory.backView();
    expect(currentView.url).toEqual('/contact');
    expect(backView.url).toEqual('/about');
    expect(backView.viewId).toEqual(currentView.backViewId);

    ionicHistory.removeBackView();

    currentView = ionicHistory.currentView();
    backView = ionicHistory.backView();
    expect(backView.url).toEqual('/');
    expect(backView.stateName).toEqual('home');
    expect(currentView.url).toEqual('/contact');
    expect(currentView.backViewId).toEqual(backView.viewId);

  }));

  it('should wipe out any back view references to a view when revisiting that view', inject(function($state, $ionicHistory) {

    var tab1Container = {};
    var tab2Container = {};
    var tab3Container = {};
    ionicHistory.registerHistory(tab1Container);
    ionicHistory.registerHistory(tab2Container);
    ionicHistory.registerHistory(tab3Container);

    // register tab1, view1
    $state.go('tabs.tab1view1');
    rootScope.$apply();
    var tab1view1Reg = ionicHistory.register(tab1Container, false);
    expect(ionicHistory.viewHistory().histories[tab1Container.$historyId].cursor).toEqual(0);

    // register tab3, view1
    $state.go('tabs.tab3view1');
    rootScope.$apply();
    var tab3view1Reg = ionicHistory.register(tab3Container, false);

    // register tab2, view1
    $state.go('tabs.tab2view1');
    rootScope.$apply();
    var tab2view1Reg = ionicHistory.register(tab2Container, false);

    // go to tab2, view 2
    // register tab1, view2
    $state.go('tabs.tab2view2');
    rootScope.$apply();
    var tab2view2Reg = ionicHistory.register(tab2Container, false);
    expect(ionicHistory.viewHistory().histories[tab2Container.$historyId].cursor).toEqual(1);
    currentView = ionicHistory.currentView();
    expect(currentView.backViewId).toEqual(tab2view1Reg.viewId);

    // register tab3, view1
    $state.go('tabs.tab3view1');
    rootScope.$apply();
    tab3view1Reg = ionicHistory.register(tab3Container, false);

    currentView = ionicHistory.currentView();
    expect(currentView.backViewId).toEqual(tab2view2Reg.viewId);

    backView = ionicHistory.getViewById(currentView.backViewId);
    expect(backView.backViewId).toEqual(tab2view1Reg.viewId);

    var backBackView = ionicHistory.getViewById(backView.backViewId);
    expect(backBackView.backViewId).toEqual(null);

  }));

  it('should be able to go forward from non-tabbed view, to tabbed-view, to different non-tabbed view, and then all the way back', inject(function($state, $ionicHistory) {

    $state.go('home');
    rootScope.$apply();
    var view1Scope = {};
    var rsp = ionicHistory.register(view1Scope, false);

    var tab1Container = {};
    ionicHistory.registerHistory(tab1Container);

    // register tab1, view1
    $state.go('tabs.tab1view1');
    rootScope.$apply();
    var tab1view1Reg = ionicHistory.register(tab1Container, false);
    expect(ionicHistory.viewHistory().histories[tab1Container.$historyId].cursor).toEqual(0);

    $state.go('about');
    rootScope.$apply();
    rsp = ionicHistory.register({}, false);

    var currentView = ionicHistory.currentView();
    var backView = ionicHistory.getViewById(currentView.backViewId);

    expect(currentView.stateName).toEqual('about');
    expect(backView.stateName).toEqual('tabs.tab1view1');

    var originalView = ionicHistory.getViewById(backView.backViewId);
    expect(originalView.stateName).toEqual('home');

  }));

  it('should be able to go forward from non-tabbed view, to multiple tabbed-views, to different non-tabbed view, and then all the way back', inject(function($state, $ionicHistory) {

    $state.go('home');
    rootScope.$apply();
    var view1Scope = {};
    var rsp = ionicHistory.register(view1Scope, false);

    var tab1Container = {};
    var tab2Container = {};
    var tab3Container = {};
    ionicHistory.registerHistory(tab1Container);
    ionicHistory.registerHistory(tab2Container);
    ionicHistory.registerHistory(tab3Container);

    // register tab1, view1
    $state.go('tabs.tab1view1');
    rootScope.$apply();
    var tab1view1Reg = ionicHistory.register(tab1Container, false);
    expect(ionicHistory.viewHistory().histories[tab1Container.$historyId].cursor).toEqual(0);

    $state.go('tabs.tab2view1');
    rootScope.$apply();
    var tab2view1Reg = ionicHistory.register(tab2Container, false);
    expect(ionicHistory.viewHistory().histories[tab2Container.$historyId].cursor).toEqual(0);

    $state.go('tabs.tab2view2');
    rootScope.$apply();
    var tab2view2Reg = ionicHistory.register(tab2Container, false);
    expect(ionicHistory.viewHistory().histories[tab2Container.$historyId].cursor).toEqual(1);

    $state.go('tabs.tab3view1');
    rootScope.$apply();
    var tab3view1Reg = ionicHistory.register(tab3Container, false);
    expect(ionicHistory.viewHistory().histories[tab3Container.$historyId].cursor).toEqual(0);

    $state.go('tabs.tab3view2');
    rootScope.$apply();
    var tab3view2Reg = ionicHistory.register(tab3Container, false);
    expect(ionicHistory.viewHistory().histories[tab3Container.$historyId].cursor).toEqual(1);

    $state.go('about');
    rootScope.$apply();
    rsp = ionicHistory.register({}, false);

    var currentView = ionicHistory.currentView();
    var backView = ionicHistory.getViewById(currentView.backViewId);

    expect(currentView.stateName).toEqual('about');
    expect(backView.stateName).toEqual('tabs.tab3view2');

    // update the backview
    backView = ionicHistory.getViewById(backView.backViewId);
    expect(backView.stateName).toEqual('tabs.tab3view1');

    backView = ionicHistory.getViewById(backView.backViewId);
    expect(backView.stateName).toEqual('tabs.tab2view2');

    backView = ionicHistory.getViewById(backView.backViewId);
    expect(backView.stateName).toEqual('tabs.tab2view1');

    backView = ionicHistory.getViewById(backView.backViewId);
    expect(backView.stateName).toEqual('tabs.tab1view1');

    backView = ionicHistory.getViewById(backView.backViewId);
    expect(backView.stateName).toEqual('home');

  }));

  it('should navigate forward then be able to get back via backViews', inject(function($state, $ionicHistory) {

    $state.go('home');
    rootScope.$apply();
    var homeScope = {};
    var home = ionicHistory.register(homeScope, false);

    $state.go('about');
    rootScope.$apply();
    var aboutScope = {};
    var about = ionicHistory.register(aboutScope, false);

    $state.go('contact');
    rootScope.$apply();
    var contactScope = {};
    var contact = ionicHistory.register(contactScope, false);

    $state.go('home');
    rootScope.$apply();
    var homeScope = {};
    var home = ionicHistory.register(homeScope, false);

    var currentView = ionicHistory.currentView();
    expect(currentView.stateName).toEqual('home');

    var backView = ionicHistory.getViewById(currentView.backViewId);
    expect(backView.stateName).toEqual('contact');

    // update the backview
    backView = ionicHistory.getViewById(backView.backViewId);
    expect(backView.stateName).toEqual('about');

    // update the backview
    backView = ionicHistory.getViewById(backView.backViewId);
    expect(backView.stateName).toEqual('home');
    expect(backView.backViewId).toEqual(null);

  }));

});
