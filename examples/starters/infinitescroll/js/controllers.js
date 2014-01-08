angular.module('listExample.controllers', [])


// Controller that fetches a list of data
.controller('MovieIndexCtrl', function($scope, MovieService,$timeout) {
  
  // "MovieService" is a service returning mock data (services.js)
  // the returned data from the service is placed into this 
  // controller's scope so the template can render the data
  $scope.movies = MovieService.all();

  $scope.title = "Completely Random Collection Of Movies";

  // Method called on infinite scroll
  // Receives a "done" callback to inform the infinite scroll that we are done
  $scope.loadMore = function(done) {
    $timeout(function() {
      $scope.movies.push({
        id: 'tt0114814',
        title: 'Usual Suspects',
        released: '1995',
        description: 'A boat has been destroyed, criminals are dead, and the key to this mystery lies with the only survivor and his twisted, convoluted story beginning with five career crooks in a seemingly random police lineup.',
        director: 'Bryan Singer',
        rating: 8.3
      });
      done();
    }, 1000);
  }
})

// Controller that shows more detailed info about a movie
.controller('MovieDetailCtrl', function($scope, $routeParams, MovieService) {
  // "MovieService" is a service returning mock data (services.js)
  $scope.movie = MovieService.get($routeParams.movieId);
  $scope.title = "Movie Info";
});
