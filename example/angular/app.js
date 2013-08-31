
/*
document.addEventListener('touchstart', function() {});

var app = angular.module('peopleApp', ['ngRoute', 'ngAnimate']);

app.config( ["$routeProvider", function($routeProvider){
    $routeProvider.when("/customers", {"templateUrl" : "customers.html", controller: 'CustomersCtrl'});
    $routeProvider.when("/customer/:id", {"templateUrl" : "customer.html", controller: 'CustomerCtrl'});
    $routeProvider.otherwise({"redirectTo":"/customers"});

  }]
);

app.provider('Customers', function() {
  var customers = [
    {'name': 'Max Lynch', id: 1},
    {'name': 'Max Lynch', id: 2},
    {'name': 'Max Lynch', id: 3},
    {'name': 'Max Lynch', id: 4},
    {'name': 'Max Lynch', id: 5},
    {'name': 'Max Lynch', id: 6},
    {'name': 'Max Lynch', id: 7},
    {'name': 'Max Lynch', id: 8},
    {'name': 'Max Lynch', id: 9},
    {'name': 'Max Lynch', id: 10},
    {'name': 'Max Lynch', id: 11},
  ];

  this.$get = function() {
    return {
      list: customers,
      getById: function(id) {
        for(var i = 0; i < this.list.length; i++) { if(this.list[i].id == id) return this.list[i]; }
      }
    }
  }
});

app.controller('CustomersCtrl', function($scope, Customers) {
  $scope.customers = Customers;
});

app.controller('CustomerCtrl', function($scope, $routeParams, Customers) {
  var id = $routeParams.id;
  var customer = Customers.getById(id);
  $scope.customer = customer;
  console.log('Showing user', id, customer);
});
*/
