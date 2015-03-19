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

  it('should provide gesture prevent_default_directions if native scrolling', function() {
    spyOn(window.ionic,'onGesture');

    var el = setup('', '<hello></hello>');
    flush();
    expect(window.ionic.onGesture).toHaveBeenCalled();
    args = window.ionic.onGesture.mostRecentCall.args;
    expect(args[3]).toEqual({});

    var el = setup('class="overflow-scroll"', '<hello></hello>');
    flush();
    var gestureOpts = {prevent_default_directions: ['left','right']};
    args = window.ionic.onGesture.mostRecentCall.args;
    expect(args[3]).toEqual(gestureOpts);
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
    expect(el.scope().$onReorder).not.toHaveBeenCalled();
    flush();
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
    var el = setup('', '<div class="item-delete item-left-edit ng-hide"></div><div></div><div class="item-content"></div></div>');
    flush();

    spyOn(el.controller('ionList'), 'closeOptionButtons');

    el.controller('ionList').showDelete(true);
    expect(el.controller('ionList').canSwipeItems()).toBe(true);
    el.scope().$apply();

    expect(el.controller('ionList').canSwipeItems()).toBe(false);
    expect(el.controller('ionList').closeOptionButtons).toHaveBeenCalled();
    var deleteButtons = angular.element(el[0].querySelectorAll('.item-delete.item-left-edit'));
    expect(deleteButtons.length).not.toBe(0);
    expect(el.children().hasClass('list-left-editing')).toBe(true);
    var content = angular.element(el[0].querySelectorAll('.item-content'));
  }));

  it('should watch ctrl.showDelete when false from true', inject(function($animate) {
    var el = setup('', '<div class="item-delete item-left-edit"></div><div></div><div class="item-content">');
    flush();

    spyOn(el.controller('ionList'), 'closeOptionButtons');

    el.controller('ionList').showDelete(true);
    el.scope().$apply();
    el.controller('ionList').showDelete(false);
    el.scope().$apply();

    expect(el.controller('ionList').canSwipeItems()).toBe(true);
    expect(el.controller('ionList').closeOptionButtons.callCount).toBe(1);
    var deleteButtons = angular.element(el[0].querySelectorAll('.item-delete.item-left-edit'));
    expect(deleteButtons.length).not.toBe(0);
    expect(el.children().hasClass('list-left-editing')).toBe(false);
    var content = angular.element(el[0].querySelectorAll('.item-content'));
  }));

  it('should watch ctrl.showReorder when true', inject(function($animate) {
    var el = setup('show-reorder="shouldReorder"', '<div class="item-reorder item-right-edit ng-hide"></div><div class="item-content"></div><div></div>');
    flush();

    spyOn(el.controller('ionList'), 'closeOptionButtons');

    el.controller('ionList').showReorder(true);
    expect(el.controller('ionList').canSwipeItems()).toBe(true);
    el.scope().$apply();

    expect(el.controller('ionList').closeOptionButtons).toHaveBeenCalled();
    expect(el.controller('ionList').canSwipeItems()).toBe(false);
    var reorderButtons = angular.element(el[0].querySelectorAll('.item-reorder.item-right-edit'));
    expect(reorderButtons.length).not.toBe(0);
    expect(el.children().hasClass('list-right-editing')).toBe(true);
    var content = angular.element(el[0].querySelectorAll('.item-content'));
  }));

  it('should watch ctrl.showReorder when false from true', inject(function($animate) {
    var el = setup('show-reorder="shouldReorder"', '<div class="item-reorder item-right-edit"></div><div></div>');
    flush();

    spyOn(el.controller('ionList'), 'closeOptionButtons');

    el.controller('ionList').showReorder(true);
    el.scope().$apply();
    el.controller('ionList').showReorder(false);
    el.scope().$apply();

    expect(el.controller('ionList').canSwipeItems()).toBe(true);
    expect(el.controller('ionList').closeOptionButtons.callCount).toBe(1);
    var reorderButtons = angular.element(el[0].querySelectorAll('.item-reorder.item-right-edit'));
    expect(reorderButtons.length).not.toBe(0);
    expect(el.children().hasClass('list-right-editing')).toBe(false);
    var content = angular.element(el[0].querySelectorAll('.item-content'));
  }));
});

