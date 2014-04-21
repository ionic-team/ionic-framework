describe('',function(){

describe('$ionicList controller', function() {
  beforeEach(module('ionic'));
  function setup(attrs) {
    var ctrl;
    inject(function($controller, $rootScope) {
      var scope = $rootScope.$new();
      ctrl = $controller('$ionicList', {
        $scope: scope,
        $attrs: attrs || {},
      });
      ctrl.$scope = scope;
    });
    return ctrl;
  }

  it('should register with handle', inject(function($ionicListDelegate) {
    spyOn($ionicListDelegate, '_registerInstance');
    var ctrl = setup({delegateHandle: 'foobar'});
    expect($ionicListDelegate._registerInstance)
      .toHaveBeenCalledWith(ctrl, 'foobar');
  }));

  it('should register with given handle and deregister on destroy', inject(function($ionicListDelegate) {
    var deregisterSpy = jasmine.createSpy('deregister');
    spyOn($ionicListDelegate, '_registerInstance').andCallFake(function() {
      return deregisterSpy;
    });
    var ctrl = setup({
      delegateHandle: 'something'
    });
    expect($ionicListDelegate._registerInstance)
      .toHaveBeenCalledWith(ctrl, 'something');

    expect(deregisterSpy).not.toHaveBeenCalled();
    ctrl.$scope.$destroy();
    expect(deregisterSpy).toHaveBeenCalled();
  }));

  it('.showReorder sets/gets', function() {
    var ctrl = setup();
    expect(ctrl.showReorder()).toBe(false);
    ctrl.showReorder(true);
    expect(ctrl.showReorder()).toBe(true);
  });

  it('.showDelete sets/gets', function() {
    var ctrl = setup();
    expect(ctrl.showDelete()).toBe(false);
    ctrl.showDelete(true);
    expect(ctrl.showDelete()).toBe(true);
  });

  it('.canSwipeItems sets/gets', function() {
    var ctrl = setup();
    expect(ctrl.canSwipeItems()).toBe(true);
    ctrl.canSwipeItems(false);
    expect(ctrl.canSwipeItems()).toBe(false);
  });

  it('.closeOptionButtons closes calls clearDragEffects', function() {
    var ctrl = setup();
    ctrl.listView = { clearDragEffects: jasmine.createSpy('clearDragEffects') };
    ctrl.closeOptionButtons();
    expect(ctrl.listView.clearDragEffects).toHaveBeenCalled();
  });
});

describe('ionList directive', function() {
  beforeEach(module('ionic'));

  function setup(attrs, content) {
    var el;
    inject(function($compile, $rootScope) {
      var scope = $rootScope.$new();
      el = angular.element('<ion-list '+(attrs||'')+'>'+(content||'')+'</ion-list>');
      el.data('$$ionicScrollController', {
        scrollView: {},
        element: angular.element('<div>')
      });
      $compile(el)(scope);
      scope.$apply();
    });
    return el;
  }
  function flush() {
    inject(function($timeout) { $timeout.flush(); });
  }

  it('should put contents in a list wrapper', function() {
    var el = setup('', '<hello></hello>');
    expect(el.children().hasClass('list')).toBe(true);
    expect(el.children().html()).toBe('<hello></hello>');
  });

  it('should give options to listView after init', function() {
    var options;
    spyOn(ionic.views, 'ListView').andCallFake(function(o) {
      options = o;
    });
    var el = setup();
    flush();
    expect(ionic.views.ListView).toHaveBeenCalled();
    expect(options.el).toBe(el[0]);
    expect(options.listEl).toBe(el.children()[0]);
    expect(options.scrollEl).toBe(el.controller('$ionicScroll').element);
    expect(options.scrollView).toBe(el.controller('$ionicScroll').scrollView);

    spyOn(el.controller('ionList'), 'canSwipeItems').andReturn('swipey');
    expect(options.canSwipe()).toBe('swipey');

    el.scope().$onReorder = jasmine.createSpy('$onReorder');
    options.onReorder(el, 2, 3);
    expect(el.scope().$onReorder).toHaveBeenCalledWith(2,3);
  });

  it('should watch attr.canSwipe if given', function() {
    var el = setup('can-swipe="shouldSwipe"');
    flush();
    expect(el.controller('ionList').canSwipeItems()).toBe(false);
    el.scope().$apply('shouldSwipe = true');
    expect(el.controller('ionList').canSwipeItems()).toBe(true);
    el.scope().$apply('shouldSwipe = false');
    expect(el.controller('ionList').canSwipeItems()).toBe(false);
  });

  it('should watch attr.showDelete if given', function() {
    var el = setup('show-delete="shouldDelete"');
    flush();
    expect(el.controller('ionList').showDelete()).toBe(false);
    el.scope().$apply('shouldDelete = true');
    expect(el.controller('ionList').showDelete()).toBe(true);
    el.scope().$apply('shouldDelete = false');
    expect(el.controller('ionList').showDelete()).toBe(false);
  });

  it('should watch attr.showReorder if given', function() {
    var el = setup('show-reorder="shouldReorder"');
    flush();
    expect(el.controller('ionList').showReorder()).toBe(false);
    el.scope().$apply('shouldReorder = true');
    expect(el.controller('ionList').showReorder()).toBe(true);
    el.scope().$apply('shouldReorder = false');
    expect(el.controller('ionList').showReorder()).toBe(false);
  });

  it('should watch ctrl.showDelete when true', inject(function($animate) {
    var el = setup('', '<div class="item-delete item-left-edit ng-hide"></div><div></div>');
    flush();

    spyOn(el.controller('ionList'), 'closeOptionButtons');

    el.controller('ionList').showDelete(true);
    el.scope().$apply();

    expect(el.controller('ionList').closeOptionButtons).toHaveBeenCalled();
    var deleteButtons = angular.element(el[0].querySelectorAll('.item-delete.item-left-edit'));
    expect(deleteButtons.length).not.toBe(0);
    expect(deleteButtons.hasClass('ng-hide')).toBe(false);
    expect(el.children().hasClass('list-left-editing')).toBe(true);
  }));

  it('should watch ctrl.showDelete when false from true', inject(function($animate) {
    var el = setup('', '<div class="item-delete item-left-edit"></div><div></div>');
    flush();

    spyOn(el.controller('ionList'), 'closeOptionButtons');

    el.controller('ionList').showDelete(true);
    el.scope().$apply();
    el.controller('ionList').showDelete(false);
    el.scope().$apply();

    expect(el.controller('ionList').closeOptionButtons.callCount).toBe(1);
    var deleteButtons = angular.element(el[0].querySelectorAll('.item-delete.item-left-edit'));
    expect(deleteButtons.hasClass('ng-hide')).toBe(true);
    expect(deleteButtons.length).not.toBe(0);
    expect(el.children().hasClass('list-left-editing')).toBe(false);
  }));

  it('should watch ctrl.showReorder when true', inject(function($animate) {
    var el = setup('show-reorder="shouldReorder"', '<div class="item-reorder item-right-edit ng-hide"></div><div></div>');
    flush();

    spyOn(el.controller('ionList'), 'closeOptionButtons');

    el.controller('ionList').showReorder(true);
    el.scope().$apply();

    expect(el.controller('ionList').closeOptionButtons).toHaveBeenCalled();
    var reorderButtons = angular.element(el[0].querySelectorAll('.item-reorder.item-right-edit'));
    expect(reorderButtons.length).not.toBe(0);
    expect(reorderButtons.hasClass('ng-hide')).toBe(false);
    expect(el.children().hasClass('list-right-editing')).toBe(true);
  }));

  it('should watch ctrl.showReorder when false from true', inject(function($animate) {
    var el = setup('show-reorder="shouldReorder"', '<div class="item-reorder item-right-edit"></div><div></div>');
    flush();

    spyOn(el.controller('ionList'), 'closeOptionButtons');

    el.controller('ionList').showReorder(true);
    el.scope().$apply();
    el.controller('ionList').showReorder(false);
    el.scope().$apply();

    expect(el.controller('ionList').closeOptionButtons.callCount).toBe(1);
    var reorderButtons = angular.element(el[0].querySelectorAll('.item-reorder.item-right-edit'));
    expect(reorderButtons.length).not.toBe(0);
    expect(reorderButtons.hasClass('ng-hide')).toBe(true);
    expect(el.children().hasClass('list-right-editing')).toBe(false);
  }));
});

describe('ionItem directive', function() {
  beforeEach(module('ionic'));
  function setup(attrs, content) {
    var el;
    inject(function($rootScope, $compile) {
      el = angular.element('<ion-item '+(attrs||'')+'>').html(content || '');
      el.data('$ionListController', {});
      $compile(el)($rootScope);
      $rootScope.$apply();
    });
    return el;
  }

  it('should be simple item by default', function() {
    var el = setup('', '{{1}} <b>2</b>');
    expect(el.html()).toBe('1 <b>2</b>');
    expect(el.hasClass('item')).toBe(true);
    expect(el.hasClass('item-complex')).toBe(false);
  });
  ['href', 'ng-href'].forEach(function(attr) {
    it('should be complex anchor if '+attr+' is defined', function() {
      var el = setup(attr+'="something"');
      expect(el.hasClass('item item-complex')).toBe(true);
      expect(el.children()[0].tagName).toBe('A');
      expect(el.children().hasClass('item-content')).toBe(true);
      expect(el.children().attr('ng-href')).toBe('something');
    });
  });
  ['ion-option-button','ion-reorder-button','ion-delete-button'].forEach(function(tag) {
    it('should be complex div if '+tag+' is found', function() {
      var el = setup('', tag);
      expect(el.hasClass('item item-complex')).toBe(true);
      expect(el.children()[0].tagName).toBe('DIV');
      expect(el.children().hasClass('item-content')).toBe(true);
      expect(el.children().html()).toBe(tag);
    });
  });
});

describe('ionDeleteButton directive', function() {
  beforeEach(module('ionic'));
  it('should have delete button', inject(function($compile, $rootScope) {
    var setSpy = jasmine.createSpy('setDeleteButton');
    var el = angular.element('<ion-item><ion-delete-button></ion-delete-button></ion-item>');
    el.data('$ionListController', {
      showDelete: function() { return false; }
    });
    $compile(el)($rootScope.$new());
    $rootScope.$apply();

    var deleteContainer = angular.element(el[0].querySelector('.item-left-edit.item-delete.ng-hide'));
    expect(deleteContainer.length).toBe(1);
    expect(deleteContainer.children().hasClass('button icon button-icon')).toBe(true);
  }));
  it('should unhide if delete is shown', inject(function($compile, $rootScope) {
    var setSpy = jasmine.createSpy('setDeleteButton');
    var el = angular.element('<ion-item><ion-delete-button></ion-delete-button></ion-item>');
    el.data('$ionListController', {
      showDelete: function() { return true; }
    });
    $compile(el)($rootScope.$new());
    $rootScope.$apply();

    var deleteContainer = angular.element(el[0].querySelector('.item-left-edit.item-delete'));
    expect(deleteContainer.length).toBe(1);
    expect(deleteContainer.hasClass('ng-hide')).toBe(false);
  }));
});

describe('ionReorderButton directive', function() {
  beforeEach(module('ionic'));
  it('should have reorder button', inject(function($compile, $rootScope) {
    var setSpy = jasmine.createSpy('setReorderButton');
    var el = angular.element('<ion-item><ion-reorder-button></ion-reorder-button></ion-item>');
    el.data('$ionListController', {
      showReorder: function() { return false; }
    });
    $compile(el)($rootScope.$new());
    $rootScope.$apply();

    var reorderContainer = angular.element(el[0].querySelector('.item-right-edit.item-reorder.ng-hide'));
    expect(reorderContainer.length).toBe(1);
    expect(reorderContainer.children().hasClass('button icon button-icon')).toBe(true);
    expect(reorderContainer.attr('data-prevent-scroll')).toBe('true');
    expect(reorderContainer.children().attr('data-prevent-scroll')).toBe('true');
  }));
  it('should remove ng-hide if reorder is already active', inject(function($compile, $rootScope) {
    var setSpy = jasmine.createSpy('setReorderButton');
    var el = angular.element('<ion-item><ion-reorder-button></ion-reorder-button></ion-item>');
    el.data('$ionListController', {
      showReorder: function() { return true; }
    });
    $compile(el)($rootScope.$new());
    $rootScope.$apply();
    var reorderContainer = angular.element(el[0].querySelector('.item-right-edit.item-reorder'));
    expect(reorderContainer.length).toBe(1);
    expect(reorderContainer.hasClass('ng-hide')).toBe(false);
  }));
});

describe('ionOptionButton directive', function() {
  beforeEach(module('ionic'));
  it('should have option button', inject(function($compile, $rootScope) {
    var setSpy = jasmine.createSpy('setOptionButton');
    var el = angular.element('<ion-item><ion-option-button></ion-option-button></ion-item>');
    el.data('$ionListController', {
      showDelete: function() { return false; }
    });
    $compile(el)($rootScope.$new());
    $rootScope.$apply();

    var optionContainer = angular.element(el[0].querySelector('.item-options'));
    expect(optionContainer.length).toBe(1);
    expect(optionContainer.children().hasClass('button')).toBe(true);
  }));
});

});
