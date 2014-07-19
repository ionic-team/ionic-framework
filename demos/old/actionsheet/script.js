angular.module('ionicApp', ['ionic'])

.controller('AppCtrl', function ($scope, $ionicActionSheet) {

  $scope.showActionsheet = function () {

    $ionicActionSheet.show({
      titleText: 'ActionSheet Example',
      buttons: [
        {
          text: 'Share'
        },
        {
          text: 'Move'
        },
      ],
      destructiveText: 'Delete',
      cancelText: 'Cancel',
      cancel: function () {
        console.log('CANCELLED');
      },
      buttonClicked: function (index) {
        console.log('BUTTON CLICKED', index);
        return true;
      },
      destructiveButtonClicked: function () {
        console.log('DESTRUCT');
        return true;
      }
    });
  };


});