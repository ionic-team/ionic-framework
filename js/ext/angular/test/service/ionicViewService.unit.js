describe('Ionic View Service', function() {
  var viewService, rootScope, stateProvider, window;

  beforeEach(module('ionic.service.view'));
  beforeEach(module('ui.router'));

  beforeEach(module(function ($stateProvider, $provide) {
    stateProvider = $stateProvider;

    $stateProvider
      .state('home', { url: "/" })
      .state('home.item', { url: "front/:id" })

      .state('about', { url: "/about" })
      .state('about.person', { url: "/person" })
      .state('about.person.item', { url: "/id" })

      .state('about.sidebar', {})
      .state('about.sidebar.item', {})

      .state('contact', { url: "/contact" })

      .state('info', { url: "/info" })

      .state('tabs', { abstract: true })
      .state('tabs.tab1view1', {})
      .state('tabs.tab1view2', {})
      .state('tabs.tab1view3', {})

      .state('tabs.tab2view1', {})
      .state('tabs.tab2view2', {})
      .state('tabs.tab2view3', {})

      .state('tabs.tab3view1', {})
      .state('tabs.tab3view2', {})
      .state('tabs.tab3view3', {})

  }));

  beforeEach(inject(function($ionicViewService, $rootScope, $window, $location) {
    viewService = $ionicViewService;
    rootScope = $rootScope;
    window = $window;
    window.history.go = function(val) { return val };
  }));

  it('should do nothing if the same state happens', inject(function($state) {
    var uiViewScope = {};
    $state.go('home');
    rootScope.$apply();
    viewService.register(uiViewScope);

    homeViewScope = {};
    $state.go('home');
    rootScope.$apply();
    registerData = viewService.register(homeViewScope);

    expect(registerData.navAction).toEqual('noChange');
    expect(registerData.historyId).toEqual('root');
  }));

  it('should create a new view', inject(function($location, $state) {
    $location.url('/home');
    var view1Scope = {};
    var rsp = viewService.register(view1Scope);
    expect(rsp.navAction).toEqual('initialView');
    expect(rsp.historyId).toEqual('root');

    var currentView = viewService.getCurrentView();
    expect(currentView.viewId).toBeDefined();
    expect(currentView.index).toEqual(0);
    expect(currentView.historyId).toBeDefined();
    expect(currentView.backViewId).toEqual(null);
    expect(currentView.forwardViewId).toEqual(null);
    expect(currentView.url).toEqual('/home');

    var hist = rootScope.$viewHistory.histories.root;
    expect(hist.cursor).toEqual(0);
    expect(hist.stack.length).toEqual(1);
  }));

  it('should register two sequential views', inject(function($state) {
    $state.go('home');
    rootScope.$apply();
    expect(viewService.getCurrentStateName()).toEqual('home');
    var view1Scope = {};
    var rsp = viewService.register(view1Scope);
    expect(rootScope.$viewHistory.currentView.stateName).toEqual('home');

    expect(rsp.viewId).not.toBeUndefined();
    expect(rootScope.$viewHistory.histories[rsp.viewId].viewId).toEqual(rsp.viewId);
    expect(viewService.getBackView()).toEqual(null);
    expect(viewService.getForwardView()).toEqual(null);

    expect(rootScope.$viewHistory.currentView.stateName).toEqual('home');
    var currentView = viewService.getCurrentView();
    expect(currentView.index).toEqual(0);

    $state.go('about');
    rootScope.$apply();
    expect(viewService.getCurrentStateName()).toEqual('about');
    rsp = viewService.register({});
    expect(rsp.navAction).toEqual('newView');
    expect(viewService.getCurrentView().stateName).toEqual('about');
    expect(viewService.getBackView().stateName).toEqual('home');
    expect(viewService.getForwardView()).toEqual(null);

    var hist = rootScope.$viewHistory.histories.root;
    expect(hist.cursor).toEqual(1);
    expect(hist.stack.length).toEqual(2);
  }));

  it('should register views and go back to start', inject(function($state) {
    $state.go('home');
    rootScope.$apply();
    var registerData = viewService.register({});
    expect(viewService.getCurrentView().stateName).toEqual('home');
    expect(viewService.getBackView()).toEqual(null);
    expect(viewService.getForwardView()).toEqual(null);
    expect(registerData.navDirection).toEqual(null);
    expect(registerData.navAction).toEqual('initialView');

    $state.go('about');
    rootScope.$apply();
    registerData = viewService.register({});
    var currentView = viewService.getCurrentView();
    var backView = viewService.getBackView();
    var forwardView = viewService.getForwardView();
    expect(currentView.stateName).toEqual('about');
    expect(currentView.backViewId).toEqual(backView.viewId);
    expect(backView.stateName).toEqual('home');
    expect(forwardView).toEqual(null);
    expect(registerData.navDirection).toEqual('forward');
    expect(registerData.navAction).toEqual('newView');

    expect(rootScope.$viewHistory.histories.root.cursor).toEqual(1);
    expect(rootScope.$viewHistory.histories.root.stack.length).toEqual(2);

    $state.go('contact');
    rootScope.$apply();
    registerData = viewService.register({});
    currentView = viewService.getCurrentView();
    //Set test value for remembered scroll
    currentView.scrollValues = 'foo';
    backView = viewService.getBackView();
    forwardView = viewService.getForwardView();
    expect(backView.stateName).toEqual('about');
    expect(currentView.backViewId).toEqual(backView.viewId);
    expect(viewService.getForwardView()).toEqual(null);
    expect(registerData.navDirection).toEqual('forward');
    expect(registerData.navAction).toEqual('newView');

    expect(rootScope.$viewHistory.histories.root.cursor).toEqual(2);
    expect(rootScope.$viewHistory.histories.root.stack.length).toEqual(3);

    $state.go('about');
    rootScope.$apply();
    registerData = viewService.register({});
    currentView = viewService.getCurrentView();
    backView = viewService.getBackView();
    forwardView = viewService.getForwardView();
    expect(forwardView.scrollValues).toEqual({});
    expect(currentView.stateName).toEqual('about');
    expect(currentView.backViewId).toEqual(backView.viewId);
    expect(currentView.forwardViewId).toEqual(forwardView.viewId);
    expect(backView.stateName).toEqual('home');
    expect(forwardView.stateName).toEqual('contact');
    expect(registerData.navDirection).toEqual('back');
    expect(registerData.navAction).toEqual('moveBack');

    expect(rootScope.$viewHistory.histories.root.cursor).toEqual(1);
    expect(rootScope.$viewHistory.histories.root.stack.length).toEqual(3);

    $state.go('home');
    rootScope.$apply();
    registerData = viewService.register({});
    currentView = viewService.getCurrentView();
    backView = viewService.getBackView();
    forwardView = viewService.getForwardView();
    expect(currentView.stateName).toEqual('home');
    expect(currentView.forwardViewId).toEqual(forwardView.viewId);
    expect(backView).toEqual(null);
    expect(forwardView.stateName).toEqual('about');
    expect(registerData.navDirection).toEqual('back');
    expect(registerData.navAction).toEqual('moveBack');

    expect(rootScope.$viewHistory.histories.root.cursor).toEqual(0);
    expect(rootScope.$viewHistory.histories.root.stack.length).toEqual(3);
  }));

  it('should register four views, and not go back to the first', inject(function($state) {
    var homeViewScope = {};
    $state.go('home');
    rootScope.$apply();
    var homeReg = viewService.register(homeViewScope);
    expect(homeReg.navAction).toEqual('initialView');
    expect(viewService.getCurrentStateName()).toEqual('home');
    expect(viewService.getCurrentView().stateName).toEqual('home');
    expect(viewService.getBackView()).toEqual(null);
    expect(viewService.getForwardView()).toEqual(null);
    expect(rootScope.$viewHistory.histories.root.cursor).toEqual(0);
    expect(rootScope.$viewHistory.histories.root.stack.length).toEqual(1);

    var aboutViewScope = {};
    $state.go('about');
    rootScope.$apply();
    var aboutReg = viewService.register(aboutViewScope);
    var currentView = viewService.getCurrentView();
    var backView = viewService.getBackView();
    var forwardView = viewService.getForwardView();
    expect(aboutReg.navAction).toEqual('newView');
    expect(currentView.viewId).toEqual(aboutReg.viewId);
    expect(currentView.backViewId).toEqual(homeReg.viewId);
    expect(currentView.forwardViewId).toEqual(null);
    expect(backView.viewId).toEqual(homeReg.viewId);
    expect(backView.forwardViewId).toEqual(currentView.viewId);
    expect(rootScope.$viewHistory.histories.root.cursor).toEqual(1);
    expect(rootScope.$viewHistory.histories.root.stack.length).toEqual(2);

    var tab1Scope = {};
    viewService.registerHistory(tab1Scope);
    var tab1view1Scope = { $parent: tab1Scope };

    $state.go('tabs.tab1view1');
    rootScope.$apply();
    var tab1view1Reg = viewService.register(tab1view1Scope);
    expect(tab1view1Reg.navAction).toEqual('newView');

    expect(rootScope.$viewHistory.histories[tab1Scope.$historyId].historyId).toEqual(tab1Scope.$historyId);
    expect(rootScope.$viewHistory.histories[tab1Scope.$historyId].stack[0].viewId).toEqual(tab1view1Reg.viewId);
    expect(rootScope.$viewHistory.histories[tab1Scope.$historyId].cursor).toEqual(0);
    expect(rootScope.$viewHistory.histories[tab1Scope.$historyId].stack.length).toEqual(1);
    expect(rootScope.$viewHistory.histories.root.cursor).toEqual(1);
    expect(rootScope.$viewHistory.histories.root.stack.length).toEqual(2);

    currentView = viewService.getCurrentView();
    backView = viewService.getBackView();
    forwardView = viewService.getForwardView();
    expect(currentView.viewId).toEqual(tab1view1Reg.viewId);
    expect(currentView.historyId).toEqual(tab1Scope.$historyId);
    expect(currentView.historyId).toEqual(tab1view1Reg.historyId);
    expect(currentView.backViewId).toEqual(aboutReg.viewId);
    expect(currentView.forwardViewId).toEqual(null);
    expect(backView.viewId).toEqual(aboutReg.viewId);
    expect(backView.forwardViewId).toEqual(currentView.viewId);

    $state.go('home');
    rootScope.$apply();
    var home2reg = viewService.register({});
    expect(home2reg.navAction).toEqual('newView');
    currentView = viewService.getCurrentView();
    backView = viewService.getBackView();
    forwardView = viewService.getForwardView();
    expect(currentView.backViewId).toEqual(tab1view1Reg.viewId);
    expect(currentView.forwardViewId).toEqual(null);
    expect(backView.viewId).toEqual(tab1view1Reg.viewId);
    expect(backView.forwardViewId).toEqual(currentView.viewId);

    expect(rootScope.$viewHistory.histories.root.cursor).toEqual(2);
    expect(rootScope.$viewHistory.histories.root.stack.length).toEqual(3);
    expect(rootScope.$viewHistory.histories[tab1Scope.$historyId].cursor).toEqual(0);
    expect(rootScope.$viewHistory.histories[tab1Scope.$historyId].stack.length).toEqual(1);
  }));

  it('should register views in the same history, go back, then overwrite the forward views', inject(function($state) {
    var homeViewScope = {};
    $state.go('home');
    rootScope.$apply();
    var homeReg = viewService.register(homeViewScope);
    currentView = viewService.getCurrentView();
    backView = viewService.getBackView();
    forwardView = viewService.getForwardView();
    expect(currentView.viewId).toEqual(homeReg.viewId);
    expect(currentView.backViewId).toEqual(null);
    expect(currentView.forwardViewId).toEqual(null);
    expect(rootScope.$viewHistory.histories.root.cursor).toEqual(0);
    expect(rootScope.$viewHistory.histories.root.stack.length).toEqual(1);
    expect(homeReg.navAction).toEqual('initialView');
    expect(homeReg.navDirection).toEqual(null);

    var aboutScope = {};
    $state.go('about');
    rootScope.$apply();
    var aboutReg = viewService.register(aboutScope);
    currentView = viewService.getCurrentView();
    backView = viewService.getBackView();
    forwardView = viewService.getForwardView();
    expect(currentView.viewId).toEqual(aboutReg.viewId);
    expect(currentView.backViewId).toEqual(homeReg.viewId);
    expect(currentView.forwardViewId).toEqual(null);
    expect(backView.viewId).toEqual(homeReg.viewId);
    expect(backView.forwardViewId).toEqual(currentView.viewId);
    expect(rootScope.$viewHistory.histories.root.cursor).toEqual(1);
    expect(rootScope.$viewHistory.histories.root.stack.length).toEqual(2);
    expect(aboutReg.navAction).toEqual('newView');
    expect(aboutReg.navDirection).toEqual('forward');

    homeViewScope = {};
    $state.go('home');
    rootScope.$apply();
    var homeReg2 = viewService.register(homeViewScope);
    currentView = viewService.getCurrentView();
    backView = viewService.getBackView();
    forwardView = viewService.getForwardView();
    expect(currentView.viewId).toEqual(homeReg.viewId);
    expect(currentView.backViewId).toEqual(null);
    expect(currentView.forwardViewId).toEqual(aboutReg.viewId);
    expect(forwardView.viewId).toEqual(aboutReg.viewId);
    expect(forwardView.backViewId).toEqual(currentView.viewId);
    expect(rootScope.$viewHistory.histories.root.cursor).toEqual(0);
    expect(rootScope.$viewHistory.histories.root.stack.length).toEqual(2);
    expect(homeReg2.navAction).toEqual('moveBack');
    expect(homeReg2.navDirection).toEqual('back');

    // this should overwrite that we went to the "about" view
    contactScope = {};
    $state.go('contact');
    rootScope.$apply();
    var contactReg = viewService.register(contactScope);
    currentView = viewService.getCurrentView();
    backView = viewService.getBackView();
    forwardView = viewService.getForwardView();
    expect(currentView.backViewId).toEqual(homeReg.viewId);
    expect(currentView.forwardViewId).toEqual(null);
    expect(forwardView).toEqual(null);
    expect(backView.viewId).toEqual(homeReg.viewId);
    expect(backView.forwardViewId).toEqual(currentView.viewId);
    expect(rootScope.$viewHistory.histories.root.cursor).toEqual(1);
    expect(rootScope.$viewHistory.histories.root.stack.length).toEqual(2);
    expect(contactReg.navAction).toEqual('newView');
    expect(contactReg.navDirection).toEqual('forward');
  }));

  it('should go to a new history, come back out, go to same history and come back out', inject(function($state) {
    var rootViewContainer = {};
    $state.go('home');
    rootScope.$apply();
    var homeReg = viewService.register(rootViewContainer);
    var currentView = viewService.getCurrentView();
    expect(currentView.historyId).toEqual('root');
    expect(rootScope.$viewHistory.histories.root.cursor).toEqual(0);
    expect(homeReg.navAction).toEqual('initialView');

    // each tab gets its own history in the tabs directive
    // create a new tab and its history
    var tabs1Container = { $parent: rootViewContainer };
    viewService.registerHistory(tabs1Container);
    expect(tabs1Container.$historyId).toBeDefined();
    expect(rootViewContainer.$historyId).not.toEqual(tabs1Container.$historyId);
    var originalTab1ViewId = tabs1Container.$historyId;

    // the actual view within the tab renders
    // nav to tab1 which has its own history
    var tab1View = { $parent: tabs1Container };
    $state.go('tabs.tab1view1');
    rootScope.$apply();
    var tab1view1Reg = viewService.register(tab1View);
    currentView = viewService.getCurrentView();
    expect(currentView.historyId).toEqual(tabs1Container.$historyId);
    expect(rootScope.$viewHistory.histories[tabs1Container.$historyId].parentHistoryId).toEqual('root');
    expect(rootScope.$viewHistory.histories[tabs1Container.$historyId].cursor).toEqual(0);
    expect(rootScope.$viewHistory.histories[tabs1Container.$historyId].stack.length).toEqual(1);
    expect(tab1view1Reg.navAction).toEqual('newView');

    currentView = viewService.getCurrentView();
    backView = viewService.getBackView();
    forwardView = viewService.getForwardView();

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
    var homeReg = viewService.register(homeViewScope);
    expect(rootScope.$viewHistory.histories.root.cursor).toEqual(0);
    expect(rootScope.$viewHistory.histories.root.stack.length).toEqual(1);
    expect(homeReg.historyId).toEqual('root');

    currentView = viewService.getCurrentView();
    backView = viewService.getBackView();
    forwardView = viewService.getForwardView();

    expect(currentView.stateName).toEqual('home');
    expect(currentView.backViewId).toEqual(null);
    expect(currentView.forwardViewId).toEqual(tab1view1Reg.viewId);

    expect(forwardView.stateName).toEqual('tabs.tab1view1');
    expect(forwardView.viewId).toEqual(tab1view1Reg.viewId);
    expect(forwardView.backViewId).toEqual(currentView.viewId);
    expect(forwardView.forwardViewId).toEqual(null);
    expect(rootScope.$viewHistory.histories.root.cursor).toEqual(0);
    expect(rootScope.$viewHistory.histories.root.stack.length).toEqual(1);

    // create a new tab and its history
    tabs1Container = { $parent: rootViewContainer };
    viewService.registerHistory(tabs1Container);
    expect(originalTab1ViewId).not.toEqual(tabs1Container.$historyId);

    tab1View = { $parent: tabs1Container };
    $state.go('tabs.tab1view1');
    rootScope.$apply();
    tab1view1Reg = viewService.register(tab1View);
    expect(tab1view1Reg.navAction).toEqual('moveForward');
    expect(tab1view1Reg.navDirection).toEqual(null);
    expect(tab1view1Reg.historyId).toEqual(originalTab1ViewId);
    expect(originalTab1ViewId).toEqual(tabs1Container.$historyId);
    expect(tab1view1Reg.historyId).not.toEqual('root');
    expect(rootScope.$viewHistory.histories[tab1view1Reg.historyId].cursor).toEqual(0);
    expect(rootScope.$viewHistory.histories[tab1view1Reg.historyId].stack.length).toEqual(1);

    currentView = viewService.getCurrentView();
    expect(currentView.historyId).toEqual(tabs1Container.$historyId);
    expect(rootScope.$viewHistory.histories[tabs1Container.$historyId].cursor).toEqual(0);

    currentView = viewService.getCurrentView();
    backView = viewService.getBackView();
    forwardView = viewService.getForwardView();

    expect(currentView.stateName).toEqual('tabs.tab1view1');
    expect(currentView.viewId).toEqual(tab1view1Reg.viewId);
    expect(currentView.backViewId).toEqual(homeReg.viewId);
    expect(currentView.forwardViewId).toEqual(null);

    expect(backView.viewId).toEqual(homeReg.viewId);
    expect(backView.stateName).toEqual('home');
    expect(backView.backViewId).toEqual(null);
    expect(backView.forwardViewId).toEqual(currentView.viewId);

    expect(forwardView).toEqual(null);
    expect(rootScope.$viewHistory.histories.root.cursor).toEqual(0);
  }));

  it('should nav to a history, move around in it, and come back', inject(function($state) {
    // go to the first page
    $state.go('home');
    rootScope.$apply();
    var homeReg = viewService.register({});

    // each tab gets its own history in the tabs directive
    var tab1Scope = { };
    var tab2Scope = { };
    var tab3Scope = { };
    viewService.registerHistory(tab1Scope);
    viewService.registerHistory(tab2Scope);
    viewService.registerHistory(tab3Scope);

    // the actual view renders
    var tab1view1Scope = { $parent: tab1Scope };
    $state.go('tabs.tab1view1');
    rootScope.$apply();
    var tab1view1ScopeReg = viewService.register(tab1view1Scope);
    expect(viewService.getCurrentStateName()).toEqual('tabs.tab1view1');
    expect(viewService.getBackView().stateName).toEqual('home');
    expect(viewService.getForwardView()).toEqual(null);
    var lastView = viewService.getCurrentView();
    expect(lastView.index).toEqual(0);
    expect(tab1view1ScopeReg.viewId).toEqual(lastView.viewId);
    expect(tab1view1ScopeReg.navAction).toEqual('newView');
    expect(tab1view1ScopeReg.navDirection).toEqual(null);
    expect(rootScope.$viewHistory.histories[tab1view1ScopeReg.historyId].cursor).toEqual(0);
    expect(rootScope.$viewHistory.histories[tab1view1ScopeReg.historyId].stack.length).toEqual(1);

    // inside first tab, go to another list inside the same tab
    var tab1view2Scope = { $parent: tab1Scope };
    $state.go('tabs.tab1view2');
    rootScope.$apply();
    var tab1view2ScopeReg = viewService.register(tab1view2Scope);
    expect(viewService.getCurrentStateName()).toEqual('tabs.tab1view2');
    expect(viewService.getBackView().stateName).toEqual('tabs.tab1view1');
    expect(viewService.getForwardView()).toEqual(null);
    var lastView = viewService.getCurrentView();
    expect(lastView.index).toEqual(1);
    expect(tab1view2ScopeReg.viewId).toEqual(lastView.viewId);
    expect(tab1view2ScopeReg.navAction).toEqual('newView');
    expect(tab1view2ScopeReg.navDirection).toEqual('forward');
    expect(rootScope.$viewHistory.histories[tab1view2ScopeReg.historyId].cursor).toEqual(1);
    expect(rootScope.$viewHistory.histories[tab1view2ScopeReg.historyId].stack.length).toEqual(2);

    // go back one within the tab
    $state.go('tabs.tab1view1');
    rootScope.$apply();
    var tab1view1Scope2Reg = viewService.register(tab1view1Scope);
    expect(viewService.getCurrentStateName()).toEqual('tabs.tab1view1');
    expect(viewService.getBackView().stateName).toEqual('home');
    expect(viewService.getForwardView().stateName).toEqual('tabs.tab1view2');
    var lastView = viewService.getCurrentView();
    expect(lastView.index).toEqual(0);
    expect(tab1view1Scope2Reg.navAction).toEqual('moveBack');
    expect(tab1view1Scope2Reg.navDirection).toEqual('back');
    expect(rootScope.$viewHistory.histories[tab1view1Scope2Reg.historyId].cursor).toEqual(0);
    expect(rootScope.$viewHistory.histories[tab1view1Scope2Reg.historyId].stack.length).toEqual(2);

    // go back again, and should break out of the tab's history
    $state.go('home');
    rootScope.$apply();
    var homeReg2 = viewService.register({});
    expect(viewService.getCurrentStateName()).toEqual('home');
    expect(homeReg2.historyId).toEqual('root');
    expect(homeReg2.navAction).toEqual('moveBack');
    expect(homeReg2.navDirection).toEqual(null);
    expect(rootScope.$viewHistory.histories[homeReg2.historyId].cursor).toEqual(0);
    expect(rootScope.$viewHistory.histories[homeReg2.historyId].stack.length).toEqual(1);

    $state.go('about');
    rootScope.$apply();
    var aboutReg = viewService.register({});
    expect(viewService.getCurrentStateName()).toEqual('about');
    expect(aboutReg.historyId).toEqual('root');
    expect(aboutReg.navAction).toEqual('newView');
    expect(aboutReg.navDirection).toEqual('forward');
    expect(rootScope.$viewHistory.histories[aboutReg.historyId].cursor).toEqual(1);
    expect(rootScope.$viewHistory.histories[aboutReg.historyId].stack.length).toEqual(2);
  }));

  it('should change to history that already exists, and go to its last current view', inject(function($location, $state) {
    // register tabs
    var tab1Scope = {};
    var tab2Scope = {};
    viewService.registerHistory(tab1Scope);
    viewService.registerHistory(tab2Scope);
    var orgTab1HistoryId = tab1Scope.$historyId;

    // render first view in tab1
    var tab1view1Scope = { $parent: tab1Scope };
    $state.go('tabs.tab1view1');
    rootScope.$apply();
    var registerData = viewService.register(tab1view1Scope);
    expect(viewService.getCurrentStateName()).toEqual('tabs.tab1view1');
    expect(rootScope.$viewHistory.histories[tab1Scope.$historyId].cursor).toEqual(0);
    expect(rootScope.$viewHistory.histories[tab1Scope.$historyId].stack.length).toEqual(1);
    expect(registerData.navAction).toEqual('initialView');
    expect(registerData.navDirection).toEqual(null);

    // render second view in tab1
    var tab1view2Scope = { $parent: tab1Scope };
    $state.go('tabs.tab1view2');
    rootScope.$apply();
    registerData = viewService.register(tab1view2Scope);
    expect(viewService.getCurrentStateName()).toEqual('tabs.tab1view2');
    expect(rootScope.$viewHistory.histories[tab1Scope.$historyId].cursor).toEqual(1);
    expect(rootScope.$viewHistory.histories[tab1Scope.$historyId].stack.length).toEqual(2);
    expect(registerData.navAction).toEqual('newView');
    expect(registerData.navDirection).toEqual('forward');
    currentView = viewService.getCurrentView();
    expect(currentView.viewId).toEqual(registerData.viewId);

    // go back to the first view again in tab 1
    tab1view1Scope = { $parent: tab1Scope };
    $state.go('tabs.tab1view1');
    rootScope.$apply();
    registerData = viewService.register(tab1view1Scope);
    expect(viewService.getCurrentStateName()).toEqual('tabs.tab1view1');
    currentView = viewService.getCurrentView();
    expect(currentView.viewId).toEqual(registerData.viewId);
    forwardView = viewService.getForwardView();
    expect(currentView.forwardViewId).toEqual(rootScope.$viewHistory.histories[tab1Scope.$historyId].stack[1].viewId);
    expect(forwardView.backViewId).toEqual(currentView.viewId);
    expect(rootScope.$viewHistory.histories[tab1Scope.$historyId].cursor).toEqual(0);
    expect(rootScope.$viewHistory.histories[tab1Scope.$historyId].stack.length).toEqual(2);
    expect(registerData.navAction).toEqual('moveBack');
    expect(registerData.navDirection).toEqual('back');

    // render first view in tab2
    var tab2view1Scope = { $parent: tab2Scope };
    $state.go('tabs.tab2view1');
    rootScope.$apply();
    registerData = viewService.register(tab2view1Scope);
    expect(viewService.getCurrentStateName()).toEqual('tabs.tab2view1');
    expect(rootScope.$viewHistory.histories[tab2Scope.$historyId].cursor).toEqual(0);
    expect(rootScope.$viewHistory.histories[tab2Scope.$historyId].stack.length).toEqual(1);
    expect(registerData.navAction).toEqual('newView');
    expect(registerData.navDirection).toEqual(null);
    var tab2view1ViewId = registerData.viewId;

    // tab1's forward history should be destroyed
    expect(rootScope.$viewHistory.histories[tab1Scope.$historyId].stack.length).toEqual(1);
    expect(rootScope.$viewHistory.histories[tab1Scope.$historyId].stack[0].forwardViewId).toEqual(registerData.viewId);

    // go back to tab1, and it should load the first view of tab1
    expect(tab1Scope.$historyId).toEqual(orgTab1HistoryId);
    rootScope.$broadcast("viewState.changeHistory", { historyId: tab1Scope.$historyId, enableUrlChange: false });
    rootScope.$apply();
    expect(viewService.getCurrentStateName()).toEqual('tabs.tab1view1');
    registerData = viewService.register(tab1view1Scope);
    expect(registerData.navAction).toEqual('moveBack');
    expect(registerData.navDirection).toEqual(null);

    currentView = viewService.getCurrentView();
    expect(currentView.viewId).toEqual(registerData.viewId);
    expect(currentView.historyId).toEqual(orgTab1HistoryId);
    expect(currentView.forwardViewId).toEqual(tab2view1ViewId);

    expect(rootScope.$viewHistory.histories[tab1Scope.$historyId].cursor).toEqual(0);
    expect(rootScope.$viewHistory.histories[tab1Scope.$historyId].stack.length).toEqual(1);

    currentView = viewService.getCurrentView();
    expect(currentView.stateName).toEqual('tabs.tab1view1');
    expect(currentView.historyId).toEqual(tab1Scope.$historyId);

    // go to view 2 in tab 1
    tab1view2Scope = { $parent: tab1Scope };
    $state.go('tabs.tab1view2');
    rootScope.$apply();
    registerData = viewService.register(tab1view2Scope);
    expect(registerData.historyId).toEqual(orgTab1HistoryId);
    var tab1view2ViewId = registerData.viewId;
    expect(viewService.getCurrentStateName()).toEqual('tabs.tab1view2');
    expect(rootScope.$viewHistory.histories[tab1Scope.$historyId].stack.length).toEqual(2);
    expect(rootScope.$viewHistory.histories[tab1Scope.$historyId].cursor).toEqual(1);
    expect(registerData.navAction).toEqual('newView');
    expect(registerData.navDirection).toEqual('forward');

    // go to view 1 in tab 2
    tab2view1Scope = { $parent: tab2Scope };
    $state.go('tabs.tab2view1');
    rootScope.$apply();
    registerData = viewService.register(tab2view1Scope);
    expect(viewService.getCurrentStateName()).toEqual('tabs.tab2view1');
    expect(rootScope.$viewHistory.histories[tab2Scope.$historyId].cursor).toEqual(0);
    expect(registerData.navAction).toEqual('newView');
    expect(registerData.navDirection).toEqual(null);
    currentView = viewService.getCurrentView();
    expect(currentView.backViewId).toEqual(tab1view2ViewId);
    expect(currentView.forwardViewId).toEqual(null);

    // should be remembered at the tab 1 view 2
    rootScope.$broadcast("viewState.changeHistory", { historyId: tab1Scope.$historyId });
    rootScope.$apply();
    expect(viewService.getCurrentStateName()).toEqual('tabs.tab1view2');
    expect(rootScope.$viewHistory.histories[tab1Scope.$historyId].cursor).toEqual(1);
  }));

  it('should go one level in tab1, vist tab2 and tab3, come back to tab1 and still be at spot', inject(function($location, $state) {
    var tab1Container = {};
    var tab2Container = {};
    var tab3Container = {};
    viewService.registerHistory(tab1Container);
    viewService.registerHistory(tab2Container);
    viewService.registerHistory(tab3Container);

    // register tab1, view1
    $state.go('tabs.tab1view1');
    rootScope.$apply();
    var tab1view1Reg = viewService.register(tab1Container);
    expect(rootScope.$viewHistory.histories[tab1Container.$historyId].cursor).toEqual(0);

    // register tab1, view2
    $state.go('tabs.tab1view2');
    rootScope.$apply();
    var tab1view2Reg = viewService.register(tab1Container);
    expect(rootScope.$viewHistory.histories[tab1Container.$historyId].cursor).toEqual(1);
    currentView = viewService.getCurrentView();
    expect(currentView.backViewId).toEqual(tab1view1Reg.viewId);

    // register tab2, view1
    $state.go('tabs.tab2view1');
    rootScope.$apply();
    var tab2view1Reg = viewService.register(tab2Container);

    // register tab3, view1
    $state.go('tabs.tab3view1');
    rootScope.$apply();
    var tab3view1Reg = viewService.register(tab3Container);

    // register tab 1, view 2 again
    $state.go('tabs.tab1view2');
    rootScope.$apply();
    var tab1view2Reg2 = viewService.register(tab1Container);
    expect(tab1view2Reg2.navAction).toEqual('moveBack');
    expect(tab1view2Reg2.viewId).toEqual(tab1view2Reg.viewId);


    var currentViewId = tab1view2Reg.viewId;
    expect(rootScope.$viewHistory.histories[tab1view2Reg.historyId].stack.length).toEqual(2);
    backView = viewService.getBackView();
    expect(backView).toBeDefined();
    viewService.clearHistory();
    expect(rootScope.$viewHistory.histories[tab1view2Reg.historyId].stack.length).toEqual(1);
    backView = viewService.getBackView();
    expect(backView).toEqual(null);
    currentView = viewService.getCurrentView();
    expect(currentView.viewId).toEqual(currentViewId);
  }));

  it('should init root viewHistory data', inject(function() {
    expect(rootScope.$viewHistory.backView).toEqual(null);
    expect(rootScope.$viewHistory.currentView).toEqual(null);
    expect(rootScope.$viewHistory.forwardView).toEqual(null);
    expect(rootScope.$viewHistory.histories).toEqual({
        root: { historyId: 'root', parentHistoryId: null, stack: [], cursor: -1 }
    });
  }));

  it('should create a viewService view', inject(function($location) {
    var newView = viewService.createView();
    expect(newView).toEqual(null);

    newView = viewService.createView({ stateName: 'about', url: '/url',  });
    expect(newView.stateName).toEqual('about');
  }));

  it('should go() to a view', inject(function($location) {
    var newView = viewService.createView({ stateName: 'about' });
    newView.go();
    rootScope.$apply();
    expect($location.url()).toEqual('/about');

    $location.url('/nochange');
    newView = viewService.createView({ url: '/nochange' });
    var result = newView.go();
    expect(result).toEqual(null);

    $location.url('/nochange')
    newView = viewService.createView({ url: '/nochange' });
    result = newView.go();
    expect(result).toEqual(null);

    newView = rootScope.$viewHistory.backView = viewService.createView({ url: '/url' });
    result = newView.go();
    expect(result).toEqual(-1);

    newView = rootScope.$viewHistory.forwardView = viewService.createView({ url: '/url' });
    result = newView.go();
    expect(result).toEqual(1);

    newView = viewService.createView({ url: '/url' });
    newView.go();
    expect($location.url()).toEqual('/url');
  }));

  it('should change history on event changeHistory', inject(function($location, $state) {
    $location.url('/original');

    rootScope.$broadcast("viewState.changeHistory");
    expect($location.url()).toEqual('/original');

    rootScope.$broadcast("viewState.changeHistory", { uiSref: 'about' });
    expect($location.url()).toEqual('/about');

    rootScope.$broadcast("viewState.changeHistory", { url: '/url' });
    expect($location.url()).toEqual('/url');

    rootScope.$viewHistory.histories['h123'] = { stack: [], cursor: -1 }
    rootScope.$broadcast("viewState.changeHistory", { historyId: 'h123' });
    expect($location.url()).toEqual('/url');

    var newView = viewService.createView({ stateName: 'about' });
    rootScope.$viewHistory.histories['h123'].stack.push(newView);
    rootScope.$viewHistory.histories['h123'].cursor++;
    rootScope.$broadcast("viewState.changeHistory", { historyId: 'h123' });
    rootScope.$apply();
    expect($state.current.name).toEqual('about');
  }));

  it('should update document title', inject(function($document) {
    $document[0].title = 'Original Title';

    rootScope.$broadcast("viewState.viewEnter");
    expect($document[0].title).toEqual('Original Title');

    rootScope.$broadcast("viewState.viewEnter", {});
    expect($document[0].title).toEqual('Original Title');

    rootScope.$broadcast("viewState.viewEnter", { title: 'New Title' });
    expect($document[0].title).toEqual('New Title');
  }));

});
