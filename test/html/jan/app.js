// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', [
    'ionic',
    'ngIOS9UIWebViewPatch',
])

.config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
    $stateProvider
        .state('app', {
            url: "/app",
            abstract: true,
            templateUrl: "menu.html",
            controller: 'AppCtrl'
        })
        .state('app.contact', {
            cache: false,
            url: "/contact",
            views: {
                'menuContent': {
                    templateUrl: "contact.html",
                    controller: 'ContactCtrl'
                }
            }
        })
        .state('app.info', {
            cache: false,
            url: "/info",
            views: {
                'menuContent': {
                    templateUrl: "info.html",
                    controller: 'InfoCtrl'
                }
            }
        });
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/info');
    $ionicConfigProvider.views.swipeBackEnabled(false);
})
.controller('AppCtrl', function ($scope, $http, $timeout, $rootScope, $ionicSideMenuDelegate, $state, $ionicHistory, $ionicPopup, $window) {
})
.controller('ContactCtrl', function ($scope, $http, $state, $ionicPopup) {
})

.controller('InfoCtrl', function ($scope, $http, $ionicPlatform) {
})
