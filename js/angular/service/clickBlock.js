IonicModule
.factory('$ionicClickBlock', [
  '$document',
  '$ionicBody',
function($document, $ionicBody) {
  var cb = $document[0].createElement('div');
  cb.className = 'click-block';
  return {
    show: function() {
      if(cb.parentElement) {
        cb.classList.remove('hide');
      } else {
        $ionicBody.append(cb);
      }
    },
    hide: function() {
      cb.classList.add('hide');
    }
  }
}]);
