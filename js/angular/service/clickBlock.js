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
    show: function(autoExpire) {
      // cancel the fallback timer
      $timeout.cancel(fallbackTimer);

      ionic.requestAnimationFrame(function() {
        if (isAttached) {
          cb.classList.remove(CSS_HIDE);
        } else {
          $ionicBody.append(cb);
          isAttached = true;
        }
      });

      fallbackTimer = $timeout(function() {
        cb.classList.add(CSS_HIDE);
      }, autoExpire || 300);
    },
    hide: function() {
      $timeout.cancel(fallbackTimer);
      cb.classList.add(CSS_HIDE);
    }
  };
}]);
