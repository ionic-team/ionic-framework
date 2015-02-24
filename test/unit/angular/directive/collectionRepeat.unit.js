describe('collectionRepeat', function() {

  var el;
  beforeEach(module('ionic', function($provide) {
    $provide.decorator('$$rAF', function($delegate) {
      return function mockRaf(callback) { callback(); };
    });
    spyOn(ionic, 'animationFrameThrottle').andCallFake(function(cb) {
      return function fakeThrottled() {
        cb.apply(this, arguments);
      };
    });
  }));

  var scrollView;
  function setup(listData, attrs, scrollViewData) {
    var content = angular.element('<content>')
    scrollView = angular.extend({
      __content: content[0],
      __clientHeight: 100,
      __clientWidth: 50,

      __scrollTop: 0,
      __scrollLeft: 0,
      __maxScrollTop: 100,
      __maxScrollLeft: 50,

      options: {
        scrollingY: true
      },
      __callback: function(){},
    }, scrollViewData || {});
    var scrollCtrl = {
      scrollView: scrollView,
      $element: content
    };

    var list = [];
    if (angular.isNumber(listData)) {
      for (var i = 0; i < listData; i++) list.push(i);
    } else if (angular.isArray(listData)) {
      list = listData;
    }

    var element;
    inject(function($compile, $rootScope) {
      attrs = attrs || '';
      if (!/item-height/.test(attrs)) attrs += ' item-height="25px"';
      if (!/item-render-buffer/.test(attrs)) attrs += ' item-render-buffer="0"';
      element = angular.element(
        '<div collection-repeat="item in list" '+(attrs)+'>{{item}}</div>'
      );
      content.append(element);
      content.data('$$ionicScrollController', scrollCtrl);
      $rootScope.list = list;
      $compile(element)($rootScope);
      $rootScope.$apply();
      content.triggerHandler('scroll.init');
      $rootScope.$apply();
    });
    return element;
  }

  function scrollTo(n) {
    if (scrollView.options.scrollingY) {
      scrollView.__scrollTop = n;
      scrollView.__maxScrollTop = scrollView.options.getContentHeight() - scrollView.__clientHeight;
    } else {
      scrollView.__scrollLeft = n;
      scrollView.__maxScrollLeft = scrollView.options.getContentWidth() - scrollView.__clientWidth;
    }
    scrollView.__callback();
  }

  function items() {
    return [].slice.call(scrollView.__content.querySelectorAll('[collection-repeat]'))
      .map(function(node) {
        return angular.element(node).data('$$collectionRepeatItem')
      })
      // make sure we didn't get anything that doesn't actually have the data
      .filter(function(item) {
        return !!item;
      });
  }
  function activeItems() {
    return items()
      .filter(function(item) {
        return item.isShown;
      })
      .sort(function(a, b) {
        return a.primaryPos + a.secondaryPos > b.primaryPos + b.secondaryPos ? 1 : -1;
      });
  }
  function activeItemContents() {
    return activeItems().map(function(item) {
      return item.node.innerHTML.trim();
    });
  }
  function activeItemIds() {
    return activeItems().map(function(item) {
      return item.id;
    });
  }

  it('should error with direction="xy" parent', function() {
    expect(function() {
      setup(10, '', {
        options: { scrollingX: true, scrollingY: true }
      });
    }).toThrow();
  });

  it('should error without proper collection-repeat expression', inject(function($compile, $rootScope) {
    expect(function() {
      $compile('<ion-content>' +
               '<div collection-repeat="bad"></div>' +
               '</ion-content>')($rootScope);
    }).toThrow();
  }));


  it('should destroy', inject(function($compile, $rootScope) {
    var scope = $rootScope.$new();
    var content = $compile('<ion-content>' +
             '<div collection-repeat="item in items"></div>' +
             '</ion-content>')(scope);
    $rootScope.$apply();
    content.triggerHandler('scroll.init');
    scope.$destroy();
  }));

  describe('horizontal static list', function() {
    beforeEach(function() {
      setup(10, 'item-height="100%" item-width="30"', {
        options: {
          scrollingX: true,
          scrollingY: false
        },
        __clientWidth: 80,
        __clientHeight: 25
      });
    });
    it('should show initial screen of items', function() {
      expect(activeItems().length).toBe(3);
      expect(activeItemContents()).toEqual(['0','1','2'])
    });
    it('should switch out as you scroll', function() {
      expect(activeItems().length).toBe(3);
      expect(activeItemContents()).toEqual(['0','1','2'])
      expect(activeItemIds()).toEqual(['item_0','item_1','item_2']);

      // Item 0 gets sent down to the bottom after scrolling past it
      scrollTo(31);
      expect(activeItems().length).toBe(3);
      expect(activeItemContents()).toEqual(['1','2','3'])
      expect(activeItemIds()).toEqual(['item_1','item_2','item_0']);

      // Item 1 gets sent down
      scrollTo(61);
      expect(activeItems().length).toBe(3);
      expect(activeItemContents()).toEqual(['2','3','4'])
      expect(activeItemIds()).toEqual(['item_2','item_0','item_1']);
    });
    it('should start with the same items when resizing', inject(function($window) {
      scrollTo(31);
      scrollTo(61);

      expect(activeItems().length).toBe(3);
      expect(activeItemContents()).toEqual(['2','3','4'])
      expect(activeItemIds()).toEqual(['item_2','item_0','item_1']);

      scrollView.__clientWidth = 50;
      scrollView.__clientHeight = 40;
      angular.element($window).triggerHandler('resize');

      expect(activeItems().length).toBe(2);
      expect(activeItemContents()).toEqual(['2','3'])
      expect(activeItemIds()).toEqual(['item_2','item_0']);
    }));
  });

  describe('vertical static list', function() {
    beforeEach(function() {
      setup(10);
    });

    it('should show initial screen of items', function() {
      expect(activeItems().length).toBe(5);
      expect(activeItemContents()).toEqual(['0','1','2','3','4'])
    });

    it('should switch out as you scroll', function() {
      expect(activeItems().length).toBe(5);
      expect(activeItemContents()).toEqual(['0','1','2','3','4'])
      expect(activeItemIds()).toEqual(['item_0','item_1','item_2','item_3','item_4']);

      // Item 0 gets sent down to the bottom after scrolling past it
      scrollTo(26);
      expect(activeItems().length).toBe(5);
      expect(activeItemContents()).toEqual(['1','2','3','4','5'])
      expect(activeItemIds()).toEqual(['item_1','item_2','item_3','item_4','item_0']);

      // Item 1 gets sent down
      scrollTo(51);
      expect(activeItems().length).toBe(5);
      expect(activeItemContents()).toEqual(['2','3','4','5','6'])
      expect(activeItemIds()).toEqual(['item_2','item_3','item_4','item_0','item_1']);

      // scroll to bottom incrementally
      // items are traded our until it's the first case again
      scrollTo(76);
      scrollTo(101);
      scrollTo(126);
      expect(activeItems().length).toBe(5);
      expect(activeItemContents()).toEqual(['5','6','7','8','9'])
      expect(activeItemIds()).toEqual(['item_0','item_1','item_2','item_3','item_4']);
    });

    it('should start with the same items when resizing', inject(function($window) {
      setup(10);
      scrollTo(26);
      scrollTo(51);

      expect(activeItems().length).toBe(5);
      expect(activeItemContents()).toEqual(['2','3','4','5','6'])
      expect(activeItemIds()).toEqual(['item_2','item_3','item_4','item_0','item_1']);

      scrollView.__clientWidth = 200;
      scrollView.__clientHeight = 40;
      angular.element($window).triggerHandler('resize');

      expect(activeItems().length).toBe(2);
      expect(activeItemContents()).toEqual(['2','3'])
      expect(activeItemIds()).toEqual(['item_2','item_3']);
    }));

  });

});
