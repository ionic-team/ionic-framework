---
name: simple
component: ionCheckbox
---

var app = angular.module('simple', ['ionic']);
app.controller('CheckboxSimpleCtrl', function($scope) {
  $scope.pizza = {
    pepperoni: true,
    sausage: false,
    anchovies: true,
    jalapenos: false
  };

  $scope.toppings = function() {
    var toppings = Object.keys($scope.pizza).filter(function(flavor) {
      return $scope.pizza[flavor];
    });
    if (toppings.length > 1) {
      toppings[toppings.length - 1] = 'and ' + toppings[toppings.length - 1];
    }
    if (toppings.length > 2) {
      return toppings.join(', ');
    } else if (toppings.length) {
      return toppings.join(' ');
    } else {
      return 'nothing';
    }
  };
});
