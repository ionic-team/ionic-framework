describe('keyboardAttach directive', function() {
  beforeEach(module('ionic'));

  function setup() {
    var el, content;
    inject(function($compile, $rootScope) {
      el = angular.element('<div keyboard-attach></div>');
      content = angular.element('<ion-content></ion-content>');
      content.append(el);
      $compile(content)($rootScope.$new());
      $rootScope.$apply();
    });
    return {el: el, content: content};
  }

  it('should move up when window fires native.showkeyboard event', function() {
    var el = setup().el;
    ionic.Platform.isFullScreen = true;
    expect(el.css('bottom')).toEqual('');
    ionic.trigger('native.showkeyboard', { target: window, keyboardHeight: 33 });
    expect(el.css('bottom')).toEqual('33px');
    el.scope().$destroy();
  });

  it('should move up when window fires native.showkeyboard event', function() {
    var directives = setup();
    var el = directives.el;
    var content = directives.content;
    var keyboardHeight = 33;
    var elHeight = 50;

    spyOn(window, 'keyboardAttachGetClientHeight').andReturn(elHeight);

    expect(content.css('bottom')).toEqual('');
    ionic.trigger('native.showkeyboard', { target: window, keyboardHeight: 33 });
    expect(content.css('bottom')).toEqual(keyboardHeight + elHeight + 'px');
  });

  it('should do nothing if Android and not fullscreen', function() {
    var el = setup().el;
    ionic.Platform.setPlatform('android');
    ionic.Platform.isFullScreen = false;
    expect(el.css('bottom')).toEqual('');
    ionic.trigger('native.showkeyboard', { target: window, keyboardHeight: 33 });
    expect(el.css('bottom')).toEqual('');
    el.scope().$destroy();
  });

  it('should remove listeners on destroy', function() {
    spyOn(ionic, 'off');
    var el = setup().el;
    el.scope().$destroy();
    expect(ionic.off).toHaveBeenCalledWith('native.keyboardshow', jasmine.any(Function), window);
    expect(ionic.off).toHaveBeenCalledWith('native.keyboardhide', jasmine.any(Function), window);
  });
})
