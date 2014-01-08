// angular.module is a global place for creating, registering and retrieving Angular modules
// 'listExample' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array or 'requires'
// 'listExample.services' is found in services.js
// 'listExample.controllers' is found in controllers.js
angular.module('listExample', ['ionic', 'listExample.services', 'listExample.controllers'])

.config(function($stateProvider, $urlRouterProvider) {

  // Set up the initial routes that our app will respond to.
  // These are then tied up to our nav router which animates and
  // updates a navigation bar
  $stateProvider
    .state('movieIndex', {
      url: '/',
      templateUrl: '/index.html',
      controller: 'MovieIndexCtrl'
    })

    // if the url matches something like /movie/88 then this route
    // will fire off the MovieDetailCtrl (controllers.js)
    .state('movieDetail', {
      url: '/movie/:movieId',
      templateUrl: '/movie.html',
      controller: 'MovieDetailCtrl'
    });

  // if none of the above routes are met, use this fallback
  $urlRouterProvider.otherwise('/');

});
