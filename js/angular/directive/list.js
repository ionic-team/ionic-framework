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
/**
 * @ngdoc demo
 * @name ionList#reorderDelete
 * @module listEverything
 * @javascript
 * angular.module('listEverything', ['ionic'])
 * .controller('ListCtrl', function($scope, $ionicPopup) {
 *   $scope.data = {
 *     showReorder: false,
 *     showDelete: false
 *   };
 *
 *   $scope.items = [];
 *   for (var i = 0; i < 20; i++) {
 *     $scope.items.push(i);
 *   }
 *
 *   $scope.toggleDelete = function() {
 *     $scope.data.showReorder = false;
 *     $scope.data.showDelete = !$scope.data.showDelete;
 *   };
 *   $scope.toggleReorder = function() {
 *     $scope.data.showDelete = false;
 *     $scope.data.showReorder = !$scope.data.showReorder;
 *   };
 *
 *   $scope.share = function(item) {
 *     alert('Sharing ' + item);
 *   };
 *   $scope.edit = function(item) {
 *     alert('Editing ' + item);
 *   };
 *
 *   $scope.reorderItem = function(item, fromIndex, toIndex) {
 *     $scope.items.splice(fromIndex, 1)
 *     $scope.items.splice(toIndex, 0, item)
 *   };
 * });
 *
 * @html
 * <div ng-controller="ListCtrl">
 *   <ion-header-bar class="bar-positive">
 *     <a class="button" ng-click="toggleDelete()">
 *       Delete
 *     </a>
 *     <h1 class="title">List</h1>
 *     <a class="button" ng-click="toggleReorder()">
 *       Reorder
 *     </a>
 *   </ion-header-bar>
 *   <ion-content>
 *     <ion-list show-delete="data.showDelete"
 *               show-reorder="data.showReorder">
 *       <ion-item ng-repeat="item in items"
 *                 class="item-thumbnail-left">
 *
 *         <img ng-src="http://placekitten.com/{{60+$index}}/{{61+2*$index}}">
 *         <h2>Item {{item}}</h2>
 *         <p>Here's an item description.</p>
 *         <ion-option-button class="button-positive"
 *                            ng-click="share(item)">
 *           Share
 *         </ion-option-button>
 *         <ion-option-button class="button-info"
 *                            ng-click="edit(item)">
 *           Edit
 *         </ion-option-button>
 *         <ion-delete-button class="ion-minus-circled"
 *                            ng-click="items.splice($index, 1)">
 *         </ion-delete-button>
 *         <ion-reorder-button class="ion-navicon"
 *                             on-reorder="reorderItem(item, $fromIndex, $toIndex)">
 *         </ion-reorder-button>
 *
 *       </ion-item>
 *     </ion-list>
 *   </ion-content>
 * </div>
 */
/**
 * @ngdoc demo
 * @name ionList#animated
 * @module listAnimated
 * @javascript
 * angular.module('listAnimated', ['ionic'])
 * .controller('AnimatedListCtrl', function($scope, $timeout) {
 *   var nextItem = 0;
 *   $scope.items = [];
 *   for (var i=0; i < 5; i++) {
 *     $scope.items.push('Item ' + (nextItem++));
 *   }
 *
 *   $scope.addItem = function(atIndex) {
 *     $scope.items.splice(atIndex + 1, 0, 'Item ' + nextItem);
 *     nextItem++;
 *   };
 * });
 *
 * @html
 * <div ng-controller="AnimatedListCtrl">
 *   <ion-header-bar class="bar-positive">
 *     <h1 class="title">Animated List</h1>
 *   </ion-header-bar>
 *   <ion-content>
 *     <ion-list show-delete="showDelete">
 *
 *       <ion-item class="animated-item"
 *                 ng-repeat="item in items">
 *         {{item}}
 *         <div class="item-note">
 *           <a class="button button-small"
 *              ng-click="addItem($index)">
 *              Add
 *           </a>
 *           <a class="button button-small"
 *              ng-click="items.splice($index, 1)">
 *             Remove
 *           </a>
 *         </div>
 *       </ion-item>
 *
 *     </ion-list>
 *   </ion-content>
 * </div>
 *
 * @css
 * .animated-item .item-note .button {
 *   margin-top: 10px;
 * }
 * .animated-item {
 *   line-height: 52px;
 *   max-height: 52px;
 *   padding-top: 0;
 *   padding-bottom: 0;
 *   -webkit-transition: all 0.15s linear;
 *   -moz-transition: all 0.15s linear;
 *   transition: all 0.15s linear;
 * }
 * .animated-item.ng-leave.ng-leave-active,
 * .animated-item.ng-enter {
 *   opacity: 0;
 *   max-height: 0;
 * }
 * .animated-item.ng-leave,
 * .animated-item.ng-enter.ng-enter-active {
 *   opacity: 1;
 *   max-height: 52px;
 * }
 */
IonicModule
.directive('ionList', [
  '$animate',
  '$timeout',
function($animate, $timeout) {
  return {
    restrict: 'E',
    require: ['ionList', '^?$ionicScroll'],
    controller: '$ionicList',
    compile: function($element, $attr) {
      var listEl = jqLite('<div class="list">')
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
              var itemScope = jqLite(el).scope();
              if (itemScope && itemScope.$onReorder) {
                //Make sure onReorder is called in apply cycle,
                //but also make sure it has no conflicts by doing
                //$evalAsync
                itemScope.$evalAsync(function() {
                  itemScope.$onReorder(oldIndex, newIndex);
                });
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

          if (angular.isDefined($attr.showDelete)) {
            $scope.$watch('!!(' + $attr.showDelete + ')', function(value) {
              listCtrl.showDelete(value);
            });
          }
          if (angular.isDefined($attr.showReorder)) {
            $scope.$watch('!!(' + $attr.showReorder + ')', function(value) {
              listCtrl.showReorder(value);
            });
          }

          $scope.$watch(function() {
            return listCtrl.showDelete();
          }, function(isShown, wasShown) {
            //Only use isShown=false if it was already shown
            if (!isShown && !wasShown) { return; }

            if (isShown) listCtrl.closeOptionButtons();
            listCtrl.canSwipeItems(!isShown);

            $element.children().toggleClass('list-left-editing', isShown);
            toggleNgHide('.item-delete.item-left-edit', isShown);
            toggleTapDisabled('.item-content', isShown);
          });
          $scope.$watch(function() {
            return listCtrl.showReorder();
          }, function(isShown, wasShown) {
            //Only use isShown=false if it was already shown
            if (!isShown && !wasShown) { return; }

            if (isShown) listCtrl.closeOptionButtons();
            listCtrl.canSwipeItems(!isShown);

            $element.children().toggleClass('list-right-editing', isShown);
            toggleNgHide('.item-reorder.item-right-edit', isShown);
            toggleTapDisabled('.item-content', isShown);
          });

          function toggleNgHide(selector, shouldShow) {
            forEach($element[0].querySelectorAll(selector), function(node) {
              if (shouldShow) {
                $animate.removeClass(jqLite(node), 'ng-hide');
              } else {
                $animate.addClass(jqLite(node), 'ng-hide');
              }
            });
          }
          function toggleTapDisabled(selector, shouldDisable) {
            var el = jqLite($element[0].querySelectorAll(selector));
            if (shouldDisable) {
              el.attr('data-tap-disabled', 'true');
            } else {
              el.removeAttr('data-tap-disabled');
            }
          }
        }

      };
    }
  };
}]);
