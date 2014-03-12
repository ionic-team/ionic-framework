describe('Ionic Popup', function() {
  var popup, timeout, scope;

  beforeEach(module('ionic.service.popup'));

  beforeEach(inject(function($ionicPopup, $rootScope, $timeout) {
    ionic.requestAnimationFrame = function(cb) { cb(); }
    scope = $rootScope;
    popup = $ionicPopup;
    timeout = $timeout;
  }));

  iit('Should show popup', function() {
    var obj = {
      popupTapFn: function() {
      }
    };
    popup.show({
      type: 'split',
      buttons: [
        {
          text: 'Okay',
          onTap: obj.popupTapFn
        }
      ]
    });
        
    timeout.flush();

    runs(function() {
      timeout(function() {
        console.log(document.body);
        var popup = document.body.querySelector('.popup-backdrop');
        console.log(popup);
        expect(popup).not.toEqual(null);
      });

      scope.$digest();
      timeout.flush();
    });
  });
});
