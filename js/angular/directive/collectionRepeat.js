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
 * 2. You must explicitly tell the directive what size your items will be in the DOM, using directive attributes. Pixel amounts or percentages are allowed (see below).
 * 3. The elements rendered will be absolutely positioned: be sure to let your CSS work with
 * this (see below).
 * 4. Keep the HTML of your repeated elements as simple as possible. As the user scrolls down,
 * elements will be lazily compiled. Resultingly, the more complicated your elements, the more
 * likely it is that the on-demand compilation will cause some jerkiness in the user's scrolling.
 * 5. The more elements you render on the screen per row, the more likelihood for scrolling to
 * slow down. It is recommended to keep grids of collection-repeat list elements at 3-wide or less.
 * For example, if you have a gallery of images just set their width to 33%.
 * 6. Each collection-repeat list will take up all of its parent scrollView's space.
 * If you wish to have multiple lists on one page, put each list within its own
 * {@link ionic.directive:ionScroll ionScroll} container.
 * 7. You should not use the ng-show and ng-hide directives on your ion-content/ion-scroll elements that have a collection-repeat inside.  ng-show and ng-hide apply the `display: none` css rule to the content's style, causing the scrollView to read the width and height of the content as 0.  Resultingly, collection-repeat will render elements that have just been un-hidden incorrectly.
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
 * ```css
 * .my-image-item {
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
/**
 * @ngdoc demo
 * @name collectionRepeat#contacts
 * @module collectionRepeatContacts
 * @javascript
angular.module('collectionRepeatContacts', ['ionic'])
.controller('ContactsCtrl', function($scope, $ionicScrollDelegate, $http, $ionicLoading) {
  var contacts = $scope.contacts = [];
  var currentCharCode = 'A'.charCodeAt(0) - 1;

  $ionicLoading.show({
    template: 'Fetching Contacts...'
  });

  $http.get('/contacts.json').then(function(response) {
    $ionicLoading.hide();
    response.data.sort(function(a, b) {
      return a.last_name > b.last_name ? 1 : -1;
    })
    .forEach(function(person) {
      //Get the first letter of the last name, and if the last name changes
      //put the letter in the array
      var personCharCode = person.last_name.toUpperCase().charCodeAt(0);
      //We may jump two letters, be sure to put both in
      //(eg if we jump from Adam Bradley to Bob Doe, add both C and D)
      var difference = personCharCode - currentCharCode;
      for (var i = 1; i <= difference; i++) {
        addLetter(currentCharCode + i);
      }
      currentCharCode = personCharCode;
      contacts.push(person);
    });

    //If names ended before Z, add everything up to Z
    for (var i = currentCharCode + 1; i <= 'Z'.charCodeAt(0); i++) {
      addLetter(i);
    }
  });

  function addLetter(code) {
    var letter = String.fromCharCode(code);
    contacts.push({
      isLetter: true,
      letter: letter
    });
  }

  //Letters are shorter, everything else is 100 pixels
  $scope.getItemHeight = function(item) {
    return item.isLetter ? 40 : 100;
  };

  $scope.scrollBottom = function() {
    $ionicScrollDelegate.scrollBottom(true);
  };

  $scope.scrollTop = function() {
    $ionicScrollDelegate.scrollTop();
  };

  var letterHasMatch = {};
  $scope.getContacts = function() {
    letterHasMatch = {};
    //Filter contacts by $scope.search.
    //Additionally, filter letters so that they only show if there
    //is one or more matching contact
    return contacts.filter(function(item) {
      var itemDoesMatch = !$scope.search || item.isLetter ||
        item.first_name.toLowerCase().indexOf($scope.search.toLowerCase()) > -1 ||
        item.last_name.toLowerCase().indexOf($scope.search.toLowerCase()) > -1;

      //Mark this person's last name letter as 'has a match'
      if (!item.isLetter && itemDoesMatch) {
        var letter = item.last_name.charAt(0).toUpperCase();
        letterHasMatch[letter] = true;
      }

      return itemDoesMatch;
    }).filter(function(item) {
      //Finally, re-filter all of the letters and take out ones that don't
      //have a match
      if (item.isLetter && !letterHasMatch[item.letter]) {
        return false;
      }
      return true;
    });
  };

  $scope.clearSearch = function() {
    $scope.search = '';
  };
});
 * 
 * @html
<div ng-controller="ContactsCtrl">
  <ion-header-bar class="bar-positive">
    <h1 class="title">1000 Contacts</h1>
    <div class="button" ng-click="scrollBottom()">
      Bottom
    </div>
  </ion-header-bar>
  <ion-header-bar class="bar-light bar-subheader">
    <input type="search"
      placeholder="Filter contacts..."
      ng-model="search"
      ng-change="scrollTop()">
    <button ng-if="search.length"
      class="button button-icon ion-android-close input-button"
      ng-click="clearSearch()">
    </button>
  </ion-header-bar>
  <ion-content>
    <div class="list">
      <a class="item contact-item"
        collection-repeat="item in getContacts()"
        collection-item-height="getItemHeight(item)"
        collection-item-width="100 + '%'"
        ng-style="{'line-height': getItemHeight(item) + 'px'}"
        ng-class="{'item-divider': item.isLetter}">
        <img ng-if="!item.isLetter" ng-src="http://placekitten.com/60/{{55 + ($index % 10)}}">
        {{item.letter || (item.first_name+' '+item.last_name)}}
      </a>
    </div>
  </ion-content>
</div>
 * 
 * @css
.button.button-icon.input-button {
  position: absolute;
  right: 0;
  top: 5px;
  color: #bbb;
}
.list .item.contact-item img {
  height: 60px;
  width: 60px;
  float: left;
  margin-top: 20px;
  margin-right: 10px;
}
.list .item.contact-item {
  left: 0;
  right: 0;
  padding-top: 0;
  padding-bottom: 0;
}
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
    link: function($scope, $element, $attr, scrollCtrl, $transclude) {
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
      $attr.collectionItemHeight = $attr.collectionItemHeight || '"100%"';
      $attr.collectionItemWidth = $attr.collectionItemWidth || '"100%"';

      var heightParsed = $attr.collectionItemHeight ?
        $parse($attr.collectionItemHeight) :
        function() { return scrollView.__clientHeight; };
      var widthParsed = $attr.collectionItemWidth ?
        $parse($attr.collectionItemWidth) :
        function() { return scrollView.__clientWidth; };

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

      function rerender(value) {
        scrollView.resize();
        dataSource.setData(value);
        collectionRepeatManager.resize();
      }
      function onWindowResize() {
        rerender($scope.$eval(listExpr));
      }

      ionic.on('resize', onWindowResize, window);

      $scope.$on('$destroy', function() {
        collectionRepeatManager.destroy();
        dataSource.destroy();
        ionic.off('resize', onWindowResize, window);
      });
    }
  };
}]);
