angular.module('ionic.ui.list', ['ionic.service', 'ngAnimate'])

.directive('listItem', function() {
  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    template:   '<li class="list-item">' + 
                ' <div class="list-item-edit" ng-if="item.canDelete">' +
                '   <button class="button button-icon"><i class="icon-minus-sign"></i></button>' +
                ' </div>' +
                ' <div class="list-item-content" ng-transclude>' +
                ' </div>' +
                ' <div class="list-item-buttons" ng-if="item.canSwipe">' +
                '   <button ng-click="buttonClicked(button)" class="button" ng-class="button.type" ng-repeat="button in item.buttons">{{button.text}}</button>' +
                ' </div>' +
                '</li>',
    link: function($scope, $element, $attr) {
      $scope.buttonClicked = function(button) {
        button.buttonClicked && button.buttonClicked($scope.item);
      }
    }
  }
})

.directive('list', function() {
  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    scope: {
      isEditing: '=',
      items: '=',
      animation: '='
    },
    template: '<ul class="list" ng-class="{\'list-editing\': isEditing}">' +
                '<list-item ng-repeat="item in items" canDelete="item.canDelete" canSwipe="item.canSwipe" animation="my-repeat-animation">' +
                ' {{item.text}}' +
                ' <i class="{{item.icon}}" ng-if="item.icon"></i>' + 
                '</list-item>' + 
              '</ul>',
    compile: function(element, attr, transclude) {
      return function($scope, $element, $attr) {
        var lv = new ionic.views.List({el: $element[0]});

        if(attr.animation) {
          $element.addClass(attr.animation);
        }

        $element.append(transclude($scope));
      }
    }
  }
})
