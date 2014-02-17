angular.module('ionic.decorator.location', [])

.config(['$provide', function($provide) {
  $provide.decorator('$location', ['$delegate', '$timeout', $LocationDecorator]);
}]);

function $LocationDecorator($location, $timeout) {

  $location.__hash = $location.hash;
  //Fix: first time window.location.hash is set, the scrollable area
  //found nearest to body's scrollTop is set to scroll to an element
  //with that ID.
  $location.hash = function(value) {
    if (angular.isDefined(value)) {
      $timeout(function() {
        var scroll = document.querySelector('.scroll-content');
        if (scroll)
          scroll.scrollTop = 0;
      }, 0, false);
    }
    return $location.__hash(value);
  };

  return $location;
}
