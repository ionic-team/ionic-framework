var chat = angular.module('Chat', ['ngTouch']);

chat.controller('MenuCtrl', function($scope) {
  $scope.isPanelShowing = false;
});

chat.controller('RoomsCtrl', function($scope) {
  $scope.rooms = [
    { name: 'All', key: 'all' },
    { name: 'Marketing', key: 'marketing' }
  ];
  
  $scope.openPanel = function() {
    console.log('Open panel');
    $scope.isPanelShowing = true;
  };
});

