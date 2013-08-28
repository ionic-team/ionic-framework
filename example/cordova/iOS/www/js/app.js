var chat = angular.module('Chat', ['ngTouch']);

chat.controller('MenuCtrl', function($scope) {
});

chat.controller('RoomsCtrl', function($scope) {
  $scope.rooms = [
    { name: 'All', key: 'all' },
    { name: 'Marketing', key: 'marketing' }
  ];
  
  $scope.openPanel = function() {
    $scope.isPanelShowing = true;
  };

  $scope.showAlert = function() {
    alert("WHAT");
  }
});

