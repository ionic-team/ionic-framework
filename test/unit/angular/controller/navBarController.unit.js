describe('$ionicNavBar controller', function() {
  beforeEach(module('ionic'));
  var scope, ele;

  function makeNavBarCtrl(css) {
    var ctrl;
    ele = angular.element('<div>');
    inject(function($rootScope, $controller, $ionicHistory, $ionicViewSwitcher) {
      scope = $rootScope.$new();
      ctrl = $controller('$ionicNavBar', {
        $scope: scope,
        $element: ele,
        $attrs: { class: css },
        $ionicHistory: $ionicHistory,
        $ionicViewSwitcher: $ionicViewSwitcher
      });
    });
    return ctrl;
  }

  it('should createHeaderBar instance', function() {
    var ctrl = makeNavBarCtrl('bar-royal');
    var headerBar = ctrl.createHeaderBar();
    expect(headerBar).toBeDefined();
    expect(headerBar.containerEle()).toBeDefined();
    expect(headerBar.headerBarEle().hasClass('bar-royal')).toBe(true);
    expect(headerBar.headerBarEle().children().eq(0).hasClass('title')).toBe(true);
  });

  it('should createHeaderBar and add back button', function() {
    var ctrl = makeNavBarCtrl();

    ctrl.navElement('backButton', '<button>Back</button>');

    var headerBar = ctrl.createHeaderBar();
    var backBtnEle = headerBar.headerBarEle().find('button');
    expect(headerBar.headerBarEle().children().eq(0).text()).toBe('Back');
    expect(headerBar.headerBarEle().children().eq(1).hasClass('title')).toBe(true);
  });

  it('should createHeaderBar and add primary buttons', function() {
    var ctrl = makeNavBarCtrl();

    ctrl.navElement('primaryButtons', '<div class="primary-buttons">');

    var headerBar = ctrl.createHeaderBar();
    expect(headerBar.headerBarEle().children().eq(0).hasClass('buttons')).toBe(true);
    expect(headerBar.headerBarEle().children().eq(0).children().eq(0).hasClass('primary-buttons')).toBe(true);
    expect(headerBar.headerBarEle().children().eq(1).hasClass('title')).toBe(true);
  });

  it('should createHeaderBar, back button and primary buttons', function() {
    var ctrl = makeNavBarCtrl();

    ctrl.navElement('backButton', '<div class="back-button">');
    ctrl.navElement('primaryButtons', '<div class="primary-buttons">');

    var headerBar = ctrl.createHeaderBar();
    expect(headerBar.headerBarEle().children().eq(0).hasClass('back-button')).toBe(true);
    expect(headerBar.headerBarEle().children().eq(1).hasClass('buttons')).toBe(true);
    expect(headerBar.headerBarEle().children().eq(1).children().eq(0).hasClass('primary-buttons')).toBe(true);
    expect(headerBar.headerBarEle().children().eq(2).hasClass('title')).toBe(true);
  });

  it('should createHeaderBar and add secondary buttons', function() {
    var ctrl = makeNavBarCtrl();

    ctrl.navElement('secondaryButtons', '<div class="secondary-buttons">');

    var headerBar = ctrl.createHeaderBar();
    expect(headerBar.headerBarEle().children().eq(0).hasClass('title')).toBe(true);
    expect(headerBar.headerBarEle().children().eq(1).hasClass('buttons')).toBe(true);
    expect(headerBar.headerBarEle().children().eq(1).children().eq(0).hasClass('secondary-buttons')).toBe(true);
  });

  it('should createHeaderBar, back button add secondary buttons', function() {
    var ctrl = makeNavBarCtrl();

    ctrl.navElement('backButton', '<div class="back-button">');
    ctrl.navElement('secondaryButtons', '<div class="secondary-buttons">');

    var headerBar = ctrl.createHeaderBar();
    expect(headerBar.headerBarEle().children().eq(0).hasClass('back-button')).toBe(true);
    expect(headerBar.headerBarEle().children().eq(1).hasClass('title')).toBe(true);
    expect(headerBar.headerBarEle().children().eq(2).hasClass('buttons')).toBe(true);
    expect(headerBar.headerBarEle().children().eq(2).children().eq(0).hasClass('secondary-buttons')).toBe(true);
  });

  it('should createHeaderBar, back button, primary buttons, and secondary buttons', function() {
    var ctrl = makeNavBarCtrl();

    ctrl.navElement('backButton', '<div class="back-button">');
    ctrl.navElement('primaryButtons', '<div class="primary-buttons">');
    ctrl.navElement('secondaryButtons', '<div class="secondary-buttons">');

    var headerBar = ctrl.createHeaderBar();
    expect(headerBar.headerBarEle().children().eq(0).hasClass('back-button')).toBe(true);
    expect(headerBar.headerBarEle().children().eq(1).hasClass('buttons')).toBe(true);
    expect(headerBar.headerBarEle().children().eq(1).children().eq(0).hasClass('primary-buttons')).toBe(true);
    expect(headerBar.headerBarEle().children().eq(2).hasClass('title')).toBe(true);
    expect(headerBar.headerBarEle().children().eq(3).hasClass('buttons')).toBe(true);
    expect(headerBar.headerBarEle().children().eq(3).children().eq(0).hasClass('secondary-buttons')).toBe(true);
  });

  it('should createHeaderBar, primary btns right from config', inject(function($ionicConfig) {
    var ctrl = makeNavBarCtrl();

    ctrl.navElement('primaryButtons', '<div class="primary-buttons">');

    $ionicConfig.navBar.positionPrimaryButtons('right')

    var headerBar = ctrl.createHeaderBar();
    expect(headerBar.headerBarEle().children().eq(0).hasClass('title')).toBe(true);
    expect(headerBar.headerBarEle().children().eq(1).hasClass('buttons')).toBe(true);
    expect(headerBar.headerBarEle().children().eq(1).children().eq(0).hasClass('primary-buttons')).toBe(true);
  }));

  it('should createHeaderBar, secondary btns right from config', inject(function($ionicConfig) {
    var ctrl = makeNavBarCtrl();

    ctrl.navElement('secondaryButtons', '<div class="secondary-buttons">');

    $ionicConfig.navBar.positionPrimaryButtons('right')

    var headerBar = ctrl.createHeaderBar();
    expect(headerBar.headerBarEle().children().eq(0).hasClass('title')).toBe(true);
    expect(headerBar.headerBarEle().children().eq(1).hasClass('buttons')).toBe(true);
    expect(headerBar.headerBarEle().children().eq(1).children().eq(0).hasClass('secondary-buttons')).toBe(true);
  }));

  it('should createHeaderBar, primary btns right, secondary btns right, from config', inject(function($ionicConfig) {
    var ctrl = makeNavBarCtrl();

    ctrl.navElement('primaryButtons', '<div class="primary-buttons">');
    ctrl.navElement('secondaryButtons', '<div class="secondary-buttons">');

    $ionicConfig.navBar.positionPrimaryButtons('right');
    $ionicConfig.navBar.positionSecondaryButtons('right');

    var headerBar = ctrl.createHeaderBar();
    expect(headerBar.headerBarEle().children().eq(0).hasClass('title')).toBe(true);
    expect(headerBar.headerBarEle().children().eq(1).hasClass('buttons')).toBe(true);
    expect(headerBar.headerBarEle().children().eq(1).children().eq(0).hasClass('primary-buttons')).toBe(true);
    expect(headerBar.headerBarEle().children().eq(1).children().eq(1).hasClass('secondary-buttons')).toBe(true);
  }));

  it('should createHeaderBar, primary btns right, secondary btns left, from config', inject(function($ionicConfig) {
    var ctrl = makeNavBarCtrl();

    ctrl.navElement('primaryButtons', '<div class="primary-buttons">');
    ctrl.navElement('secondaryButtons', '<div class="secondary-buttons">');

    $ionicConfig.navBar.positionPrimaryButtons('right');
    $ionicConfig.navBar.positionSecondaryButtons('left');

    var headerBar = ctrl.createHeaderBar();
    expect(headerBar.headerBarEle().children().eq(0).hasClass('buttons')).toBe(true);
    expect(headerBar.headerBarEle().children().eq(0).children().eq(0).hasClass('secondary-buttons')).toBe(true);
    expect(headerBar.headerBarEle().children().eq(1).hasClass('title')).toBe(true);
    expect(headerBar.headerBarEle().children().eq(2).hasClass('buttons')).toBe(true);
    expect(headerBar.headerBarEle().children().eq(2).children().eq(0).hasClass('primary-buttons')).toBe(true);
  }));

  it('should createHeaderBar, back button, primary btns right, secondary btns right, from config', inject(function($ionicConfig) {
    var ctrl = makeNavBarCtrl();

    ctrl.navElement('backButton' ,'<div class="back-button">');
    ctrl.navElement('primaryButtons', '<div class="primary-buttons">');
    ctrl.navElement('secondaryButtons', '<div class="secondary-buttons">');

    $ionicConfig.navBar.positionPrimaryButtons('left');
    $ionicConfig.navBar.positionSecondaryButtons('right');

    var headerBar = ctrl.createHeaderBar();
    expect(headerBar.headerBarEle().children().eq(0).hasClass('back-button')).toBe(true);
    expect(headerBar.headerBarEle().children().eq(1).hasClass('buttons')).toBe(true);
    expect(headerBar.headerBarEle().children().eq(1).children().eq(0).hasClass('primary-buttons')).toBe(true);
    expect(headerBar.headerBarEle().children().eq(2).hasClass('title')).toBe(true);
    expect(headerBar.headerBarEle().children().eq(3).hasClass('buttons')).toBe(true);
    expect(headerBar.headerBarEle().children().eq(3).children().eq(0).hasClass('secondary-buttons')).toBe(true);
  }));

  it('should createHeaderBar, secondary btns left, from config', inject(function($ionicConfig) {
    var ctrl = makeNavBarCtrl();

    ctrl.navElement('secondaryButtons', '<div class="secondary-buttons">');

    $ionicConfig.navBar.positionSecondaryButtons('left');

    var headerBar = ctrl.createHeaderBar();
    expect(headerBar.headerBarEle().children().eq(0).hasClass('buttons')).toBe(true);
    expect(headerBar.headerBarEle().children().eq(0).children().eq(0).hasClass('secondary-buttons')).toBe(true);
    expect(headerBar.headerBarEle().children().eq(1).hasClass('title')).toBe(true);
  }));

  it('should createHeaderBar, primary btns left, secondary btns left, from config', inject(function($ionicConfig) {
    var ctrl = makeNavBarCtrl();

    ctrl.navElement('primaryButtons', '<div class="primary-buttons">');
    ctrl.navElement('secondaryButtons', '<div class="secondary-buttons">');

    $ionicConfig.navBar.positionPrimaryButtons('left');
    $ionicConfig.navBar.positionSecondaryButtons('left');

    var headerBar = ctrl.createHeaderBar();
    expect(headerBar.headerBarEle().children().eq(0).hasClass('buttons')).toBe(true);
    expect(headerBar.headerBarEle().children().eq(0).children().eq(0).hasClass('primary-buttons')).toBe(true);
    expect(headerBar.headerBarEle().children().eq(0).children().eq(1).hasClass('secondary-buttons')).toBe(true);
    expect(headerBar.headerBarEle().children().eq(1).hasClass('title')).toBe(true);
  }));

  it('should createHeaderBar, primary btns left, secondary btns left, from config', inject(function($ionicConfig) {
    var ctrl = makeNavBarCtrl();

    ctrl.navElement('backButton', '<div class="back-button">');
    ctrl.navElement('secondaryButtons', '<div class="secondary-buttons">');

    $ionicConfig.navBar.positionSecondaryButtons('left');

    var headerBar = ctrl.createHeaderBar();
    expect(headerBar.headerBarEle().children().eq(0).hasClass('back-button')).toBe(true);
    expect(headerBar.headerBarEle().children().eq(1).hasClass('buttons')).toBe(true);
    expect(headerBar.headerBarEle().children().eq(1).children().eq(0).hasClass('secondary-buttons')).toBe(true);
    expect(headerBar.headerBarEle().children().eq(2).hasClass('title')).toBe(true);
  }));

  it('should createHeaderBar, back button, primary btns left, secondary btns left, from config', inject(function($ionicConfig) {
    var ctrl = makeNavBarCtrl();

    ctrl.navElement('backButton', '<div class="back-button">');
    ctrl.navElement('primaryButtons', '<div class="primary-buttons">');
    ctrl.navElement('secondaryButtons', '<div class="secondary-buttons">');

    $ionicConfig.navBar.positionPrimaryButtons('left');
    $ionicConfig.navBar.positionSecondaryButtons('left');

    var headerBar = ctrl.createHeaderBar();
    expect(headerBar.headerBarEle().children().eq(0).hasClass('back-button')).toBe(true);
    expect(headerBar.headerBarEle().children().eq(1).hasClass('buttons')).toBe(true);
    expect(headerBar.headerBarEle().children().eq(1).children().eq(0).hasClass('primary-buttons')).toBe(true);
    expect(headerBar.headerBarEle().children().eq(1).children().eq(1).hasClass('secondary-buttons')).toBe(true);
    expect(headerBar.headerBarEle().children().eq(2).hasClass('title')).toBe(true);
  }));

  it('should createHeaderBar and apply scope to new header bar', function() {
    var ctrl = makeNavBarCtrl();

    scope.buttonText = 'My Button';
    ctrl.navElement('backButton', '<button>{{ buttonText }}</button>');

    var headerBar = ctrl.createHeaderBar();
    scope.$digest();
    var backButtonEle = headerBar.headerBarEle().find('button');
    expect(backButtonEle.text()).toBe(scope.buttonText);
  });

  it('should show the active back button on update() w/ showBack false', function() {
    var ctrl = makeNavBarCtrl();
    ctrl.navElement('backButton', '<button class="back-button hide"></button>');
    ctrl.init();

    ctrl.update({
      enableBack: true,
      showBack: false
    });

    var backButtonEle1 = ele[0].querySelector('[nav-bar]:first-child .back-button');
    var backButtonEle2 = ele[0].querySelector('[nav-bar]:last-child .back-button');
    expect(backButtonEle1.classList.contains('hide')).toBe(true);
    expect(backButtonEle2.classList.contains('hide')).toBe(true);

    ctrl.update({
      enableBack: true,
      showBack: true
    });

    expect(backButtonEle1.classList.contains('hide')).toBe(false);
    expect(backButtonEle2.classList.contains('hide')).toBe(true);
  });

  it('should not show the back button on update() w/ enableBack false', function() {
    var ctrl = makeNavBarCtrl();
    ctrl.navElement('backButton', '<button class="back-button hide"></button>');
    ctrl.init();

    ctrl.update({
      enableBack: false,
      showBack: true
    });

    var backButtonEle1 = ele[0].querySelector('[nav-bar]:first-child .back-button');
    var backButtonEle2 = ele[0].querySelector('[nav-bar]:last-child .back-button');
    expect(backButtonEle1.classList.contains('hide')).toBe(true);
    expect(backButtonEle2.classList.contains('hide')).toBe(true);

    ctrl.update({
      enableBack: true,
      showBack: true
    });
    expect(backButtonEle1.classList.contains('hide')).toBe(false);
    expect(backButtonEle2.classList.contains('hide')).toBe(true);
  });

  it('should always hide the back buttons on showBackButton(false)', function() {
    var ctrl = makeNavBarCtrl();
    ctrl.navElement('backButton', '<button class="back-button hide"></button>');
    ctrl.init();

    ctrl.showBackButton(false);
    ctrl.update({
      enableBack: true,
      showBack: true
    });

    var backButtonEle1 = ele[0].querySelector('[nav-bar]:first-child .back-button');
    var backButtonEle2 = ele[0].querySelector('[nav-bar]:last-child .back-button');
    expect(backButtonEle1.classList.contains('hide')).toBe(true);
    expect(backButtonEle2.classList.contains('hide')).toBe(true);

    ctrl.showBackButton(true);
    ctrl.update({
      enableBack: true,
      showBack: true
    });
    expect(backButtonEle1.classList.contains('hide')).toBe(false);
    expect(backButtonEle2.classList.contains('hide')).toBe(false);

    ctrl.update({
      enableBack: false,
      showBack: true
    });
    expect(backButtonEle1.classList.contains('hide')).toBe(true);
    expect(backButtonEle2.classList.contains('hide')).toBe(false);
  });

});
