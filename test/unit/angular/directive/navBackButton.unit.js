describe('ionNavBackButton directive', function() {
  beforeEach(module('ionic'));
  var navBackButtonEle, buttonIconEle, outputEle;

  function setup(attr, content) {
    inject(function($compile, $rootScope) {
      navBackButtonEle = angular.element('<ion-nav-back-button '+(attr||'')+'>'+(content||'')+'</ion-nav-back-button>');
      navBackButtonEle.data('$ionNavBarController', {
        navElement: function(buttonType, buttonHtml) {
          outputEle = angular.element(buttonHtml);
        }
      });
      navBackButtonEle = $compile(navBackButtonEle)($rootScope.$new());
      $rootScope.$apply();
      buttonIconEle = navBackButtonEle.find('i');
    });
  }

  it('should error without a parent ionNavBar', inject(function($compile, $rootScope) {
    expect(function() {
      $compile('<ion-nav-back-button>')($rootScope);
    }).toThrow();
  }));

  it('should hide and empty its original self', function() {
    setup();
    expect(navBackButtonEle.hasClass('hide')).toBe(true);
    expect(navBackButtonEle.html()).toBe('');
  });

  it('should create nav element and send its HTML to its navBarController', inject(function($compile, $rootScope, $ionicConfig) {
    $ionicConfig.backButton.icon('none');
    setup();
    expect( outputEle[0].tagName ).toBe('BUTTON');
    expect( outputEle.hasClass('button') ).toBe(true);
    expect( outputEle.hasClass('back-button') ).toBe(true);
    expect( outputEle.hasClass('hide') ).toBe(true);
    expect( outputEle.hasClass('buttons') ).toBe(true);
  }));

  it('should add ng-click if one wasnt provided', inject(function($compile, $rootScope, $ionicConfig) {
    $ionicConfig.backButton.icon('none');
    setup();
    expect( outputEle.attr('ng-click') ).toBe('$ionicGoBack()');
  }));

  it('should add custom ng-click that was provided', inject(function($compile, $rootScope, $ionicConfig) {
    $ionicConfig.backButton.icon('none');
    setup('ng-click="myClick()"');
    expect( outputEle.attr('ng-click') ).toBe('myClick()');
  }));

  it('should create nav element w/ custom attributes and send its HTML to its navBarController', inject(function($compile, $rootScope, $ionicConfig) {
    setup('class="my-class other-class" id="yup"');
    expect( outputEle.attr('id') ).toBe('yup');
    expect( outputEle.hasClass('my-class') ).toBe(true);
    expect( outputEle.hasClass('other-class') ).toBe(true);
  }));

  it('should create nav element with custom content and no back icon', inject(function($compile, $rootScope, $ionicConfig) {
    $ionicConfig.backButton.icon('none');
    setup('', 'Back');
    expect( outputEle.html() ).toBe('Back');
  }));

  it('should not set a default nested back button icon if ion- classname exists', inject(function($ionicConfig) {
    $ionicConfig.backButton.icon('none');
    setup('class="ion-navicon"');
    expect(buttonIconEle.length).toBe(0);
  }));

  it('should not set default nested back button icon if "ion-" child element exists', inject(function($ionicConfig) {
    setup('', '<i class="ion-superstar"></i>');
    expect(outputEle.children().eq(0).hasClass('ion-superstar')).toBe(true);
  }));

  it('should not set default nested back button icon if "icon" child exists', inject(function($ionicConfig) {
    setup('', '<i class="icon"></i>');
    expect(outputEle.children().eq(0).hasClass('icon')).toBe(true);
  }));

  it('should set default back button icon from $ionicConfig, but no inner text', inject(function($ionicConfig) {
    $ionicConfig.backButton.icon('ion-my-arrow-back');
    setup();
    expect(outputEle.children().eq(0).hasClass('icon')).toBe(true);
    expect(outputEle.children().eq(0).hasClass('ion-my-arrow-back')).toBe(true);
    expect(outputEle.hasClass('button-clear')).toBe(true);
  }));

  it('should set default back button icon from $ionicConfig, but with inner text', inject(function($ionicConfig) {
    $ionicConfig.backButton.icon('ion-my-arrow-back');
    setup('', 'Back');
    expect(outputEle.children().eq(0).hasClass('icon')).toBe(true);
    expect(outputEle.children().eq(0).hasClass('ion-my-arrow-back')).toBe(true);
    expect(outputEle.text()).toBe(' Back');
  }));

  it('should set default back-text element when no provided inner text', inject(function($ionicConfig) {
    setup();
    expect(outputEle.children().eq(1).hasClass('back-text')).toBe(true);
  }));

  it('should set default-title element when no provided inner text, but has backButton text config', inject(function($ionicConfig) {
    $ionicConfig.backButton.text('Go Back!')
    setup();
    expect(outputEle.children().eq(1).hasClass('back-text')).toBe(true);
    expect(outputEle.children().eq(1).children().eq(0).hasClass('default-title')).toBe(true);
    expect(outputEle.children().eq(1).children().eq(0).text()).toBe('Go Back!');
  }));

  it('should set previous-title element when no provided inner text, but has backButton previousTitleText config', inject(function($ionicConfig) {
    $ionicConfig.backButton.previousTitleText(true)
    setup();
    expect(outputEle.children().eq(1).hasClass('back-text')).toBe(true);
    expect(outputEle.children().eq(1).children().eq(0).hasClass('previous-title')).toBe(true);
  }));

});
