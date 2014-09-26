IonicModule
.factory('$ionicClickBlock', [
  '$document',
  '$ionicBody',
  '$timeout',
function($document, $ionicBody, $timeout) {
  var fallbackTimer;

  var cb = $document[0].createElement('div');
  cb.className = 'click-block';

  return {
    show: function() {
      // cancel the fallback timer
      $timeout.cancel( fallbackTimer );

      if(cb.parentElement) {
        cb.classList.remove('hide');
      } else {
        $ionicBody.append(cb);
      }
      fallbackTimer = $timeout(function(){
        cb.classList.add('hide');
      }, 500);
    },
    hide: function() {
      // cancel the fallback timer
      $timeout.cancel( fallbackTimer );

      // should be a minimum time it should hide
      ionic.requestAnimationFrame(function(){
        cb.classList.add('hide');
      });
    }
  };
}]);
