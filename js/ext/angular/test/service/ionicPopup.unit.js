describe('Ionic Popup', function() {
  var popup;

  beforeEach(module('ionic.service.popup'));

  beforeEach(inject(function($ionicPopup) {
    popup = $ionicPopup;
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
          tap: obj.popupTapFn
        }
      ]
    });

    expect(popup.el.classList.contains('active')).toBe(true);
  });
});
