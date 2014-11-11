IonicModule
.factory('$ionicClickBlock', [
  '$document',
  '$ionicBody',
  '$timeout',
function($document, $ionicBody, $timeout) {
  var fallbackTimer, isAttached;
  var CSS_HIDE = 'click-block-hide';

  var cb = $document[0].createElement('div');
  cb.className = 'click-block';

  return {
    show: function() {
      // cancel the fallback timer
      $timeout.cancel( fallbackTimer );

      ionic.requestAnimationFrame(function(){
        if(isAttached) {
          cb.classList.remove(CSS_HIDE);
        } else {
          $ionicBody.append(cb);
        }
      });

      fallbackTimer = $timeout(function(){
        cb.classList.add(CSS_HIDE);
      }, 750);
    },
    hide: function() {
      // cancel the fallback timer
      $timeout.cancel( fallbackTimer );

      // should be a minimum time it should hide
      ionic.requestAnimationFrame(function(){
        cb.classList.add(CSS_HIDE);
      });
    }
  };
}]);
