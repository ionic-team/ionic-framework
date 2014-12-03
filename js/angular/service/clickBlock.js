IonicModule
.factory('$ionicClickBlock', [
  '$document',
  '$ionicBody',
  '$timeout',
function($document, $ionicBody, $timeout) {
  var fallbackTimer, isAttached;
  var CSS_HIDE = 'click-block-hide';
  var pendingShow;

  var cb = $document[0].createElement('div');
  cb.className = 'click-block';

  return {
    show: function(autoExpire) {
      pendingShow = true;
      // cancel the fallback timer
      $timeout.cancel(fallbackTimer);

      ionic.requestAnimationFrame(function() {
        if (pendingShow) {
          if (isAttached) {
            cb.classList.remove(CSS_HIDE);
          } else {
            $ionicBody.append(cb);
            isAttached = true;
          }
        }
      });

      fallbackTimer = $timeout(this.hide, autoExpire || 310);
    },
    hide: function() {
      pendingShow = false;
      $timeout.cancel(fallbackTimer);
      cb.classList.add(CSS_HIDE);
    }
  };
}]);
