describe('ionNavButtons directive', function() {
  var outputEle;

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

  function setup(side, content) {
    var el;
    inject(function($compile, $rootScope) {
      el = angular.element('<ion-nav-buttons side="'+(side)+'">'+(content||'')+'</ion-nav-buttons>');
      el.data('$ionNavBarController', {
        navElement: function(buttonType, buttonHtml) {
          outputEle = angular.element(buttonHtml);
        }
      });
      el = $compile(el)($rootScope.$new());
      $rootScope.$apply();
    });
    return el;
  }

  it('should error without a parent ionNavBar', inject(function($compile, $rootScope) {
    expect(function() {
      $compile('<ion-nav-buttons>')($rootScope);
    }).toThrow();
  }));

  it('should hide and empty its original self', function() {
    var el = setup();
    expect(el.hasClass('hide')).toBe(true);
    expect(el.html()).toBe('');
  });

  it('should default to left-buttons class and add inner element', function() {
    var el = setup(null, '<button>');
    expect(outputEle.hasClass('left-buttons'));
    expect(outputEle.children().eq(0)[0].tagName).toBe('BUTTON');
  });

  it('should default to left-buttons class with unknown side', function() {
    var el = setup('whatever', '<button>');
    expect(outputEle.hasClass('left-buttons'));
    expect(outputEle.children().eq(0)[0].tagName).toBe('BUTTON');
  });

  it('should set left-buttons class', function() {
    var el = setup('left', '<button>');
    expect(outputEle.hasClass('left-buttons'));
  });

  it('should set right-buttons class', function() {
    var el = setup('right', '<button>');
    expect(outputEle.hasClass('right-buttons'));
  });

  it('should set primary-buttons class', function() {
    var el = setup('primary', '<button>');
    expect(outputEle.hasClass('primary-buttons'));
  });

  it('should set secondary-buttons class', function() {
    var el = setup('secondary', '<button>');
    expect(outputEle.hasClass('secondary-buttons'));
  });

});
