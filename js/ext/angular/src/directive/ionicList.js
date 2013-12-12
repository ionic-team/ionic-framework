(function() {
'use strict';

angular.module('ionic.ui.list', ['ngAnimate'])

.directive('item', ['$timeout', function($timeout) {
  return {
    restrict: 'E',
    require: '?^list',
    replace: true,
    transclude: true,

    scope: {
      item: '=',
      itemType: '@',
      canDelete: '@',
      canReorder: '@',
      canSwipe: '@',
      onSelect: '&',
      onDelete: '&',
      optionButtons: '&',
      deleteIcon: '@',
      reorderIcon: '@'
    },

    template: '<div class="item item-complex" ng-class="itemClass" ng-click="selectClick()">\
            <div class="item-edit" ng-if="deleteClick !== undefined">\
              <button class="button button-icon icon" ng-class="deleteIconClass" ng-click="deleteClick()"></button>\
            </div>\
            <div class="item-content" ng-transclude></div>\
            <div class="item-drag" ng-if="reorderIconClass !== undefined">\
              <button data-ionic-action="reorder" class="button button-icon icon" ng-class="reorderIconClass"></button>\
            </div>\
            <div class="item-options" ng-if="itemOptionButtons">\
             <button ng-click="b.onClick(item, b)" class="button" ng-class="b.type" ng-repeat="b in itemOptionButtons" ng-bind="b.text"></button>\
           </div>\
          </div>',

    link: function($scope, $element, $attr, list) {
      if(!list) return;
      
      var $parentScope = list.scope;
      var $parentAttrs = list.attrs;

      // Set this item's class, first from the item directive attr, and then the list attr if item not set
      $scope.itemClass = $scope.itemType || $parentScope.itemType;

      // Decide if this item can do stuff, and follow a certain priority 
      // depending on where the value comes from
      if(($attr.canDelete ? $scope.canDelete : $parentScope.canDelete) !== "false") {
        if($attr.onDelete || $parentAttrs.onDelete) {

          // only assign this method when we need to
          // and use its existence to decide if the delete should show or not
          $scope.deleteClick = function() {
            if($attr.onDelete) {
              // this item has an on-delete attribute
              $scope.onDelete($scope.item);
            } else if($parentAttrs.onDelete) {
              // run the parent list's onDelete method
              // if it doesn't exist nothing will happen
              $parentScope.onDelete($scope.item);
            }
          };

          // Set which icons to use for deleting
          $scope.deleteIconClass = $scope.deleteIcon || $parentScope.deleteIcon || 'ion-minus-circled';
        }
      }

      if($attr.onSelect || $parentAttrs.onSelect) {
        // only assign this method when we need to
        $scope.selectClick = function() {
          if($attr.onSelect) {
            // this item has an on-delete attribute
            $scope.onSelect($scope.item);
          } else if($parentAttrs.onSelect) {
            // run the parent list's onDelete method
            // if it doesn't exist nothing will happen
            $parentScope.onSelect($scope.item);
          }
        };
      }

      // set the reorder Icon Class only if the item or list set can-reorder="true"
      if(($attr.canReorder ? $scope.canReorder : $parentScope.canReorder) === "true") {
        $scope.reorderIconClass = $scope.reorderIcon || $parentScope.reorderIcon || 'ion-navicon';
      }

      // Set the option buttons which can be revealed by swiping to the left
      // if canSwipe was set to false don't even bother
      if(($attr.canSwipe ? $scope.canSwipe : $parentScope.canSwipe) !== "false") {
        $scope.itemOptionButtons = $scope.optionButtons();
        if(typeof $scope.itemOptionButtons === "undefined") {
          $scope.itemOptionButtons = $parentScope.optionButtons();
        }
      }

    }
  };
}])

.directive('linkItem', [function() {
  return {
    restrict: 'E',
    require: '?^list',
    replace: true,
    transclude: true,

    scope: {
      item: '=',
      itemType: '@',
      canDelete: '@',
      canReorder: '@',
      canSwipe: '@',
      onSelect: '&',
      onDelete: '&',
      optionButtons: '&',
      deleteIcon: '@',
      reorderIcon: '@',
      href: '@'
    },

    template: '<a class="item item-complex" ng-class="itemClass" ng-href="{{ href }}" ng-click="onSelect()">\
            <div class="item-edit" ng-if="deleteClick !== undefined">\
              <button class="button button-icon icon" ng-class="deleteIconClass" ng-click="deleteClick()"></button>\
            </div>\
            <div class="item-content" ng-transclude></div>\
            <div class="item-drag" ng-if="reorderIconClass !== undefined">\
              <button data-ionic-action="reorder" class="button button-icon icon" ng-class="reorderIconClass"></button>\
            </div>\
            <div class="item-options" ng-if="itemOptionButtons">\
             <button ng-click="b.onClick(item, b)" class="button" ng-class="b.type" ng-repeat="b in itemOptionButtons" ng-bind="b.text"></button>\
           </div>\
          </a>',

    link: function($scope, $element, $attr, list) {
      if(!list) return;

      var $parentScope = list.scope;
      var $parentAttrs = list.attrs;

      $attr.$observe('href', function(value) {
        if(value) $scope.href = value.trim();
      });

      // Set this item's class, first from the item directive attr, and then the list attr if item not set
      $scope.itemClass = $scope.itemType || $parentScope.itemType;

      // Decide if this item can do stuff, and follow a certain priority 
      // depending on where the value comes from
      if(($attr.canDelete ? $scope.canDelete : $parentScope.canDelete) !== "false") {
        if($attr.onDelete || $parentAttrs.onDelete) {

          // only assign this method when we need to
          // and use its existence to decide if the delete should show or not
          $scope.deleteClick = function() {
            if($attr.onDelete) {
              // this item has an on-delete attribute
              $scope.onDelete($scope.item);
            } else if($parentAttrs.onDelete) {
              // run the parent list's onDelete method
              // if it doesn't exist nothing will happen
              $parentScope.onDelete($scope.item);
            }
          };

          // Set which icons to use for deleting
          $scope.deleteIconClass = $scope.deleteIcon || $parentScope.deleteIcon || 'ion-minus-circled';
        }
      }

      // set the reorder Icon Class only if the item or list set can-reorder="true"
      if(($attr.canReorder ? $scope.canReorder : $parentScope.canReorder) === "true") {
        $scope.reorderIconClass = $scope.reorderIcon || $parentScope.reorderIcon || 'ion-navicon';
      }

      // Set the option buttons which can be revealed by swiping to the left
      // if canSwipe was set to false don't even bother
      if(($attr.canSwipe ? $scope.canSwipe : $parentScope.canSwipe) !== "false") {
        $scope.itemOptionButtons = $scope.optionButtons();
        if(typeof $scope.itemOptionButtons === "undefined") {
          $scope.itemOptionButtons = $parentScope.optionButtons();
        }
      }

    }
  };
}])

.directive('list', ['$timeout', function($timeout) {
  return {
    restrict: 'E',
    replace: true,
    transclude: true,

    scope: {
      itemType: '@',
      canDelete: '@',
      canReorder: '@',
      canSwipe: '@',
      showDelete: '=',
      showReorder: '=',
      hasPullToRefresh: '@',
      onRefresh: '&',
      onRefreshOpening: '&',
      refreshComplete: '=',
      onSelect: '&',
      onDelete: '&',
      optionButtons: '&',
      deleteIcon: '@',
      reorderIcon: '@'
    },

    template: '<div class="list" ng-class="{\'list-editing\': showDelete, \'list-reordering\': showReorder}" ng-transclude></div>',

    controller: function($scope, $attrs) {
      this.scope = $scope;
      this.attrs = $attrs;
    },

    link: function($scope, $element, $attr) {
      var lv = new ionic.views.ListView({
        el: $element[0],
        listEl: $element[0].children[0],
        hasPullToRefresh: ($scope.hasPullToRefresh !== 'false'),
        onRefresh: function() {
          $scope.onRefresh();
          $scope.$parent.$broadcast('scroll.onRefresh');
        },
        onRefreshOpening: function(amt) {
          $scope.onRefreshOpening({amount: amt});
          $scope.$parent.$broadcast('scroll.onRefreshOpening', amt);
        },
        onReorder: function(el, oldIndex, newIndex) {
          $scope.$apply(function() {
            $scope.onReorder({el: el, start: oldIndex, end: newIndex});
          });
        }
      });

      $scope.listView = lv;

      if($attr.refreshComplete) {
        $scope.refreshComplete = function() {
          lv.doneRefreshing();
          $scope.$parent.$broadcast('scroll.onRefreshComplete');
        };
      }

      if($attr.animation) {
        $element[0].classList.add($attr.animation);
      }

      var destroyShowReorderWatch = $scope.$watch('showReorder', function(val) {
        if(val) {
          $element[0].classList.add('item-options-hide');
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
