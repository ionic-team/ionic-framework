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
      $scope.movies.push({
        id: 'tt0357413',
        title: 'Anchorman: The Legend of Ron Burgundy',
        released: '2004',
        description: "Ron Burgundy is San Diego's top rated newsman in the male-dominated broadcasting of the 70's, but that's all about to change for Ron and his cronies when an ambitious woman is hired as a new anchor.",
        director: 'Adam McKay',
        rating: 7.2
      });
      $scope.movies.push({
        id: 'tt0058331',
        title: 'Mary Poppins',
        released: '1964',
        description: "A magic nanny comes to work for a cold banker's unhappy family.",
        director: 'Robert Stevenson',
        rating: 7.7
      });
      done();
    }, 1000);
  }
})

// Controller that shows more detailed info about a movie
.controller('MovieDetailCtrl', function($scope, $stateParams, MovieService) {
  // "MovieService" is a service returning mock data (services.js)
  $scope.movie = MovieService.get($stateParams.movieId);
  $scope.title = "Movie Info";
});
