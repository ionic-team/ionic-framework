
/**
 * @ngdoc directive
 * @name ionSegmentedControl
 * @module ionic
 * @restrict E
 * @description
 * The segmented control works like a series of radio buttons but looks like iOS' equivalent UISegmentedControl.
 *
 * @usage:
 * ```html
 * <ion-segmented-control ng-model='value' options='possibleValues'></ion-segmented-control>
 * ```
 */
IonicModule
.directive('ionSegmentedControl', function() {
  return {
    restrict: 'E',
    replace: true,
    require: '?ngModel',
    scope: {
      ngModel: '=?',
      options: '=?'
    },
    controller: function($scope) {
      $scope.select = function(value) {
        $scope.ngModel = value;
      };
    },
    template: '<div class="segmented-control">' +
      '<button class="segmented-button" ' +
        'ng-repeat="option in options" ' +
        'ng-class="{selected: option == ngModel}" ' +
        'ng-click="select(option)"' +
        '>{{ option }}</button>' +
      '</div>'
  }
});
