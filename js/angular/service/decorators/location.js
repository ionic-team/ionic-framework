/**
 * @private
 */
IonicModule.config([
  '$provide',
function($provide) {
  function $LocationDecorator($location, $timeout) {

    $location.__hash = $location.hash;
    //Fix: when window.location.hash is set, the scrollable area
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

  $provide.decorator('$location', ['$delegate', '$timeout', $LocationDecorator]);
}]);
