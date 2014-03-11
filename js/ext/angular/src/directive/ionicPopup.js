(function() {
'use strict';

angular.module('ionic.ui.popup', [])

.directive('ionPopup', function() {
  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    link: function($scope, $element){
      //$element.addClass($scope.animation || '');
    },
    template: '<div class="popup-backdrop active">' +
                '<div class="popup">' +
                  '<div class="popup-head">' +
                    '<h3 class="popup-title">{{title}}</h3>' +
                  '</div>' +
                  '<div class="popup-body" ng-if="message">' +
                    '{{message}}' +
                  '</div>' +
                  '<div class="popup-buttons row">' +
                  '</div>' +
                '</div>' +
              '</div>'
  };
});

})();
