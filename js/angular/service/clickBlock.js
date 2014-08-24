IonicModule
.factory('$ionicClickBlock', [
  '$document',
function($document) {
  var cb = $document[0].createElement('div');
  cb.className = 'click-block';
  return {
    show: function() {
      if(!cb.parentElement) {
        $document[0].body.appendChild(cb);
      }
    },
    hide: function() {
      if(cb.parentElement) {
        cb.parentNode.removeChild(cb);
      }
    }
  }
}]);
