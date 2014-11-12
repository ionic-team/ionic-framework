describe('Ionic View Switcher', function() {
  var ionicViewSwitcher;

  beforeEach(module('ionic'));

  beforeEach(inject(function($ionicConfig){
    $ionicConfig.views.transition('platform');
  }));

  it('should get fallback transition', inject(function($ionicViewSwitcher) {
    var d = $ionicViewSwitcher.getTransitionData();
    expect(d.transition).toEqual('ios');
  }));

  it('should get transition from $ionicConfig.views.transition()', inject(function($ionicViewSwitcher, $ionicConfig) {
    $ionicConfig.views.transition('mambo-5');
    var d = $ionicViewSwitcher.getTransitionData();
    expect(d.transition).toEqual('mambo-5');
  }));

  it('should get transition from $state', inject(function($ionicViewSwitcher) {
    var viewLocals = {
      $$state: {
        self: {
          viewTransition: 'who-let-the-dogs-out'
        }
      }
    };

    var d = $ionicViewSwitcher.getTransitionData(viewLocals);
    expect(d.transition).toEqual('who-let-the-dogs-out');
  }));

  it('should get transition from entering element attribute', inject(function($ionicViewSwitcher) {
    var enteringEle = angular.element('<div view-transition="hey-yo">');
    var d = $ionicViewSwitcher.getTransitionData(null, enteringEle);
    expect(d.transition).toEqual('hey-yo');
  }));

  it('should get transition from $ionicViewSwitcher.nextTransition()', inject(function($ionicViewSwitcher) {
    $ionicViewSwitcher.nextTransition('first-you-drag-and-then-you-drop');
    var d = $ionicViewSwitcher.getTransitionData();
    expect(d.transition).toEqual('first-you-drag-and-then-you-drop');
  }));


  it('should get fallback direction', inject(function($ionicViewSwitcher) {
    var d = $ionicViewSwitcher.getTransitionData();
    expect(d.direction).toEqual('none');
  }));

  it('should get direction from direction', inject(function($ionicViewSwitcher) {
    var d = $ionicViewSwitcher.getTransitionData(null, null, 'back');
    expect(d.direction).toEqual('back');
  }));

  it('should get direction from $state', inject(function($ionicViewSwitcher) {
    var viewLocals = {
      $$state: {
        self: {
          viewDirection: 'exit'
        }
      }
    };

    var d = $ionicViewSwitcher.getTransitionData(viewLocals);
    expect(d.direction).toEqual('exit');
  }));

  it('should get direction from entering element attribute', inject(function($ionicViewSwitcher) {
    var enteringEle = angular.element('<div view-direction="back">');
    var d = $ionicViewSwitcher.getTransitionData(null, enteringEle);
    expect(d.direction).toEqual('back');
  }));

  it('should get direction from $ionicViewSwitcher.nextDirection()', inject(function($ionicViewSwitcher) {
    $ionicViewSwitcher.nextDirection('forward');
    var d = $ionicViewSwitcher.getTransitionData();
    expect(d.direction).toEqual('forward');
  }));

  it('should set showBack when the view data sets it', inject(function($ionicViewSwitcher) {
    var d = $ionicViewSwitcher.getTransitionData(null, null, null, null, true);
    expect(d.showBack).toEqual(true);

    d = $ionicViewSwitcher.getTransitionData(null, null, null, null, false);
    expect(d.showBack).toEqual(false);

    d = $ionicViewSwitcher.getTransitionData(null, null, null, null, null);
    expect(d.showBack).toEqual(false);
  }));

  it('should override showBack from view data w/ $ionicViewSwitcher.nextShowBack() setting', inject(function($ionicViewSwitcher) {
    $ionicViewSwitcher.nextShowBack(true);
    var d = $ionicViewSwitcher.getTransitionData(null, null, null, null, true);
    expect(d.showBack).toEqual(true);

    $ionicViewSwitcher.nextShowBack(false);
    var d = $ionicViewSwitcher.getTransitionData(null, null, null, null, true);
    expect(d.showBack).toEqual(false);

    $ionicViewSwitcher.nextShowBack(true);
    d = $ionicViewSwitcher.getTransitionData(null, null, null, null, false);
    expect(d.showBack).toEqual(true);

    $ionicViewSwitcher.nextShowBack(false);
    d = $ionicViewSwitcher.getTransitionData(null, null, null, null, false);
    expect(d.showBack).toEqual(false);

    $ionicViewSwitcher.nextShowBack(true);
    d = $ionicViewSwitcher.getTransitionData(null, null, null, null, null);
    expect(d.showBack).toEqual(true);

    $ionicViewSwitcher.nextShowBack(false);
    d = $ionicViewSwitcher.getTransitionData(null, null, null, null, null);
    expect(d.showBack).toEqual(false);

    $ionicViewSwitcher.nextShowBack(null);
    d = $ionicViewSwitcher.getTransitionData(null, null, null, null, true);
    expect(d.showBack).toEqual(true);
  }));

  it('should get an empty entering element with an empty navViewElement', inject(function($ionicViewSwitcher) {
    var navViewElement = angular.element('<div class="view-container">');
    var switcher = $ionicViewSwitcher.create(null, navViewElement, {}, {});
    switcher.loadViewElements();
    expect(switcher.enteringEle().length).toBe(1);
  }));

  it('should not get a leaving element with an empty navViewElement', inject(function($ionicViewSwitcher) {
    var navViewElement = angular.element('<div class="view-container">');
    var switcher = $ionicViewSwitcher.create(null, navViewElement, {}, {});
    switcher.loadViewElements();
    expect(switcher.leavingEle()).toBeUndefined();
  }));

  it('should create a new entering element from locals template navViewElement', inject(function($ionicViewSwitcher) {
    var navViewElement = angular.element('<div class="view-container">');
    var viewLocals = {
      $template: '<div class="locals-template"></div>'
    };
    var enteringView = {
      stateId: 'STATE_ID'
    };
    var switcher = $ionicViewSwitcher.create(null, navViewElement, viewLocals, enteringView);
    switcher.loadViewElements();
    expect(switcher.enteringEle().hasClass('locals-template')).toBe(true);
    expect(switcher.enteringEle().data('$eleId')).toBe('STATE_ID');
  }));

  it('should create a new entering element and set no cache data from view locals', inject(function($rootScope, $ionicViewSwitcher) {
    var navViewElement = angular.element('<div class="view-container">');
    var viewLocals = {
      $template: '<div class="locals-template"></div>',
      $$state: {
        self: {
          cache: false
        }
      }
    };
    var enteringView = {
      stateId: 'STATE_ID'
    };
    var switcher = $ionicViewSwitcher.create($rootScope, navViewElement, viewLocals, enteringView);
    switcher.loadViewElements();
    switcher.render({});
    expect(switcher.enteringEle().data('$noCache')).toBe(true);
  }));

  it('should create a new entering element and set no cache data from cache-view=false attr', inject(function($rootScope, $ionicViewSwitcher) {
    var navViewElement = angular.element('<div class="view-container">');
    var viewLocals = {
      $template: '<div class="locals-template" cache-view="false"></div>'
    };
    var enteringView = {
      stateId: 'STATE_ID'
    };
    var switcher = $ionicViewSwitcher.create($rootScope, navViewElement, viewLocals, enteringView);
    switcher.loadViewElements();
    switcher.render({});
    expect(switcher.enteringEle().data('$noCache')).toBe(true);
  }));

  it('should get an existing entering element within navViewElement by state id', inject(function($ionicViewSwitcher) {
    var navViewElement = angular.element('<div class="view-container">');
    var enteringEle = angular.element('<div class="existing">');
    enteringEle.data('$eleId', 'STATE_ID');
    navViewElement.append(enteringEle);

    var enteringView = {
      stateId: 'STATE_ID',
      viewId: 'VIEW_ID'
    };
    var switcher = $ionicViewSwitcher.create(null, navViewElement, {}, enteringView);
    switcher.loadViewElements();
    expect(switcher.enteringEle().hasClass('existing')).toBe(true);
    expect(switcher.enteringEle().data('$eleId')).toBe('STATE_ID');
  }));

  it('should get an existing entering element within navViewElement by view id', inject(function($ionicViewSwitcher) {
    var navViewElement = angular.element('<div class="view-container">');
    var enteringEle = angular.element('<div class="existing">');
    enteringEle.data('$eleId', 'VIEW_ID');
    navViewElement.append(enteringEle);

    var enteringView = {
      viewId: 'VIEW_ID'
    };
    var switcher = $ionicViewSwitcher.create(null, navViewElement, {}, enteringView);
    switcher.loadViewElements();
    expect(switcher.enteringEle().hasClass('existing')).toBe(true);
    expect(switcher.enteringEle().data('$eleId')).toBe('VIEW_ID');
  }));

  it('should get an existing entering element within navViewElement by abstract state name', inject(function($ionicViewSwitcher) {
    var navViewElement = angular.element('<div class="view-container">');
    var enteringEle = angular.element('<div class="existing">');
    enteringEle.data('$eleId', 'ABSTRACT_STATE');
    navViewElement.append(enteringEle);

    var viewLocals = {
      $$state: {
        self: {
          abstract: true,
          name: 'ABSTRACT_STATE'
        }
      }
    };
    var enteringView = {
      stateId: 'STATE_ID',
      viewId: 'VIEW_ID'
    };
    var switcher = $ionicViewSwitcher.create(null, navViewElement, viewLocals, enteringView);
    switcher.loadViewElements();
    expect(switcher.enteringEle().hasClass('existing')).toBe(true);
    expect(switcher.enteringEle().data('$eleId')).toBe('ABSTRACT_STATE');
  }));

  it('should append the new entering element to the navViewElement', inject(function($ionicViewSwitcher, $rootScope) {
    var navViewElement = angular.element('<div class="view-container">');

    var switcher = $ionicViewSwitcher.create($rootScope, navViewElement, {});
    switcher.loadViewElements();
    switcher.render(function(){});
    expect(switcher.enteringEle().length).toBe(1);
    expect(switcher.enteringEle().attr('nav-view')).toBe('stage');
    expect(switcher.enteringEle().parent().hasClass('view-container')).toBe(true);
    expect(switcher.enteringEle().data('$accessed')).toBeDefined();
  }));

});
