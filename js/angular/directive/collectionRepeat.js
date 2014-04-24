IonicModule
.directive('collectionRepeat', [
  '$collectionRepeatManager',
  '$collectionRepeatDataSource',
  '$parse',
function($collectionRepeatManager, $collectionRepeatDataSource, $parse) {
  return {
    priority: 1000,
    transclude: 'element',
    terminal: true,
    $$tlb: true,
    require: '^$ionicScroll',
    link: function($scope, $element, $attr, scrollCtrl, $transclude) {
      var scrollView = scrollCtrl.scrollView;
      if (scrollView.options.scrollingX && scrollView.options.scrollingY) {
        throw new Error("Cannot create a collection-repeat within a scrollView that is scrollable on both x and y axis.  Choose either x direction or y direction.");
      }

      var isVertical = !!scrollView.options.scrollingY;
      if (isVertical && !$attr.collectionItemHeight) {
        throw new Error("collection-repeat expected attribute collection-item-height to be a an expression that returns a number.");
      } else if (!isVertical && !$attr.collectionItemWidth) {
        throw new Error("collection-repeat expected attribute collection-item-width to be a an expression that returns a number.");
      }
      var heightGetter = $attr.collectionItemHeight ?
        $parse($attr.collectionItemHeight) :
        function() { return scrollView.__clientHeight; };
      var widthGetter = $attr.collectionItemWidth ?
        $parse($attr.collectionItemWidth) :
        function() { return scrollView.__clientWidth; };
      console.log(widthGetter());
      setTimeout(function() {
      console.log(widthGetter());
      });

      var match = $attr.collectionRepeat.match(/^\s*([\s\S]+?)\s+in\s+([\s\S]+?)(?:\s+track\s+by\s+([\s\S]+?))?\s*$/);
      if (!match) {
        throw new Error("collection-repeat expected expression in form of '_item_ in _collection_[ track by _id_]' but got '" + $attr.collectionRepeat + "'.");
      }

      var dataSource = new $collectionRepeatDataSource({
        scope: $scope,
        transcludeFn: $transclude,
        transcludeParent: $element.parent(),
        keyExpr: match[1],
        listExpr: match[2],
        trackByExpr: match[3],
        heightGetter: heightGetter,
        widthGetter: widthGetter
      });
      var collectionRepeatManager = new $collectionRepeatManager({
        dataSource: dataSource,
        element: scrollCtrl.$element,
        scrollView: scrollCtrl.scrollView,
      });

      $scope.$watchCollection(dataSource.listExpr, function(value) {
        if (value && !angular.isArray(value)) {
          throw new Error("collection-repeat expects an array to repeat over, but instead got '" + typeof value + "'.");
        }
        rerender(value);
      });

      function rerender(value) {
        scrollView.resize();
        dataSource.setData(value);
        collectionRepeatManager.resize();
      }
      var resize = angular.bind(collectionRepeatManager, collectionRepeatManager.resize);
      ionic.on('resize', function() {
        rerender($scope.$eval(dataSource.listExpr));
      }, window);

      $scope.$on('$destroy', function() {
        collectionRepeatManager.destroy();
        dataSource.destroy();
        ionic.off('resize', resize, window);
      });
    }
  };
}]);
