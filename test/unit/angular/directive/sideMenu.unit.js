/**
 * Test the side menu directive. For more test coverage of the side menu,
 * see the core Ionic sideMenu controller tests.
 */
describe('Ionic Angular Side Menu', function() {
  var el;

  beforeEach(module('ionic'));

  it('should register with $ionicSideMenuDelegate', inject(function($compile, $rootScope, $ionicSideMenuDelegate) {
    var deregisterSpy = jasmine.createSpy('deregister');
    spyOn($ionicSideMenuDelegate, '_registerInstance').andCallFake(function() {
      return deregisterSpy;
    });
    var el = $compile('<ion-side-menus delegate-handle="superHandle">')($rootScope.$new());
    $rootScope.$apply();

    expect(el.controller('ionSideMenus')).toBeDefined();
    expect($ionicSideMenuDelegate._registerInstance)
      .toHaveBeenCalledWith(el.controller('ionSideMenus'), 'superHandle', jasmine.any(Function));

    expect(deregisterSpy).not.toHaveBeenCalled();
    el.scope().$destroy();
    expect(deregisterSpy).toHaveBeenCalled();
  }));

  it('should set $exposeAside.active', inject(function($compile, $rootScope) {
    var el = $compile('<ion-side-menus><ion-side-menu></><ion-side-menu-content></ion-side-menu-content></ion-side-menus>')($rootScope.$new());
    $rootScope.$apply();
    var sideMenuController = el.controller('ionSideMenus');
    expect(sideMenuController.isAsideExposed()).toBe(false);
    expect(el.scope().$exposeAside).toBeUndefined();

    sideMenuController.exposeAside(true);
    expect(el.scope().$exposeAside.active).toEqual(true);
    expect(sideMenuController.isAsideExposed()).toBe(true);

    sideMenuController.exposeAside(false);
    expect(el.scope().$exposeAside.active).toEqual(false);
    expect(sideMenuController.isAsideExposed()).toBe(false);
  }));

  it('should add/remove "aside-resizing" from the body tag when using activeAsideResizing', inject(function($compile, $rootScope, $document) {
    var el = $compile('<ion-side-menus><ion-side-menu></><ion-side-menu-content></ion-side-menu-content></ion-side-menus>')($rootScope.$new());
    $rootScope.$apply();
    var sideMenuController = el.controller('ionSideMenus');

    expect($document[0].body.classList.contains('aside-resizing')).toEqual(false);
    sideMenuController.activeAsideResizing(true);
    expect($document[0].body.classList.contains('aside-resizing')).toEqual(true);
    sideMenuController.activeAsideResizing(false);
    expect($document[0].body.classList.contains('aside-resizing')).toEqual(false);
  }));

  it('should emit $ionicexposeAside', inject(function($compile, $rootScope) {
    var el = $compile('<ion-side-menus><ion-side-menu></><ion-side-menu-content></ion-side-menu-content></ion-side-menus>')($rootScope.$new());
    $rootScope.$apply();
    var sideMenuController = el.controller('ionSideMenus');

    spyOn(el.scope(), "$emit")
    sideMenuController.exposeAside(true);
    expect(el.scope().$emit).toHaveBeenCalledWith("$ionicExposeAside", true);

    sideMenuController.exposeAside(false);
    expect(el.scope().$emit).toHaveBeenCalledWith("$ionicExposeAside", false);
  }));

  it('should set exposed menu', inject(function($compile, $rootScope) {
    ionic.animationFrameThrottle = function(cb) { return cb; };
    var el = $compile('<ion-side-menus><ion-side-menu></><ion-side-menu-content></ion-side-menu-content></ion-side-menus>')($rootScope.$new());
    $rootScope.$apply();
    var sideMenuController = el.controller('ionSideMenus');
    var content = sideMenuController.content;
    expect(content.offsetX).toEqual(0);
    expect(content.getTranslateX()).toEqual(0);
    expect(content.element.style.width).toEqual('');
    sideMenuController.exposeAside(true);
    expect(content.offsetX).toEqual(275);
    expect(content.getTranslateX()).toEqual(0);
    expect(content.element.getAttribute('style')).toMatch(/translate3d\(275px, 0(px)?, 0(px)?/);
    expect(content.element.style.width).toNotEqual('');
    sideMenuController.exposeAside(false);
    expect(content.element.getAttribute('style')).toMatch(/translate3d\(0(px)?, 0(px)?, 0(px)?/);
    expect(content.getTranslateX()).toEqual(0);
    expect(content.offsetX).toEqual(0);
    expect(content.element.style.width).toEqual('');
  }));

  it('should canDragContent', inject(function($compile, $rootScope) {
    var el = $compile('<ion-side-menus><div ion-side-menu-content></div></ion-side-menus>')($rootScope.$new());
    $rootScope.$apply();
    expect(el.controller('ionSideMenus').canDragContent()).toBe(true);
    expect(el.scope().dragContent).toBe(true);

    el.controller('ionSideMenus').canDragContent(false);
    expect(el.controller('ionSideMenus').canDragContent()).toBe(false);
    expect(el.scope().dragContent).toBe(false);

    el.controller('ionSideMenus').canDragContent(true);
    expect(el.controller('ionSideMenus').canDragContent()).toBe(true);
    expect(el.scope().dragContent).toBe(true);
  }));

  it('should isDraggableTarget', inject(function($compile, $rootScope) {
    var el = $compile('<ion-side-menus><ion-side-menu-content></ion-side-menu-content></ion-side-menus>')($rootScope.$new());
    $rootScope.$apply();

    expect(el.controller('ionSideMenus').canDragContent()).toBe(true);

    var e = {
      gesture: {
        srcEvent: {
          defaultPrevented: false
        }
      },
      target: {
        tagName: 'DIV',
        dataset: {
          preventScroll: false
        }
      }
    };

    var ctrl = el.controller('ionSideMenus');
    expect(ctrl.isDraggableTarget(e)).toBe(true);

    el.controller('ionSideMenus').canDragContent(false);
    expect(ctrl.isDraggableTarget(e)).toBe(false);
    el.controller('ionSideMenus').canDragContent(true);

    e.gesture.srcEvent.defaultPrevented = true;
    expect(ctrl.isDraggableTarget(e)).toBe(false);
    e.gesture.srcEvent.defaultPrevented = false;

    e.target.tagName = 'INPUT';
    expect(ctrl.isDraggableTarget(e)).toBe(false);

    e.target.tagName = 'TEXTAREA';
    expect(ctrl.isDraggableTarget(e)).toBe(false);

    e.target.tagName = 'SELECT';
    expect(ctrl.isDraggableTarget(e)).toBe(false);

    e.target.tagName = 'OBJECT';
    expect(ctrl.isDraggableTarget(e)).toBe(false);

    e.target.tagName = 'EMBED';
    expect(ctrl.isDraggableTarget(e)).toBe(false);

    e.target.tagName = 'DIV';
    expect(ctrl.isDraggableTarget(e)).toBe(true);

    e.target.isContentEditable = true;
    expect(ctrl.isDraggableTarget(e)).toBe(false);
    e.target.isContentEditable = false;

    e.target.dataset.preventScroll = true;
    expect(ctrl.isDraggableTarget(e)).toBe(false);
    e.target.isContentEditable = false;

    e.target.dataset = undefined;
    e.target.getAttribute = function(val){
      return (val == 'data-prevent-scroll' ? 'true' : undefined);
    };
    expect(ctrl.isDraggableTarget(e)).toBe(false);

    e.target.getAttribute = function(){
      return null;
    };
    expect(ctrl.isDraggableTarget(e)).toBe(true);

  }));

  it('should isDraggableTarget w/ enableMenuWithBackViews', inject(function($compile, $rootScope, $ionicHistory) {
    var el = $compile('<ion-side-menus><ion-side-menu-content></ion-side-menu-content></ion-side-menus>')($rootScope.$new());
    $rootScope.$apply();

    var ctrl = el.controller('ionSideMenus');

    var e = {
      gesture: {
        srcEvent: {
          defaultPrevented: false
        }
      },
      target: {
        tagName: 'DIV',
        dataset: {
          preventScroll: false
        }
      }
    };

    ctrl.enableMenuWithBackViews(true);
    expect(ctrl.isDraggableTarget(e)).toBe(true);

    ctrl.enableMenuWithBackViews(false);
    expect(ctrl.isDraggableTarget(e)).toBe(true);

    ctrl.enableMenuWithBackViews(false);
    $ionicHistory.currentView({historyId: 'root'});
    $ionicHistory.backView({historyId: 'root'});
    expect(ctrl.isDraggableTarget(e)).toBe(false);

    ctrl.enableMenuWithBackViews(false);
    $ionicHistory.currentView({historyId: 'root'});
    $ionicHistory.backView(null);
    expect(ctrl.isDraggableTarget(e)).toBe(true);

    ctrl.enableMenuWithBackViews(true);
    $ionicHistory.currentView({historyId: 'root'});
    $ionicHistory.backView({historyId: 'root'});
    expect(ctrl.isDraggableTarget(e)).toBe(true);

    ctrl.enableMenuWithBackViews(false);
    $ionicHistory.currentView({historyId: '003'});
    $ionicHistory.backView({historyId: 'root'});
    expect(ctrl.isDraggableTarget(e)).toBe(true);

  }));

});

describe('Ionic Side Menu Content Directive', function () {
  var $compile, element, scope, sideMenusCtrl;

  beforeEach(module('ionic'));

  beforeEach(inject(function (_$compile_, _$rootScope_) {
    $compile = _$compile_;
    scope = _$rootScope_;

    var sideMenus = $compile('<ion-side-menus>')(scope).appendTo('body');

    sideMenuCtrl = sideMenus.controller('sideMenus');
    spyOn(sideMenuCtrl, '_handleDrag');

    element = angular.element('<div ion-side-menu-content>').appendTo(sideMenus);

    $compile(element)(scope);
    scope.$digest();
  }));
});

describe('Ionic Side Menu Directive', function () {
  var element, scope, sideMenuCtrl;

  beforeEach(module('ionic'));

  beforeEach(inject(function (_$compile_, _$rootScope_) {
    var $compile = _$compile_;
    var $rootScope = _$rootScope_.$new();

    $rootScope.widthVal = 250;
    $rootScope.enabledVal = true;

    var sideMenus = $compile('<ion-side-menus>')($rootScope);

    sideMenuCtrl = sideMenus.controller('ionSideMenus');

    element = angular.element(
      '<ion-side-menu side="left" is-enabled="enabledVal" width="widthVal">' +
        '<div class="content"></div>' +
      '</div>'
    ).appendTo(sideMenus);
    $compile(element)($rootScope);

    scope = element.scope();
    scope.$digest();
  }));

  it('Should set attributes on the controller', function () {
    expect(sideMenuCtrl.left.isEnabled).not.toBe(undefined);
    expect(sideMenuCtrl.left.pushDown).not.toBe(undefined);
    expect(sideMenuCtrl.left.bringUp).not.toBe(undefined);
  });

  it('should transclude content with same scope', function() {
    var content = angular.element(element[0].querySelector('.content'));
    expect(content.length).toBe(1);
    expect(content.scope()).toBe(scope);
  });

  it('should watch isEnabled', function() {
    expect(sideMenuCtrl.left.isEnabled).toBe(true);
    scope.$apply('enabledVal = false');
    expect(sideMenuCtrl.left.isEnabled).toBe(false);
  });

  it('should watch width', function() {
    expect(sideMenuCtrl.left.width).toBe(250);
    expect(sideMenuCtrl.left.el.style.width).toBe('250px');
    scope.$apply('widthVal = 222');
    expect(sideMenuCtrl.left.width).toBe(222);
    expect(sideMenuCtrl.left.el.style.width).toBe('222px');
  });
});

describe('menuToggle directive', function() {
  beforeEach(module('ionic'));
  var toggleLeftSpy, toggleRightSpy, toggleSpy;
  function setup(side) {
    var el = angular.element('<div menu-toggle="' + (side||'') + '">');
    toggleLeftSpy = jasmine.createSpy('toggleLeft');
    toggleRightSpy = jasmine.createSpy('toggleRight');
    toggleSpy = jasmine.createSpy('toggle');
    el.data('$ionSideMenusController', {
      toggleLeft: toggleLeftSpy,
      toggleRight: toggleRightSpy,
      toggle: toggleSpy
    });
    inject(function($compile, $rootScope) {
      $compile(el)($rootScope.$new());
      $rootScope.$apply();
    });
    return el;
  }
  it('should toggle left on click by default', function() {
    var el = setup();
    expect(toggleSpy).not.toHaveBeenCalled();
    el.triggerHandler('click');
    expect(toggleSpy).toHaveBeenCalled();
  });
  it('should toggle left on click with attr', function() {
    var el = setup('left');
    expect(toggleSpy).not.toHaveBeenCalled();
    el.triggerHandler('click');
    expect(toggleSpy).toHaveBeenCalled();
  });
  it('should toggle right on click with attr', function() {
    var el = setup('right');
    expect(toggleSpy).not.toHaveBeenCalled();
    el.triggerHandler('click');
    expect(toggleSpy).toHaveBeenCalled();
  });
});

describe('menuClose directive', function() {
  beforeEach(module('ionic'));
  it('should close on click', inject(function($compile, $rootScope) {
    var el = angular.element('<div menu-close>');
    var closeSpy = jasmine.createSpy('sideMenuClose');
    el.data('$ionSideMenusController', {
      close: closeSpy
    });
    $compile(el)($rootScope.$new());
    $rootScope.$apply();
    expect(closeSpy).not.toHaveBeenCalled();
    el.triggerHandler('click');
    expect(closeSpy).toHaveBeenCalled();
  }));
});
