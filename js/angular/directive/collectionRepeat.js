/**
 * @ngdoc directive
 * @module ionic
 * @name collectionRepeat
 * @restrict A
 * @codepen mFygh
 * @description
 * `collection-repeat` is a directive that allows you to render lists with
 * thousands of items in them, and experience little to no performance penalty.
 *
 * Demo:
 *
 * The directive renders onto the screen only the items that should be currently visible.
 * So if you have 1,000 items in your list but only ten fit on your screen,
 * collection-repeat will only render into the DOM the ten that are in the current
 * scroll position.
 *
 * Here are a few things to keep in mind while using collection-repeat:
 *
 * 1. The data supplied to collection-repeat must be an array.
 * 2. You must explicitly tell the directive what size your items will be in the DOM, using directive attributes.
 * Pixel amounts or percentages are allowed (see below).
 * 3. The elements rendered will be absolutely positioned: be sure to let your CSS work with
 * this (see below).
 * 4. Each collection-repeat list will take up all of its parent scrollView's space.
 * If you wish to have multiple lists on one page, put each list within its own
 * {@link ionic.directive:ionScroll ionScroll} container.
 * 5. You should not use the ng-show and ng-hide directives on your ion-content/ion-scroll elements that
 * have a collection-repeat inside.  ng-show and ng-hide apply the `display: none` css rule to the content's
 * style, causing the scrollView to read the width and height of the content as 0.  Resultingly,
 * collection-repeat will render elements that have just been un-hidden incorrectly.
 *
 *
 * @usage
 *
 * #### Basic Usage (single rows of items)
 *
 * Notice two things here: we use ng-style to set the height of the item to match
 * what the repeater thinks our item height is.  Additionally, we add a css rule
 * to make our item stretch to fit the full screen (since it will be absolutely
 * positioned).
 *
 * ```html
 * <ion-content ng-controller="ContentCtrl">
 *   <div class="list">
 *     <div class="item my-item"
 *       collection-repeat="item in items"
 *       collection-item-width="'100%'"
 *       collection-item-height="getItemHeight(item, $index)"
 *       ng-style="{height: getItemHeight(item, $index)}">
 *       {% raw %}{{item}}{% endraw %}
 *     </div>
 *   </div>
 * </div>
 * ```
 * ```js
 * function ContentCtrl($scope) {
 *   $scope.items = [];
 *   for (var i = 0; i < 1000; i++) {
 *     $scope.items.push('Item ' + i);
 *   }
 *
 *   $scope.getItemHeight = function(item, index) {
 *     //Make evenly indexed items be 10px taller, for the sake of example
 *     return (index % 2) === 0 ? 50 : 60;
 *   };
 * }
 * ```
 * ```css
 * .my-item {
 *   left: 0;
 *   right: 0;
 * }
 * ```
 *
 * #### Grid Usage (three items per row)
 *
 * ```html
 * <ion-content>
 *   <div class="item item-avatar my-image-item"
 *     collection-repeat="image in images"
 *     collection-item-width="'33%'"
 *     collection-item-height="'33%'">
 *     <img ng-src="{{image.src}}">
 *   </div>
 * </ion-content>
 * ```
 * Percentage of total visible list dimensions. This example shows a 3 by 3 matrix that fits on the screen (3 rows and 3 colums). Note that dimensions are used in the creation of the element and therefore a measurement of the item cannnot be used as an input dimension.
 * ```css
 * .my-image-item img {
 *   height: 33%;
 *   width: 33%;
 * }
 * ```
 *
 * @param {expression} collection-repeat The expression indicating how to enumerate a collection. These
 *   formats are currently supported:
 *
 *   * `variable in expression` – where variable is the user defined loop variable and `expression`
 *     is a scope expression giving the collection to enumerate.
 *
 *     For example: `album in artist.albums`.
 *
 *   * `variable in expression track by tracking_expression` – You can also provide an optional tracking function
 *     which can be used to associate the objects in the collection with the DOM elements. If no tracking function
 *     is specified the collection-repeat associates elements by identity in the collection. It is an error to have
 *     more than one tracking function to resolve to the same key. (This would mean that two distinct objects are
 *     mapped to the same DOM element, which is not possible.)  Filters should be applied to the expression,
 *     before specifying a tracking expression.
 *
 *     For example: `item in items` is equivalent to `item in items track by $id(item)'. This implies that the DOM elements
 *     will be associated by item identity in the array.
 *
 *     For example: `item in items track by $id(item)`. A built in `$id()` function can be used to assign a unique
 *     `$$hashKey` property to each item in the array. This property is then used as a key to associated DOM elements
 *     with the corresponding item in the array by identity. Moving the same object in array would move the DOM
 *     element in the same way in the DOM.
 *
 *     For example: `item in items track by item.id` is a typical pattern when the items come from the database. In this
 *     case the object identity does not matter. Two objects are considered equivalent as long as their `id`
 *     property is same.
 *
 *     For example: `item in items | filter:searchText track by item.id` is a pattern that might be used to apply a filter
 *     to items in conjunction with a tracking expression.
 *
 * @param {expression} collection-item-width The width of the repeated element.  Can be a number (in pixels) or a percentage.
 * @param {expression} collection-item-height The height of the repeated element.  Can be a number (in pixels), or a percentage.
 *
 */
var COLLECTION_REPEAT_SCROLLVIEW_XY_ERROR = "Cannot create a collection-repeat within a scrollView that is scrollable on both x and y axis.  Choose either x direction or y direction.";
var COLLECTION_REPEAT_ATTR_HEIGHT_ERROR = "collection-repeat expected attribute collection-item-height to be a an expression that returns a number (in pixels) or percentage.";
var COLLECTION_REPEAT_ATTR_WIDTH_ERROR = "collection-repeat expected attribute collection-item-width to be a an expression that returns a number (in pixels) or percentage.";
var COLLECTION_REPEAT_ATTR_REPEAT_ERROR = "collection-repeat expected expression in form of '_item_ in _collection_[ track by _id_]' but got '%'";

IonicModule
.directive('collectionRepeat', [
  '$collectionRepeatManager',
  '$collectionDataSource',
  '$parse',
function($collectionRepeatManager, $collectionDataSource, $parse) {
  return {
    priority: 1000,
    transclude: 'element',
    terminal: true,
    $$tlb: true,
    require: '^$ionicScroll',
    controller: [function(){}],
    link: function($scope, $element, $attr, scrollCtrl, $transclude) {
      var wrap = jqLite('<div style="position:relative;">');
      $element.parent()[0].insertBefore(wrap[0], $element[0]);
      wrap.append($element);

      var scrollView = scrollCtrl.scrollView;
      if (scrollView.options.scrollingX && scrollView.options.scrollingY) {
        throw new Error(COLLECTION_REPEAT_SCROLLVIEW_XY_ERROR);
      }

      var isVertical = !!scrollView.options.scrollingY;
      if (isVertical && !$attr.collectionItemHeight) {
        throw new Error(COLLECTION_REPEAT_ATTR_HEIGHT_ERROR);
      } else if (!isVertical && !$attr.collectionItemWidth) {
        throw new Error(COLLECTION_REPEAT_ATTR_WIDTH_ERROR);
      }

      var heightParsed = $parse($attr.collectionItemHeight || '"100%"');
      var widthParsed = $parse($attr.collectionItemWidth || '"100%"');

      var heightGetter = function(scope, locals) {
        var result = heightParsed(scope, locals);
        if (isString(result) && result.indexOf('%') > -1) {
          return Math.floor(parseInt(result, 10) / 100 * scrollView.__clientHeight);
        }
        return result;
      };
      var widthGetter = function(scope, locals) {
        var result = widthParsed(scope, locals);
        if (isString(result) && result.indexOf('%') > -1) {
          return Math.floor(parseInt(result, 10) / 100 * scrollView.__clientWidth);
        }
        return result;
      };

      var match = $attr.collectionRepeat.match(/^\s*([\s\S]+?)\s+in\s+([\s\S]+?)(?:\s+track\s+by\s+([\s\S]+?))?\s*$/);
      if (!match) {
        throw new Error(COLLECTION_REPEAT_ATTR_REPEAT_ERROR
                        .replace('%', $attr.collectionRepeat));
      }
      var keyExpr = match[1];
      var listExpr = match[2];
      var trackByExpr = match[3];

      var dataSource = new $collectionDataSource({
        scope: $scope,
        transcludeFn: $transclude,
        transcludeParent: $element.parent(),
        keyExpr: keyExpr,
        listExpr: listExpr,
        trackByExpr: trackByExpr,
        heightGetter: heightGetter,
        widthGetter: widthGetter
      });
      var collectionRepeatManager = new $collectionRepeatManager({
        dataSource: dataSource,
        element: scrollCtrl.$element,
        scrollView: scrollCtrl.scrollView,
      });

      $scope.$watchCollection(listExpr, function(value) {
        if (value && !angular.isArray(value)) {
          throw new Error("collection-repeat expects an array to repeat over, but instead got '" + typeof value + "'.");
        }
        rerender(value);
      });

      // Find every sibling before and after the repeated items, and pass them
      // to the dataSource
      var scrollViewContent = scrollCtrl.scrollView.__content;
      function rerender(value) {
        var beforeSiblings = [];
        var afterSiblings = [];
        var before = true;

        forEach(scrollViewContent.children, function(node, i) {
          if ( ionic.DomUtil.elementIsDescendant($element[0], node, scrollViewContent) ) {
            before = false;
          } else {
            if (node.hasAttribute('collection-repeat-ignore')) return;
            var width = node.offsetWidth;
            var height = node.offsetHeight;
            if (width && height) {
              var element = jqLite(node);
              (before ? beforeSiblings : afterSiblings).push({
                width: node.offsetWidth,
                height: node.offsetHeight,
                element: element,
                scope: element.isolateScope() || element.scope(),
                isOutside: true
              });
            }
          }
        });

        scrollView.resize();
        dataSource.setData(value, beforeSiblings, afterSiblings);
        collectionRepeatManager.resize();
      }
      function rerenderOnResize() {
        rerender($scope.$eval(listExpr));
      }

      scrollCtrl.$element.on('scroll.resize', rerenderOnResize);
      ionic.on('resize', rerenderOnResize, window);

      $scope.$on('$destroy', function() {
        collectionRepeatManager.destroy();
        dataSource.destroy();
        ionic.off('resize', rerenderOnResize, window);
      });
    }
  };
}])
.directive({
  ngSrc: collectionRepeatSrcDirective('ngSrc', 'src'),
  ngSrcset: collectionRepeatSrcDirective('ngSrcset', 'srcset'),
  ngHref: collectionRepeatSrcDirective('ngHref', 'href')
});

// Fix for #1674
// Problem: if an ngSrc or ngHref expression evaluates to a falsy value, it will
// not erase the previous truthy value of the href.
// In collectionRepeat, we re-use elements from before. So if the ngHref expression
// evaluates to truthy for item 1 and then falsy for item 2, if an element changes
// from representing item 1 to representing item 2, item 2 will still have
// item 1's href value.
// Solution:  erase the href or src attribute if ngHref/ngSrc are falsy.
function collectionRepeatSrcDirective(ngAttrName, attrName) {
  return [function() {
    return {
      priority: '99', // it needs to run after the attributes are interpolated
      link: function(scope, element, attr) {
        attr.$observe(ngAttrName, function(value) {
          if (!value) {
            element[0].removeAttribute(attrName);
          }
        });
      }
    };
  }];
}
