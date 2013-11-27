angular.module('listExample.controllers', [])


// Controller that fetches a list of data
.controller('MovieIndexCtrl', function($scope, MovieService) {
  
  // "MovieService" is a service returning mock data (services.js)
  // the returned data from the service is placed into this 
  // controller's scope so the template can render the data
  $scope.movies = MovieService.all();

  $scope.title = "Completely Random Collection Of Movies";
})

// Controller that shows more detailed info about a movie
.controller('MovieDetailCtrl', function($scope, $routeParams, MovieService) {
  // "MovieService" is a service returning mock data (services.js)
  $scope.movie = MovieService.get($routeParams.movieId);
  $scope.title = "Movie Info";
});
