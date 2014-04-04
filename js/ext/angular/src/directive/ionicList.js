(function() {
  'use strict';

  var TPL_CONTENT_ANCHOR =
    '<a class="item-content" ng-href="{{$href()}}"></a>';
  var TPL_CONTENT =
    '<div class="item-content"></div>';
  var TPL_DELETE_BUTTON =
    '<div class="item-left-edit item-delete ng-hide">' +
    '</div>';
  var TPL_REORDER_BUTTON =
    '<div data-prevent-scroll="true" class="item-right-edit item-reorder ng-hide">' +
    '</div>';
  var TPL_OPTION_BUTTONS =
    '<div class="item-options invisible">' +
    '</div>';

  angular.module('ionic.ui.list', ['ngAnimate'])

  /**
   * @ngdoc service
   * @name $ionicListDelegate
   * @module ionic
   *
   * @description
   * Delegate for controlling the {@link ionic.directive:ionList} directive.
   *
   * Methods called directly on the $ionicListDelegate service will control all lists.
   * Use the {@link ionic.service:$ionicListDelegate#$getByHandle $getByHandle}
   * method to control specific ionList instances.
   *
   * @usage
   *
   * ````html
   * <ion-content ng-controller="MyCtrl">
   *   <button class="button" ng-click="showDeleteButtons()"></button>
   *   <ion-list>
   *     <ion-item ng-repeat="i in items">>
   *       {% raw %}Hello, {{i}}!{% endraw %}
   *       <ion-delete-button class="ion-minus-circled"></ion-delete-button>
   *     </ion-item>
   *   </ion-list>
   * </ion-content>
   * ```
   * ```js
   * function MyCtrl($scope, $ionicListDelegate) {
   *   $scope.showDeleteButtons = function() {
   *     $ionicListDelegate.showDelete(true);
   *   };
   * }
   * ```
   */
  .service('$ionicListDelegate', delegateService([
    /**
     * @ngdoc method
     * @name $ionicListDelegate#showReorder
     * @param {boolean=} showReorder Set whether or not this list is showing its reorder buttons.
     * @returns {boolean} Whether the reorder buttons are shown.
     */
    'showReorder',
    /**
     * @ngdoc method
     * @name $ionicListDelegate#showDelete
     * @param {boolean=} showReorder Set whether or not this list is showing its delete buttons.
     * @returns {boolean} Whether the delete buttons are shown.
     */
    'showDelete',
    /**
     * @ngdoc method
     * @name $ionicListDelegate#canSwipeItems
     * @param {boolean=} showReorder Set whether or not this list is able to swipe to show
     * option buttons.
     * @returns {boolean} Whether the list is able to swipe to show option buttons.
     */
    'canSwipeItems',
    /**
     * @ngdoc method
     * @name $ionicListDelegate#closeOptionButtons
     * @description Closes any option buttons on the list that are swiped open.
     */
    'closeOptionButtons',
    /**
     * @ngdoc method
     * @name $ionicListDelegate#$getByHandle
     * @param {string} handle
     * @returns `delegateInstance` A delegate instance that controls only the
     * {@link ionic.directive:ionList} directives with `delegate-handle` matching
     * the given handle.
     *
     * Example: `$ionicListDelegate.$getByHandle('my-handle').showReorder(true);`
     */
  ]))

  .controller('$ionicList', [
    '$scope',
    '$attrs',
    '$parse',
    '$ionicListDelegate',
    function($scope, $attrs, $parse, $ionicListDelegate) {

      var isSwipeable = true;
      var isReorderShown = false;
      var isDeleteShown = false;

      var deregisterInstance = $ionicListDelegate._registerInstance(this, $attrs.delegateHandle);
      $scope.$on('$destroy', deregisterInstance);

      this.showReorder = function(show) {
        if (arguments.length) {
          isReorderShown = !!show;
        }
        return isReorderShown;
      };

      this.showDelete = function(show) {
        if (arguments.length) {
          isDeleteShown = !!show;
        }
        return isDeleteShown;
      };

      this.canSwipeItems = function(can) {
        if (arguments.length) {
          isSwipeable = !!can;
        }
        return isSwipeable;
      };

      this.closeOptionButtons = function() {
        this.listView && this.listView.clearDragEffects();
      };
    }])

/**
 * @ngdoc directive
 * @name ionList
 * @module ionic
 * @delegate ionic.service:$ionicListDelegate
 * @codepen JsHjf
 * @restrict E
 * @description
 * The List is a widely used interface element in almost any mobile app, and can include
 * content ranging from basic text all the way to buttons, toggles, icons, and thumbnails.
 *
 * Both the list, which contains items, and the list items themselves can be any HTML
 * element. The containing element requires the `list` class and each list item requires
 * the `item` class.
 *
 * However, using the ionList and ionItem directives make it easy to support various
 * interaction modes such as swipe to edit, drag to reorder, and removing items.
 *
 * Related: {@link ionic.directive:ionItem}, {@link ionic.directive:ionOptionButton}
 * {@link ionic.directive:ionReorderButton}, {@link ionic.directive:ionDeleteButton}, [`list CSS documentation`](/docs/components/#list).
 *
 * @usage
 *
 * Basic Usage:
 *
 * ```html
 * <ion-list>
 *   <ion-item ng-repeat="item in items">
 *     {% raw %}Hello, {{item}}!{% endraw %}
 *   </ion-item>
 * </ion-list>
 * ```
 *
 * Advanced Usage: Thumbnails, Delete buttons, Reordering, Swiping
 *
 * ```html
 * <ion-list ng-controller="MyCtrl"
 *           show-delete="shouldShowDelete"
 *           show-reorder="shouldShowReorder"
 *           can-swipe="listCanSwipe">
 *   <ion-item ng-repeat="item in items"
 *             class="item-thumbnail-left">
 *
 *     {% raw %}<img ng-src="{{item.img}}">
 *     <h2>{{item.title}}</h2>
 *     <p>{{item.description}}</p>{% endraw %}
 *     <ion-option-button class="button-positive"
 *                        ng-click="share(item)">
 *       Share
 *     </ion-option-button>
 *     <ion-option-button class="button-info"
 *                        ng-click="edit(item)">
 *       Edit
 *     </ion-option-button>
 *     <ion-delete-button class="ion-minus-circled"
 *                        ng-click="items.splice($index, 1)">
 *     </ion-delete-button>
 *     <ion-reorder-button class="ion-navicon"
 *                         on-reorder="reorderItem(item, $fromIndex, $toIndex)">
 *     </ion-reorder-button>
 *
 *   </ion-item>
 * </ion-list>
 * ```
 *
 * @param {string=} delegate-handle The handle used to identify this list with
 * {@link ionic.service:$ionicListDelegate}.
 * @param show-delete {boolean=} Whether the delete buttons for the items in the list are
 * currently shown or hidden.
 * @param show-reorder {boolean=} Whether the reorder buttons for the items in the list are
 * currently shown or hidden.
 * @param can-swipe {boolean=} Whether the items in the list are allowed to be swiped to reveal
 * option buttons. Default: true.
 */
.directive('ionList', [
  '$animate',
  '$timeout',
function($animate, $timeout) {
  return {
    restrict: 'E',
    require: ['ionList', '^?$ionicScroll'],
    controller: '$ionicList',
    compile: function($element, $attr) {
      var listEl = angular.element('<div class="list">')
        .append( $element.contents() );
      $element.append(listEl);

      return function($scope, $element, $attrs, ctrls) {
        var listCtrl = ctrls[0];
        var scrollCtrl = ctrls[1];

        //Wait for child elements to render...
        $timeout(init);

        function init() {
          var listView = listCtrl.listView = new ionic.views.ListView({
            el: $element[0],
            listEl: $element.children()[0],
            scrollEl: scrollCtrl && scrollCtrl.element,
            scrollView: scrollCtrl && scrollCtrl.scrollView,
            onReorder: function(el, oldIndex, newIndex) {
              var itemScope = angular.element(el).scope();
              if (itemScope && itemScope.$onReorder) {
                itemScope.$onReorder(oldIndex, newIndex);
              }
            },
            canSwipe: function() {
              return listCtrl.canSwipeItems();
            }
          });

          if (angular.isDefined($attr.canSwipe)) {
            $scope.$watch('!!(' + $attr.canSwipe + ')', function(value) {
              listCtrl.canSwipeItems(value);
            });
          }

          $scope.$watch('!!(' + $attr.showDelete + ')', function(value, oldValue) {
            //Don't care about first false value
            if (!value && !angular.isDefined(oldValue)) return;

            if (value) listCtrl.closeOptionButtons();
            listCtrl.showDelete(value);

            $element.children().toggleClass('list-left-editing', value);
            toggleNgHide('.item-delete.item-left-edit', value);
          });
          $scope.$watch('!!(' + $attr.showReorder + ')', function(value, oldValue) {
            //Don't care about first false value
            if (!value && !angular.isDefined(oldValue)) return;

            if (value) listCtrl.closeOptionButtons();
            listCtrl.showReorder(value);

            $element.children().toggleClass('list-right-editing', value);
            toggleNgHide('.item-reorder.item-right-edit', value);
          });

          function toggleNgHide(selector, shouldShow) {
            angular.forEach($element[0].querySelectorAll(selector), function(node) {
              if (shouldShow) $animate.removeClass(angular.element(node), 'ng-hide');
              else $animate.addClass(angular.element(node), 'ng-hide');
            });
          }
        }

      };
    }
  };
}])

.controller('$ionicItem', [
  '$scope',
  '$element',
function($scope, $element) {
  this.$element = $element;
  this.$scope = $scope;
}])

/**
 * @ngdoc directive
 * @name ionItem
 * @parent ionic.directive:ionList
 * @module ionic
 * @restrict E
 * Creates a list-item that can easily be swiped,
 * deleted, reordered, edited, and more.
 *
 * See {@link ionic.directive:ionList} for a complete example & explanation.
 *
 * Can be assigned any item class name. See the
 * [list CSS documentation](/docs/components/#list).
 *
 * @usage
 *
 * ```html
 * <ion-list>
 *   <ion-item>Hello!</ion-item>
 * </ion-list>
 * ```
 */
.directive('ionItem', ['$animate', '$compile', function($animate, $compile) {
  return {
    restrict: 'E',
    controller: '$ionicItem',
    priorty: Number.MAX_VALUE,
    require: ['ionItem', '^ionList'],
    scope: true,
    compile: function($element, $attrs) {
      var isAnchor = angular.isDefined($attrs.href) || angular.isDefined($attrs.ngHref);
      var isComplexItem = isAnchor ||
        //Lame way of testing, but we have to know at compile what to do with the element
        /ion-(delete|option|reorder)-button/.test($element.html());

      if (isComplexItem) {
        var innerElement = angular.element(isAnchor ? TPL_CONTENT_ANCHOR : TPL_CONTENT);
        innerElement.append($element.contents());

        $element.append(innerElement);
        $element.addClass('item item-complex');
      } else {
        $element.addClass('item');
      }

      return function link($scope, $element, $attrs) {
        $scope.$href = function() {
          return $attrs.href || $attrs.ngHref;
        };
      };
    }
  };
}])

/**
 * @ngdoc directive
 * @name ionDeleteButton
 * @parent ionic.directive:ionItem
 * @module ionic
 * @restrict E
 * Creates a delete button inside a list item, that is visible when the
 * {@link ionic.directive:ionList ionList parent's} `show-delete` evaluates to true or
 * `$ionicListDelegate.showDelete(true)` is called.
 *
 * Takes any ionicon as a class.
 *
 * See {@link ionic.directive:ionList} for a complete example & explanation.
 *
 * @usage
 *
 * ```html
 * <ion-list show-delete="shouldShowDelete">
 *   <ion-item>
 *     <ion-delete-button class="ion-minus-circled"></ion-delete-button>
 *     Hello, list item!
 *   </ion-item>
 * </ion-list>
 * <ion-toggle ng-model="shouldShowDelete">
 *   Show Delete?
 * </ion-toggle>
 * ```
 */
.directive('ionDeleteButton', [function() {
  return {
    restrict: 'E',
    require: '^ionItem',
    //Run before anything else, so we can move it before other directives process
    //its location (eg ngIf relies on the location of the directive in the dom)
    priority: Number.MAX_VALUE,
    compile: function($element, $attr) {
      //Add the classes we need during the compile phase, so that they stay
      //even if something else like ngIf removes the element and re-addss it
      $attr.$set('class', ($attr.class || '') + ' button icon button-icon', true);
      return function($scope, $element, $attr, itemCtrl) {
        var container = angular.element(TPL_DELETE_BUTTON);
        container.append($element);
        itemCtrl.$element.append(container).addClass('item-left-editable');
      };
    }
  };
}])

/**
 * @ngdoc directive
 * @name ionReorderButton
 * @parent ionic.directive:ionItem
 * @module ionic
 * @restrict E
 * Creates a reorder button inside a list item, that is visible when the
 * {@link ionic.directive:ionList ionList parent's} `show-reorder` evaluates to true or
 * `$ionicListDelegate.showReorder(true)` is called.
 *
 * Can be dragged to reorder items in the list. Takes any ionicon class.
 *
 * When an item reorder is complete, the `on-reorder` callback given in the attribute is called
 * (see below).
 *
 * See {@link ionic.directive:ionList} for a complete example.
 *
 * @usage
 *
 * ```html
 * <ion-list ng-controller="MyCtrl">
 *   <ion-item ng-repeat="item in items">
 *     Item {{$index}}
 *     <ion-reorder-button class="ion-navicon"
 *                         on-reorder="moveItem(item, $fromIndex, $toIndex)">
 *     </ion-reorder>
 *   </ion-item>
 * </ion-list>
 * ```
 * ```js
 * function MyCtrl($scope) {
 *   $scope.items = [1, 2, 3, 4];
 *   $scope.moveItem = function(item, fromIndex, toIndex) {
 *     //Move the item in the array
 *     $scope.items.splice(fromIndex, 1);
 *     $scope.items.splice(toIndex, 0, item);
 *   };
 * }
 * ```
 *
 * @param {expression=} on-reorder Expression to call when an item is reordered.
 * Parameters given: $fromIndex, $toIndex.
 */
.directive('ionReorderButton', [function() {
  return {
    restrict: 'E',
    require: '^ionItem',
    priority: Number.MAX_VALUE,
    compile: function($element, $attr) {
      $attr.$set('class', ($attr.class || '') + ' button icon button-icon', true);
      $element[0].setAttribute('data-prevent-scroll', true);
      return function($scope, $element, $attr, itemCtrl) {
        $scope.$onReorder = function(oldIndex, newIndex) {
          $scope.$eval($attr.onReorder, {
            $fromIndex: oldIndex,
            $toIndex: newIndex
          });
        };

        var container = angular.element(TPL_REORDER_BUTTON);
        container.append($element);
        itemCtrl.$element.append(container).addClass('item-right-editable');
      };
    }
  };
}])

/**
 * @ngdoc directive
 * @name ionOptionButton
 * @parent ionic.directive:ionItem
 * @module ionic
 * @restrict E
 * Creates an option button inside a list item, that is visible when the item is swiped
 * to the left by the user.  Swiped open option buttons can be hidden with
 * {@link ionic.directive:$ionicListDelegate#closeOptionButtons $ionicListDelegate#closeOptionButtons}.
 *
 * Can be assigned any button class.
 *
 * See {@link ionic.directive:ionList} for a complete example & explanation.
 *
 * @usage
 *
 * ```html
 * <ion-list>
 *   <ion-item>
 *     I love kittens!
 *     <ion-option-button class="button-positive">Share</ion-option-button>
 *     <ion-option-button class="button-assertive">Edit</ion-option-button>
 *   </ion-item>
 * </ion-list>
 * ```
 */
.directive('ionOptionButton', ['$compile', function($compile) {
  return {
    restrict: 'E',
    require: '^ionItem',
    priority: Number.MAX_VALUE,
    compile: function($element, $attr) {
      $attr.$set('class', ($attr.class || '') + ' button', true);
      return function($scope, $element, $attr, itemCtrl) {
        if (!itemCtrl.optionsContainer) {
          itemCtrl.optionsContainer = angular.element(TPL_OPTION_BUTTONS);
          itemCtrl.$element.append(itemCtrl.optionsContainer);
        }
        itemCtrl.optionsContainer.append($element);
      };
    }
  };
}]);

})();
