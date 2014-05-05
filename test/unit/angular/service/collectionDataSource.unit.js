describe('$collectionDataSource service', function() {

  beforeEach(module('ionic'));

  function setup(options, template) {
    var dataSource;
    inject(function($rootScope, $compile, $collectionDataSource) {
      options = angular.extend({
        scope: $rootScope.$new(),
        transcludeParent: angular.element('<div>'),
        keyExpr: 'key',
        listExpr: 'list',
        heightGetter: function() {
          return 1;
        },
        widthGetter: function() {
          return 1;
        }
      }, options || {});
      options.transcludeFn = options.transcludeFn || function(scope, cb) {
        cb( $compile(template || '<div>')(scope) );
      };
      dataSource = new $collectionDataSource(options);
    });
    return dataSource;
  }

  it('should have properties', function() {
    var source = setup({
      scope: 1,
      transcludeFn: 2,
      transcludeParent: 3,
      keyExpr: 4,
      listExpr: 5,
      trackByExpr: 6,
      heightGetter: 7,
      widthGetter: 8
    });
    expect(source.scope).toBe(1);
    expect(source.transcludeFn).toBe(2);
    expect(source.transcludeParent).toBe(3);
    expect(source.keyExpr).toBe(4);
    expect(source.listExpr).toBe(5);
    expect(source.trackByExpr).toBe(6);
    expect(source.heightGetter).toBe(7);
    expect(source.widthGetter).toBe(8);
  });

  describe('.itemHashGetter()', function() {

    it('should default to hashKey of value', function() {
      spyOn(window, 'hashKey').andReturn('hashed');

      var source = setup();
      expect(source.itemHashGetter(1, 2)).toBe('hashed');
      expect(hashKey).toHaveBeenCalledWith(2);
    });

    it('should use trackbyExpr if provided, and provide locals', function() {
      var source = setup({
        keyExpr: 'item',
        trackByExpr: 'item.idMaker($index, item)'
      });
      var idMakerSpy = jasmine.createSpy('idMaker').andReturn('superhash');
      var item = {
        idMaker: idMakerSpy
      };
      expect(source.itemHashGetter(1, item)).toEqual('superhash');
      expect(idMakerSpy).toHaveBeenCalledWith(1, item);
    });
  });

  describe('itemCache', function() {

    it('should be $cacheFactory', function() {
      var cache = {};
      module('ionic', function($provide) {
        $provide.value('$cacheFactory', function() { return cache; });
      });
      var source = setup();
      expect(source.itemCache).toBe(cache);
    });

    it('should have added keys() method', function() {
      var source = setup();
      source.itemCache.put('a', 1);
      source.itemCache.put('b', 2);
      expect(source.itemCache.keys()).toEqual(['a', 'b']);
      source.itemCache.remove('a');
      expect(source.itemCache.keys()).toEqual(['b']);
    });

  });

  it('.destroy() should cleanup dimensions & cache', function() {
    var source = setup();
    source.dimensions = [1,2,3];
    var cachedItem = {
      scope: { $destroy: jasmine.createSpy('$destroy') },
      element: { remove: jasmine.createSpy('remove') }
    };
    source.itemCache.put('a', cachedItem);
    source.destroy();
    expect(source.dimensions.length).toBe(0);
    expect(cachedItem.scope.$destroy).toHaveBeenCalled();
    expect(cachedItem.element.remove).toHaveBeenCalled();
  });

  it('.calculateDataDimensions()', function() {
    function widthGetter(scope, locals) {
      return locals.$index + locals.item + 'w';
    }
    function heightGetter(scope, locals) {
      return locals.$index + locals.item + 'h';
    }
    var source = setup({
      keyExpr: 'item',
      widthGetter: widthGetter,
      heightGetter: heightGetter
    });
    source.data = ['a', 'b', 'c'];
    expect(source.dimensions).toEqual([]);
    source.calculateDataDimensions();
    expect(source.dimensions[0]).toEqual({
      width: '0aw',
      height: '0ah'
    });
    expect(source.dimensions[1]).toEqual({
      width: '1bw',
      height: '1bh'
    });
    expect(source.dimensions[2]).toEqual({
      width: '2cw',
      height: '2ch'
    });
  });

  describe('.compileItem()', function() {
    it('should get item from cache if exists', function() {
      var source = setup();
      var hash = source.itemHashGetter(1,2);
      var item = {};
      source.itemCache.put(hash, item);
      expect(source.compileItem(1,2)).toBe(item);
    });

    it('should give back a compiled item and put in cache', function() {
      var source = setup({
        keyExpr: 'key'
      });

      var item = source.compileItem(1, 2);

      expect(item.scope.$parent).toBe(source.scope);
      expect(item.scope.key).toBe(2);

      expect(item.element).toBeTruthy();
      expect(item.element.css('position')).toBe('absolute');
      expect(item.element.scope()).toBe(item.scope);

      expect(source.itemCache.get(source.itemHashGetter(1,2))).toBe(item);
    });
  });

  describe('.getItem()', function() {
    it('should return a value with index values set', function() {
      var source = setup();
      source.data = ['a', 'b', 'c'];
      spyOn(source, 'compileItem').andCallFake(function() { return { scope: {} }; });

      var item = source.getItem(0);
      expect(item.scope.$index).toBe(0);
      expect(item.scope.$first).toBe(true);
      expect(item.scope.$last).toBe(false);
      expect(item.scope.$middle).toBe(false);
      expect(item.scope.$odd).toBe(false);

      item = source.getItem(1);
      expect(item.scope.$index).toBe(1);
      expect(item.scope.$first).toBe(false);
      expect(item.scope.$last).toBe(false);
      expect(item.scope.$middle).toBe(true);
      expect(item.scope.$odd).toBe(true);

      item = source.getItem(2);
      expect(item.scope.$index).toBe(2);
      expect(item.scope.$first).toBe(false);
      expect(item.scope.$last).toBe(true);
      expect(item.scope.$middle).toBe(false);
      expect(item.scope.$odd).toBe(false);
    });
  });

  describe('.detachItem()', function() {
    it('should remove element from parent and disconnectScope', function() {
      var source = setup();
      var element = angular.element('<div>');
      var parent = angular.element('<div>').append(element);
      var item = {
        element: element,
        scope: {}
      };
      spyOn(window, 'disconnectScope');

      expect(element[0].parentNode).toBe(parent[0]);
      source.detachItem(item);
      expect(element[0].parentNode).toBeFalsy();
      expect(disconnectScope).toHaveBeenCalledWith(item.scope);
    });
  });

  describe('.attachItem()', function() {
    it('should add element if it has no parent and digest', inject(function($rootScope) {
      var source = setup({
        transcludeParent: angular.element('<div>')
      });
      var element = angular.element('<div>');
      spyOn(window, 'reconnectScope');
      var item = {
        element: element,
        scope: $rootScope.$new()
      };

      spyOn(item.scope, '$digest');
      spyOn(source.transcludeParent[0], 'appendChild');
      source.attachItem(item);
      expect(source.transcludeParent[0].appendChild).toHaveBeenCalledWith(element[0]);
      expect(reconnectScope).toHaveBeenCalledWith(item.scope);
      expect(item.scope.$digest).toHaveBeenCalled();
    }));

    it('should not append element if it has a parent already', inject(function($rootScope) {
      var element = angular.element('<div>');
      var source = setup({
        transcludeParent: angular.element('<div>')
          .append(element)
      });
      spyOn(window, 'reconnectScope');
      var item = {
        element: element,
        scope: $rootScope.$new()
      };
      spyOn(item.scope, '$digest');
      source.attachItem(item);
      spyOn(source.transcludeParent[0], 'appendChild');
      expect(source.transcludeParent[0].appendChild).not.toHaveBeenCalled();
      expect(reconnectScope).toHaveBeenCalledWith(item.scope);
      expect(item.scope.$digest).toHaveBeenCalled();
    }));
  });

  describe('.getLength()', function() {
    it('should return 0 by default', function() {
      var source = setup();
      source.data = null;
      expect(source.getLength()).toBe(0);
    });

    it('should return data length', function() {
      var source = setup();
      source.data = [1,2,3];
      expect(source.getLength()).toBe(3);
      source.data = [];
      expect(source.getLength()).toBe(0);
    });
  });

  describe('.setData()', function() {
    it('should set data and calculateDataDimensions()', function() {
      var source = setup();
      spyOn(source, 'calculateDataDimensions');

      expect(source.data).toEqual([]);
      source.setData([1,2,3]);
      expect(source.data).toEqual([1,2,3]);
      expect(source.calculateDataDimensions).toHaveBeenCalled();
    });

    it('should default falsy to empty array', function() {
      var source = setup();
      source.data = 'none';
      source.setData(null);
      expect(source.data).toEqual([]);
    });
  });

});
