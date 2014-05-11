(function (window, angular){
  "use strict";

  angular.module('ionicApp', ['ionic'])
    .controller('DropdownCtrl', function ($scope, $timeout, $ionicDropdown) {
      console.log('DropdownCtrl')

      $ionicDropdown.fromTemplateUrl('template/ionic.html', {
        scope: $scope
      }).then(function(dropdown) {
        $scope.ionic = dropdown;
      })

      $ionicDropdown.fromTemplateUrl('template/chat.html', {
        scope: $scope
      }).then(function(dropdown) {
        $scope.chat = dropdown;
      })

      $ionicDropdown.fromTemplateUrl('template/fork.html', {
        scope: $scope
      }).then(function(dropdown) {
        $scope.fork = dropdown;
      })

      $ionicDropdown.fromTemplateUrl('template/drop.html', {
        scope: $scope
      }).then(function(dropdown) {
        $scope.drop = dropdown;
      })

    })

})(window, window.angular)