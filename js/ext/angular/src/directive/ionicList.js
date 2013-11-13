(function() {
'use strict';

angular.module('ionic.ui.list', ['ngAnimate'])

.directive('item', ['$timeout', function($timeout) {
  return {
    restrict: 'E',
    require: ['?^list'],
    replace: true,
    transclude: true,
    scope: {
      item: '=',
      onSelect: '&',
      onDelete: '&',
      canDelete: '@',
      canReorder: '@',
      canSwipe: '@',
      buttons: '=',
      type: '@'
    },
    template: '<a href="#" class="item">\
            <div class="item-edit" ng-if="canDelete && isEditing">\
              <button class="button button-icon" ng-click="onDelete()"><i ng-class="deleteIcon"></i></button>\
            </div>\
            <div class="item-content slide-left" ng-transclude>\
            </div>\
             <div class="item-drag" ng-if="canReorder && isEditing">\
               <button data-ionic-action="reorder" class="button button-icon"><i ng-class="reorderIcon"></i></button>\
             </div>\
            <div class="item-options" ng-if="canSwipe && !isEditing && showOptions">\
             <button ng-click="buttonClicked(button)" class="button" ng-class="button.type" ng-repeat="button in buttons">{{button.text}}</button>\
           </div>\
          </a>',

    link: function($scope, $element, $attr, list) {
      // Grab the parent list controller
      if(list[0]) {
        list = list[0];
      } else if(list[1]) {
        list = list[1];
      }

      // Add the list item type class
      $element.addClass($attr.type || 'item-slider');

      if($attr.type !== 'item-slider') {
        $scope.canSwipe = false;
      }

      $scope.isEditing = false;
      $scope.deleteIcon = list.scope.deleteIcon;
      $scope.reorderIcon = list.scope.reorderIcon;
      $scope.showOptions = true;

      $scope.buttonClicked = function(button) {
        button.onButtonClicked && button.onButtonClicked($scope.item, button);
      };

      list.scope.$watch('isEditing', function(v) {
        $scope.isEditing = v;

        // Add a delay before we allow the options layer to show, to avoid any odd
        // animation issues
        if(!v) {
          $timeout(function() {
            $scope.showOptions = true;
          }, 200);
        } else {
          $scope.showOptions = false;
        }
      });
    }
  };
}])

.directive('list', function() {
  return {
    restrict: 'E',
    replace: true,
    transclude: true,

    scope: {
      isEditing: '=',
      deleteIcon: '@',
      reorderIcon: '@',
      hasPullToRefresh: '@',
      onRefresh: '&',
      onRefreshOpening: '&'
    },

    controller: function($scope) {
      var _this = this;

      this.scope = $scope;

      $scope.$watch('isEditing', function(v) {
        _this.isEditing = true;
      });
    },

    template: '<ul class="list" ng-class="{\'list-editing\': isEditing}" ng-transclude>\
              </ul>',

    compile: function(element, attr, transclude) {
      return function($scope, $element, $attr) {
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
          }
        });

        if(attr.animation) {
          $element.addClass(attr.animation);
        }
      };
    }
  };
});

})();
