(function(ionic) {
'use strict';

angular.module('ionic.ui.toggle', [])

// The Toggle directive is a toggle switch that can be tapped to change
// its value
.directive('ionToggle', function() {

  return {
    restrict: 'E',
    replace: true,
    require: '?ngModel',
    scope: {
      ngModel: '=?',
      ngValue: '=?',
      ngChecked: '=?',
      ngChange: '&',
      ngDisabled: '=?'
    },
    transclude: true,
    template: '<div class="item item-toggle disable-pointer-events">' +
                '<div ng-transclude></div>' +
                '<label class="toggle enable-pointer-events">' +
                  '<input type="checkbox" ng-model="ngModel" ng-value="ngValue" ng-change="ngChange()" ng-disabled="ngDisabled">' +
                  '<div class="track disable-pointer-events">' +
                    '<div class="handle"></div>' +
                  '</div>' +
                '</label>' +
              '</div>',

    compile: function(element, attr) {
      var input = element.find('input');
      if(attr.name) input.attr('name', attr.name);
      if(attr.ngChecked) input.attr('ng-checked', 'ngChecked');
      if(attr.ngTrueValue) input.attr('ng-true-value', attr.ngTrueValue);
      if(attr.ngFalseValue) input.attr('ng-false-value', attr.ngFalseValue);

      // return function link($scope, $element, $attr, ngModel) {
      //   var el, checkbox, track, handle;

      //   el = $element[0].getElementsByTagName('label')[0];
      //   checkbox = el.children[0];
      //   track = el.children[1];
      //   handle = track.children[0];

      //   $scope.toggle = new ionic.views.Toggle({
      //     el: el,
      //     track: track,
      //     checkbox: checkbox,
      //     handle: handle
      //   });

      //   ionic.on('drag', function(e) {
      //     console.log('drag');
      //     $scope.toggle.drag(e);
      //   }, handle);

      // }
    }

  };
});

})(window.ionic);
