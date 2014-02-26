describe('ionNavAnimation directive', function() {
  beforeEach(module('ionic.ui.navAnimation'));

  var navViewCtrl;
  function setup(anim, noNavViewCtrl) {
    if (noNavViewCtrl) {
      navViewCtrl = null;
    } else {
      navViewCtrl = {
        setNextAnimation: jasmine.createSpy('setNextAnimation')
      };
    }
    var element = angular.element(
      '<div ion-nav-animation="'+(anim||'')+'"></div>'
    );
    element.data('$ionNavViewController', navViewCtrl);
    inject(function($compile, $rootScope) {
      $compile(element)($rootScope.$new());
    });

    return element;
  }

  it('should not listen for tap if no navViewCtrl', function() {
    spyOn(ionic, 'on');
    setup('', true);
    expect(ionic.on).not.toHaveBeenCalled();
  });

  it('should listen for tap', function() {
    spyOn(ionic, 'on');
    var el = setup('');
    expect(ionic.on).toHaveBeenCalledWith('tap', jasmine.any(Function), el[0]);
  });

  it('should call navViewCtrl.setNextAnimation on tap', function() {
    var el = setup('foobar');
    ionic.trigger('tap', { target: el[0] });
    expect(navViewCtrl.setNextAnimation).toHaveBeenCalledWith('foobar');
  });
});
