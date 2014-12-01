describe('collectionRepeat directive', function() {

  var dataSource, repeatManager;
  beforeEach(module('ionic', function($provide) {
    $provide.value(
      '$collectionDataSource',
      jasmine.createSpy('$dataSource').andCallFake(function(opts) {
        dataSource = {
          options: opts,
          setData: jasmine.createSpy('setData')
        };
        return dataSource;
      })
    );
    $provide.value(
      '$collectionRepeatManager',
      jasmine.createSpy('$repeatManager').andCallFake(function(opts) {
        repeatManager = {
          options: opts,
          resize: jasmine.createSpy('resize')
        };
        return repeatManager;
      })
    );
  }));

  function setup(attrs, scrollViewOpts) {
    var el;
    inject(function($compile, $rootScope) {
      var content = $compile('<ion-content>')($rootScope.$new());
      $rootScope.$apply();
      angular.extend(
        content.controller('$ionicScroll').scrollView.options,
        scrollViewOpts || {}
      );
      el = angular.element('<div ' + (attrs||'') + '></div>');
      content.append(el);
      $compile(el)(content.scope());
      $rootScope.$apply();
    });
    return el;
  }

  describe('errors', function() {
    it('should error if scrollView is x and y', function() {
      expect(function() {
        setup('collection-repeat', {scrollingX:true, scrollingY:true});
      }).toThrow(COLLECTION_REPEAT_SCROLLVIEW_XY_ERROR);
    });
    it('should error if scrollView is x and no width', function() {
      expect(function() {
        setup('collection-repeat collection-item-height', {
          scrollingX:true,
          scrollingY:false
        });
      }).toThrow(COLLECTION_REPEAT_ATTR_WIDTH_ERROR);
    });
    it('should error if scrollView is y and no height', function() {
      expect(function() {
        setup('collection-repeat collection-item-width', {
          scrollingX:false,
          scrollingY:true
        });
      }).toThrow(COLLECTION_REPEAT_ATTR_HEIGHT_ERROR);
    });
    it('should error if no repeat expression', function() {
      expect(function() {
        setup('collection-repeat="bad" collection-item-height="1"');
      }).toThrow(COLLECTION_REPEAT_ATTR_REPEAT_ERROR.replace('%', 'bad'));
    });
  });

  describe('widthGetter & heightGetter', function() {
    it('should work with given amounts parsed to int', function() {
      var el = setup('collection-repeat="a in b" collection-item-height="\'5\'" collection-item-width="\'10\'"');
      expect(dataSource.options.heightGetter()).toBe(5);
      expect(dataSource.options.widthGetter()).toBe(10);
    });
    it('should default width of y-scroller to 100%', function() {
      var el = setup('collection-repeat="a in b" collection-item-height="5"');
      el.controller('$ionicScroll').scrollView.__clientWidth = 200;
      expect(dataSource.options.widthGetter()).toBe(200);
    });
    it('should default height of x-scroller to 100%', function() {
      var el = setup('collection-repeat="a in b" collection-item-width="5"', {
        scrollingX: true,
        scrollingY: false
      });
      el.controller('$ionicScroll').scrollView.__clientHeight = 199;
      expect(dataSource.options.heightGetter()).toBe(199);
    });
    it('should work with user-inputted percentage height', function() {
      var el = setup('collection-repeat="a in b" collection-item-height="\'23%\'"');
      el.controller('$ionicScroll').scrollView.__clientHeight = 300;
      expect(dataSource.options.heightGetter()).toEqual(0.23 * 300);
    });
    it('should work with user-inputted percentage width', function() {
      var el = setup('collection-repeat="a in b" collection-item-width="\'23%\'"', {
        scrollingX: true,
        scrollingY: false
      });
      el.controller('$ionicScroll').scrollView.__clientWidth = 300;
      expect(dataSource.options.widthGetter()).toEqual(0.23 * 300);
    });
  });

  it('should error if list is not an array and is truthy', function() {
    var el = setup('collection-repeat="item in items" collection-item-height="50"');
    expect(function() {
      el.scope().$apply('items = "string"');
    }).toThrow();
    expect(function() {
      el.scope().$apply('items = 123');
    }).toThrow();
    expect(function() {
      el.scope().$apply('items = {}');
    }).toThrow();
  });

  it('should rerender on list change', function() {
    var el = setup('collection-repeat="item in items" collection-item-height="50"');
    var scrollView = el.controller('$ionicScroll').scrollView;
    spyOn(scrollView, 'resize');
    dataSource.setData.reset();
    repeatManager.resize.reset();

    el.scope().$apply('items = [ 1,2,3 ]');
    expect(dataSource.setData).toHaveBeenCalledWith(el.scope().items, [], []);
    expect(repeatManager.resize.callCount).toBe(1);
    expect(scrollView.resize.callCount).toBe(1);
    el.scope().$apply('items = null');
    expect(dataSource.setData).toHaveBeenCalledWith(null, [], []);
    expect(repeatManager.resize.callCount).toBe(2);
    expect(scrollView.resize.callCount).toBe(2);
  });

  it('should rerender on window resize', function() {
    var el = setup('collection-repeat="item in items" collection-item-height="50"');
    var scrollView = el.controller('$ionicScroll').scrollView;
    spyOn(scrollView, 'resize');
    dataSource.setData.reset();
    repeatManager.resize.reset();

    el.scope().items = [1,2,3];

    ionic.trigger('resize', { target: window });
    expect(dataSource.setData).toHaveBeenCalledWith(el.scope().items, [], []);
    expect(repeatManager.resize.callCount).toBe(1);
    expect(scrollView.resize.callCount).toBe(1);
  });

  it('should rerender on scrollCtrl resize', inject(function($timeout) {
    var el = setup('collection-repeat="item in items" collection-item-height="50"');
    var scrollCtrl = el.controller('$ionicScroll');
    repeatManager.resize.reset();

    scrollCtrl.resize();
    $timeout.flush();
    expect(repeatManager.resize.callCount).toBe(1);
  }));

  it('$destroy', function() {
    var el = setup('collection-repeat="item in items" collection-item-height="50"');
    dataSource.destroy = jasmine.createSpy('dataSourceDestroy');
    repeatManager.destroy = jasmine.createSpy('repeatManagerDestroy');
    spyOn(ionic, 'off');

    el.scope().$destroy();
    expect(dataSource.destroy).toHaveBeenCalled();
    expect(repeatManager.destroy).toHaveBeenCalled();
    expect(ionic.off).toHaveBeenCalledWith('resize', jasmine.any(Function), window);
  });
});
