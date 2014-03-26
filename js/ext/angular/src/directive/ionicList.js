(function() {
'use strict';

angular.module('ionic.ui.list', ['ngAnimate'])

/**
 * @ngdoc directive
 * @name ionItem
 * @module ionic
 * @restrict E
 * @parent ionic.directive:ionList
 *
 * @description
 * The ionItem directive creates a list-item that can easily be swiped,
 * deleted, reordered, edited, and more.
 *
 * @usage
 * ```html
 * <ion-list>
 *   <ion-item ng-repeat="item in items"
 *     item="item"
 *     can-swipe="true"
 *     option-buttons="myItemButtons">
 *   </ion-item>
 * </ion-list>
 * ```
 *
 * @param {string=} item-type The type of this item.  See [the list CSS page](/docs/components/#list) for available item types.
 * @param {expression=} option-buttons The option buttons to show when swiping the item to the left (if swiping is enabled).  Defaults to the ionList parent's option-buttons setting.  The format of each button object is:
 *   ```js
 *   {
 *     text: 'Edit',
 *     type: 'Button',
 *     onTap: function(item) {}
 *   }
 *   ```
 *
 * @param {expression=} item The 'object' representing this item, to be passed in to swipe, delete, and reorder callbacks.
 * @param {boolean=} can-swipe Whether or not this item can be swiped. Defaults ot the ionList parent's can-swipe setting.
 * @param {boolean=} can-delete Whether or not this item can be deleted. Defaults to the ionList parent's can-delete setting.
 * @param {boolean=} can-reorder Whether or not this item can be reordered. Defaults to the ionList parent's can-reorder setting.
 * @param {expression=} on-delete The expression to call when this item is deleted.
 * @param {string=} delete-icon The class name of the icon to show on this item while deleting. Defaults to the ionList parent's delete-icon setting.
 * @param {string=} reorder-icon The class name of the icon to show on this item while reordering. Defaults to the ionList parent's reorder-icon setting.
 */
.directive('ionItem', ['$timeout', '$parse', function($timeout, $parse) {
  return {
    restrict: 'E',
    require: '?^ionList',
    replace: true,
    transclude: true,

    scope: {
      item: '=',
      itemType: '@',
      canDelete: '@',
      canReorder: '@',
      canSwipe: '@',
      onDelete: '&',
      optionButtons: '&',
      deleteIcon: '@',
      reorderIcon: '@'
    },

    template: '<div class="item item-complex">\
            <div class="item-left-edit item-delete" ng-if="deleteClick !== undefined">\
              <button class="button button-icon icon" ng-class="deleteIconClass" ng-click="deleteClick()" ion-stop-event="click"></button>\
            </div>\
            <a class="item-content" ng-href="{{ href }}" ng-transclude></a>\
            <div class="item-right-edit item-reorder" ng-if="reorderIconClass !== undefined">\
              <button data-ionic-action="reorder" data-prevent-scroll="true" class="button button-icon icon" ng-class="reorderIconClass"></button>\
            </div>\
            <div class="item-options" ng-if="itemOptionButtons">\
             <button ng-click="b.onTap(item, b)" ion-stop-event="click" class="button" ng-class="b.type" ng-repeat="b in itemOptionButtons" ng-bind="b.text"></button>\
           </div>\
          </div>',

    link: function($scope, $element, $attr, list) {
      if(!list) return;

      var $parentScope = list.scope;
      var $parentAttrs = list.attrs;

      $attr.$observe('href', function(value) {
        if(value) $scope.href = value.trim();
      });

      if(!$scope.itemType) {
        $scope.itemType = $parentScope.itemType;
      }

      // Set this item's class, first from the item directive attr, and then the list attr if item not set
      $element.addClass($scope.itemType || $parentScope.itemType);

      $scope.itemClass = $scope.itemType;

      // Decide if this item can do stuff, and follow a certain priority
      // depending on where the value comes from
      if(($attr.canDelete ? $scope.canDelete : $parentScope.canDelete) !== "false") {
        if($attr.onDelete || $parentAttrs.onDelete) {

          // only assign this method when we need to
          // and use its existence to decide if the delete should show or not
          $scope.deleteClick = function() {
            if($attr.onDelete) {
              // this item has an on-delete attribute
              $scope.onDelete({ item: $scope.item, index: $scope.$parent.$index });
            } else if($parentAttrs.onDelete) {
              // run the parent list's onDelete method
              // if it doesn't exist nothing will happen
              $parentScope.onDelete({ item: $scope.item, index: $scope.$parent.$index });
            }
          };

          // Set which icons to use for deleting
          $scope.deleteIconClass = $scope.deleteIcon || $parentScope.deleteIcon || 'ion-minus-circled';
          $element.addClass('item-left-editable');
        }
      }

      // set the reorder Icon Class only if the item or list set can-reorder="true"
      if(($attr.canReorder ? $scope.canReorder : $parentScope.canReorder) === "true") {
        $scope.reorderIconClass = $scope.reorderIcon || $parentScope.reorderIcon || 'ion-navicon';
        $element.addClass('item-right-editable');
      }

      // Set the option buttons which can be revealed by swiping to the left
      // if canSwipe was set to false don't even bother
      if(($attr.canSwipe ? $scope.canSwipe : $parentScope.canSwipe) !== "false") {
        $scope.itemOptionButtons = $scope.optionButtons();
        if(typeof $scope.itemOptionButtons === "undefined") {
          $scope.itemOptionButtons = $parentScope.optionButtons();
        }
        $element.addClass('item-swipeable');
      }

    }
  };
}])

/**
 * @ngdoc directive
 * @name ionList
 * @module ionic
 * @restrict E
 * @codepen jsHjf
 *
 * @description
 * The List is a widely used interface element in almost any mobile app,
 * and can include content ranging from basic text all the way to buttons,
 * toggles, icons, and thumbnails.
 *
 * Both the list, which contains items, and the list items themselves can be
 * any HTML element. The containing element requires the list class and each
 * list item requires the item class. Ionic also comes with pre-built Angular
 * directives to make it easier to create a complex list.
 *
 * Using the ionList and {@link ionic.directive:ionItem} directives
 * make it easy to support various interaction modes such as swipe to edit,
 * drag to reorder, and removing items.
 *
 * However, if you need just a simple list you won't be required to use the
 * directives, but rather just use the classnames.
 * This demo is a simple list without using the directives.
 *
 * See the {@link ionic.directive:ionItem} documentation for more information on list items.
 *
 * @usage
 * ```html
 * <ion-list>
 *   <ion-item ng-repeat="item in items" item="item">
 *   </ion-item>
 * </ion-list>
 * ```
 *
 * @param {string=} item-type The type of this item.  See [the list CSS page](/docs/components/#list) for available item types.
 * @param {expression=} on-delete Called when a child item is deleted.
 * @param {expression=} on-reorder Called when a child item is reordered.
 * @param {boolean=} show-delete Whether to show each item delete button.
 * @param {boolean=} show-reoder Whether to show each item's reorder button.
 * @param {boolean=} can-delete Whether child items are able to be deleted or not.
 * @param {boolean=} can-reorder Whether child items can be reordered or not.
 * @param {boolean=} can-swipe Whether child items can be swiped to reveal option buttons.
 * @param {string=} delete-icon The class name of the icon to show on child items while deleting.  Defaults to `ion-minus-circled`.
 * @param {string=} reorder-icon The class name to show on child items while reordering. Defaults to `ion-navicon`.
 * @param {string=} animation An animation class to apply to the list for animating when child items enter or exit the list.
 */
.directive('ionList', ['$timeout', function($timeout) {
  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    require: '^?$ionicScroll',
    scope: {
      itemType: '@',
      canDelete: '@',
      canReorder: '@',
      canSwipe: '@',
      showDelete: '=',
      showReorder: '=',
      onDelete: '&',
      onReorder: '&',
      optionButtons: '&',
      deleteIcon: '@',
      reorderIcon: '@'
    },

    template: '<div class="list" ng-class="{\'list-left-editing\': showDelete, \'list-right-editing\': showReorder}" ng-transclude></div>',

    controller: ['$scope', '$attrs', function($scope, $attrs) {
      this.scope = $scope;
      this.attrs = $attrs;
    }],

    link: function($scope, $element, $attr, ionicScrollCtrl) {
      $scope.listView = new ionic.views.ListView({
        canSwipe: $scope.canSwipe !== "false" && !!$scope.optionButtons(),
        el: $element[0],
        listEl: $element[0].children[0],
        scrollEl: ionicScrollCtrl && ionicScrollCtrl.element,
        scrollView: ionicScrollCtrl && ionicScrollCtrl.scrollView,
        onReorder: function(el, oldIndex, newIndex) {
          $scope.$apply(function() {
            $scope.onReorder({el: el, start: oldIndex, end: newIndex});
          });
        }
      });

      if($attr.animation) {
        $element[0].classList.add($attr.animation);
      }

      var destroyShowReorderWatch = $scope.$watch('showReorder', function(val) {
        if(val) {
          $element[0].classList.add('item-options-hide');
          $scope.listView && $scope.listView.clearDragEffects();
        } else if(val === false) {
          // false checking is because it could be undefined
          // if its undefined then we don't care to do anything
          $timeout(function(){
            $element[0].classList.remove('item-options-hide');
          }, 250);
        }
      });

      $scope.$on('$destroy', function () {
        destroyShowReorderWatch();
      });

    }
  };
}]);

})();
