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
      dataSource.dataStartIndex = 0;
      dataSource.beforeSiblings = [];
      dataSource.afterSiblings = [];
    });
    return dataSource;
  }

  it('should have properties', inject(function($collectionDataSource) {
    var source = setup({
      scope: 1,
      transcludeFn: 2,
      transcludeParent: 3,
      keyExpr: 4,
      listExpr: 5,
      heightGetter: 7,
      widthGetter: 8
    });
    expect(source.scope).toBe(1);
    expect(source.transcludeFn).toBe(2);
    expect(source.transcludeParent).toBe(3);
    expect(source.keyExpr).toBe(4);
    expect(source.listExpr).toBe(5);
    expect(source.heightGetter).toBe(7);
    expect(source.widthGetter).toBe(8);
  }));

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

  describe('.createItem()', function() {
    it('should return item with new scope and transclude', function() {
      var source = setup();

      var item = source.createItem();

      expect(item.scope.$parent).toBe(source.scope);

      expect(item.element).toBeTruthy();
      expect(item.element.css('position')).toBe('absolute');
      expect(item.element.scope()).toBe(item.scope);

      expect(item.element.parent()[0]).toBe(source.transcludeParent[0]);
    });
  });

  describe('.getItem()', function() {
    it('should return attachedItems[index] if available', function() {
      var source = setup();
      var item = {};
      source.attachedItems['123'] = item;
      expect(source.getItem('123')).toBe(item);
    });

    it('should return backupItemsArray item if available, and reconnect the item', function() {
      var source = setup();
      var item = {
        scope: {},
      };
      spyOn(ionic.Utils, 'reconnectScope');
      source.backupItemsArray = [item];
      expect(source.getItem('123')).toBe(item);
      expect(ionic.Utils.reconnectScope).toHaveBeenCalledWith(item.scope);
    });

    it('should last resort create an item', function() {
      var source = setup();
      var item = {};
      spyOn(source, 'createItem').andReturn(item);
      expect(source.getItem('123')).toBe(item);
    });
  });

  describe('.attachItemAtIndex()', function() {
    it('should return a value with index values set and put in attachedItems', inject(function($rootScope) {
      var source = setup({
        keyExpr: 'value'
      });
      source.data = ['a', 'b', 'c'];
      source.dimensions = ['a','b','c'];
      spyOn(source, 'getItem').andCallFake(function() {
        return { scope: $rootScope.$new() };
      });

      var item1 = source.attachItemAtIndex(0);
      expect(item1.scope.value).toEqual('a');
      expect(item1.scope.$index).toBe(0);
      expect(item1.scope.$first).toBe(true);
      expect(item1.scope.$last).toBe(false);
      expect(item1.scope.$middle).toBe(false);
      expect(item1.scope.$odd).toBe(false);

      var item2 = source.attachItemAtIndex(1);
      expect(item2.scope.value).toEqual('b');
      expect(item2.scope.$index).toBe(1);
      expect(item2.scope.$first).toBe(false);
      expect(item2.scope.$last).toBe(false);
      expect(item2.scope.$middle).toBe(true);
      expect(item2.scope.$odd).toBe(true);

      var item3 = source.attachItemAtIndex(2);
      expect(item3.scope.value).toEqual('c');
      expect(item3.scope.$index).toBe(2);
      expect(item3.scope.$first).toBe(false);
      expect(item3.scope.$last).toBe(true);
      expect(item3.scope.$middle).toBe(false);
      expect(item3.scope.$odd).toBe(false);

      expect(source.attachedItems).toEqual({
        0: item1,
        1: item2,
        2: item3
      });
    }));
  });

  describe('.detachItem()', function() {
    it('should detach item and add to backup array if there is room', function() {
      var source = setup();
      var item = {
        element: angular.element('<div>'),
        scope: {},
        index: 1
      };
      source.backupItemsArray = [];
      source.attachedItems[1] = item;
      spyOn(ionic.Utils, 'disconnectScope');
      source.detachItem(item);
      expect(source.attachedItems).toEqual({});
      expect(source.backupItemsArray).toEqual([item]);
      expect(ionic.Utils.disconnectScope).toHaveBeenCalledWith(item.scope);
    });
    it('should remove element from parent and disconnectScope if backupItemsArray is full', function() {
      var source = setup();
      spyOn(source, 'destroyItem');
      source.BACKUP_ITEMS_LENGTH = 0;

      var item = { index: 0 };
      source.attachedItems[item.index] = item;
      source.detachItem(item);
      expect(source.destroyItem).toHaveBeenCalledWith(item);
      expect(source.attachedItems).toEqual({});
    });
  });

  describe('.destroyItem()', function() {
    it('should remove element and destroy scope', function() {
      var source = setup();
      var element = angular.element('<div>');
      var parent = angular.element('<div>').append(element);
      var item = {
        element: element,
        scope: {}
      };
      var destroySpy = item.scope.$destroy = jasmine.createSpy('$destroy');

      expect(element[0].parentNode).toBe(parent[0]);
      source.destroyItem(item);
      expect(element[0].parentNode).toBeFalsy();
      expect(destroySpy).toHaveBeenCalled();
      expect(item.scope).toBe(null);
      expect(item.element).toBe(null);
    });
  });

  describe('.getLength()', function() {
    it('should return 0 by default', function() {
      var source = setup();
      source.dimensions = null;
      expect(source.getLength()).toBe(0);
    });

    it('should return dimensions length', function() {
      var source = setup();
      source.dimensions = [1,2,3];
      expect(source.getLength()).toBe(3);
      source.dimensions = [];
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
