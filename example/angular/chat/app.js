var chat = angular.module('Chat', ['ngTouch']);

chat.controller('MenuCtrl', function($scope) {
  $scope.isPanelShowing = false;
});

chat.controller('RoomsCtrl', function($scope) {
  $scope.rooms = [
    { name: 'All', key: 'all' },
    { name: 'Marketing', key: 'marketing' }
  ];
});

// TODO: Move this to a directive corresponding to this panel
// Grab the sections
var page = document.getElementById('page');
var leftPanel = document.getElementById('left-panel');
var rightPanel = document.getElementById('right-panel');
var controller = new ion.controllers.LeftRightPanelViewController({
  left: leftPanel,
  leftWidth: 270,
  right: rightPanel,
  rightWidth: 270,
  center: page,
  animateClass: 'ion-panel-animated'
});

