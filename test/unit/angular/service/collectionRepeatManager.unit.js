describe('collectionRepeatManager service', function() {
  beforeEach(module('ionic'));

  var afThrottle;
  beforeEach(function() {
    afThrottle = ionic.animationFrameThrottle;
    ionic.animationFrameThrottle = function(cb) {
      return function() {
        cb.apply(this, arguments);
      };
    };
  });
  afterEach(function() {
    ionic.animationFrameThrottle = afThrottle;
  });

  function setup(options, dataSourceOptions, scrollViewOptions) {
    var manager;
    inject(function($collectionDataSource, $rootScope, $compile, $collectionRepeatManager) {
      var dataSource = new $collectionDataSource(angular.extend({
        scope: $rootScope.$new(),
        transcludeParent: angular.element('<div>'),
        transcludeFn: function(scope, cb) {
          cb($compile('<div></div>')(scope));
        },
        keyExpr: 'key',
        listExpr: 'list',
        heightGetter: function() {
          return 1;
        },
        widthGetter: function() {
          return 1;
        }
      }, dataSourceOptions || {}));

      var el = angular.element('<div scroll-container>')
        .append(angular.element('<div scroll-content>'));
      options = angular.extend({
        dataSource: dataSource,
        element: el,
        scrollView: new ionic.views.Scroll(angular.extend({
          el: el[0]
        }, scrollViewOptions || {})),
      }, options || {});
      manager = new $collectionRepeatManager(options);
    });
    return manager;
  }

  it('should have properties', function() {
    var manager = setup();
    expect(manager.dataSource).toBeTruthy();
    expect(manager.scrollView).toBeTruthy();
    expect(manager.element[0]).toBe(manager.scrollView.__container);
  });

  it('should be isVertical if scrollingY', function() {
    var manager = setup();
    expect(manager.scrollView.options.scrollingY).toBe(true);
    expect(manager.isVertical).toBe(true);
  });

  it('should be !isVertical if scrollingX', function() {
    var manager = setup({}, {}, {
      scrollingX: true,
      scrollingY: false
    });
    expect(manager.scrollView.options.scrollingX).toBe(true);
    expect(manager.scrollView.options.scrollingY).toBe(false);
    expect(manager.isVertical).toBe(false);
  });

  describe('isVertical', function() {

    it('should set getContentHeight', function() {
      var manager = setup();
      manager.viewportSize = 55;
      expect(manager.scrollView.options.getContentHeight()).toBe(55);
    });

    it('.scrollValue()', function() {
      var manager = setup();
      manager.scrollView.__scrollTop = 33;
      expect(manager.scrollValue()).toBe(33);
    });

    it('.scrollMaxValue()', function() {
      var manager = setup();
      manager.scrollView.__maxScrollTop = 123;
      expect(manager.scrollMaxValue()).toBe(123);
    });

    it('.scrollSize()', function() {
      var manager = setup();
      manager.scrollView.__clientHeight = 12;
      expect(manager.scrollSize()).toBe(12);
    });

    it('.secondaryScrollSize()', function() {
      var manager = setup();
      manager.scrollView.__clientWidth = 999;
      expect(manager.secondaryScrollSize()).toBe(999);
    });

    it('.transformString()', function() {
      var manager = setup();
      expect(manager.transformString(3,6)).toBe('translate3d(6px,3px,0)');
    });

    it('.primaryDimension()', function() {
      var manager = setup();
      expect(manager.primaryDimension({height: 100})).toBe(100);
    });

    it('.secondaryDimension()', function() {
      var manager = setup();
      expect(manager.secondaryDimension({width: 99})).toBe(99);
    });

  });

  describe('!isVertical', function() {

    it('should set getContentWidth', function() {
      var manager = setup({}, {}, { scrollingX: true, scrollingY: false });
      manager.viewportSize = 55;
      expect(manager.scrollView.options.getContentWidth()).toBe(55);
    });

    it('.scrollValue()', function() {
      var manager = setup({}, {}, { scrollingX: true, scrollingY: false });
      manager.scrollView.__scrollLeft = 33;
      expect(manager.scrollValue()).toBe(33);
    });

    it('.scrollMaxValue()', function() {
      var manager = setup({}, {}, { scrollingX: true, scrollingY: false });
      manager.scrollView.__maxScrollLeft = 123;
      expect(manager.scrollMaxValue()).toBe(123);
    });

    it('.scrollSize()', function() {
      var manager = setup({}, {}, { scrollingX: true, scrollingY: false });
      manager.scrollView.__clientWidth = 12;
      expect(manager.scrollSize()).toBe(12);
    });

    it('.secondaryScrollSize()', function() {
      var manager = setup({}, {}, { scrollingX: true, scrollingY: false });
      manager.scrollView.__clientHeight = 999;
      expect(manager.secondaryScrollSize()).toBe(999);
    });

    it('.transformString()', function() {
      var manager = setup({}, {}, { scrollingX: true, scrollingY: false });
      expect(manager.transformString(3,6)).toBe('translate3d(3px,6px,0)');
    });

    it('.primaryDimension()', function() {
      var manager = setup({}, {}, { scrollingX: true, scrollingY: false });
      expect(manager.primaryDimension({width: 100})).toBe(100);
    });

    it('.secondaryDimension()', function() {
      var manager = setup({}, {}, { scrollingX: true, scrollingY: false });
      expect(manager.secondaryDimension({height: 99})).toBe(99);
    });

  });

  describe('.calculateDimensions()', function() {
    it('should work with 1 item per space', function() {
      var manager = setup();
      manager.dataSource.dimensions = [
        { width: 100, height: 20 },
        { width: 100, height: 30 },
        { width: 100, height: 40 },
        { width: 100, height: 50 }
      ];
      manager.secondaryScrollSize = function() {
        return 100;
      };
      var result = manager.calculateDimensions().dimensions;
      expect(result[0].primarySize).toBe(20);
      expect(result[0].secondarySize).toBe(100);
      expect(result[0].primaryPos).toBe(0);
      expect(result[0].secondaryPos).toBe(0);

      expect(result[1].primarySize).toBe(30);
      expect(result[1].secondarySize).toBe(100);
      expect(result[1].primaryPos).toBe(20);
      expect(result[1].secondaryPos).toBe(0);

      expect(result[2].primarySize).toBe(40);
      expect(result[2].secondarySize).toBe(100);
      expect(result[2].primaryPos).toBe(50);
      expect(result[2].secondaryPos).toBe(0);

      expect(result[3].primarySize).toBe(50);
      expect(result[3].secondarySize).toBe(100);
      expect(result[3].primaryPos).toBe(90);
      expect(result[3].secondaryPos).toBe(0);
    });
    it('should work with a grid', function() {
      var manager = setup();
      manager.dataSource.dimensions = [
        { width: 30, height: 30 },
        { width: 35, height: 30 },
        { width: 40, height: 30 },
        { width: 30, height: 30 },
        { width: 20, height: 30 },
        { width: 35, height: 30 },
      ];
      manager.secondaryScrollSize = function() {
        return 90;
      };
      var result = manager.calculateDimensions().dimensions;
      expect(result[0].primarySize).toBe(30);
      expect(result[0].secondarySize).toBe(30);
      expect(result[0].primaryPos).toBe(0);
      expect(result[0].secondaryPos).toBe(0);

      expect(result[1].primarySize).toBe(30);
      expect(result[1].secondarySize).toBe(35);
      expect(result[1].primaryPos).toBe(0);
      expect(result[1].secondaryPos).toBe(30);

      expect(result[2].primarySize).toBe(30);
      expect(result[2].secondarySize).toBe(40);
      expect(result[2].primaryPos).toBe(30);
      expect(result[2].secondaryPos).toBe(0);

      expect(result[3].primarySize).toBe(30);
      expect(result[3].secondarySize).toBe(30);
      expect(result[3].primaryPos).toBe(30);
      expect(result[3].secondaryPos).toBe(40);

      expect(result[4].primarySize).toBe(30);
      expect(result[4].secondarySize).toBe(20);
      expect(result[4].primaryPos).toBe(30);
      expect(result[4].secondaryPos).toBe(70);

      expect(result[5].primarySize).toBe(30);
      expect(result[5].secondarySize).toBe(35);
      expect(result[5].primaryPos).toBe(60);
      expect(result[5].secondaryPos).toBe(0);
    });
  });

  describe('.resize()', function() {
    it('should work without data', function() {
      var manager = setup();
      spyOn(manager, 'render');
      spyOn(manager, 'calculateDimensions').andReturn({
        dimensions: [],
        beforeSize: 0,
        totalSize: 0
      });
      spyOn(manager, 'setCurrentIndex');
      manager.resize();
      expect(manager.dimensions).toEqual([]);
      expect(manager.viewportSize).toBe(0);
      expect(manager.setCurrentIndex).toHaveBeenCalledWith(0);
      expect(manager.render).toHaveBeenCalledWith(true);
    });
    it('should work with data', function() {
      var manager = setup();
      spyOn(manager, 'calculateDimensions').andReturn({
        dimensions: [{
          primaryPos: 100, primarySize: 30
        }],
        beforeSize: 0,
        totalSize: 130
      });
      manager.resize();
      expect(manager.dataSource.transcludeParent[0].style.height).toBe('130px');
      expect(manager.viewportSize).toBe(130);
    });
  });

  describe('.setCurrentIndex()', function() {
    it('without prev or next', function() {
      var manager = setup();
      spyOn(manager.dataSource, 'getLength').andReturn(0);
      manager.setCurrentIndex(0);
      expect(manager.currentIndex).toBe(0);
      expect(manager.hasPrevIndex).toBe(false);
      expect(manager.previousPos).toBeFalsy();
      expect(manager.hasNextIndex).toBe(false);
      expect(manager.nextPos).toBeFalsy();
    });

    it('with next', function() {
      var manager = setup();
      spyOn(manager.dataSource, 'getLength').andReturn(2);
      manager.dimensions = [{ primaryPos: 0 ,primarySize: 25}, { primaryPos: 25, primarySize: 35 }];
      manager.setCurrentIndex(0);
      expect(manager.currentIndex).toBe(0);
      expect(manager.hasPrevIndex).toBe(false);
      expect(manager.previousPos).toBeFalsy();
      expect(manager.hasNextIndex).toBe(true);
      expect(manager.nextPos).toBe(25);
    });

    it('with prev', function() {
      var manager = setup();
      spyOn(manager.dataSource, 'getLength').andReturn(2);
      manager.dimensions = [{ primaryPos: 0 , primarySize: 25 }, { primaryPos: 25, primarySize: 25 }];
      manager.setCurrentIndex(1);
      expect(manager.currentIndex).toBe(1);
      expect(manager.hasPrevIndex).toBe(true);
      expect(manager.previousPos).toBe(0);
      expect(manager.hasNextIndex).toBe(false);
      expect(manager.nextPos).toBeFalsy();
    });

    it('with next and prev', function() {
      var manager = setup();
      spyOn(manager.dataSource, 'getLength').andReturn(3);
      manager.dimensions = [{ primarySize: 25, primaryPos: 0 }, { primarySize: 25, primaryPos: 25 }, { primarySize: 25, primaryPos: 50 }];
      manager.setCurrentIndex(1);
      expect(manager.currentIndex).toBe(1);
      expect(manager.hasPrevIndex).toBe(true);
      expect(manager.previousPos).toBe(0);
      expect(manager.hasNextIndex).toBe(true);
      expect(manager.nextPos).toBe(50);
    });
  });

  describe('.renderScroll()', function() {
    it('should pass the values to __$callback', function() {
      var manager = setup();
      spyOn(manager.scrollView, '__$callback');
      manager.renderScroll(1, 2, 3, 4);
      expect(manager.scrollView.__$callback).toHaveBeenCalledWith(1, 2, 3, 4);
    });
  });

  describe('.renderIfNeeded()', function() {
    it('should render if >= nextPos', function() {
      var manager = setup();
      spyOn(manager, 'render');
      manager.hasNextIndex = true;
      manager.nextPos = 30;
      manager.renderIfNeeded(20);
      expect(manager.render).not.toHaveBeenCalled();
      manager.renderIfNeeded(30);
      expect(manager.render).toHaveBeenCalled();
    });

    it('should render if < previousPos', function() {
      var manager = setup();
      spyOn(manager, 'render');
      manager.hasPrevIndex = true;
      manager.previousPos = 50;
      manager.renderIfNeeded(60);
      expect(manager.render).not.toHaveBeenCalled();
      manager.renderIfNeeded(50);
      expect(manager.render).not.toHaveBeenCalled();
      manager.renderIfNeeded(49);
      expect(manager.render).toHaveBeenCalled();
    });
  });

  describe('.getIndexForScrollValue()', function() {
    it('should scroll until it finds right position', function() {
      var manager = setup();
      manager.dimensions = [
        { primaryPos: 0 },
        { primaryPos: 100 },
        { primaryPos: 200 },
        { primaryPos: 300 },
        { primaryPos: 400 },
        { primaryPos: 500 }
      ];
      expect(manager.getIndexForScrollValue(3, 50)).toBe(1);
      expect(manager.getIndexForScrollValue(1, 450)).toBe(4);
      //bounds
      expect(manager.getIndexForScrollValue(0, 1000)).toBe(5);
      expect(manager.getIndexForScrollValue(2, -100)).toBe(0);
    });
  });

  describe('.render()', function() {

    it('currentIndex >= length should remove all and return', function() {
      var manager = setup();
      manager.renderedItems = {'a':1, 'b':1};
      spyOn(manager, 'removeItem');
      spyOn(manager.dataSource, 'getLength').andReturn(0);
      manager.currentIndex = 1;
      manager.render();
      expect(manager.removeItem).toHaveBeenCalledWith('a');
      expect(manager.removeItem).toHaveBeenCalledWith('b');
    });
    it('shouldRedrawAll should remove all', function() {
      var manager = setup();
      manager.renderedItems = {'a':1, 'b':1};
      manager.currentIndex = 0;
      spyOn(manager, 'removeItem');
      manager.render(true);
      expect(manager.removeItem).toHaveBeenCalledWith('a');
      expect(manager.removeItem).toHaveBeenCalledWith('b');
    });

    function mockRendering(options) {
      var manager = setup({}, {
        keyExpr: 'item',
        listExpr: 'items',
        heightGetter: function() {
          return options.itemHeight;
        },
        widthGetter: function() {
          return options.itemWidth;
        }
      });
      spyOn(manager, 'scrollSize').andReturn(options.scrollHeight);
      spyOn(manager, 'secondaryScrollSize').andReturn(options.scrollWidth);
      spyOn(manager, 'renderItem').andCallFake(function(i) {
        manager.renderedItems[i] = true;
      });
      spyOn(manager, 'removeItem').andCallFake(function(i) {
        delete manager.renderedItems[i];
      });
      var data = [];
      for (var i = 0; i < 100; i++) {
        data.push(i);
      }
      manager.dataSource.setData(data);
      return manager;
    }

    it('should render the first items that fit on screen', function() {
      var manager = mockRendering({
        itemWidth: 3,
        itemHeight: 20,
        scrollWidth: 10,
        scrollHeight: 100
      });
      manager.resize(); //triggers render

      //it should render (items that fit * items per row) with three extra row at end
      expect(Object.keys(manager.renderedItems).length).toBe(20);
      for (var i = 0; i < 20; i++) {
        expect(manager.renderedItems[i]).toBe(true);
      }
      expect(manager.renderedItems[20]).toBeUndefined();
    });

    it('should render items in the middle of the screen', function() {
      var manager = mockRendering({
        itemWidth: 3,
        itemHeight: 20,
        scrollWidth: 10,
        scrollHeight: 100
      });
      spyOn(manager, 'scrollValue').andReturn(111);
      manager.resize();
      var startIndex = 17;
      var bufferStartIndex = 14; //one row of buffer before the start
      var bufferEndIndex = 37;  //start + 17 + 6

      expect(Object.keys(manager.renderedItems).length).toBe(24);
      for (var i = bufferStartIndex; i <= bufferEndIndex; i++) {
        expect(manager.renderedItems[i]).toBe(true);
      }
      expect(manager.renderedItems[bufferStartIndex - 1]).toBeUndefined();
      expect(manager.renderedItems[bufferEndIndex + 1]).toBeUndefined();
    });
  });

  describe('.renderItem()', function() {
    it('should attachItemAtIndex and set the element transform', function() {
      var manager = setup();
      var item = {
        element: angular.element('<div>')
      };
      spyOn(item.element, 'css');
      spyOn(manager.dataSource, 'attachItemAtIndex').andReturn(item);
      manager.renderItem(0, 33, 44);
      expect(manager.dataSource.attachItemAtIndex).toHaveBeenCalledWith(0);
      expect(item.element.css).toHaveBeenCalledWith(
        ionic.CSS.TRANSFORM,
        manager.transformString(33, 44)
      );
      expect(manager.renderedItems[0]).toBe(item);
    });
  });

  describe('.removeItem()', function() {
    it('should detachItem', function() {
      var manager = setup();
      var item = {};
      manager.renderedItems[0] = item;
      spyOn(manager, 'removeItem').andCallThrough();
      spyOn(manager.dataSource, 'detachItem');
      manager.removeItem(0);
      expect(manager.renderedItems).toEqual({});
    });
  });
});
