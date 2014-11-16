---
name: popping
component: $ionicPopup
---
angular.module('popping', ['ionic'])
.controller('PopupCtrl', function($scope, $timeout, $q, $ionicPopup) {
  $scope.showPopup = function() {
    $scope.data = {}

    $ionicPopup.show({
      templateUrl: 'popup-template.html',
      title: 'Enter Wi-Fi Password',
      subTitle: 'Please use normal things',
      scope: $scope,
      buttons: [
        { text: 'Cancel', onTap: function(e) { return true; } },
        {
          text: '<b>Save</b>',
          type: 'button-positive',
          onTap: function(e) {
            return $scope.data.wifi;
          }
        },
      ]
      }).then(function(res) {
        console.log('Tapped!', res);
      }, function(err) {
        console.log('Err:', err);
      }, function(msg) {
        console.log('message:', msg);
      });

    $timeout(function() {
      $ionicPopup.confirm({
        title: 'Do you like ice cream?',
        cancelText: 'No',
        okText: 'Yes, of course'
      }).then(function(res) {
        console.log('Your love for ice cream:', res);
      });
    }, 1000);
  };

  $scope.showConfirm = function() {
    $ionicPopup.confirm({
      title: 'Consume Ice Cream',
      content: 'Are you sure you want to eat this ice cream?'
    }).then(function(res) {
      if(res) {
        console.log('You are sure');
      } else {
        console.log('You are not sure');
      }
    });
  };
  $scope.showPrompt = function() {
    $ionicPopup.prompt({
      title: 'ID Check',
      subTitle: 'What is your name?'
    }).then(function(res) {
      console.log('Your name is', res);
    });
  };
  $scope.showPasswordPrompt = function() {
    $ionicPopup.prompt({
      title: 'Password Check',
      subTitle: 'Enter your secret password',
      inputType: 'password',
      inputPlaceholder: 'Your password'
    }).then(function(res) {
      console.log('Your name is', res);
    });
  };
  $scope.showAlert = function() {
    $ionicPopup.alert({
      title: 'Draft Saved',
      content: 'Your Data has been saved!'
    }).then(function(res) {
      console.log('Your Data has been saved!');
    }, function(err) {},
    function(popup) {
      console.log('Got popup', popup);
      $timeout(function() {
        popup.close();
      }, 1000);
    });
  };
});
