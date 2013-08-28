var chat = angular.module('Chat', ['ngTouch']);

chat.service('MenuService', function() {
  this.openPanel = function() {
    console.log('Opening panel');
  }
});

chat.controller('MenuCtrl', function($scope) {
  $scope.isPanelShowing = false;
});

chat.controller('RoomsCtrl', function($scope, MenuService) {
  $scope.rooms = [
    { name: 'All', key: 'all' },
    { name: 'Marketing', key: 'marketing' }
  ];
  
  $scope.openPanel = function() {
    MenuService.openPanel();
  };

  $scope.showAlert = function() {
    alert("WHAT");
  }
});

