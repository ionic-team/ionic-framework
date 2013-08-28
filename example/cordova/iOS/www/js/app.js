var chat = angular.module('Chat', []);

chat.controller('RoomsCtrl', function($scope) {
  $scope.rooms = [
    { name: 'All', key: 'all' },
    { name: 'Marketing', key: 'marketing' }
  ];
});

