'use strict';

describe('Ionic Popup Directive', function() {
  var compile, scope, popupEl;

  beforeEach(module('ionic'));

  beforeEach(inject(function($compile, $rootScope, $controller) {
    compile = $compile;
    scope = $rootScope;

  }));

  it('Should build', function() {
    popupEl = angular.element('<ion-popup></ion-popup>');
    popupEl = compile(popupEl)(scope);

    expect(popupEl[0].classList.contains('popup')).toBe(true);
  });

  it('Set scope', function() {
    popupEl = angular.element('<ion-popup title="Cats"></ion-popup>');

    var buttons = [
      {
        type: 'button-whack',
        text: 'Whacky'
      }
    ];

    scope.buttons = buttons;

    popupEl = compile(popupEl)(scope);

    scope.$apply();

    scope = popupEl.scope();

    expect(scope.title).toEqual('Cats');

    expect(scope.buttons).toBe(buttons);
    expect(scope.buttons[0].text).toEqual('Whacky');
    expect(scope.buttons[0].type).toEqual('button-whack');

    expect(popupEl[0].querySelector('button').classList.contains('button-whack')).toBe(true);

    expect(popupEl[0].classList.contains('popup')).toBe(true);
  });

  it('Does call callbacks', function() {
    popupEl = angular.element('<ion-popup title="Cats" on-button-tap="onTap(button, $event)" on-close="onClose(button, $event)"></ion-popup>');

    // For spy
    /* Not sure how to trigger these
    var cb = {
      onTap: function(e) {},
      onClose: function(e) {}
    };
    */

    var buttons = [
      {
        type: 'button-whack',
        text: 'Whacky',
        onTap: function(e) {}
      }
    ];

    scope.buttons = buttons;

    /*
    scope.onTap = cb.onTap;
    scope.onClose = cb.onClose;
    */

    popupEl = compile(popupEl)(scope);

    scope.$apply();

    spyOn(buttons[0], 'onTap');
    /*
    spyOn(cb, 'onTap');
    spyOn(cb, 'onClose');
    */

    var button = popupEl[0].querySelector('button');
    ionic.trigger('click', {
      target: button
    });

    /*
    expect(cb.onTap).toHaveBeenCalled();
    expect(cb.onClose).toHaveBeenCalled();
    */
    expect(buttons[0].onTap).toHaveBeenCalled();
  });
});
