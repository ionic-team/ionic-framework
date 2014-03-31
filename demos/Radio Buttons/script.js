angular.module('ionicApp', ['ionic'])

.controller('MainCtrl', function ($scope) {

  $scope.clientSideList = [
    {
      text: "Backbone",
      value: "bb"
    },
    {
      text: "Angular",
      value: "ng"
    },
    {
      text: "Ember",
      value: "em"
    },
    {
      text: "Knockout",
      value: "ko"
    }
  ];

  $scope.serverSideList = [
    {
      text: "Go",
      value: "go"
    },
    {
      text: "Python",
      value: "py"
    },
    {
      text: "Ruby",
      value: "rb"
    },
    {
      text: "Java",
      value: "jv"
    }
  ];

  $scope.data = {
    clientSide: 'ng'
  };

  $scope.serverSideChange = function (item) {
    console.log("Selected Serverside, text:", item.text, "value:", item.value);
  };

});