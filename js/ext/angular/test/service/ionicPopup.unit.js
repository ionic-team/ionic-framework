describe('Ionic Popup', function() {
  var popup, timeout, scope, document;

  beforeEach(module('ionic'));

  beforeEach(inject(function($ionicPopup, $rootScope, $timeout, $document) {
    ionic.requestAnimationFrame = function(cb) { cb(); }
    scope = $rootScope;
    popup = $ionicPopup;
    timeout = $timeout;
    document = $document;
    document[0].body.className = '';
  }));

  it('Should show popup', function() {
    popup.show({
      title: 'Cats',
      content: 'Dogs',
      buttons: [
        {
          text: 'Okay',
          type: 'button-balanced',
          onTap: function(e) {}
        }
      ]
    });

    timeout.flush();

    var popupBackdropEl = document[0].body.querySelector('.popup-backdrop');
    expect(popupBackdropEl).not.toEqual(null);

    var popupEl = document[0].body.querySelector('.popup');
    expect(popupEl.classList.contains('active')).toBe(true);
    expect(popupEl.classList.contains('popup-showing')).toBe(true);

    popup.show({
      title: 'Cats',
      content: 'Dogs',
      buttons: [
        {
          text: 'Okay',
          type: 'button-balanced',
          onTap: function(e) {}
        }
      ]
    });

    timeout.flush();

    // Make sure there are two popups
    expect(document[0].body.querySelectorAll('.popup').length).toEqual(2);
  });

  it('Should set correct element data', function() {
    popup.show({
      title: 'Cats',
      content: 'Dogs',
      buttons: [
        {
          text: 'Okay',
          type: 'button-balanced',
          onTap: function(e) {}
        }
      ]
    });

    var popupEl = document[0].body.querySelector('.popup');
    expect(popupEl.querySelector('.popup-title').innerText).toEqual('Cats');
    expect(popupEl.querySelector('.popup-body').innerText).toEqual('Dogs');
  });

  it('Should add .popup-open from body', function() {
    expect(document[0].body.classList.contains('popup-open')).toEqual(false);

    popup.show({
      title: 'Cats',
      content: 'Dogs',
      buttons: [
        {
          text: 'Okay',
          type: 'button-balanced',
          onTap: function(e) {}
        }
      ]
    });

    timeout.flush();
    expect(document[0].body.classList.contains('popup-open')).toEqual(true);
  });
});
