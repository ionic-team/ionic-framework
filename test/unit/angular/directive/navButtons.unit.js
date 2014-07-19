describe('ionNavButtons directive', function() {

  beforeEach(module('ionic', function($compileProvider) {
    $compileProvider.directive('needsScroll', function() {
      return {
        //Test if the buttons are 'children of ionScroll' when compiled
        require: '^$ionicScroll',
        link: function(scope, element, attrs, ctrl) {
          element.data('scrollCtrl', ctrl);
        }
      };
    });
  }));
  beforeEach(function() {
    ionic.requestAnimationFrame = function(cb) { cb(); };
  });

  function setup(side, tpl) {
    var el;
    inject(function($compile, $rootScope) {
      el = $compile('<div>' +
       '<ion-nav-bar></ion-nav-bar>' +
       '<ion-view>' +
         '<ion-content>' +
           '<ion-nav-buttons side="'+(side)+'">' +
             (tpl || '') + 
           '</ion-nav-buttons>' +
         '</ion-content>' +
       '</ion-view>' +
      '</div>')($rootScope.$new());
      $rootScope.$apply();
    });
    return el;
  }

  it('should add buttons to left side by default', function() {
    var el = setup(null, '<button id="my-btn">');
    expect(el[0].querySelector('.left-buttons #my-btn')).toBeTruthy();
    expect(el[0].querySelector('.right-buttons #my-btn')).toBeFalsy();
  });

  it('should add buttons to left side', function() {
    var el = setup('left', '<button id="my-btn">');
    expect(el[0].querySelector('.left-buttons #my-btn')).toBeTruthy();
    expect(el[0].querySelector('.right-buttons #my-btn')).toBeFalsy();
  });

  it('should add buttons to right side', function() {
    var el = setup('right', '<button id="my-btn">');
    expect(el[0].querySelector('.left-buttons #my-btn')).toBeFalsy();
    expect(el[0].querySelector('.right-buttons #my-btn')).toBeTruthy();
  });

  it('should remove buttons on content destroy', function() {
    var el = setup('', '<button id="my-btn">');
    expect(el[0].querySelector('.left-buttons #my-btn')).toBeTruthy();
    el.find('ion-nav-buttons').scope().$destroy();
    el.scope().$apply();
    expect(el[0].querySelector('.left-buttons #my-btn')).toBeFalsy();
  });

  it('should compile buttons with same scope & access the same data on compile', function() { 
    var el = setup('left', '<button needs-scroll>Hello!</button>');
    expect(jqLite(el[0].querySelector('ion-content')).children().scope().$id)
      .toBe(jqLite(el[0].querySelector('.left-buttons button')).scope().$id);

    //Test if the button was compiled able to access the parents of ion-nav-buttons
    var scrollCtrl = el.find('ion-content').controller('$ionicScroll');
    expect(scrollCtrl).toBeTruthy();
    expect(el.find('button[needs-scroll]').data('scrollCtrl')).toBe(scrollCtrl);
  });

  it('should not enter if button is destroyed before raf', function() {
    var rafCb;
    ionic.requestAnimationFrame = function(cb) { rafCb = cb; };
    var el = setup('left', '<button id="my-btn">');
    el.find('ion-content').scope().$destroy();
    el.scope().$apply();
    rafCb();
    expect(el[0].querySelector('.left-buttons #my-btn')).toBeFalsy();
  });

});
