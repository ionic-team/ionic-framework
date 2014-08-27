IonicModule
.factory('$ionicClickBlock', [
  '$document',
  '$ionicBody',
  '$timeout',
function($document, $ionicBody, $timeout) {
  var cb = $document[0].createElement('div');
  cb.className = 'click-block';
  return {
    show: function() {
      if(cb.parentElement) {
        cb.classList.remove('hide');
      } else {
        $ionicBody.append(cb);
      }
      $timeout(function(){
        cb.classList.add('hide');
      }, 500);
    },
    hide: function() {
      cb.classList.add('hide');
    }
  };
}]);
