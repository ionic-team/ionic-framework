angular.module('ionicApp', ['ionic'])

.controller('MainCtrl', function ($scope) {

  $scope.settingsList = [
    {
      text: "Wireless",
      checked: true
    },
    {
      text: "GPS",
      checked: false
    },
    {
      text: "Bluetooth",
      checked: false
    }
  ];

  $scope.pushNotificationChange = function () {
    console.log('Push Notification Change', $scope.pushNotification.checked);
  };

  $scope.pushNotification = {
    checked: true
  };
  $scope.emailNotification = 'Subscribed';

});